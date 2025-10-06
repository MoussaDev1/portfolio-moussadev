# 🏗️ Plan d'Architecture Séparée — Personal Dev Dashboard & Portfolio

**Date de création :** 6 octobre 2025  
**Statut :** 🚧 En planification  
**Version :** 1.0

---

## 🎯 Objectif du Plan

Transformer le projet actuel (Next.js monolithique avec données JSON) vers une architecture séparée :

- **Frontend :** Next.js 15 (App Router) - Interface utilisateur et portfolio public
- **Backend :** NestJS + PostgreSQL + Prisma - API et gestion des données

---

## 📊 État Actuel vs Vision Cible

### 🔄 État Actuel

```
portfolio-moussadev/
├── app/ (Next.js 15 - App Router)
├── components/ (React + TypeScript)
├── data/projects.json (données statiques)
├── lib/ (utilitaires)
├── types/ (TypeScript definitions)
└── public/ (assets statiques)
```

### 🎯 Vision Cible

```
Portfolio Project/
│
├── portfolio-frontend/ (Next.js 15)
│   ├── Dashboard privé (Zone/Floor System)
│   ├── Portfolio public
│   ├── Tech Radar interactif
│   └── Blog personnel
│
└── portfolio-backend/ (NestJS + PostgreSQL)
    ├── API REST complète
    ├── Gestion projets (Zones/Floors/Quêtes)
    ├── Tech Radar avec relations
    ├── Blog avec articles
    └── Authentification JWT
```

---

## 🗺️ Feuille de Route de Migration

### Phase 1 : Préparation et Setup Backend 🔧

**Durée estimée :** 1-2 semaines

#### 1.1 Setup Backend NestJS

- [ ] **Créer nouveau projet NestJS** dans `../portfolio-backend/`
- [ ] **Configuration Prisma + PostgreSQL** (local + production)
- [ ] **Structure modulaire NestJS** (projects, zones, quests, technologies, blog, auth)
- [ ] **Schéma Prisma complet** avec toutes les entités
- [ ] **Migrations initiales** de la base de données

#### 1.2 Migration des Données Actuelles

- [ ] **Script de migration** : `data/projects.json` → PostgreSQL
- [ ] **Enrichissement des données** avec nouvelles entités (zones, quêtes, etc.)
- [ ] **Seed database** avec données de développement
- [ ] **Tests des relations** entre entités

#### 1.3 API Backend Complète

- [ ] **CRUD Projects** (avec Zone/Floor System)
- [ ] **CRUD Zones/Floors** et leurs Quêtes
- [ ] **CRUD Technologies** (Tech Radar)
- [ ] **CRUD Blog Posts** avec relations
- [ ] **Authentification JWT** (admin)
- [ ] **Validation DTOs** et gestion erreurs

### Phase 2 : Adaptation Frontend 🖥️

**Durée estimée :** 2-3 semaines

#### 2.1 Restructuration Frontend

- [ ] **Réorganiser structure** actuelle pour séparer concerns
- [ ] **Client API centralisé** (axios/fetch wrapper)
- [ ] **Gestion d'état** (Zustand/Context) pour données partagées
- [ ] **Types TypeScript** synchronisés avec backend
- [ ] **Configuration environnements** (.env pour API URLs)

#### 2.2 Nouvelles Pages & Fonctionnalités

- [ ] **Dashboard principal** `/dashboard` (privé)
- [ ] **Gestion projets** `/dashboard/projects` (Zone/Floor System)
- [ ] **Tech Radar** `/tech-radar` (public + privé)
- [ ] **Blog** `/blog` avec filtres dynamiques
- [ ] **Pomodoro Timer** `/dashboard/pomodoro`
- [ ] **Admin panel** `/admin` (protégé)

#### 2.3 Migration Pages Existantes

- [ ] **Adapter `/projects`** pour utiliser l'API backend
- [ ] **Enrichir portfolio public** avec nouvelles données
- [ ] **SEO et méta** pour nouvelles pages
- [ ] **Responsive design** complet

### Phase 3 : Intégrations & Finitions ✨

**Durée estimée :** 1-2 semaines

#### 3.1 Fonctionnalités Avancées

- [ ] **Relations dynamiques** projet ↔ techno ↔ blog
- [ ] **Filtres intelligents** (par techno, statut, date)
- [ ] **Recherche full-text** dans projets/blog
- [ ] **Export/Import** données (backup/restore)

#### 3.2 UX/UI Polish

