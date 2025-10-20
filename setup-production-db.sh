#!/bin/bash

# 🗄️ DATABASE PRODUCTION SETUP SCRIPT

echo "🚀 Setting up production database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set!"
    echo "📝 Please set it like this:"
    echo "export DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'"
    exit 1
fi

echo "🔗 Using database: $DATABASE_URL"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to production database
echo "📤 Pushing schema to production database..."
npx prisma db push

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npx tsx prisma/seed.ts

echo "✅ Production database setup completed!"
echo ""
echo "🎉 Your database is ready with:"
echo "   - Admin user: admin / admin123"
echo "   - Koordinator: koordinator / koor123"
echo "   - Petugas: petugas / petugas123"
echo "   - Sample piutang data"
echo "   - Sample setoran data"