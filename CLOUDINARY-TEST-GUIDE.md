# 🧪 Guide de test Cloudinary

## ✅ Floor Quest 2.1 - COMPLÉTÉ !

### Ce qui a été fait :

#### Backend

- ✅ SDK Cloudinary installé (`cloudinary`, `multer`, `@types/multer`)
- ✅ Service `CloudinaryService` créé avec upload/delete/multiple uploads
- ✅ Controller `UploadController` avec 2 endpoints :
  - `POST /api/upload/image` (upload 1 image)
  - `POST /api/upload/gallery` (upload jusqu'à 10 images)
- ✅ Module `UploadModule` intégré dans `AppModule`
- ✅ Validations : type de fichier (JPEG/PNG/WebP), taille max (5MB)
- ✅ Optimisations automatiques : compression, redimensionnement, format auto

#### Frontend

- ✅ Composant `CloudinaryImage` réutilisable
- ✅ Optimisation automatique (WebP, lazy loading)

---

## 🔧 Configuration requise

### 1. Créer un compte Cloudinary

1. Va sur [cloudinary.com](https://cloudinary.com)
2. Créer un compte gratuit (email + mot de passe)
3. Une fois connecté, tu verras ton **Dashboard**

### 2. Récupérer les identifiants

Dans le Dashboard Cloudinary, tu verras :

```
Account Details
├── Cloud name: dxxxxxx          ← Copie ce nom
├── API Key: 123456789012345     ← Copie cette clé
└── API Secret: [Reveal]         ← Clique sur "Reveal" puis copie
```

### 3. Configurer le backend

Ajoute dans `portfolio-backend/.env` :

```bash
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=ton_secret_ici
```

### 4. Configurer le frontend

Ajoute dans `portfolio-moussadev/.env.local` :

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxx
```

⚠️ **Utilise le MÊME Cloud Name dans les deux !**

### 5. Redémarrer les serveurs

```bash
# Backend (si nécessaire)
cd portfolio-backend
npm run start:dev

# Frontend
cd portfolio-moussadev
npm run dev
```

---

## 🧪 Test manuel de l'upload

### Option 1 : Avec Thunder Client / Postman

1. **Ouvre Thunder Client** dans VS Code (ou Postman)

2. **Crée une nouvelle requête :**
   - Méthode : `POST`
   - URL : `http://localhost:3001/api/upload/image`
   - Body : `multipart/form-data`
3. **Ajoute un fichier :**

   - Clé : `file`
   - Valeur : Sélectionne une image (JPG/PNG/WebP)

4. **Envoie la requête**

5. **Réponse attendue :**

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dxxxxxx/image/upload/v1234567890/projects/thumbnails/abc123.jpg",
  "publicId": "projects/thumbnails/abc123"
}
```

### Option 2 : Avec cURL (terminal)

```bash
# Upload d'une image
curl -X POST http://localhost:3001/api/upload/image \
  -F "file=@/path/to/your/image.jpg"
```

### Option 3 : Depuis le formulaire admin (prochaine étape)

On va l'implémenter dans **Floor Quest 3.1** 🎯

---

## 📁 Structure Cloudinary créée automatiquement

Quand tu uploades des images, elles seront organisées comme ça :

```
Cloudinary Media Library
├── projects/
│   ├── thumbnails/
│   │   ├── abc123.jpg    ← Images thumbnails des projets
│   │   └── def456.jpg
│   └── gallery/
│       ├── xyz789.jpg    ← Images des galeries
│       └── uvw012.jpg
```

---

## 🎨 Utilisation du composant CloudinaryImage

Une fois les images uploadées, tu peux les afficher comme ça :

```tsx
import CloudinaryImage from '@/components/CloudinaryImage';

// Exemple 1 : Image simple
<CloudinaryImage
  publicId="projects/thumbnails/abc123"
  alt="Mon projet"
  width={800}
  height={600}
  className="rounded-lg shadow-lg"
/>

// Exemple 2 : Avec transformations custom
<CloudinaryImage
  publicId="projects/thumbnails/abc123"
  alt="Mon projet"
  width={400}
  height={300}
  transformations="w_400,h_300,c_fill,f_auto,q_auto,e_sharpen"
  className="rounded-lg"
/>
```

### Transformations disponibles :

- `w_800,h_600` : Largeur/hauteur
- `c_fill` : Crop pour remplir (autres : `scale`, `fit`, `limit`)
- `f_auto` : Format automatique (WebP si supporté)
- `q_auto` : Qualité automatique
- `e_sharpen` : Effet netteté
- `e_blur:300` : Effet flou
- `r_10` : Border radius

**Documentation complète :** [Cloudinary Transformations](https://cloudinary.com/documentation/image_transformations)

---

## ✅ Validation

Floor Quest 2.1 est **TERMINÉE** quand :

- ✅ Compte Cloudinary créé
- ✅ Variables d'environnement configurées (backend + frontend)
- ✅ Test d'upload réussi (Thunder Client / Postman)
- ✅ URL d'image Cloudinary retournée
- ✅ Image accessible dans ton Dashboard Cloudinary

---

## 🚀 Prochaine étape

**Floor Quest 2.2** : On va maintenant intégrer l'upload directement dans le formulaire admin (`ProjectForm.tsx`) avec :

- Input file avec preview
- Upload vers Cloudinary au submit
- Stockage de l'URL dans la DB

Dis-moi quand tu as :

1. ✅ Configuré Cloudinary (compte + variables d'env)
2. ✅ Testé l'upload manuellement

Et on passe à la suite ! 🎯
