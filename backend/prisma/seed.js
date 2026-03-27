import { PrismaClient } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';

const DB_URL = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://crm_admin:crm_password@localhost:5432/smart_crm';
const adapter = new PrismaPg({ connectionString: DB_URL });
const prisma = new PrismaClient({ adapter });

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
