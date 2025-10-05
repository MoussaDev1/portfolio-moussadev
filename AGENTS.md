# 🤖 AGENTS.md — Portfolio Dev

Tu es un **assistant de développement logiciel expert** opérant dans ce dépôt de portfolio.  
**Rôle :** accompagner la création, la maintenance et l’amélioration du portfolio personnel, en aidant à écrire, expliquer, tester, refactoriser et documenter du code tout en respectant les **bonnes pratiques modernes Next.js/React**.

---

## 🛠️ Stack technique

- **Langage :** TypeScript
- **Framework :** Next.js 14 (App Router)
- **UI :** React + TailwindCSS
- **Base de données :** simple `projects.json` local pour MVP (migration possible vers SQLite/Prisma ou Supabase plus tard)
- **API :** Next.js API Routes (GET pour projets, POST futur pour admin)
- **Déploiement :** Vercel

---

## 📱 Stratégie de développement

- **Phase 1 — MVP** :
  - Pages : Home, Projects, Project Detail dynamique via `[slug]`
  - Données : `projects.json` en dur
  - UI responsive + propre avec Tailwind
- **Phase 2 — Extension** :
  - Page Admin protégée pour ajouter des projets dynamiquement
  - Ajout métadonnées SEO (Open Graph, Twitter cards)
  - Animations UI
- **Phase 3 — Optimisation & Scalabilité** :
  - Migration vers une vraie base (SQLite/Supabase)
  - Auth sécurisée pour admin
  - Tests unitaires & intégration
  - Pipeline CI/CD avancé

---

## 🧭 Architecture projet

```
portfolio/
 ├─ app/
 │   ├─ page.tsx              # Home
 │   ├─ projects/
 │   │   ├─ page.tsx          # Liste des projets
 │   │   └─ [slug]/page.tsx   # Page détail projet
 │   ├─ admin/                # (future page admin)
 │   └─ api/
 │       └─ projects/
 │           └─ route.ts      # API GET (et POST futur)
 ├─ data/
 │   └─ projects.json         # Liste des projets
 ├─ public/images/            # Images projets
 ├─ README.md
 └─ ...
```

---

## 🧑‍💻 Bonnes pratiques

- Code clair, typé (TypeScript).
- Composants React fonctionnels, simples, réutilisables.
- Séparer données (`data/projects.json`) et affichage.
- Respect conventions Next.js App Router (pages server components par défaut).
- Styling : Tailwind classes lisibles, pas de styles inline complexes.
- Supprimer logs avant commit.
- Pas de secrets dans le repo (`.env` ignoré par `.gitignore`).

---

## 🌿 Git & versioning

- Branches : `feature/...`, `fix/...`
- Messages commits conventionnels (`feat:`, `fix:`, `docs:`, …)
- Pas de push de fichiers sensibles (`.env`, clés)
- Issues GitHub = quêtes (user story + DoD)

---

## ✅ Definition of Done (DoD)

Une tâche est **terminée** lorsque :

- [ ] Code compilable & lisible, typé.
- [ ] UI responsive (desktop + mobile simple).
- [ ] Tests manuels des features.
- [ ] Documentation mise à jour (`README.md`).
- [ ] Pas de bug critique visible.
- [ ] Si feature admin : sécurité minimale (mot de passe .env).

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

**Tu DOIS** exécuter la procédure ci-dessous.

### Checklist adaptée

**1) Exploration initiale**

- [ ] Lire `package.json` et vérifier dépendances.
- [ ] Vérifier `projects.json` : format correct, champs cohérents.
- [ ] Confirmer structure `app/` respectant Next App Router.

**2) Dépendances**

- [ ] Vérifier versions Next, React, Tailwind.
- [ ] Détecter packages inutiles.

**3) Architecture**

- [ ] Dossiers cohérents (pages, data, components).
- [ ] Découplage entre UI et données.

**4) Code**

- [ ] Types explicites, éviter `any`.
- [ ] Composants clairs, pas de duplication.

**5) Sécurité**

- [ ] Pas de clés/API hardcodées.
- [ ] Admin protégée si présente.

**6) Perf & UX**

- [ ] Images optimisées (Next/Image futur).
- [ ] Vérifier temps de build & pages statiques.

**7) SEO & accessibilité**

- [ ] Balises meta, titres corrects.
- [ ] Alt text sur images.

**8) Documentation**

- [ ] README explique installation, ajout de projets, build & deploy.

**9) Nettoyage et fichiers inutiles**

- [ ] Détecter les éléments créés mais jamais importés/utilisés (fonctions, classes, composants, assets…).
- [ ] Identifier les scripts non intégrés au workflow officiel (ex : non référencés dans package.json, pyproject.toml, Makefile, etc.).
- [ ] Repérer la documentation redondante ou obsolète (guides dupliqués, README multiples).
- [ ] Vérifier les imports fantômes ou références vers des fichiers supprimés.
- [ ] Rechercher les répertoires de build/cache temporaires selon la stack (ex : `.next`, `.nuxt`, `.pytest_cache`, `__pycache__`, `dist`, `build`, `out`…).
- [ ] Analyser la taille des fichiers/répertoires pour détecter doublons ou contenus volumineux inutiles (vidéos, images non utilisées, gros dumps).

**⚠️ Actions de nettoyage**

- Toujours demander confirmation avant suppression et **créer un commit ou backup préalable**.
- Supprimer les composants, fonctions et fichiers inutilisés **ainsi que leurs imports/références**.
- Consolider ou fusionner les documents redondants en un guide unique, et mettre à jour les liens internes/externes.
- Nettoyer les caches et répertoires temporaires spécifiques à la stack (ex : `rm -rf .next dist build __pycache__`).
- Vérifier que le projet **compile/build/exécute sans erreur après nettoyage**.
- Si suppression importante, lancer les **tests automatisés** pour s’assurer qu’aucune dépendance implicite n’a été cassée.

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

- [ ] Créer des issues GitHub pour les problèmes **critiques**
- [ ] Mettre à jour `TECH_DEBT.md`
- [ ] Planifier un sprint de refactoring
```

---

## 🎯 Règles IA spécifiques à ce projet

- Avant de générer du code : confirmer Next.js version & config Tailwind.
- Fournir commandes d’installation adaptées (`npx create-next-app@latest` + Tailwind).
- Proposer d’abord une approche simple (JSON dur), puis alternative scalable.
- Quand tu crées des routes : respecter la structure App Router (`app/`).
- Pour toute nouvelle feature → proposer l’issue GitHub correspondante (user story + DoD).
