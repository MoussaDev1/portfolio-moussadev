# 🚀 Checklist de Déploiement V1

## ✅ Phase 1 : Préparation locale

### Frontend
- [ ] `cd portfolio-moussadev && npm install`
- [ ] `npm run build` passe sans erreur
- [ ] `.env.example` créé avec toutes les variables
- [ ] Tests manuels sur `http://localhost:3000`

### Backend
- [ ] `cd portfolio-backend && npm install`
- [ ] `npm run build` passe sans erreur
- [ ] `.env.example` à jour
- [ ] `npx prisma generate` exécuté
- [ ] Tests manuels sur `http://localhost:3001/api`

### Git
- [ ] Tous les commits pushés sur GitHub
- [ ] Branche `master` à jour
- [ ] Pas de `.env` commité
- [ ] `.gitignore` contient `.env` et `node_modules`

---

## ✅ Phase 2 : Railway (Backend + Database)

### PostgreSQL
- [ ] Compte Railway créé
- [ ] Projet Railway créé
- [ ] Service PostgreSQL ajouté
- [ ] URL de connexion copiée

### Backend NestJS
- [ ] Service Backend ajouté au projet Railway
- [ ] Repo GitHub connecté
- [ ] Root directory configuré : `portfolio-backend`
- [ ] Build command : `npm run build`
- [ ] Start command : `npm run start:prod`

### Variables d'environnement Railway
- [ ] `DATABASE_URL` configurée (avec `?schema=public`)
- [ ] `JWT_SECRET` défini (32+ caractères)
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `PORT=3001`
- [ ] `NODE_ENV=production`
- [ ] `ADMIN_PASSWORD` défini
- [ ] `CLOUDINARY_CLOUD_NAME` défini
- [ ] `CLOUDINARY_API_KEY` défini
- [ ] `CLOUDINARY_API_SECRET` défini
- [ ] `FRONTEND_URL` temporaire (sera mis à jour)

### Migrations
- [ ] Railway CLI installé
- [ ] `railway login` effectué
- [ ] `railway link` effectué
- [ ] `railway run npx prisma migrate deploy` exécuté
- [ ] (Optionnel) `railway run npm run seed` exécuté

### Tests Backend
- [ ] Backend déployé avec succès
- [ ] URL Railway copiée : `https://_____.up.railway.app`
- [ ] `curl https://_____.up.railway.app/api/projects` fonctionne
- [ ] `curl https://_____.up.railway.app/api/technologies` fonctionne

---

## ✅ Phase 3 : Cloudinary (Images)

### Configuration
- [ ] Compte Cloudinary créé
- [ ] Cloud Name copié
- [ ] API Key copié
- [ ] API Secret copié

### Upload Preset
- [ ] Settings → Upload → Upload Presets
- [ ] Preset `portfolio_images` créé
- [ ] Mode : Unsigned
- [ ] Folder : `portfolio`

### Test
- [ ] Upload test d'une image via Dashboard
- [ ] Vérifier l'URL générée

---

## ✅ Phase 4 : Vercel (Frontend)

### Projet Vercel
- [ ] Compte Vercel créé
- [ ] Nouveau projet créé
- [ ] Repo GitHub connecté
- [ ] Root directory : `portfolio-moussadev`
- [ ] Framework : Next.js (auto-détecté)

### Variables d'environnement Vercel
- [ ] `NEXT_PUBLIC_API_URL` défini (URL Railway Backend + `/api`)
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` défini
- [ ] `NEXT_PUBLIC_ADMIN_PASSWORD` défini
- [ ] `JWT_SECRET` défini (IDENTIQUE au backend)

### Déploiement
- [ ] Premier déploiement lancé
- [ ] Build réussi
- [ ] URL Vercel copiée : `https://_____.vercel.app`

### Mise à jour Backend
- [ ] Retour sur Railway → Backend → Variables
- [ ] `FRONTEND_URL` mis à jour avec URL Vercel
- [ ] Backend redéployé automatiquement

---

## ✅ Phase 5 : Tests de production

### Frontend Public
- [ ] `https://_____.vercel.app` accessible
- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] `/projects` affiche les projets
- [ ] `/tech-radar` accessible
- [ ] Images Cloudinary se chargent

### Admin Dashboard
- [ ] `/admin/login` accessible
- [ ] Connexion avec `ADMIN_PASSWORD` fonctionne
- [ ] Dashboard admin se charge
- [ ] Liste des projets visible
- [ ] Création d'un projet de test
- [ ] Upload d'image fonctionne
- [ ] Création d'une technologie
- [ ] Création d'une zone/floor
- [ ] Création d'une quête

### API Backend
- [ ] API répond depuis Vercel
- [ ] CORS configuré correctement
- [ ] Authentification admin fonctionne
- [ ] CRUD projets fonctionnel
- [ ] CRUD technologies fonctionnel

---

## ✅ Phase 6 : Configuration avancée (Optionnel)

### Domaine personnalisé
- [ ] Domaine acheté
- [ ] DNS configuré pour Vercel
- [ ] Sous-domaine API configuré pour Railway
- [ ] Certificat SSL actif

### Monitoring
- [ ] Vercel Analytics activé
- [ ] Railway Metrics vérifiées
- [ ] Cloudinary Usage Dashboard consulté

### CI/CD
- [ ] Push sur `master` déclenche auto-deploy Vercel
- [ ] Push sur `master` déclenche auto-deploy Railway
- [ ] Notifications configurées

---

## 🎉 Déploiement complet !

Une fois toutes les cases cochées, votre application est **100% déployée en production** !

### URLs finales
- 🌍 **Frontend :** `https://_____.vercel.app`
- 🔧 **Backend :** `https://_____.up.railway.app`
- 📊 **Admin :** `https://_____.vercel.app/admin`
- 📸 **Images :** `https://res.cloudinary.com/___/image/upload/...`

### Prochaines étapes recommandées
1. Configurer un domaine personnalisé
2. Mettre en place un système de backup pour la DB
3. Configurer des alertes de monitoring
4. Documenter les procédures de maintenance
5. Planifier la v1.1 avec les features Phase 2

---

**Dernière mise à jour :** 18 Octobre 2025