- [ ] **Composants UI cohérents** (Shadcn/Radix)
- [ ] **Animations et transitions** fluides
- [ ] **Mode sombre/clair** persistant
- [ ] **Loading states** et gestion erreurs
- [ ] **Notifications toast** pour actions utilisateur

#### 3.3 Déploiement & Production

- [ ] **Backend déployé** (Railway/Render)
- [ ] **Frontend déployé** (Vercel)
- [ ] **Variables d'environnement** production
- [ ] **Tests end-to-end** critiques
- [ ] **Documentation utilisateur** mise à jour

---

## 🏛️ Architecture Technique Détaillée

### Backend (NestJS + PostgreSQL)

```
portfolio-backend/
├── src/
│   ├── main.ts                    # Bootstrap application
│   ├── app.module.ts             # Module racine
│   │
│   ├── auth/                      # 🔐 Authentification
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   │
│   ├── projects/                  # 📊 Gestion Projets
│   │   ├── entities/
│   │   │   ├── project.entity.ts
│   │   │   ├── zone.entity.ts
│   │   │   ├── floor.entity.ts
│   │   │   └── quest.entity.ts
│   │   ├── dto/
│   │   │   ├── create-project.dto.ts
│   │   │   ├── update-project.dto.ts
│   │   │   └── create-quest.dto.ts
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── projects.module.ts
│   │
│   ├── technologies/              # 🧭 Tech Radar
│   │   ├── entities/technology.entity.ts
│   │   ├── dto/
│   │   ├── technologies.controller.ts
│   │   ├── technologies.service.ts
│   │   └── technologies.module.ts
│   │
│   ├── blog/                      # 📒 Blog/Articles
│   │   ├── entities/
│   │   │   ├── post.entity.ts
│   │   │   ├── category.entity.ts
│   │   │   └── tag.entity.ts
│   │   ├── dto/
│   │   ├── blog.controller.ts
│   │   ├── blog.service.ts
│   │   └── blog.module.ts
│   │
│   ├── pomodoro/                  # ⏱️ Timer Pomodoro
│   │   ├── entities/session.entity.ts
│   │   ├── dto/
│   │   ├── pomodoro.controller.ts
│   │   ├── pomodoro.service.ts
│   │   └── pomodoro.module.ts
│   │
│   └── common/                    # 🔧 Utilitaires
│       ├── guards/
│       ├── interceptors/
│       ├── pipes/
│       └── decorators/
│
├── prisma/
│   ├── schema.prisma             # Schéma complet DB
│   ├── migrations/               # Migrations auto-générées
│   └── seed.ts                   # Données de développement
│
├── test/                         # Tests e2e
├── .env.example                  # Variables d'environnement
└── package.json
```

### Frontend (Next.js 15)

```
portfolio-frontend/
├── app/
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Home/Portfolio public
│   ├── globals.css               # Styles globaux
│   │
│   ├── projects/                 # 💼 Portfolio Public
│   │   ├── page.tsx             # Liste projets
│   │   └── [slug]/page.tsx      # Détail projet
│   │
│   ├── tech-radar/               # 🧭 Tech Radar
│   │   ├── page.tsx             # Vue radar interactive
│   │   └── [slug]/page.tsx      # Détail technologie
│   │
│   ├── blog/                     # 📒 Blog Public
│   │   ├── page.tsx             # Liste articles
│   │   ├── [slug]/page.tsx      # Article détail
│   │   └── category/[slug]/page.tsx # Articles par catégorie
│   │
│   ├── dashboard/                # 🏠 Dashboard Privé
│   │   ├── layout.tsx           # Layout dashboard
│   │   ├── page.tsx             # Vue d'ensemble
│   │   │
│   │   ├── projects/            # Gestion projets
│   │   │   ├── page.tsx         # Liste projets admin
│   │   │   ├── new/page.tsx     # Créer projet
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Détail/édition
│   │   │       ├── zones/       # Gestion Zones
│   │   │       └── floors/      # Gestion Floors
│   │   │
│   │   ├── tech-radar/          # Tech Radar admin
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── blog/                # Blog admin
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   │
│   │   └── pomodoro/            # Timer Pomodoro
│   │       └── page.tsx
│   │
│   ├── admin/                    # 🔐 Admin Panel
│   │   ├── layout.tsx           # Layout admin
│   │   ├── page.tsx             # Dashboard admin
│   │   └── login/page.tsx       # Authentification
│   │
│   └── api/                      # 🔌 API Routes (proxy)
│       └── auth/                # Auth Next.js
│
├── components/
│   ├── ui/                       # 🎨 Composants UI base
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   │
│   ├── dashboard/                # 🏠 Composants Dashboard
│   │   ├── Sidebar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── QuestItem.tsx
│   │   └── PomodoroTimer.tsx
│   │
│   ├── portfolio/                # 💼 Composants Portfolio
│   │   ├── ProjectGrid.tsx
│   │   ├── TechRadar.tsx
│   │   └── BlogCard.tsx
│   │
│   └── common/                   # 🔧 Composants communs
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Navigation.tsx
│       └── SearchBar.tsx
│
├── lib/
│   ├── api.ts                    # Client API centralisé
│   ├── auth.ts                   # Gestion auth frontend
│   ├── store/                    # Zustand stores
│   │   ├── projectStore.ts
│   │   ├── techStore.ts
│   │   └── authStore.ts
│   └── utils.ts                  # Utilitaires
│
├── types/
│   ├── project.ts                # Types projets/zones/quêtes
│   ├── technology.ts             # Types tech radar
│   ├── blog.ts                   # Types blog/articles
│   └── api.ts                    # Types API responses
│
└── public/
    ├── images/
    └── icons/
```

