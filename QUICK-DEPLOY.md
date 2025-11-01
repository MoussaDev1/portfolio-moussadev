# 🚀 Guide Rapide - Déploiement V1

## ⚡ TL;DR - En 5 étapes

### 1️⃣ Railway PostgreSQL (5 min)

```
railway.app → New Project → Deploy PostgreSQL
→ Copier DATABASE_URL
```

### 2️⃣ Railway Backend (10 min)

```
New Service → GitHub → portfolio-moussadev
Root: portfolio-backend
Variables: DATABASE_URL, JWT_SECRET, CLOUDINARY_*, ADMIN_PASSWORD
→ Déploie automatiquement
→ railway run npx prisma migrate deploy
→ Copier URL backend
```

### 3️⃣ Cloudinary (5 min)

```
cloudinary.com → Sign up
→ Copier Cloud Name, API Key, API Secret
Settings → Upload Presets → Create "portfolio_images" (unsigned)
```

### 4️⃣ Vercel Frontend (5 min)

```
vercel.com → New Project → Import GitHub
Root: portfolio-moussadev
Variables: NEXT_PUBLIC_API_URL (Railway URL), CLOUDINARY_*, JWT_SECRET
→ Deploy
→ Copier URL Vercel
```

### 5️⃣ Connecter Backend ↔ Frontend (2 min)

```
Railway → Backend → Variables
→ FRONTEND_URL = URL Vercel
→ Redéploie automatiquement
```

---

## 🎯 URLs nécessaires

| Service             | URL                                         | Où la trouver                            |
| ------------------- | ------------------------------------------- | ---------------------------------------- |
| **Railway Backend** | `https://_____.up.railway.app`              | Railway Dashboard → Backend Service      |
| **Vercel Frontend** | `https://_____.vercel.app`                  | Vercel Dashboard → Deployment            |
| **PostgreSQL**      | `postgresql://postgres:___@___:___/railway` | Railway → PostgreSQL → Connect           |
| **Cloudinary**      | Cloud Name                                  | Cloudinary → Dashboard → Account Details |

---

## 🔑 Variables d'environnement essentielles

### Railway Backend (10 variables)

```env
DATABASE_URL=postgresql://...?schema=public
JWT_SECRET=votre-secret-32-caracteres-minimum
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
ADMIN_PASSWORD=votre-password-admin
FRONTEND_URL=https://votre-projet.vercel.app
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### Vercel Frontend (4 variables)

```env
NEXT_PUBLIC_API_URL=https://votre-backend.up.railway.app/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
NEXT_PUBLIC_ADMIN_PASSWORD=votre-password-admin
JWT_SECRET=le-meme-que-railway
```

---

## ✅ Checklist ultra-rapide

- [ ] Railway PostgreSQL déployé
- [ ] Backend Railway déployé + migré
- [ ] Cloudinary configuré
- [ ] Frontend Vercel déployé
- [ ] `FRONTEND_URL` mis à jour dans Railway
- [ ] Test: `https://votre-projet.vercel.app` accessible
- [ ] Test: `https://votre-projet.vercel.app/admin` accessible
- [ ] Test: Upload une image fonctionne

---

## 🐛 Quick Fixes

### ❌ 404 sur /api/projects

→ Vérifier `NEXT_PUBLIC_API_URL` dans Vercel (doit inclure `/api`)

### ❌ CORS error

→ Vérifier `FRONTEND_URL` dans Railway (sans `/` à la fin)

### ❌ Database connection failed

→ Vérifier `DATABASE_URL` contient `?schema=public`

### ❌ Images ne s'uploadent pas

→ Vérifier preset Cloudinary `portfolio_images` existe et est "unsigned"

---

## 📚 Documentation complète

- **Guide détaillé :** `DEPLOYMENT.md`
- **Checklist complète :** `DEPLOYMENT-CHECKLIST.md`
- **Script de vérification :** `./check-deployment-ready.sh`

---

## 🎉 Après le déploiement

Ton app sera accessible sur :

- 🌍 **Public** : `https://votre-projet.vercel.app`
- 📊 **Admin** : `https://votre-projet.vercel.app/admin`
- 🔧 **API** : `https://votre-backend.up.railway.app/api`

**Temps total estimé :** ~30 minutes pour première fois

---

**Version :** 1.0.0 | **Date :** 18 Octobre 2025
