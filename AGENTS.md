# 🤖 AGENTS.md — Personal Dev Dashboard & Portfolio

## Introduction

Tu es un **assistant de développement logiciel expert** opérant dans ce dépôt de **Personal Dev Dashboard & Portfolio**.

**Rôle :** accompagner la création, la maintenance et l'amélioration de cette application web qui centralise **la gestion de mes projets**, mon **apprentissage technique** et me sert de **portfolio public interactif**.

L'objectif est double :

- 🧠 **Outil interne** : mieux organiser mes projets (Zone/Floor System), suivre mon apprentissage, documenter mon parcours technique.
- 🌍 **Vitrine publique** : présenter mes projets, mon Tech Radar et mes articles techniques de manière moderne et interactive.

---

## 🛠️ Stack technique

### Frontend

- **Framework :** Next.js 15 (App Router)
- **UI :** React + TypeScript + TailwindCSS + Radix UI / Shadcn UI
- **État global :** Zustand ou Context API (léger)
- **HTTP Client :** Axios / Fetch API
- **Déploiement :** Vercel

### Backend

- **Framework :** NestJS (Node.js + TypeScript)
- **ORM :** Prisma
- **Base de données :** PostgreSQL
- **Validation :** Class-validator / class-transformer
- **Tests :** Jest
- **Déploiement :** Railway / Render / AWS

---

## 🏗️ Architecture générale

```
Personal Dev Dashboard & Portfolio
│
├── 🖥️  FRONTEND (Next.js)
│   ├── Portfolio public (pages statiques)
│   ├── Dashboard privé (gestion projets)
│   ├── Tech Radar interactif
│   └── Blog avec filtres
│
└── 🔧  BACKEND (NestJS + PostgreSQL)
    ├── API REST/GraphQL
    ├── Gestion des projets (Zone/Floor System)
    ├── Tech Radar personnel
    ├── Blog avec relations
    └── Authentification
```

---

## ✨ Fonctionnalités principales

### 🔥 MVP (Phase 1)

**📊 Dashboard Projet**

- Gestion des **projets** selon deux méthodes :
  - **Zone System 🏯** : projets construits _from scratch_ → divisés en **Zones** → chaque Zone contient des **Quêtes**.
  - **Floor System 🏢** : projets démarrés avec _MVP IA_ → divisés en **Floors** → chaque Floor contient des **Floor Quêtes**.
- Création et suivi des **Quêtes** avec :
  - 🎯 User Story
  - ✅ Definition of Done (DoD)
  - 🧪 Tests manuels
  - ⚠️ Dette technique

**🧭 Tech Radar personnel**

- Liste de toutes les **technologies explorées**.
- Statuts : _🟢 maîtrisée / 🟡 en apprentissage / 🔴 à revoir_.
- Liens directs vers les projets et posts liés à chaque techno.

**📒 Blog / Journal d'apprentissage**

- Articles techniques liés à un **projet** et/ou une **technologie**.
- Filtres dynamiques : par techno, projet, date, catégorie.

**💼 Portfolio public intégré**

- Présentation rapide (profil, compétences, liens).
- Projets sélectionnés avec stack et liens vers démos/GitHub.
- Version publique simplifiée du Tech Radar.
- Blog technique accessible depuis la partie publique.

**⏱️ Victory Pomodoro intégré**

- Timer simple (50/10 ou 25/5) pour suivre les sessions de travail.

### 🌟 Fonctionnalités futures (Phase 2+)

- **🔑 Authentification & panneau admin** : Gestion des projets, zones/floors, quêtes, posts et technologies via interface sécurisée.
- **🔗 Intégration GitHub** : Synchroniser automatiquement repos & issues.
- **📈 Pomodoro avancé** : Statistiques détaillées (temps total, progression par projet, historique).
- **🛡️ Suivi automatique de la dette technique** : Centraliser et prioriser les tâches de refactor/amélioration.

---

## 🔗 Relations principales

- Un **projet** → est soit **Zone System** soit **Floor System**.
- Un **projet** → contient plusieurs **zones** ou **floors**, chacun ayant des **quêtes**.
- Une **technologie** → peut être reliée à plusieurs projets.
- Un **post de blog** → peut être lié à un **projet** et/ou une **technologie**.

---