---

## 🗄️ Schéma de Base de Données

### Entités Principales

```prisma
// Projets (Zone System vs Floor System)
model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  type        ProjectType  // ZONE_SYSTEM | FLOOR_SYSTEM
  status      ProjectStatus // PLANNING | ACTIVE | COMPLETED | PAUSED
  featured    Boolean  @default(false)

  // Relations
  zones       Zone[]
  floors      Floor[]
  technologies ProjectTechnology[]
  posts       ProjectPost[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Zones (pour Zone System)
model Zone {
  id          String   @id @default(cuid())
  name        String
  description String?
  order       Int

  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])

  quests      Quest[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Floors (pour Floor System)
model Floor {
  id          String   @id @default(cuid())
  name        String
  description String?
  order       Int

  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])

  floorQuests FloorQuest[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Quêtes (pour Zones)
model Quest {
  id          String   @id @default(cuid())
  title       String
  userStory   String
  definitionOfDone String[]
  manualTests String[]
  techDebt    String?
  status      QuestStatus // TODO | IN_PROGRESS | TESTING | DONE
  priority    Priority    // LOW | MEDIUM | HIGH | CRITICAL

  zoneId      String
  zone        Zone     @relation(fields: [zoneId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Floor Quêtes (pour Floors)
model FloorQuest {
  id          String   @id @default(cuid())
  title       String
  userStory   String
  definitionOfDone String[]
  manualTests String[]
  techDebt    String?
  status      QuestStatus
  priority    Priority

  floorId     String
  floor       Floor    @relation(fields: [floorId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Technologies (Tech Radar)
model Technology {
  id          String   @id @default(cuid())
  name        String   @unique
  category    TechCategory // LANGUAGES | FRAMEWORKS | TOOLS | PLATFORMS
  status      TechStatus   // MASTERED | LEARNING | TO_REVIEW
  description String?

  // Relations
  projects    ProjectTechnology[]
  posts       PostTechnology[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Blog Posts
model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String   // Markdown
  excerpt     String?
  published   Boolean  @default(false)

  // Relations
  projects    ProjectPost[]
  technologies PostTechnology[]
  categories  PostCategory[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
}

// Sessions Pomodoro
model PomodoroSession {
  id          String   @id @default(cuid())
  duration    Int      // en minutes
  type        SessionType // WORK | SHORT_BREAK | LONG_BREAK
  completed   Boolean  @default(false)

  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])

  createdAt   DateTime @default(now())
  completedAt DateTime?
}

// Tables de liaison
model ProjectTechnology {
  projectId    String
  technologyId String

  project      Project    @relation(fields: [projectId], references: [id])
  technology   Technology @relation(fields: [technologyId], references: [id])

  @@id([projectId, technologyId])
}

model ProjectPost {
  projectId String
  postId    String

  project   Project @relation(fields: [projectId], references: [id])
  post      Post    @relation(fields: [postId], references: [id])

  @@id([projectId, postId])
}

model PostTechnology {
  postId       String
  technologyId String

  post         Post       @relation(fields: [postId], references: [id])
  technology   Technology @relation(fields: [technologyId], references: [id])

  @@id([postId, technologyId])
}

// Enums
enum ProjectType {
  ZONE_SYSTEM
  FLOOR_SYSTEM
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  COMPLETED
  PAUSED
}

enum QuestStatus {
  TODO
  IN_PROGRESS
  TESTING
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum TechCategory {
  LANGUAGES
  FRAMEWORKS
  TOOLS
  PLATFORMS
}

enum TechStatus {
  MASTERED
  LEARNING
  TO_REVIEW
}

enum SessionType {
  WORK
  SHORT_BREAK
  LONG_BREAK
}
```

