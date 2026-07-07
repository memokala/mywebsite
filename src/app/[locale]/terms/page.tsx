import { Container } from "@/components/ui/container";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: "Terms of Service - WorldPDF",
    description: "WorldPDF Terms of Service. Read our terms and conditions.",
  };
}

export default async function TermsPage({ params }: Props) {
  await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-surface-400 mb-8">Last updated: January 2025</p>

        <div className="prose-nova space-y-8">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using WorldPDF, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use WorldPDF for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2>3. User Content</h2>
            <p>
              You retain full ownership of any files you process using WorldPDF. We do not claim any rights over your files. All processing happens in your browser and files are never uploaded to our servers.
            </p>
          </section>

          <section>
            <h2>4. Prohibited Uses</h2>
            <p>
              You agree not to use WorldPDF for any unlawful purpose or to solicit the performance of any illegal activity. You may not use our tools to process files containing malware or illegal content.
            </p>
          </section>

          <section>
            <h2>5. Disclaimer</h2>
            <p>
              WorldPDF is provided &quot;as is&quot; without warranties of any kind. We make no warranties about the accuracy, reliability, or completeness of the tools or their output.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall WorldPDF be liable for any damages arising out of the use or inability to use our tools, even if we have been notified of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page.
            </p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@worldpdf.com.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
