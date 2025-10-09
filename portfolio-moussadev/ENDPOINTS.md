# 📡 API Endpoints - Personal Dev Dashboard

> **Base URL Backend:** `http://localhost:3001/api`

---

## 📦 Projects

### CRUD de base

| Méthode  | Endpoint               | Description                  |
| -------- | ---------------------- | ---------------------------- |
| `GET`    | `/projects`            | Liste tous les projets       |
| `POST`   | `/projects`            | Créer un nouveau projet      |
| `GET`    | `/projects/:id`        | Récupérer un projet par ID   |
| `GET`    | `/projects/slug/:slug` | Récupérer un projet par slug |
| `PATCH`  | `/projects/:id`        | Modifier un projet           |
| `DELETE` | `/projects/:id`        | Supprimer un projet          |
| `GET`    | `/projects/:id/stats`  | Statistiques d'un projet     |

**Query Parameters:**

- `GET /projects?featured=true` : Filtrer les projets featured

---

## 🏯 Zones (Zone System)

### Routes directes `/zones`

| Méthode  | Endpoint                             | Description                          |
| -------- | ------------------------------------ | ------------------------------------ |
| `GET`    | `/zones`                             | Liste toutes les zones               |
| `GET`    | `/zones?projectId=xxx`               | Zones d'un projet spécifique         |
| `GET`    | `/zones/:id`                         | Récupérer une zone par ID            |
| `POST`   | `/zones`                             | Créer une nouvelle zone              |
| `PUT`    | `/zones/:id`                         | Modifier une zone                    |
| `DELETE` | `/zones/:id`                         | Supprimer une zone                   |
| `GET`    | `/zones/:id/stats`                   | Statistiques d'une zone              |
| `GET`    | `/zones/project/:projectId/overview` | Vue d'ensemble des zones d'un projet |

### Routes nested `/projects/:projectId/zones` ⭐

| Méthode  | Endpoint                                   | Description                   |
| -------- | ------------------------------------------ | ----------------------------- |
| `GET`    | `/projects/:projectId/zones`               | Liste les zones d'un projet   |
| `POST`   | `/projects/:projectId/zones`               | Créer une zone dans un projet |
| `GET`    | `/projects/:projectId/zones/:zoneId`       | Récupérer une zone            |
| `PUT`    | `/projects/:projectId/zones/:zoneId`       | Modifier une zone             |
| `DELETE` | `/projects/:projectId/zones/:zoneId`       | Supprimer une zone            |
| `GET`    | `/projects/:projectId/zones/:zoneId/stats` | Stats d'une zone              |

---

## 🏢 Floors (Floor System)

### Routes directes `/floors`

| Méthode  | Endpoint                              | Description                           |
| -------- | ------------------------------------- | ------------------------------------- |
| `GET`    | `/floors`                             | Liste tous les floors                 |
| `GET`    | `/floors?projectId=xxx`               | Floors d'un projet spécifique         |
| `GET`    | `/floors/:id`                         | Récupérer un floor par ID             |
| `POST`   | `/floors`                             | Créer un nouveau floor                |
| `PUT`    | `/floors/:id`                         | Modifier un floor                     |
| `DELETE` | `/floors/:id`                         | Supprimer un floor                    |
| `GET`    | `/floors/:id/stats`                   | Statistiques d'un floor               |
| `GET`    | `/floors/project/:projectId/overview` | Vue d'ensemble des floors d'un projet |

### Routes nested `/projects/:projectId/floors` ⭐

| Méthode  | Endpoint                                     | Description                   |
| -------- | -------------------------------------------- | ----------------------------- |
| `GET`    | `/projects/:projectId/floors`                | Liste les floors d'un projet  |
| `POST`   | `/projects/:projectId/floors`                | Créer un floor dans un projet |
| `GET`    | `/projects/:projectId/floors/:floorId`       | Récupérer un floor            |
| `PUT`    | `/projects/:projectId/floors/:floorId`       | Modifier un floor             |
| `DELETE` | `/projects/:projectId/floors/:floorId`       | Supprimer un floor            |
| `GET`    | `/projects/:projectId/floors/:floorId/stats` | Stats d'un floor              |

