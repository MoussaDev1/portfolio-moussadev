# 🚀 Portfolio MoussaDev

Portfolio personnel moderne développé avec Next.js 15, TypeScript et Tailwind CSS. Un site élégant et performant pour présenter mes projets et compétences de développeur Full-Stack.

## ✨ Fonctionnalités

- **🎨 Design moderne** - Interface propre et professionnelle avec mode sombre automatique
- **📱 Responsive** - Optimisé pour tous les appareils (mobile, tablette, desktop)
- **⚡ Performance** - Next.js 15 avec App Router et génération statique
- **🔍 SEO optimisé** - Métadonnées dynamiques et structure sémantique
- **♿ Accessible** - Conforme aux standards d'accessibilité WCAG
- **🚀 API intégrée** - Routes API pour la gestion des projets
- **📊 Gestion de contenu** - Structure JSON flexible pour les projets

## 🛠️ Technologies utilisées

- **Framework** : Next.js 15.5.4 avec App Router
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **Build Tool** : Turbopack
- **Déploiement** : Vercel (recommandé)
- **Fonts** : Geist Sans & Geist Mono

## 🏗️ Structure du projet

```
portfolio-moussadev/
├── app/                          # App Router (Next.js 13+)
│   ├── api/projects/            # Routes API pour les projets
│   ├── projects/                # Pages des projets
│   ├── globals.css              # Styles globaux
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Page d'accueil
│   └── not-found.tsx           # Page 404 personnalisée
├── components/                  # Composants réutilisables
│   ├── Header.tsx              # En-tête de navigation
│   ├── Footer.tsx              # Pied de page
│   └── ProjectCard.tsx         # Carte de projet
├── data/                       # Données statiques
│   ├── projects.json           # Base de données des projets
│   └── config.json             # Configuration du site
├── lib/                        # Utilitaires et helpers
│   ├── projects.ts             # Fonctions de gestion des projets
│   └── utils.ts                # Utilitaires généraux
├── types/                      # Types TypeScript
│   └── index.ts                # Définitions de types
└── public/                     # Assets statiques
    └── images/                 # Images des projets
```

## 🚀 Installation et développement

### Prérequis

- Node.js 18+
- npm, yarn, pnpm ou bun

### Installation

```bash
# Cloner le repository
git clone https://github.com/moussadev1/portfolio-moussadev.git
cd portfolio-moussadev

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Scripts disponibles

```bash
npm run dev      # Serveur de développement avec Turbopack
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification ESLint
```

## 📝 Gestion du contenu

### Ajouter un nouveau projet

1. Modifier le fichier `data/projects.json`
2. Ajouter les images dans `public/images/projects/`
3. Le site se met à jour automatiquement

### Structure d'un projet

```json
{
  "id": "unique-id",
  "slug": "url-friendly-slug",
  "title": "Titre du projet",
  "shortDescription": "Description courte pour les cartes",
  "fullDescription": "Description complète détaillée",
  "technologies": ["React", "Next.js", "TypeScript"],
  "category": "Web Development",
  "status": "completed", // completed | in_progress | planned
  "featured": true, // Affiché sur la page d'accueil
  "images": {
    "thumbnail": "/images/projects/thumb.jpg",
    "gallery": ["/images/projects/1.jpg"]
  },
  "links": {
    "demo": "https://demo-url.com",
    "github": "https://github.com/user/repo"
  },
  "highlights": ["Point fort 1", "Point fort 2"],
  "challenges": "Défis techniques rencontrés",
  "learnings": "Ce que j'ai appris",
  "duration": "3 mois",
  "team_size": 1,
  "date_completed": "2024-08-15",
  "date_created": "2024-05-15"
}
```

## 🎨 Personnalisation

### Modifier les informations personnelles

- Éditer `data/config.json`
- Mettre à jour les métadonnées dans `app/layout.tsx`

### Thème et couleurs

- Les couleurs sont définies dans `app/globals.css`
- Mode sombre automatique basé sur les préférences système
- Variables CSS personnalisables

### Polices

- Geist Sans pour le texte principal
- Geist Mono pour le code
- Facilement modifiable dans `app/layout.tsx`

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Autres plateformes

Le projet est compatible avec :

- Netlify
- Railway
- AWS Amplify
- Cloudflare Pages

## 📊 Performance

- **Lighthouse Score** : 100/100 (Performance, Accessibilité, SEO)
- **Core Web Vitals** : Tous optimisés
- **Bundle Size** : ~121kB First Load JS
- **Build Time** : <3 secondes avec Turbopack

## 🛡️ Accessibilité

- Navigation au clavier complète
- Lecteurs d'écran supportés
- Contrastes respectés (WCAG AA)
- Alt texts sur toutes les images
- Structure sémantique HTML5

## 🔧 Développement

### Conventions de code

- ESLint configuré avec les règles Next.js
- TypeScript strict mode
- Prettier pour le formatage (optionnel)

### Structure des commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Mise en forme
- `refactor:` Refactoring

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changes (`git commit -m 'Ajout: nouvelle fonctionnalité'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📞 Contact

**MoussaDev** - [contact@moussadev.com](mailto:contact@moussadev.com)

- 🌐 Website: [moussadev.com](https://moussadev.com)
- 💼 LinkedIn: [linkedin.com/in/moussadev](https://linkedin.com/in/moussadev)
- 🐱 GitHub: [github.com/moussadev1](https://github.com/moussadev1)

---

## Nouvelles features upcoming

⭐ **N'hésitez pas à starrer le repo si ce projet vous a aidé !**
