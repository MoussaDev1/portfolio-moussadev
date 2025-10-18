# 🚀 Guide de Déploiement V1 - Portfolio MoussaDev

**Date :** 18 Octobre 2025  
**Version :** 1.0.0  
**Stack :** Next.js 15 (Frontend) + NestJS (Backend) + PostgreSQL

---

## 📋 Vue d'ensemble

Ce guide couvre le déploiement complet de l'application :

- **Frontend** → Vercel
- **Backend** → Railway
- **Base de données** → Railway PostgreSQL
- **Images** → Cloudinary

---

## 🎯 Prérequis

### Comptes nécessaires

- [x] Compte GitHub (avec repos pushés)
- [ ] Compte Vercel (gratuit)
- [ ] Compte Railway (gratuit avec $5/mois offerts)
- [ ] Compte Cloudinary (gratuit)

### Vérifications locales

```bash
# Frontend
cd portfolio-moussadev
npm run build  # Doit passer sans erreur

# Backend
cd ../portfolio-backend
npm run build  # Doit passer sans erreur
```

---

## 🗄️ ÉTAPE 1 : Base de données (Railway PostgreSQL)

### 1.1 Créer le projet Railway

1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur **"New Project"**
3. Choisir **"Deploy PostgreSQL"**
4. Attendre le provisionnement (~30 secondes)

### 1.2 Récupérer l'URL de connexion

1. Cliquer sur le service PostgreSQL
2. Onglet **"Connect"**
3. Copier **"Postgres Connection URL"**
4. Format : `postgresql://postgres:PASSWORD@HOST:PORT/railway`

### 1.3 Préparer les variables d'environnement

Copier cette URL, on en aura besoin pour le backend.

---

## 🔧 ÉTAPE 2 : Backend (Railway)

### 2.1 Créer le service Backend

1. Dans le même projet Railway, cliquer **"New Service"**
2. Choisir **"GitHub Repo"**
3. Autoriser Railway à accéder à GitHub
4. Sélectionner le repo `portfolio-moussadev`
5. **Root Directory :** `portfolio-backend`

### 2.2 Configurer les variables d'environnement

Dans Railway → Backend Service → **"Variables"**, ajouter :

