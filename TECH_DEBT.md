# 📊 Dette Technique - Personal Dev Dashboard & Portfolio

**Dernière mise à jour :** 14 Octobre 2025  
**Dette totale estimée :** ~80-100h de travail

---

## 🔴 Priorité HAUTE (Bloqueurs production)

### 1. Configuration TypeScript Backend

**Statut :** 🔴 Critique  
**Fichier :** `portfolio-backend/tsconfig.json`  
**Problème :** 181 erreurs TypeScript - décorateurs non reconnus  
**Effort :** Petit (5 minutes)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**Solution :**

```jsonc
{
  "compilerOptions": {
    "strictPropertyInitialization": false // AJOUTER CETTE LIGNE
  }
}
```

**Impact si non résolu :** Compilation défectueuse, validations class-validator incertaines

---

### 2. Pages Projets Publiques Cassées

**Statut :** 🔴 Critique  
**Fichiers :**

- `app/projects/[slug]/page.tsx`
- `app/admin/components/ProjectDetails.tsx`

**Problème :** 9 erreurs - fonctions `getProjectBySlug()` et `getAllProjects()` non définies  
**Effort :** Moyen (4-6h)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**Options :**

1. Implémenter les fonctions manquantes via API
2. Supprimer les pages si obsolètes (migration vers admin uniquement)

**Impact si non résolu :** Partie publique du portfolio non fonctionnelle

---

### 3. Authentification Admin Manquante

**Statut :** 🔴 Bloqueur production  
**Fichiers :** Toutes les routes `/admin/*`  
**Problème :** Aucune protection des routes admin  
**Effort :** Moyen (8-12h)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**TODO :**

- [ ] Créer middleware Next.js pour protéger `/admin/*`
- [ ] Implémenter page login
- [ ] Système de session JWT
- [ ] Utiliser `@nestjs/jwt` déjà configuré côté backend

**Impact si non résolu :** 🔴 **IMPOSSIBLE de déployer en production**

---

### 4. Mot de passe Admin Faible

**Statut :** 🔴 Critique en production  
**Fichier :** `portfolio-backend/.env`  
**Problème :** `ADMIN_PASSWORD="admin123"` (dev password)  
**Effort :** Petit (2 minutes)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**Action :**

```bash
openssl rand -base64 32
# Remplacer dans .env.production
```

**Impact si non résolu :** Sécurité compromise en production

---

## 🟠 Priorité MOYENNE (Sprint suivant)

### 5. Tests Inexistants

**Statut :** 🟠 Dette importante  
**Couverture actuelle :** ~0%  
**Effort :** Grand (20-30h)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**TODO :**

- [ ] Tests unitaires services backend (ProjectsService, FloorsService, ZonesService, TechnologiesService)
- [ ] Tests e2e endpoints critiques (GET/POST/PUT/DELETE projects, zones, floors)
- [ ] Tests composants React (Floor System, Zone System)
- [ ] Configuration Jest + React Testing Library

**Impact si non résolu :** Risque de régression, difficulté à maintenir le code

---

### 6. Seed Data Manquant

**Statut :** 🟠 Développement ralenti  
**Fichier :** `portfolio-backend/prisma/seed.ts`  
**Effort :** Petit (3-4h)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**TODO :**

- [ ] Créer 5 projets exemples (3 ZONE_SYSTEM, 2 FLOOR_SYSTEM)
- [ ] Ajouter 10-15 technologies populaires
- [ ] Générer zones/floors/quêtes réalistes
- [ ] Créer catégories et tags pour blog

**Impact si non résolu :** Onboarding développeurs lent, tests manuels fastidieux

---

### 7. Code Mort & Variables Inutilisées

**Statut :** 🟠 Qualité du code  
**Fichiers :**

- `components/admin/quests/QuestForm.tsx` (zoneId, projectId inutilisés)
- `app/admin/quests/page.tsx` (allQuestsLoading inutilisé)
- Autres à identifier

**Effort :** Petit (2h avec ESLint)  
**Assigné à :** -  
**Issue GitHub :** #TBD

**Action :**

```bash
npm run lint -- --fix
# Supprimer manuellement les variables inutilisées restantes
```

**Impact si non résolu :** Code moins lisible, bundle size légèrement plus grand

---

## 🟡 Priorité BASSE (Backlog)

### 8. Logging Non Structuré

