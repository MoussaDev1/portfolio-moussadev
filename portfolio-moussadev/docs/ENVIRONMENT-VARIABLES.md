# 🔐 Configuration des Variables d'Environnement

## Frontend (Next.js)

### Fichier : `.env.local`

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin password
ADMIN_PASSWORD=your_secure_password_here
```

### Production (Vercel)

```bash
# Backend API URL (URL de production Railway/Render)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Site URL
NEXT_PUBLIC_SITE_URL=https://moussadev.com

# Admin password
ADMIN_PASSWORD=your_production_password
```

---

## Backend (NestJS)

### Fichier : `.env`

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_dev?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# Admin
ADMIN_PASSWORD="your-secure-admin-password"
```

### Production (Railway/Render)

```bash
# Database (fourni par Railway/Render)
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT (génère une clé sécurisée)
JWT_SECRET="production-secret-key-very-long-and-secure"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="production"

# Admin
ADMIN_PASSWORD="strong-production-password"

# CORS (optionnel, si besoin de restreindre)
CORS_ORIGIN="https://moussadev.com,https://www.moussadev.com"
```

---

## 🔒 Génération de clés sécurisées

### JWT_SECRET

```bash
# Option 1 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2 : OpenSSL
openssl rand -hex 32

# Option 3 : En ligne
# https://generate-secret.vercel.app/32
```

### ADMIN_PASSWORD

Utilise un gestionnaire de mots de passe (1Password, LastPass, Bitwarden) pour générer un mot de passe fort.

---

## 📝 Checklist avant déploiement

### Frontend

- [ ] Créer `.env.local` depuis `.env.local.example`
- [ ] Mettre à jour `NEXT_PUBLIC_API_URL` avec l'URL du backend
- [ ] Configurer les variables dans Vercel

### Backend

- [ ] Créer `.env` depuis `.env.example`
- [ ] Configurer `DATABASE_URL` avec PostgreSQL
- [ ] Générer un `JWT_SECRET` sécurisé
- [ ] Définir un `ADMIN_PASSWORD` fort
- [ ] Configurer les variables dans Railway/Render

### Sécurité

- [ ] Ne JAMAIS commiter les fichiers `.env`
- [ ] Vérifier que `.env*` est dans `.gitignore`
- [ ] Utiliser des clés différentes pour dev/prod
- [ ] Changer les mots de passe par défaut

---

## 🚀 URLs de production

**Frontend (Vercel):**

- Production: `https://moussadev.com`
- Preview: `https://portfolio-moussadev-git-main-moussadev.vercel.app`

**Backend (Railway/Render):**

- API: `https://portfolio-backend-production.up.railway.app`
- Admin: `https://portfolio-backend-production.up.railway.app/api`

---

## ⚠️ Notes importantes

1. **NEXT*PUBLIC*\* variables** : Exposées côté client, ne jamais y mettre de secrets
2. **JWT_SECRET** : Doit être long (minimum 32 caractères) et complexe
3. **DATABASE_URL** : Fourni automatiquement par Railway/Render lors de la création de la base de données
4. **CORS** : S'assurer que le backend autorise les requêtes depuis le domaine frontend
