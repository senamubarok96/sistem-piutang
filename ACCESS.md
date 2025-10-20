# 🌐 Access Configuration

## Local Development
- **URL**: http://localhost:3000
- **Login**: Gunakan akun demo yang tersedia

## Production Access

### After Vercel Deployment
1. **URL**: https://your-app-name.vercel.app
2. **Custom Domain**: https://your-domain.com (jika di-setup)

### After Railway Deployment
1. **URL**: https://your-app-name.up.railway.app

### After VPS Deployment
1. **URL**: http://your-server-ip:3000
2. **With Nginx**: https://your-domain.com

## 🔑 Login Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | admin | admin123 | Full system access |
| Koordinator | koordinator | koor123 | Team management |
| Petugas | petugas | petugas123 | Area management |

## 📱 Mobile Access

Aplikasi **fully responsive** dan bisa diakses via:
- Smartphone (Android/iOS)
- Tablet
- Desktop/Laptop

## 🌍 Public Access

Untuk membuat aplikasi bisa diakses publik:

### 1. **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Your app will be available at:
# https://your-app-name.vercel.app
```

### 2. **Custom Domain**
```bash
# Di Vercel dashboard:
# 1. Go to Project Settings
# 2. Add custom domain
# 3. Update DNS records:
#    A record: 76.76.19.61
#    CNAME: cname.vercel-dns.com
```

### 3. **Share with Users**
Setelah deployment, bagikan link berikut:
- **Admin**: https://your-domain.com/admin
- **Koordinator**: https://your-domain.com/koordinator  
- **Petugas**: https://your-domain.com/petugas

## 🔒 Security Notes

1. **Change Default Passwords**: Ganti password default setelah first login
2. **HTTPS**: Selalu gunakan HTTPS di production
3. **Database**: Gunakan strong password untuk database
4. **Backup**: Setup regular backup untuk data penting

## 📊 Monitoring

### Check Application Health
```bash
# Health check endpoint
curl https://your-domain.com/api/health

# Monitor logs (Vercel)
vercel logs

# Monitor logs (VPS)
pm2 logs sistem-piutang
```

## 🚀 Ready to Share!

Aplikasi Anda sekarang siap digunakan oleh semua user di mana saja! 🎉