```bash
# Database (copier l'URL PostgreSQL de l'étape 1.2)
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway?schema=public

# JWT
JWT_SECRET=votre-secret-jwt-ultra-securise-32-caracteres-minimum
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=production

# Admin
ADMIN_PASSWORD=votre-mot-de-passe-admin-securise

# Frontend URL (on le mettra à jour après déploiement Vercel)
FRONTEND_URL=https://votre-app.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### 2.3 Configurer le déploiement

1. Onglet **"Settings"**
2. **Build Command :** `npm run build`
3. **Start Command :** `npm run start:prod`
4. **Watch Paths :** `portfolio-backend/**`

### 2.4 Migrer la base de données

Railway va déployer automatiquement. Une fois déployé :

```bash
# Option 1 : Via Railway CLI (recommandé)
# Installer Railway CLI : https://docs.railway.app/develop/cli
railway login
railway link  # Sélectionner le projet
railway run npx prisma migrate deploy

# Option 2 : Via Prisma Studio en ligne
# Dans Railway → PostgreSQL → Connect → Prisma Studio URL
```

### 2.5 Seed initial (optionnel)

```bash
railway run npm run seed
```

### 2.6 Récupérer l'URL du backend

1. Railway génère automatiquement une URL : `https://nom-du-service.up.railway.app`
2. Copier cette URL, on en aura besoin pour Vercel

---

## 🎨 ÉTAPE 3 : Frontend (Vercel)

### 3.1 Importer le projet

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer **"Add New Project"**
3. Importer depuis GitHub
4. Sélectionner le repo `portfolio-moussadev`
5. **Root Directory :** `portfolio-moussadev`

### 3.2 Configurer le build

Vercel détecte automatiquement Next.js. Vérifier :

- **Framework Preset :** Next.js
- **Build Command :** `npm run build` (ou laisser par défaut)
- **Output Directory :** `.next`
- **Install Command :** `npm install`

### 3.3 Variables d'environnement

Dans Vercel → Project Settings → **"Environment Variables"**, ajouter :

```bash
# API Backend (URL Railway de l'étape 2.6)
NEXT_PUBLIC_API_URL=https://votre-backend.up.railway.app/api

# Cloudinary (optionnel si images via backend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name

# Admin Password (pour l'authentification frontend)
NEXT_PUBLIC_ADMIN_PASSWORD=votre-mot-de-passe-admin-securise

# JWT Secret (IMPORTANT : doit être identique au backend)
JWT_SECRET=le-meme-secret-que-railway
```

### 3.4 Déployer

1. Cliquer **"Deploy"**
2. Attendre ~2-3 minutes
3. Vercel va générer une URL : `https://votre-projet.vercel.app`

### 3.5 Mettre à jour le backend

Retourner sur Railway → Backend → Variables :

```bash
FRONTEND_URL=https://votre-projet.vercel.app
```

Redéployer le backend (Railway le fait automatiquement).

---

## � ÉTAPE 4 : Cloudinary (Images)

### 4.1 Créer le compte

1. Aller sur [cloudinary.com](https://cloudinary.com)
2. S'inscrire gratuitement
3. Dashboard → **Account Details**

### 4.2 Récupérer les credentials

Copier :
- **Cloud Name**
- **API Key**
- **API Secret**

### 4.3 Configurer les presets

1. Dashboard → **Settings** → **Upload**
2. **Upload Presets** → **Add Upload Preset**
3. Créer un preset nommé `portfolio_images`
4. Mode : **Unsigned** (pour uploads directs depuis frontend)

### 4.4 Ajouter au backend Railway

Déjà fait à l'étape 2.2, mais vérifier que les valeurs sont correctes.

---

## ✅ ÉTAPE 5 : Vérifications post-déploiement

### 5.1 Tests Frontend

1. Ouvrir `https://votre-projet.vercel.app`
2. Vérifier :
   - [ ] Page d'accueil se charge
   - [ ] Navigation fonctionne
   - [ ] Projets s'affichent
   - [ ] Tech Radar accessible

### 5.2 Tests Admin

1. Aller sur `https://votre-projet.vercel.app/admin/login`
2. Se connecter avec `ADMIN_PASSWORD`
3. Vérifier :
   - [ ] Dashboard admin accessible
   - [ ] Liste des projets
   - [ ] Création d'un projet de test
   - [ ] Upload d'image (Cloudinary)

### 5.3 Tests API Backend

```bash
# Test basique
curl https://votre-backend.up.railway.app/api/projects

# Test avec données
curl https://votre-backend.up.railway.app/api/technologies
```

### 5.4 Monitoring

- **Vercel :** Dashboard → Analytics
- **Railway :** Dashboard → Metrics
- **Cloudinary :** Dashboard → Reports

---

## 🔧 Configuration avancée (optionnel)

### Domaine personnalisé

#### Frontend (Vercel)
1. Project Settings → **Domains**
2. Ajouter `moussadev.com`
3. Suivre les instructions DNS

#### Backend (Railway)
1. Service Settings → **Networking**
2. Ajouter `api.moussadev.com`
3. Configurer DNS

### CI/CD automatique

Déjà configuré ! Chaque push sur `master` déclenchera :
- Vercel → Redéploiement frontend
- Railway → Redéploiement backend

### Variables par environnement

Railway et Vercel supportent plusieurs environnements :
- **Production** : branche `main`/`master`
- **Preview** : branches features
- **Development** : local

---

## 🐛 Troubleshooting

### ❌ Frontend ne se connecte pas au backend

**Symptôme :** Erreurs CORS ou 404 sur `/api/*`

**Solutions :**
1. Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
2. Vérifier `FRONTEND_URL` dans Railway
3. Vérifier CORS dans `portfolio-backend/src/main.ts`

### ❌ Database connection failed

**Symptôme :** Backend crash au démarrage

**Solutions :**
1. Vérifier `DATABASE_URL` dans Railway
2. Format doit inclure `?schema=public`
3. Vérifier que PostgreSQL est bien démarré

### ❌ Images ne s'uploadent pas

**Symptôme :** Erreur lors de l'upload d'images

**Solutions :**
1. Vérifier credentials Cloudinary
2. Vérifier preset `portfolio_images` existe
3. Vérifier variables `CLOUDINARY_*` dans Railway

### ❌ Build failed sur Vercel

**Symptôme :** Erreur TypeScript pendant le build

**Solutions :**
1. Tester `npm run build` en local
2. Vérifier `tsconfig.json`
3. Commit les corrections sur GitHub

---

## 📊 Métriques de santé

### Vérifications quotidiennes

- [ ] Frontend accessible (< 2s de chargement)
- [ ] Backend répond (< 500ms)
- [ ] Base de données connectée
- [ ] Cloudinary storage < 80% du quota

### Limites gratuites

| Service | Plan Gratuit | Quota |
|---------|--------------|-------|
| **Vercel** | Hobby | 100GB bandwidth/mois |
| **Railway** | Starter | $5 crédit/mois (= ~500h uptime) |
| **Cloudinary** | Free | 25 crédits/mois = ~25GB storage + transformations |
| **PostgreSQL** | Railway inclus | 512MB storage |

---

## 🎉 Félicitations !

Ton app est maintenant en production ! 🚀

**URLs importantes :**
- 🌍 Frontend : `https://votre-projet.vercel.app`
- 🔧 Backend : `https://votre-backend.up.railway.app`
- 📊 Admin : `https://votre-projet.vercel.app/admin`

**Prochaines étapes :**
1. Configurer un domaine personnalisé
2. Activer les analytics Vercel
3. Configurer les alertes Railway
4. Mettre en place un système de backup DB

---

## 📞 Support

- **Vercel Docs :** https://vercel.com/docs
- **Railway Docs :** https://docs.railway.app
- **Cloudinary Docs :** https://cloudinary.com/documentation
- **NestJS Deploy :** https://docs.nestjs.com/faq/deployment
- **Next.js Deploy :** https://nextjs.org/docs/deployment

---

**Dernière mise à jour :** 18 Octobre 2025  
**Version du guide :** 1.0.0

---

## �🟢 Vercel (Recommandé pour Frontend seul)

### Méthode 1 : Via l'interface web

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New Project"
4. Importez ce repository
5. Configurez :
   - **Framework Preset** : Next.js
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`
6. Cliquez sur "Deploy"

### Méthode 2 : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer depuis le dossier du projet
vercel

# Suivre les instructions :
# ? Set up and deploy? Yes
# ? Which scope? Votre compte
# ? Link to existing project? No
# ? What's your project's name? portfolio-moussadev
# ? In which directory is your code located? ./
```

### Configuration Vercel

Votre `vercel.json` est déjà configuré avec :

- Headers de sécurité
- Cache optimisé pour les images
- Redirections automatiques

## 🔵 Netlify

### Via interface web

1. Allez sur [netlify.com](https://netlify.com)
2. "New site from Git" → Connectez GitHub
3. Sélectionnez le repository
4. Configuration :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
   - **Node version** : 18 ou plus récent

### Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify init
netlify deploy --prod
```

## 🟠 Cloudflare Pages

1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect to Git → GitHub
4. Configuration :
   - **Framework preset** : Next.js
   - **Build command** : `npm run build`
   - **Build output directory** : `.next`

## 🟡 Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser
railway init

# Déployer
railway up
```

## 🔴 AWS Amplify

1. Console AWS → Amplify
2. Host web app → GitHub
3. Sélectionner le repository
4. Configuration automatique détectée
5. Deploy

## 📊 Optimisations Post-Déploiement

### 1. **Domaine personnalisé**

- Vercel : Settings → Domains
- Netlify : Domain settings → Custom domains
- Ajoutez votre domaine et configurez les DNS

### 2. **Variables d'environnement** (si nécessaire future)

```bash
# Exemple pour des APIs externes
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

### 3. **Analytics** (optionnel)

- Google Analytics
- Vercel Analytics
- Plausible Analytics

### 4. **Performance monitoring**

- Vercel Speed Insights
- Lighthouse CI
- Core Web Vitals

## 🐛 Résolution de problèmes

### Build Fails

```bash
# Nettoyer et rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Images 404

Vérifiez que toutes les images sont dans `public/images/projects/` et correspondent aux chemins dans `projects.json`

### Erreurs TypeScript

```bash
# Vérifier les erreurs
npm run lint
npx tsc --noEmit
```

### Performance

- Optimisez vos images (WebP, tailles appropriées)
- Vérifiez les Core Web Vitals sur PageSpeed Insights
- Utilisez `npm run build` pour voir les tailles de bundles

## 📈 Monitoring Post-Déploiement

### Tests automatisés à faire régulièrement :

1. **Lighthouse Score** : Maintenez 90+ sur tous les critères
2. **Broken Links** : Vérifiez que tous les liens fonctionnent
3. **Mobile Responsiveness** : Testez sur différents appareils
4. **Loading Speed** : < 3s sur 3G

### URLs importantes à tester :

- `/` - Page d'accueil
- `/projects` - Liste des projets
- `/projects/[slug]` - Pages projet individuelles
- `/sitemap.xml` - Sitemap généré
- `/robots.txt` - Robots.txt

## 💡 Conseils Pro

1. **Déployez souvent** : Chaque nouveau projet = nouveau déploiement
2. **Testez en local** : Toujours `npm run build` avant de deployer
3. **Surveillez les performances** : Core Web Vitals essentiels pour le SEO
4. **Backup** : Gardez une copie de vos données JSON
5. **Domaine personnalisé** : Professionnel et mémorable

## 🎯 Prochaines étapes

Après déploiement réussi :

1. ✅ Ajoutez le site à Google Search Console
2. ✅ Configurez Google Analytics (optionnel)
3. ✅ Partagez sur LinkedIn/réseaux sociaux
4. ✅ Ajoutez l'URL à votre CV
5. ✅ Testez les performances avec Lighthouse

---

🚀 **Votre portfolio est maintenant en ligne et prêt à impressionner !**
