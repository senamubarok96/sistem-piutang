#!/bin/bash

# 🚀 Deployment Script for Sistem Piutang

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Run linting
echo "🔍 Running linting..."
npm run lint

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your application is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Choose your deployment platform:"
    echo "   - Vercel: vercel --prod"
    echo "   - Railway: railway up"
    echo "   - VPS: pm2 start npm --name 'sistem-piutang' -- start"
    echo ""
    echo "2. Don't forget to set your environment variables!"
    echo "3. Run database migrations in production"
    echo ""
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi