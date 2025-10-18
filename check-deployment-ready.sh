#!/bin/bash

# 🚀 Script de préparation au déploiement V1
# Ce script vérifie que tout est prêt pour le déploiement

echo "🔍 Vérification pré-déploiement..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
SUCCESS=0
WARNINGS=0
ERRORS=0

# Fonction de vérification
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((ERRORS++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 VÉRIFICATION FRONTEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd portfolio-moussadev

# Vérifier node_modules
if [ -d "node_modules" ]; then
    check "node_modules existe"
else
    echo -e "${RED}✗${NC} node_modules manquant"
    echo "  → Exécutez: npm install"
    ((ERRORS++))
fi

# Vérifier .env.example
if [ -f ".env.example" ]; then
    check ".env.example existe"
else
    warn ".env.example manquant (optionnel)"
fi

# Vérifier les fichiers critiques
[ -f "package.json" ] && check "package.json existe" || { echo -e "${RED}✗${NC} package.json manquant"; ((ERRORS++)); }
[ -f "next.config.ts" ] && check "next.config.ts existe" || { echo -e "${RED}✗${NC} next.config.ts manquant"; ((ERRORS++)); }
[ -f "tsconfig.json" ] && check "tsconfig.json existe" || { echo -e "${RED}✗${NC} tsconfig.json manquant"; ((ERRORS++)); }

# Test de build
echo ""
echo "🔨 Test de build frontend..."
npm run build > /dev/null 2>&1
check "Build frontend réussi"

# Test de lint
echo "🔍 Test de lint frontend..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    check "Lint frontend réussi"
else
    warn "Lint frontend a des warnings (non bloquant)"
fi

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 VÉRIFICATION BACKEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd portfolio-backend

# Vérifier node_modules
if [ -d "node_modules" ]; then
    check "node_modules existe"
else
    echo -e "${RED}✗${NC} node_modules manquant"
    echo "  → Exécutez: npm install"
    ((ERRORS++))
fi

# Vérifier .env.example
if [ -f ".env.example" ]; then
    check ".env.example existe"
else
    echo -e "${RED}✗${NC} .env.example manquant"
    ((ERRORS++))
fi

# Vérifier Prisma schema
if [ -f "prisma/schema.prisma" ]; then
    check "prisma/schema.prisma existe"
else
    echo -e "${RED}✗${NC} prisma/schema.prisma manquant"
    ((ERRORS++))
fi

# Test de build
echo ""
echo "🔨 Test de build backend..."
npm run build > /dev/null 2>&1
check "Build backend réussi"

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 VÉRIFICATION DOCUMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ -f "README.md" ] && check "README.md existe" || warn "README.md manquant"
[ -f "DEPLOYMENT.md" ] && check "DEPLOYMENT.md existe" || warn "DEPLOYMENT.md manquant"
[ -f "AGENTS.md" ] && check "AGENTS.md existe" || warn "AGENTS.md manquant"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 VÉRIFICATION SÉCURITÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Vérifier .gitignore
if grep -q ".env" .gitignore 2>/dev/null; then
    check ".env dans .gitignore"
else
    echo -e "${RED}✗${NC} .env PAS dans .gitignore"
    ((ERRORS++))
fi

if grep -q "node_modules" .gitignore 2>/dev/null; then
    check "node_modules dans .gitignore"
else
    echo -e "${RED}✗${NC} node_modules PAS dans .gitignore"
    ((ERRORS++))
fi

# Vérifier qu'il n'y a pas de .env commité
if git ls-files | grep -q "\.env$"; then
    echo -e "${RED}✗${NC} Fichier .env commité dans Git!"
    echo "  → Exécutez: git rm --cached .env"
    ((ERRORS++))
else
    check "Pas de .env commité"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ Succès : $SUCCESS${NC}"
echo -e "${YELLOW}⚠ Warnings : $WARNINGS${NC}"
echo -e "${RED}✗ Erreurs : $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUT EST PRÊT POUR LE DÉPLOIEMENT !${NC}"
    echo ""
    echo "📝 Prochaines étapes :"
    echo "  1. Créer un compte Railway (https://railway.app)"
    echo "  2. Créer un compte Vercel (https://vercel.com)"
    echo "  3. Créer un compte Cloudinary (https://cloudinary.com)"
    echo "  4. Suivre le guide DEPLOYMENT.md"
    echo ""
    exit 0
else
    echo -e "${RED}❌ DES ERREURS DOIVENT ÊTRE CORRIGÉES${NC}"
    echo ""
    echo "Corrigez les erreurs ci-dessus avant de déployer."
    echo ""
    exit 1
fi
