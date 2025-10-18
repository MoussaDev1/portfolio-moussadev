# 🖼️ Images Open Graph (OG Images)

## Images requises pour le SEO

### 1. Image OG par défaut

**Fichier :** `public/og-image.png`
**Dimensions :** 1200x630 pixels
**Contenu suggéré :**

- Logo/Nom : "MoussaDev"
- Titre : "Développeur Full-Stack"
- Technologies : React • Next.js • TypeScript • NestJS
- Design moderne avec dégradé (bleu → violet → rose)
- Background sombre (dark mode)

### 2. Favicon

**Fichier :** `app/favicon.ico`
✅ Déjà présent

### 3. Images de projets

**Dossier :** `public/images/projects/`
**Format :** JPG/PNG optimisé
**Dimensions recommandées :** 1200x675 pixels (16:9)

---

## Génération d'image OG

### Option 1 : Créer manuellement avec Figma/Canva

1. Créer un design 1200x630px
2. Exporter en PNG
3. Placer dans `public/og-image.png`

### Option 2 : Utiliser Vercel OG Image Generation

```tsx
// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={
          {
            /* styles */
          }
        }
      >
        MoussaDev - Développeur Full-Stack
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

### Option 3 : Template simple

Créer un fichier SVG → Convertir en PNG avec https://cloudconvert.com/svg-to-png

---

## Vérification

Après création, tester l'aperçu avec :

- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Action immédiate

**À faire avant le déploiement :**

1. Créer `public/og-image.png` (1200x630px)
2. Vérifier que toutes les images de projets existent
3. Optimiser les images avec [TinyPNG](https://tinypng.com/) ou [Squoosh](https://squoosh.app/)
