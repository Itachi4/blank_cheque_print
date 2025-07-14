const { PrismaClient } = require('@prisma/client');  // Import Prisma
const prisma = new PrismaClient();                  // Initialize Prisma client

async function main() {
  // Create a company
  const company = await prisma.company.create({
    data: {
      name: 'Hawk Properties',
    },
  });

  // Create a bank associated with that company
  const bank = await prisma.bank.create({
    data: {
      name: 'M&T Bank',
      company: {
        connect: { id: company.id },  // Links to the company you just created
      },
    },
  });

  // Create an account under the bank
  const account = await prisma.account.create({
    data: {
      number: '9838634997',
      lastCheck: 1000,               // Start at cheque #1000
      bank: {
        connect: { id: bank.id },    // Link to the bank
      },
    },
  });

  // Create an admin user
// Check if admin user already exists
const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });
  
  if (!existingUser) {
    // Create Admin User only if not already present
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists, skipping...');
  }
  
  console.log('✅ Seeding completed successfully!');
}

// Run it
main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
  })
  .finally(() => {
    prisma.$disconnect();            // Always disconnect at the end
  });
