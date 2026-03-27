import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar configuração padrão de API se não existir
  const config = await prisma.apiConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      facebookAdsToken: null,
      googleAdsToken: null,
      googleAdsDeveloperToken: null,
      googleAdsCustomerId: null,
    },
  });

  console.log('✅ Default API config created:', config);
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
