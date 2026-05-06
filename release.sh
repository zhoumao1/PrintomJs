#!/bin/bash

# PrintomJs 发布脚本
# 用法：./release.sh <version> [message]
# 示例：./release.sh 1.0.1 "新增水印功能"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VERSION=$1
MESSAGE=$2

if [ -z "$VERSION" ]; then
    echo "用法: ./release.sh <version> [message]"
    echo "示例: ./release.sh 1.0.1 \"新增水印功能\""
    exit 1
fi

if [ -z "$MESSAGE" ]; then
    MESSAGE="Release v${VERSION}"
fi

echo "=========================================="
echo "PrintomJs 发布"
echo "版本: ${VERSION}"
echo "=========================================="

# 1. 更新版本号
echo "📝 更新版本号..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" package.json

# 2. 构建
echo "🔨 构建中..."
./build.sh

# 3. Git 提交
echo "📦 Git 提交..."
git add -A
git commit -m "${MESSAGE}"
git tag "v${VERSION}"

# 4. 推送到 GitHub（触发 Actions 自动部署）
echo "🚀 推送到 GitHub..."
git push origin main --tags

# 5. 发布到 npm
echo "📤 发布到 npm..."
cd dist
npm publish --access public

echo ""
echo "=========================================="
echo "✅ 发布完成！"
echo "=========================================="
echo "npm: https://www.npmjs.com/package/printom-js"
echo "演示: https://zhoumao1.github.io/PrintomJs/（稍后自动部署）"
