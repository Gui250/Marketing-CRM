/**
 * Script de migração para Vercel Postgres
 *
 * Este script executa as migrations do Prisma quando o projeto é deployado
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrate() {
  console.log('🔄 Starting database migration...');

  try {
    // Gerar Prisma Client
    console.log('📦 Generating Prisma Client...');
    await execAsync('npx prisma generate', { cwd: process.cwd() });
    console.log('✅ Prisma Client generated');

    // Executar migrations
    console.log('🚀 Running migrations...');
    await execAsync('npx prisma db push --accept-data-loss', { cwd: process.cwd() });
    console.log('✅ Migrations completed');

    // Executar seed (opcional)
    if (process.env.RUN_SEED === 'true') {
      console.log('🌱 Running seed...');
      await execAsync('node prisma/seed.js', { cwd: process.cwd() });
      console.log('✅ Seed completed');
    }

    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
