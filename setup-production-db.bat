@echo off
REM 🗄️ DATABASE PRODUCTION SETUP SCRIPT (Windows)

echo 🚀 Setting up production database...

REM Check if DATABASE_URL is set
if "%DATABASE_URL%"=="" (
    echo ❌ ERROR: DATABASE_URL environment variable is not set!
    echo 📝 Please set it like this:
    echo set DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
    pause
    exit /b 1
)

echo 🔗 Using database: %DATABASE_URL%

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Push schema to production database
echo 📤 Pushing schema to production database...
npx prisma db push

REM Seed the database with initial data
echo 🌱 Seeding database with initial data...
npx tsx prisma/seed.ts

echo ✅ Production database setup completed!
echo.
echo 🎉 Your database is ready with:
echo    - Admin user: admin / admin123
echo    - Koordinator: koordinator / koor123
echo    - Petugas: petugas / petugas123
echo    - Sample piutang data
echo    - Sample setoran data
echo.
pause