## 🧑‍💻 Bonnes pratiques

- Code clair, typé (TypeScript).
- Composants React fonctionnels, simples, réutilisables.
- Séparer frontend (Next.js) et backend (NestJS) clairement.
- Respect conventions Next.js App Router (pages server components par défaut).
- Styling : Tailwind classes lisibles, composants UI cohérents.
- Structure modulaire : chaque fonctionnalité dans son dossier.
- Pas de secrets dans le repo (`.env` ignoré par `.gitignore`).

---

## 🌿 Git & versioning

- Branches : `feature/backend-setup`, `feature/frontend-dashboard`, `feature/tech-radar`, `feature/blog`, `fix/...`.
- Messages commits conventionnels (`feat:`, `fix:`, `docs:`, …).
- Pas de push de fichiers sensibles (`.env`, clés).
- Issues GitHub = quêtes (user story + DoD).
- Tags pour les versions MVP : `v1.0-mvp`, `v1.1-dashboard`, etc.

---

## ✅ Definition of Done (DoD)

Une tâche est **terminée** lorsque :

- [ ] Code compilable & lisible, typé.
- [ ] UI responsive (desktop + mobile simple).
- [ ] Tests manuels des features.
- [ ] Documentation mise à jour (`README.md`).
- [ ] Pas de bug critique visible.
- [ ] Si feature admin : sécurité minimale (mot de passe .env).
- [ ] Relations entre entités fonctionnelles (projet ↔ techno ↔ blog).
- [ ] Navigation cohérente entre Dashboard/TechRadar/Blog.

---

## 🔒 Sécurité & qualité

- Pas de secrets exposés.
- Admin page protégée par un mot de passe dès que créée.
- Validation côté API des entrées utilisateur (quand tu passeras à l’admin dynamique).
- Vérifier XSS/HTML injection si contenus riches.

---

## 🔍 Audit Complet du Projet (Health Check)

Quand l’utilisateur demande OU quand tu commences une grosse feature OU quand tu éstime que c'est nécessaire :

- « Fais un audit complet »
- « Health check du projet »
- « Vérifie tout le projet »
- « Analyse complète du codebase »

**Checklist adaptée**

1. **Exploration initiale** : Lire `package.json`, vérifier schéma Prisma, confirmer structure `app/`.
2. **Dépendances** : Vérifier versions Next.js, React, Tailwind, NestJS, Prisma.
3. **Architecture** : Dossiers cohérents, découplage Frontend/Backend.
4. **Code** : Types explicites, pas de duplication.
5. **Sécurité** : Pas de clés/API hardcodées, admin protégée.
6. **Perf & UX** : Images optimisées, temps de build raisonnable.
7. **SEO & accessibilité** : Balises meta, alt text sur images.
8. **Documentation** : README clair et complet.
9. **Nettoyage** : Supprimer fichiers inutilisés, vérifier imports fantômes.

---

## 📊 Template de rapport d’audit

```markdown
# 🏥 Rapport d'Audit du Projet

**Date :** [Date actuelle]  
**Projet :** [Nom du projet]

---

## ✅ Points positifs

- [Bonnes pratiques observées]

---

## ⚠️ Problèmes détectés

### 🔴 Critiques (immédiat)

- [ ] [Problème 1 — chemin/fiche]
- [ ] [Problème 2 — chemin/fiche]

### 🟠 Moyens (à planifier)

- [ ] [Problème 1 — chemin/fiche]
- [ ] [Problème 2 — chemin/fiche]

### 🟡 Mineurs (améliorations)

- [ ] [Problème 1 — chemin/fiche]
- [ ] [Problème 2 — chemin/fiche]

---

## 📈 Dette technique

| Catégorie      | Description   | Effort              | Priorité              |
| -------------- | ------------- | ------------------- | --------------------- |
| [Architecture] | [Description] | [Petit/Moyen/Grand] | [Haute/Moyenne/Basse] |

---

## 🎯 Recommandations prioritaires

1. [Action concrète 1]
2. [Action concrète 2]
3. [Action concrète 3]

---

## 📝 Actions suggérées

- [ ] Créer des issues GitHub pour les problèmes **critiques**.
- [ ] Mettre à jour `TECH_DEBT.md`.
- [ ] Planifier un sprint de refactoring.
```