**Statut :** 🟡 Amélioration  
**Problème :** console.log() basique  
**Effort :** Petit (2-3h)  
**Assigné à :** -

**Solution :** Intégrer Winston (backend) ou Pino

---

### 9. Gestion d'Erreurs Dispersée

**Statut :** 🟡 Amélioration  
**Problème :** Pas de format uniforme pour les erreurs  
**Effort :** Petit (4h)  
**Assigné à :** -

**TODO :**

- [ ] Exception Filters NestJS (backend)
- [ ] ErrorBoundary React (frontend)

---

### 10. Images Non Optimisées

**Statut :** 🟡 Performance  
**Dossier :** `/public/images/projects/`  
**Effort :** Petit (2h)  
**Assigné à :** -

**Action :** Utiliser next/image avec blur placeholders

---

### 11. CI/CD Manquant

**Statut :** 🟡 DevOps  
**Effort :** Moyen (6h)  
**Assigné à :** -

**TODO :**

- [ ] `.github/workflows/ci.yml`
- [ ] Tests automatiques sur PR
- [ ] Déploiement auto Vercel (frontend)
- [ ] Déploiement auto Railway/Render (backend)

---

### 12. Monitoring Inexistant

**Statut :** 🟡 Observability  
**Effort :** Moyen (5h)  
**Assigné à :** -

**Solution :**

- Sentry (error tracking)
- Posthog (analytics)

---

## 📊 Tableau récapitulatif

| #   | Item                             | Priorité   | Effort | Statut     | Issues |
| --- | -------------------------------- | ---------- | ------ | ---------- | ------ |
| 1   | Configuration TypeScript Backend | 🔴 Haute   | Petit  | 🔴 À faire | -      |
| 2   | Pages Projets Publiques          | 🔴 Haute   | Moyen  | 🔴 À faire | -      |
| 3   | Authentification Admin           | 🔴 Haute   | Moyen  | 🔴 À faire | -      |
| 4   | Mot de passe Admin Fort          | 🔴 Haute   | Petit  | 🔴 À faire | -      |
| 5   | Tests Complets                   | 🟠 Moyenne | Grand  | 🔴 À faire | -      |
| 6   | Seed Data                        | 🟠 Moyenne | Petit  | 🔴 À faire | -      |
| 7   | Code Mort                        | 🟠 Moyenne | Petit  | 🔴 À faire | -      |
| 8   | Logging                          | 🟡 Basse   | Petit  | 🔴 À faire | -      |
| 9   | Gestion Erreurs                  | 🟡 Basse   | Petit  | 🔴 À faire | -      |
| 10  | Images                           | 🟡 Basse   | Petit  | 🔴 À faire | -      |
| 11  | CI/CD                            | 🟡 Basse   | Moyen  | 🔴 À faire | -      |
| 12  | Monitoring                       | 🟡 Basse   | Moyen  | 🔴 À faire | -      |

---

## 🎯 Roadmap de résolution

### Phase 1 : Fixes Critiques (3-4 jours)

**Objectif :** Rendre le projet déployable en production

1. ⚡ Fixer tsconfig.json backend (5 min)
2. 🔒 Implémenter authentification admin (8-12h)
3. 🔐 Changer mot de passe admin (2 min)
4. 🔧 Réparer ou supprimer pages projets publiques (4-6h)

**Total Phase 1 :** ~16-20h

---

### Phase 2 : Qualité & Tests (1-2 semaines)

**Objectif :** Améliorer la maintenabilité 5. 🧪 Implémenter tests essentiels (20-30h) 6. 🌱 Créer seed data complet (3-4h) 7. 🧹 Nettoyer code mort (2h)

**Total Phase 2 :** ~25-36h

---

### Phase 3 : DevOps & Monitoring (backlog)

**Objectif :** Professionnaliser la stack 8. 🔧 Logging structuré (2-3h) 9. ⚠️ Gestion d'erreurs centralisée (4h) 10. 🖼️ Optimisation images (2h) 11. 🚀 CI/CD pipeline (6h) 12. 📊 Monitoring (5h)

**Total Phase 3 :** ~19-20h

---

## 📝 Notes

- **Dette totale estimée :** 60-76h
- **Bloquer production :** Items #1, #3, #4 (obligatoires)
- **Maintenance continue :** Tests (#5) et CI/CD (#11) à prioriser

---

**Dernière révision :** 14 Octobre 2025  
**Prochain audit prévu :** 1 mois après résolution Phase 1
