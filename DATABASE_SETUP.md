# 📋 INSTRUKSI SETUP DATABASE PRODUCTION

## Cara 1: Via Terminal (Linux/Mac)

1. **Buka terminal di laptop Anda**
2. **Set environment variable**:
   ```bash
   export DATABASE_URL='postgresql://username:password@host/dbname?sslmode=require'
   ```
   (Ganti dengan connection string dari Neon)

3. **Run setup script**:
   ```bash
   chmod +x setup-production-db.sh
   ./setup-production-db.sh
   ```

## Cara 2: Via Windows Command Prompt

1. **Buka Command Prompt atau PowerShell**
2. **Set environment variable**:
   ```cmd
   set DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
   ```

3. **Run setup script**:
   ```cmd
   setup-production-db.bat
   ```

## Cara 3: Manual Commands

Jika script tidak jalan, jalankan manual:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema to database
npx prisma db push

# 3. Seed database
npx tsx prisma/seed.ts
```

## ✅ Success Indicators

Jika berhasil, Anda akan melihat:
- ✅ "Prisma Client generated"
- ✅ "Database schema pushed"
- ✅ "Seeding finished"
- ✅ "Created users: { admin, koordinatorUser, petugasUser }"

## 🔧 Troubleshooting

### Error: "Connection refused"
- Check DATABASE_URL format
- Verify database is active di Neon dashboard

### Error: "Permission denied"
- Check database user permissions
- Verify SSL mode is `require`

### Error: "Module not found"
- Run `npm install` terlebih dahulu
- Check Node.js version (min 18)

## 🎉 Setelah Setup

Database Anda siap dengan:
- 3 user demo (Admin, Koordinator, Petugas)
- Sample data piutang
- Sample data setoran
- Semua tabel ter-create dengan benar