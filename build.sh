#!/bin/bash

# 快速构建脚本

cd "$(dirname "$0")"

echo "🔨 Building standalone print plugin..."
node build-standalone.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful!"
  echo ""
  echo "📦 Copying package files..."
  cp package.json dist/package.json
  cp README.md dist/README.md
  cp LICENSE dist/LICENSE 2>/dev/null || echo "⚠️  LICENSE not found"

  echo ""
  echo "📋 Syncing to docs..."
  cp dist/*.js docs/
  cp dist/*.css docs/
  cp dist/package.json docs/package.json
  cp dist/README.md docs/README.md
  cp dist/LICENSE docs/LICENSE 2>/dev/null
  echo "✅ Synced to docs/"

  echo ""
  echo "📂 Output: $(pwd)/dist"
  echo ""
  echo "📊 File sizes:"
  cd dist
  ls -lh *.min.js *.css 2>/dev/null | awk '{print "  " $9 ": " $5}'
  echo ""
  echo "Next steps:"
  echo "  1. Test locally: open docs/index.html in browser"
  echo "  2. Publish: ./release.sh <version>"
else
  echo "❌ Build failed!"
  exit 1
fi
