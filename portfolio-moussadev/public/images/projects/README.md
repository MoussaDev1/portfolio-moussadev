# Images de projets

Ce dossier contient les images des projets du portfolio.

## Structure recommandée

```
projects/
├── ecommerce-thumb.jpg      # Miniature pour la carte
├── ecommerce-1.jpg          # Images de la galerie
├── ecommerce-2.jpg
├── dashboard-thumb.jpg
├── dashboard-1.jpg
├── mobile-app-thumb.jpg
└── mobile-app-1.jpg
```

## Formats recommandés

- **Miniatures** : 400x300px, JPG optimisé (< 50KB)
- **Galerie** : 800x600px, JPG optimisé (< 200KB)
- **Formats acceptés** : JPG, PNG, WebP

## Optimisation

Les images sont automatiquement optimisées par Next.js Image component :

- Lazy loading
- Responsive images
- Format moderne (WebP) si supporté
- Placeholder flou pendant le chargement

## Ajout d'images

1. Ajouter vos images dans ce dossier
2. Mettre à jour les chemins dans `data/projects.json`
3. L'affichage se met à jour automatiquement
