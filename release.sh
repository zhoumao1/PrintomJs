#!/bin/bash

# FlowPrint 一键发布脚本
# 用法：./release.sh [version] [message]
# 示例：./release.sh 1.0.1 "修复分页bug"

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# GitHub 仓库配置
GITHUB_REPO="https://github.com/zhoumao1/FlowPrint.git"
GITHUB_BRANCH="main"

# 检查参数
VERSION=$1
MESSAGE=$2

if [ -z "$VERSION" ]; then
    print_error "请提供版本号"
    echo "用法: ./release.sh <version> [message]"
    echo "示例: ./release.sh 1.0.1 \"修复分页bug\""
    exit 1
fi

if [ -z "$MESSAGE" ]; then
    MESSAGE="Release v${VERSION}"
fi

echo ""
print_info "=========================================="
print_info "FlowPrint 一键发布脚本"
print_info "=========================================="
echo ""
print_info "版本号: ${VERSION}"
print_info "提交信息: ${MESSAGE}"
echo ""

# 1. 检查工作区状态
print_info "1️⃣  检查工作区状态..."
if [ -d ".git" ]; then
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        print_warning "工作区有未提交的更改"
        git status --short
        echo ""
    fi
fi
print_success "工作区检查完成"
echo ""

# 2. 更新版本号
print_info "2️⃣  更新版本号..."
if [ -f "package.json" ]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" package.json
    print_success "已更新 package.json"
fi
echo ""

# 3. 重新构建
print_info "3️⃣  重新构建..."
./build.sh
if [ $? -ne 0 ]; then
    print_error "构建失败"
    exit 1
fi
print_success "构建完成"
echo ""

# 4. 初始化/检查 Git 仓库
print_info "4️⃣  准备 Git 仓库..."
if [ ! -d ".git" ]; then
    print_info "初始化 Git 仓库..."
    git init
    git remote add origin "$GITHUB_REPO"
    print_success "Git 仓库初始化完成"
else
    # 确保 remote 正确
    if ! git remote get-url origin &>/dev/null; then
        git remote add origin "$GITHUB_REPO"
    else
        git remote set-url origin "$GITHUB_REPO"
    fi
    print_info "Git 仓库已存在"
fi
echo ""

# 5. Git 提交
print_info "5️⃣  提交到 Git..."
git add -A
git commit -m "${MESSAGE}" || print_warning "没有新的更改需要提交"
git tag "v${VERSION}" -f
print_success "Git 提交完成"
echo ""

# 6. 推送到 GitHub
print_info "6️⃣  推送到 GitHub..."
echo ""
print_warning "推送使用 HTTPS，需要输入 GitHub Personal Access Token"
print_info "如果还没有 Token，请访问: https://github.com/settings/tokens"
print_info "生成 Token 时勾选 'repo' 权限"
echo ""
echo "正在推送代码和标签..."

# 强制推送到 GitHub（因为是独立仓库）
git push -f origin HEAD:${GITHUB_BRANCH}
git push -f origin --tags

if [ $? -eq 0 ]; then
    print_success "已推送到 GitHub"
    print_info "仓库地址: https://github.com/zhoumao1/FlowPrint"
    print_info "演示地址: https://zhoumao1.github.io/FlowPrint/"
else
    print_error "推送到 GitHub 失败"
    print_warning "请检查网络连接和 GitHub Token"
    echo ""
    read -p "是否继续发布到 npm？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "已取消发布"
        exit 1
    fi
fi
echo ""

# 7. 发布到 npm
print_info "7️⃣  发布到 npm..."
cd dist

# 检查是否已登录 npm
if ! npm whoami &> /dev/null; then
    print_warning "未登录 npm，请先登录"
    npm login
fi

echo ""
print_info "准备发布到 npm..."
echo "包名: flow-print"
echo "版本: ${VERSION}"
echo ""
read -p "确认发布到 npm？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm publish --access public
    if [ $? -eq 0 ]; then
        print_success "已发布到 npm"
        print_info "npm 地址: https://www.npmjs.com/package/flow-print"
        print_info "安装命令: npm install flow-print"
    else
        print_error "发布到 npm 失败"
        exit 1
    fi
else
    print_warning "已跳过 npm 发布"
fi

cd ..
echo ""

# 8. 完成
echo ""
print_success "=========================================="
print_success "🎉 发布完成！"
print_success "=========================================="
echo ""
print_info "版本: v${VERSION}"
print_info "GitHub: https://github.com/zhoumao1/FlowPrint"
print_info "演示: https://zhoumao1.github.io/FlowPrint/"
print_info "npm: https://www.npmjs.com/package/flow-print"
echo ""
print_info "CDN 地址:"
echo "  - https://unpkg.com/flow-print@${VERSION}"
echo "  - https://cdn.jsdelivr.net/npm/flow-print@${VERSION}"
echo ""
