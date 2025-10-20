# 📋 DATABASE CONNECTION TEST
# Jalankan ini untuk test connection ke database Neon

# Ganti dengan connection string Anda
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# Test connection
echo "🔍 Testing database connection..."
npx prisma db pull --force

echo "✅ Database connected successfully!"