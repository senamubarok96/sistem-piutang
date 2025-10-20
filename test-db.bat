# 📋 DATABASE CONNECTION TEST
# Jalankan untuk test koneksi ke database Neon

# Ganti dengan connection string kamu sendiri
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

echo "🔍 Testing database connection..."
npx prisma db pull --force

echo "✅ Database connected successfully!"
