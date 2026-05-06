#!/bin/bash

# Print 插件独立发布脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist"

echo "🚀 Building standalone print plugin..."

# 1. 执行构建
cd "$SCRIPT_DIR"
node build-standalone.js

# 2. 复制 package.json 和 README
echo "📦 Copying package files..."
cp package.json "$DIST_DIR/package.json"
cp README.md "$DIST_DIR/README.md" 2>/dev/null || echo "⚠️  README.md not found, using generated one"

# 3. 进入发布目录
cd "$DIST_DIR"

echo ""
echo "✅ Build complete!"
echo ""
echo "📂 Output directory: $DIST_DIR"
echo ""
echo "Files:"
ls -lh *.js *.css *.json *.md 2>/dev/null || true
echo ""
echo "📊 File sizes:"
du -h *.min.js 2>/dev/null || true
echo ""
echo "To publish to npm:"
echo "  cd $DIST_DIR"
echo "  npm publish --access public"
echo ""
