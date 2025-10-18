# 🖼️ Guide pour optimiser vos images de projets

## 📏 **Tailles recommandées**

### **Thumbnails (miniatures)**

- **Résolution** : 800x600px ou 1200x800px
- **Format** : JPG (pour photos) ou PNG (pour captures d'écran)
- **Poids** : < 100KB
- **Ratio** : 4:3 ou 3:2

### **Images de galerie**

- **Résolution** : 1200x800px ou 1600x1000px
- **Format** : JPG optimisé
- **Poids** : < 200KB
- **Ratio** : 3:2 ou 16:10

## 🛠️ **Outils d'optimisation**

### **En ligne (gratuit)**

1. **TinyPNG** - https://tinypng.com
   - Compression intelligente
   - Préserve la qualité
   - Réduit jusqu'à 70% la taille

2. **Squoosh** - https://squoosh.app (Google)
   - Comparaison avant/après
   - Formats modernes (WebP, AVIF)
   - Réglages avancés

### **Logiciels**

- **Photoshop** : Export pour le web
- **GIMP** (gratuit) : Export optimisé
- **ImageOptim** (Mac) / **FileOptimizer** (Windows)

## 📋 **Checklist pour vos images**

✅ **Noms de fichiers**

- Utilisez des tirets (-) au lieu d'underscores (\_)
- Pas d'espaces ou caractères spéciaux
- Exemple : `ecommerce-homepage.jpg`

✅ **Formats**

- JPG pour les photos/screenshots
- PNG pour les graphiques avec transparence
- WebP pour la performance (Next.js convertit automatiquement)

✅ **Optimisation**

- Compressez toujours vos images
- Vérifiez la qualité après compression
- Testez l'affichage sur mobile

## 🎯 **Exemple de structure**

```
public/images/projects/
├── ecommerce-homepage.jpg      (thumbnail)
├── ecommerce-product-page.jpg  (galerie)
├── ecommerce-checkout.jpg      (galerie)
├── dashboard-overview.jpg      (thumbnail)
├── dashboard-analytics.jpg     (galerie)
└── mobile-app-interface.jpg    (thumbnail)
```

## 🚀 **Script d'optimisation automatique**

Vous pouvez utiliser ce script pour optimiser toutes vos images :

```bash
# Installer imagemin-cli
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Optimiser toutes les images
imagemin public/images/projects/*.jpg --out-dir=public/images/projects/optimized --plugin=mozjpeg
```

## 💡 **Bonnes pratiques Next.js**

1. **Utilisez le composant Image** (déjà fait dans le code)
2. **Définissez des tailles multiples** pour responsive
3. **Lazy loading automatique** (Next.js le fait)
4. **Formats modernes** (WebP/AVIF) générés automatiquement

Vos images sont maintenant prêtes pour un affichage parfait ! 🎨
