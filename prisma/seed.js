const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const plans = [
    {
      id: "free",
      name: "Free",
      priceMonthly: 0,
      maxFileSizeMB: 10,
      dailyFileLimit: 10,
      teamManagement: false,
    },
    {
      id: "pro",
      name: "Pro",
      priceMonthly: 900, // $9.00
      maxFileSizeMB: 100,
      dailyFileLimit: null,
      teamManagement: false,
    },
    {
      id: "business",
      name: "Business",
      priceMonthly: 2900, // $29.00
      maxFileSizeMB: null,
      dailyFileLimit: null,
      teamManagement: true,
    },
  ];

  for (const plan of plans) {
    await db.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }
  console.log("Database seeded successfully with default plans.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
