@echo off
REM 🚀 Deployment Script for Sistem Piutang (Windows)

echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Build the application
echo 🏗️ Building application...
npm run build

REM Run linting
echo 🔍 Running linting...
npm run lint

echo.
echo ✅ Build completed!
echo.
echo 🎉 Your application is ready for deployment!
echo.
echo 📋 Next steps:
echo 1. Choose your deployment platform:
echo    - Vercel: vercel --prod
echo    - Railway: railway up
echo    - VPS: pm2 start npm --name "sistem-piutang" -- start
echo.
echo 2. Don't forget to set your environment variables!
echo 3. Run database migrations in production
echo.
pause