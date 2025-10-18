# 🧪 Guide de Test - TechnologySelector

## ✅ Problèmes Résolus

### 1. Erreur 500 corrigée

**Cause** : Le formulaire projet envoyait des **noms de technologies** au lieu d'**IDs (UUID)**  
**Solution** : Nouveau composant `TechnologySelector` qui gère correctement les IDs

### 2. Création de technologie à la volée

**Avant** : Il fallait aller dans Tech Radar → Créer la techno → Retourner au projet  
**Maintenant** : Créez des technologies directement depuis le formulaire projet !

### 3. Sélection de technos existantes

**Avant** : Saisie manuelle avec virgules (erreur-prone)  
**Maintenant** : Autocomplete intelligent avec toutes les technologies disponibles

---

## 🎯 Scénarios de Test

### Scénario 1 : Créer un projet avec des technologies existantes

1. Va sur `http://localhost:3000/admin` → **Projets**
2. Clique **"➕ Nouveau Projet"**
3. Remplis le formulaire :
   - Titre : **"Mon Super Projet"**
   - Type : **Zone System**
   - Statut : **Active**
4. Dans le champ **Technologies** :
   - Commence à taper (ex: "Type") → le dropdown s'ouvre
   - Sélectionne **TypeScript** (si elle existe)
   - Ajoute d'autres technos (React, Node.js, etc.)
5. Remplis description, URLs (optionnel)
6. Clique **"Créer"**

**✅ Résultat attendu** :

- Le projet est créé sans erreur 500
- Les technologies apparaissent comme tags bleus
- Les relations sont enregistrées en BDD

---

### Scénario 2 : Créer une nouvelle technologie à la volée

1. Va sur `http://localhost:3000/admin` → **Projets**
2. Clique **"➕ Nouveau Projet"**
3. Remplis titre, type, statut
4. Dans le champ **Technologies** :
   - Tape **"Prisma"** (si elle n'existe pas)
   - Clique sur **"➕ Créer 'Prisma' comme nouvelle technologie"**
   - Un formulaire rapide apparaît :
     - **Catégorie** : Sélectionne **"🗄️ Base de données"**
     - **Statut** : Laisse **"🔵 En apprentissage"**
   - Clique **"✅ Créer et ajouter"**
5. La nouvelle techno **Prisma** apparaît immédiatement comme tag
6. Continue à ajouter d'autres technos si besoin
7. Clique **"Créer"** le projet

**✅ Résultat attendu** :

- Prisma est créée ET ajoutée au projet
- Elle apparaît maintenant dans Tech Radar
- Le projet est créé avec Prisma dans ses technologies

---

### Scénario 3 : Mélanger technologies existantes et nouvelles

1. Nouveau projet
2. Ajoute **React** (existante) → clique dessus
3. Tape **"Vite"** → Créer nouvelle techno :
   - Catégorie : **"🔧 Outils"**
   - Statut : **"🔵 En apprentissage"**
4. Ajoute **TypeScript** (existante)
5. Tape **"Vitest"** → Créer nouvelle :
   - Catégorie : **"🔧 Outils"**
   - Statut : **"🟣 Exploration"**
6. Crée le projet

**✅ Résultat attendu** :

- 4 technologies liées au projet (2 existantes + 2 nouvelles)
- Les nouvelles technos sont disponibles dans Tech Radar
- Pas d'erreur 500

---

### Scénario 4 : Retirer une technologie

1. Crée un projet avec plusieurs technos
2. Clique sur le **❌** d'un tag bleu
3. La techno est retirée du projet (mais existe toujours dans Tech Radar)
4. Sauvegarde le projet

---

### Scénario 5 : Modifier un projet existant

1. Va dans un projet existant
2. Clique **"✏️ Modifier"**
3. Les technologies du projet apparaissent déjà comme tags
4. Ajoute/retire des technologies
5. Sauvegarde

---

## 🔍 Points à Vérifier

### Frontend

- [ ] Dropdown s'ouvre quand on tape
- [ ] Autocomplete fonctionne (filtre par nom)
- [ ] Tags bleus s'affichent correctement
- [ ] Bouton "Créer nouvelle techno" apparaît
- [ ] Formulaire rapide fonctionne (catégorie + statut)
- [ ] Bouton ❌ retire les tags
- [ ] Pas d'erreur console

### Backend

- [ ] Pas d'erreur 500 dans les logs backend
- [ ] `POST /api/projects` accepte `technologyIds: ["uuid1", "uuid2"]`
- [ ] Relations créées dans table `ProjectTechnology`
- [ ] Technologies liées visibles dans détails projet

### Base de Données

Vérifie dans PostgreSQL (ou Prisma Studio) :

```sql
-- Voir les relations projet-technologie
SELECT p.title, t.name
FROM "Project" p
JOIN "ProjectTechnology" pt ON pt."projectId" = p.id
JOIN "Technology" t ON t.id = pt."technologyId";
```

---

## 🐛 Si Problèmes

### Erreur "Cannot read property 'map' of undefined"

→ Le backend ne retourne pas les technologies. Vérifie l'include Prisma dans `projects.service.ts`

### Dropdown ne s'ouvre pas

→ Vérifie que `GET /api/technologies` retourne des données (ouvre DevTools → Network)

### Technologies créées mais pas liées au projet

→ Vérifie que `technologyIds` contient bien des UUIDs et non des noms

### Erreur 500 persiste

→ Regarde les logs backend pour voir l'erreur Prisma exacte

---

## 📊 Vérification Finale

Une fois les tests réussis :

1. ✅ Crée un projet "Test Tech" avec 3 technos (1 existante + 2 nouvelles)
2. ✅ Va dans Tech Radar → vérifie que les 2 nouvelles sont présentes
3. ✅ Va dans le détail du projet → vérifie que les 3 technos sont listées
4. ✅ Modifie le projet → retire 1 techno, ajoute 1 autre
5. ✅ Vérifie en BDD que les relations sont correctes

Si tout fonctionne → **TechnologySelector opérationnel** ! 🎉
