# 🚀 Guide de Déploiement - Portfolio MoussaDev

Ce guide vous explique comment déployer votre portfolio sur différentes plateformes.

## 📋 Pré-requis avant déploiement

### ✅ Checklist obligatoire

- [ ] **Build local réussi** : `npm run build` sans erreurs
- [ ] **Lint passé** : `npm run lint` sans erreurs
- [ ] **Images ajoutées** : Toutes les images des projets dans `public/images/projects/`
- [ ] **Données personnalisées** : `data/config.json` et `data/projects.json` mis à jour
- [ ] **URLs mises à jour** : Remplacer `https://moussadev.com` par votre domaine
- [ ] **Tests manuels** : Navigation entre toutes les pages fonctionnelle

### 🔧 Configuration finale

1. **Mettre à jour l'URL de base dans `app/layout.tsx`** :

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://VOTRE-DOMAINE.com"), // <- Changez ici
  // ...
};
```

2. **Vérifier les URLs dans `vercel.json`, sitemap.ts, robots.ts`**

## 🟢 Vercel (Recommandé)

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
