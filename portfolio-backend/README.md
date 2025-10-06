# Portfolio Backend API

Backend NestJS pour le Personal Dev Dashboard & Portfolio avec PostgreSQL et Prisma.

## ��� Installation

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Configurer votre base de données PostgreSQL dans .env
# DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_dev?schema=public"
```

## ���️ Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init

# Peupler la base de données avec des données d'exemple
npm run seed
```

## ��� Développement

```bash
# Démarrer en mode développement
npm run start:dev

# L'API sera disponible sur http://localhost:3001/api
```

## ��� Endpoints API

### Projects

- `GET /api/projects` - Liste tous les projets
- `GET /api/projects?featured=true` - Projets mis en avant uniquement
- `GET /api/projects/:id` - Détail d'un projet par ID
- `GET /api/projects/slug/:slug` - Détail d'un projet par slug
- `GET /api/projects/:id/stats` - Statistiques d'un projet
- `POST /api/projects` - Créer un nouveau projet
- `PATCH /api/projects/:id` - Modifier un projet
- `DELETE /api/projects/:id` - Supprimer un projet

### Exemple de création de projet

```json
POST /api/projects
{
  "slug": "mon-nouveau-projet",
  "title": "Mon Nouveau Projet",
  "description": "Description courte du projet",
  "fullDescription": "Description complète...",
  "type": "ZONE_SYSTEM",
  "status": "ACTIVE",
  "featured": true,
  "category": "Web Development",
  "highlights": [
    "Feature 1",
    "Feature 2"
  ],
  "duration": "2 mois",
  "teamSize": 1,
  "technologyIds": ["tech-id-1", "tech-id-2"]
}
```

## ���️ Architecture

```
src/
├── prisma/          # Service Prisma global
├── projects/        # Module Projects avec CRUD complet
│   ├── dto/        # Data Transfer Objects
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.module.ts
├── app.module.ts    # Module racine
└── main.ts         # Point d'entrée
```

## ��� Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## ��� Scripts disponibles

- `npm run start:dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run start:prod` - Démarrage en production
- `npm run seed` - Peupler la base de données
- `npx prisma studio` - Interface graphique pour la base de données

## ��� Variables d'environnement

Voir `.env.example` pour la liste complète des variables.

## ��� Prochaines étapes

- [ ] Module Technologies (Tech Radar)
- [ ] Module Blog/Posts
- [ ] Module Zones/Floors/Quêtes
- [ ] Module Pomodoro
- [ ] Authentification JWT
- [ ] Documentation Swagger
