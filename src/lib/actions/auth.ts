"use server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { signIn } from "@/auth";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  let requestIp = "127.0.0.1";
  try {
    try {
      const nextHeaders = await import("next/headers");
      const h = await nextHeaders.headers();
      requestIp = h.get("x-forwarded-for") || h.get("x-real-ip") || "127.0.0.1";
    } catch (e) {
      requestIp = "127.0.0.1";
    }

    // Rate Limit: 5 registration requests per 15 minutes per IP
    const rateLimitKey = `register:${requestIp}`;
    const limitCheck = await rateLimit(rateLimitKey, 5, 900);
    if (!limitCheck.success) {
      return { error: "Too many registration attempts. Please try again later." };
    }

    const parsed = RegisterSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      // Prevent account enumeration: return standard success message but send an informative email
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myworldpdf.com";
      await sendEmail({
        to: email,
        subject: "WorldPDF Account Registration Attempt",
        html: `<div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ef4444;">Registration Attempt</h2>
          <p>Hello,</p>
          <p>Someone attempted to create a WorldPDF account using this email address. However, this email is already registered.</p>
          <p>If this was you and you forgot your password, please request a reset here:</p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="${siteUrl}/forgot-password" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>`,
      });

      await logAudit({
        action: "auth.register.duplicate",
        details: `Duplicate sign up attempt for ${email}`,
        ip: requestIp,
      });

      return { success: "If your email is valid, a verification link has been sent to your inbox." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Auto-verify email if SMTP is not configured to allow instant login
    const emailVerified = process.env.SMTP_HOST ? null : new Date();

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified,
      },
    });

    // Create Verification Token if email is not auto-verified
    if (!emailVerified) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myworldpdf.com";
      const verifyLink = `${siteUrl}/verify-email?token=${token}`;

      await sendEmail({
        to: email,
        subject: "Verify your email address - WorldPDF",
        html: `<div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ef4444;">Welcome to WorldPDF!</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address and activate your account:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${verifyLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p><a href="${verifyLink}">${verifyLink}</a></p>
          <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This link will expire in 24 hours. If you did not sign up for WorldPDF, please ignore this email.</p>
        </div>`,
      });

      await logAudit({
        userId: user.id,
        action: "auth.register.success",
        details: `User registered (verification pending): ${email}`,
        ip: requestIp,
      });

      return { success: "Registration successful. Please check your email to verify your account." };
    } else {
      // Auto-verified: create default Free subscription immediately
      const freePlan = await db.plan.findUnique({ where: { id: "free" } });
      if (freePlan) {
        await db.subscription.create({
          data: {
            userId: user.id,
            planId: "free",
            status: "ACTIVE",
            paymentProvider: "system",
            currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // ~100 years
          },
        });
      }

      await logAudit({
        userId: user.id,
        action: "auth.register.auto_verify",
        details: `User registered and auto-verified: ${email}`,
        ip: requestIp,
      });

      return { success: "Registration successful! You can now log in immediately." };
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: `Registration error: ${error.message || error}` };
  }
}

export async function verifyEmail(token: string) {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { error: "Invalid or expired email verification token." };
    }

    const user = await db.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { token },
    });

    // Create standard Free plan subscription for new users
    const freePlan = await db.plan.findUnique({ where: { id: "free" } });
    if (freePlan) {
      await db.subscription.upsert({
        where: { userId: user.id },
        update: {
          planId: "free",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId: user.id,
          planId: "free",
          status: "ACTIVE",
          paymentProvider: "system",
          currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
        },
      });
    }

    await logAudit({
      userId: user.id,
      action: "auth.verify_email.success",
      details: `Email verified for ${user.email}`,
    });

    return { success: "Your email has been successfully verified! You can now log in." };
  } catch (error) {
    console.error("Email verification error:", error);
    return { error: "An unexpected error occurred during verification." };
  }
}

export async function forgotPassword(email: string) {
  let requestIp = "127.0.0.1";
  try {
    const nextHeaders = await import("next/headers");
    const h = await nextHeaders.headers();
    requestIp = h.get("x-forwarded-for") || h.get("x-real-ip") || "127.0.0.1";
  } catch (e) {
    requestIp = "127.0.0.1";
  }

  // Rate Limit: 3 password reset requests per 15 minutes per IP
  const rateLimitKey = `forgot:${requestIp}`;
  const limitCheck = await rateLimit(rateLimitKey, 3, 900);
  if (!limitCheck.success) {
    return { error: "Too many password reset requests. Please try again later." };
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      // Account enumeration prevention
      return { success: "If the email exists in our system, a password reset link has been sent." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myworldpdf.com";
    const resetLink = `${siteUrl}/forgot-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your password - WorldPDF",
      html: `<div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #ef4444;">Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to choose a new password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This link will expire in 15 minutes. If you did not request this change, please ignore this email.</p>
      </div>`,
    });

    await logAudit({
      userId: user.id,
      action: "auth.forgot_password.requested",
      details: `Password reset link sent to ${email}`,
      ip: requestIp,
    });

    return { success: "If the email exists in our system, a password reset link has been sent." };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function resetPassword(token: string, password: z.infer<typeof RegisterSchema>["password"]) {
  let requestIp = "127.0.0.1";
  try {
    const nextHeaders = await import("next/headers");
    const h = await nextHeaders.headers();
    requestIp = h.get("x-forwarded-for") || h.get("x-real-ip") || "127.0.0.1";
  } catch (e) {
    requestIp = "127.0.0.1";
  }

  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return { error: "Invalid or expired password reset token." };
    }

    if (!passwordRegex.test(password)) {
      return { error: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.update({
      where: { email: verificationToken.identifier },
      data: { passwordHash },
    });

    await db.verificationToken.delete({
      where: { token },
    });

    await logAudit({
      userId: user.id,
      action: "auth.reset_password.success",
      details: `Password reset success for ${user.email}`,
      ip: requestIp,
    });

    return { success: "Password reset successfully. You can now log in." };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred during password reset." };
  }
}
