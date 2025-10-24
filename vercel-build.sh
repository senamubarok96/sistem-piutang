#!/bin/bash
set -e

echo "🚀 Running custom Vercel build script..."
echo "📦 Installing dependencies with legacy peer deps..."

# Install dependencies dengan flag aman
npm install --legacy-peer-deps

echo "✅ Dependencies installed successfully."

# Jalankan build Next.js
echo "🏗️  Building Next.js project..."
npm run build

echo "🎉 Build completed successfully!"