---

## 🔌 API Endpoints

### Projects API

```
GET    /api/projects              # Liste projets (public)
GET    /api/projects/:slug        # Détail projet (public)
POST   /api/projects              # Créer projet (admin)
PUT    /api/projects/:id          # Modifier projet (admin)
DELETE /api/projects/:id          # Supprimer projet (admin)

GET    /api/projects/:id/zones    # Zones d'un projet
POST   /api/projects/:id/zones    # Créer zone
PUT    /api/zones/:id             # Modifier zone
DELETE /api/zones/:id             # Supprimer zone

GET    /api/zones/:id/quests      # Quêtes d'une zone
POST   /api/zones/:id/quests      # Créer quête
PUT    /api/quests/:id            # Modifier quête
DELETE /api/quests/:id            # Supprimer quête
```

### Technologies API

```
GET    /api/technologies          # Liste technologies
GET    /api/technologies/:slug    # Détail technologie
POST   /api/technologies          # Créer technologie (admin)
PUT    /api/technologies/:id      # Modifier technologie (admin)
DELETE /api/technologies/:id      # Supprimer technologie (admin)
```

### Blog API

```
GET    /api/posts                 # Liste articles (public)
GET    /api/posts/:slug           # Article détail (public)
POST   /api/posts                 # Créer article (admin)
PUT    /api/posts/:id             # Modifier article (admin)
DELETE /api/posts/:id             # Supprimer article (admin)
```

### Pomodoro API

```
GET    /api/pomodoro/sessions     # Historique sessions
POST   /api/pomodoro/sessions     # Créer session
PUT    /api/pomodoro/sessions/:id # Terminer session
```

### Auth API

```
POST   /api/auth/login            # Connexion admin
POST   /api/auth/refresh          # Refresh token
POST   /api/auth/logout           # Déconnexion
```

---

## 🚀 Déploiement et Environnements

### Développement Local

```bash
# Backend (port 3001)
cd portfolio-backend
npm run start:dev

# Frontend (port 3000)
cd portfolio-frontend
npm run dev
```

### Production

- **Backend :** Railway/Render (PostgreSQL inclus)
- **Frontend :** Vercel (variables d'env pour API URL)
- **Base de données :** PostgreSQL managée
- **Assets :** Vercel/Cloudinary pour images

---

## 📋 Checklist de Migration

### Avant de Commencer

- [ ] **Backup complet** du projet actuel
- [ ] **Créer branche** `feature/architecture-separation`
- [ ] **Setup environnements** locaux (PostgreSQL)

### Phase Backend

- [ ] **NestJS projet** initialisé et configuré
- [ ] **Prisma schema** complet avec toutes entités
- [ ] **Database seeded** avec données actuelles + exemples
- [ ] **API complète** testée (Postman/Insomnia)
- [ ] **Authentification** JWT fonctionnelle
- [ ] **Documentation API** (Swagger)

### Phase Frontend

- [ ] **Structure reorganisée** et client API intégré
- [ ] **Toutes les pages** migrées vers nouvelle API
- [ ] **Dashboard complet** avec fonctionnalités CRUD
- [ ] **UI/UX cohérente** sur toutes les pages
- [ ] **Tests manuels** de tous les workflows

### Phase Déploiement

- [ ] **Backend déployé** et accessible
- [ ] **Frontend déployé** avec variables d'env correctes
- [ ] **Database production** migrée et sécurisée
- [ ] **Tests end-to-end** sur environnement de production
- [ ] **Documentation** mise à jour (README, DEPLOYMENT)

---

## 🎯 Prochaines Étapes Immédiates

1. **Valider ce plan** avec l'équipe/utilisateur
2. **Préparer environnement** de développement backend
3. **Commencer par le setup NestJS** et schéma Prisma
4. **Créer script de migration** des données actuelles
5. **Développer API MVP** pour les entités principales

---

**📝 Notes :**

- Ce plan peut évoluer selon les besoins découverts en cours de développement
- Prioriser les fonctionnalités MVP avant les features avancées
- Maintenir compatibilité avec le portfolio actuel pendant la transition