---

## 🎯 Zone Quests

### Routes directes `/zones/:id/quests`

| Méthode  | Endpoint                 | Description                   |
| -------- | ------------------------ | ----------------------------- |
| `GET`    | `/zones/:id/quests`      | Liste les quests d'une zone   |
| `POST`   | `/zones/:id/quests`      | Créer une quest dans une zone |
| `GET`    | `/zones/quests/:questId` | Récupérer une quest par ID    |
| `PUT`    | `/zones/quests/:questId` | Modifier une quest            |
| `DELETE` | `/zones/quests/:questId` | Supprimer une quest           |

### Routes nested `/projects/:projectId/zones/:zoneId/quests` ⭐

| Méthode  | Endpoint                                             | Description                 |
| -------- | ---------------------------------------------------- | --------------------------- |
| `GET`    | `/projects/:projectId/zones/:zoneId/quests`          | Liste les quests d'une zone |
| `POST`   | `/projects/:projectId/zones/:zoneId/quests`          | Créer une quest             |
| `GET`    | `/projects/:projectId/zones/:zoneId/quests/:questId` | Récupérer une quest         |
| `PUT`    | `/projects/:projectId/zones/:zoneId/quests/:questId` | Modifier une quest          |
| `DELETE` | `/projects/:projectId/zones/:zoneId/quests/:questId` | Supprimer une quest         |

---

## 🎯 Floor Quests

### Routes directes `/floors/:id/quests`

| Méthode  | Endpoint                  | Description                   |
| -------- | ------------------------- | ----------------------------- |
| `GET`    | `/floors/:id/quests`      | Liste les quests d'un floor   |
| `POST`   | `/floors/:id/quests`      | Créer une quest dans un floor |
| `GET`    | `/floors/quests/:questId` | Récupérer une quest par ID    |
| `PUT`    | `/floors/quests/:questId` | Modifier une quest            |
| `DELETE` | `/floors/quests/:questId` | Supprimer une quest           |

### Routes nested `/projects/:projectId/floors/:floorId/quests` ⭐

| Méthode  | Endpoint                                               | Description                 |
| -------- | ------------------------------------------------------ | --------------------------- |
| `GET`    | `/projects/:projectId/floors/:floorId/quests`          | Liste les quests d'un floor |
| `POST`   | `/projects/:projectId/floors/:floorId/quests`          | Créer une quest             |
| `GET`    | `/projects/:projectId/floors/:floorId/quests/:questId` | Récupérer une quest         |
| `PUT`    | `/projects/:projectId/floors/:floorId/quests/:questId` | Modifier une quest          |
| `DELETE` | `/projects/:projectId/floors/:floorId/quests/:questId` | Supprimer une quest         |

---

## 🔧 Technologies

| Méthode  | Endpoint                    | Description                                |
| -------- | --------------------------- | ------------------------------------------ |
| `GET`    | `/technologies`             | Liste toutes les technologies              |
| `POST`   | `/technologies`             | Créer une nouvelle technologie             |
| `GET`    | `/technologies/:identifier` | Récupérer une technologie (par ID ou slug) |
| `PATCH`  | `/technologies/:id`         | Modifier une technologie                   |
| `DELETE` | `/technologies/:id`         | Supprimer une technologie                  |
| `GET`    | `/technologies/stats`       | Statistiques des technologies              |

---

## 📋 DTOs (Data Transfer Objects)

### CreateProjectDto

```typescript
{
  title: string;
  slug: string;
  description: string;
  type: "ZONE" | "FLOOR";
  status?: "ACTIVE" | "ARCHIVED" | "PLANNING";
  featured?: boolean;
  repositoryUrl?: string;
  liveUrl?: string;
  technologies?: string[]; // IDs des technologies
}
```

### CreateZoneDto / CreateFloorDto

```typescript
{
  name: string;
  description?: string;
  order?: number;
  projectId: string;
}
```

### CreateZoneQuestDto / CreateFloorQuestDto

