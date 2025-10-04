#!/bin/bash
set -e

echo "🔨 Building MeeChain DApp..."

echo "📦 Step 1: Building frontend with Vite..."
npx vite build

echo "📁 Step 2: Organizing build output..."
if [ -d "dist/public" ]; then
  rm -rf dist/public
fi
mkdir -p dist/public

mv dist/index.html dist/public/
mv dist/assets dist/public/

echo "⚙️  Step 3: Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "📋 Step 4: Copying deployment registry..."
if [ -f "deploy-registry.json" ]; then
  cp deploy-registry.json dist/
  echo "✓ deploy-registry.json copied"
else
  echo "⚠ deploy-registry.json not found (will use env vars)"
fi

echo "✅ Build complete!"
echo ""
echo "Build output:"
ls -lh dist/
echo ""
echo "Frontend files:"
ls -lh dist/public/ | head -5