```typescript
{
  title: string;
  userStory?: string;
  definitionOfDone?: string;
  manualTests?: string;
  technicalDebt?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  order?: number;
  zoneId?: string; // Pour ZoneQuest
  floorId?: string; // Pour FloorQuest
}
```

---

## 🎯 Frontend API Client Usage

### Zones

```typescript
// Récupérer les zones d'un projet
const zones = await apiClient.getZones(projectId);

// Créer une zone
const newZone = await apiClient.createZone(projectId, {
  name: "Core Features",
  description: "Main features",
  order: 1,
});

// Modifier une zone
await apiClient.updateZone(projectId, zoneId, { name: "Updated Name" });

// Supprimer une zone
await apiClient.deleteZone(projectId, zoneId);

// Statistiques
const stats = await apiClient.getZoneStats(projectId, zoneId);
```

### Floors

```typescript
// Récupérer les floors d'un projet
const floors = await apiClient.getFloors(projectId);

// Créer un floor
const newFloor = await apiClient.createFloor(projectId, {
  name: "Authentication Floor",
  description: "User auth system",
  order: 1,
});

// Modifier un floor
await apiClient.updateFloor(projectId, floorId, { name: "Updated Name" });

// Supprimer un floor
await apiClient.deleteFloor(projectId, floorId);

// Statistiques
const stats = await apiClient.getFloorStats(projectId, floorId);
```

### Quests

```typescript
// Zone Quests
const quests = await apiClient.getZoneQuests(projectId, zoneId);
await apiClient.createZoneQuest(projectId, zoneId, questData);
await apiClient.updateZoneQuest(projectId, zoneId, questId, updateData);
await apiClient.deleteZoneQuest(projectId, zoneId, questId);

// Floor Quests
const quests = await apiClient.getFloorQuests(projectId, floorId);
await apiClient.createFloorQuest(projectId, floorId, questData);
await apiClient.updateFloorQuest(projectId, floorId, questId, updateData);
await apiClient.deleteFloorQuest(projectId, floorId, questId);
```

---

## 🏗️ Architecture Backend

### Structure Modulaire

```
AppModule
├── ProjectsModule
│   └── ProjectsController → /api/projects
│
├── ZonesModule
│   ├── ZonesController → /api/zones
│   └── ProjectZonesController → /api/projects/:projectId/zones
│
├── FloorsModule
│   ├── FloorsController → /api/floors
│   └── ProjectFloorsController → /api/projects/:projectId/floors
│
└── TechnologiesModule
    └── TechnologiesController → /api/technologies
```

### Patterns disponibles

**Pattern 1 : Routes directes (legacy)**

- ✅ Accès rapide avec query params
- ✅ Rétrocompatibilité
- Exemple : `GET /zones?projectId=xxx`

**Pattern 2 : Routes nested (recommandé) ⭐**

- ✅ RESTful et hiérarchique
- ✅ Relations parent-enfant explicites
- ✅ Meilleure sécurité et validation
- Exemple : `GET /projects/:projectId/zones`

---

## ✅ État du Frontend

| Composant                   | Status     | Utilise Routes Nested |
| --------------------------- | ---------- | --------------------- |
| `lib/api.ts`                | ✅ À jour  | ✅ Oui                |
| `lib/hooks/useZones.ts`     | ✅ À jour  | ✅ Oui                |
| `lib/hooks/useFloors.ts`    | ✅ À jour  | ✅ Oui                |
| `app/admin/zones/page.tsx`  | ✅ À jour  | ✅ Oui                |
| `app/admin/floors/page.tsx` | ⚠️ À créer | -                     |

---

## 🚀 Prochaines étapes

1. ✅ Backend refactoré (architecture modulaire)
2. ✅ Frontend API client aligné
3. ✅ Hooks mis à jour
4. ⏳ Créer l'interface Floors (Phase 3)
5. ⏳ Système de Quests complet (Phase 4)

---

**📝 Note :** Les routes avec ⭐ sont les **routes recommandées** pour le développement frontend. Les routes directes restent disponibles pour la compatibilité.
