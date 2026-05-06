# PrintomJs 发布脚本使用指南

## 🚀 一键发布脚本

### release.sh - 完整发布流程

自动完成版本更新、构建、Git 提交、GitHub 推送、npm 发布的完整流程。

#### 使用方法

```bash
./release.sh <version> [message]
```

**参数：**
- `version` - 版本号（必填），如 `1.0.1`
- `message` - 提交信息（可选），默认为 `Release v{version}`

**示例：**

```bash
# 发布 1.0.1 版本
./release.sh 1.0.1

# 发布 1.0.2 版本并指定提交信息
./release.sh 1.0.2 "修复表格跨页bug"

# 发布 1.1.0 版本（新功能）
./release.sh 1.1.0 "新增图片自适应功能"
```

#### 执行流程

脚本会自动执行以下步骤：

1. ✅ **检查工作区状态** - 确保没有未提交的更改
2. ✅ **更新版本号** - 自动更新 package.json 中的版本
3. ✅ **重新构建** - 执行 `./build.sh` 生成最新的构建文件
4. ✅ **更新 docs** - 复制 dist 到 docs（用于 GitHub Pages）
5. ✅ **Git 提交** - 提交所有更改并创建版本标签
6. ✅ **推送到 GitHub** - 推送代码和标签到远程仓库
7. ✅ **发布到 npm** - 发布到 npm 仓库（需要确认）

#### 注意事项

1. **首次使用前需要：**
   - 配置 Git SSH 密钥或使用 HTTPS
   - 登录 npm：`npm login`

2. **版本号规范：**
   - 遵循语义化版本：`主版本.次版本.修订号`
   - 修复 bug：递增修订号（1.0.0 → 1.0.1）
   - 新增功能：递增次版本号（1.0.0 → 1.1.0）
   - 重大更新：递增主版本号（1.0.0 → 2.0.0）

3. **发布到 npm 时会要求确认**，可以选择跳过

## 📦 其他脚本

### build.sh - 仅构建

只执行构建，不发布：

```bash
./build.sh
```

### publish-standalone.sh - 构建并准备发布

构建并显示发布信息，但不自动推送：

```bash
./publish-standalone.sh
```

## 🔧 手动发布流程

如果不想使用自动脚本，可以手动执行：

### 1. 更新版本号

编辑 `package.json`：
```json
{
  "version": "1.0.1"
}
```

### 2. 构建

```bash
./build.sh
```

### 3. 提交到 Git

```bash
git add -A
git commit -m "Release v1.0.1"
git tag v1.0.1
```

### 4. 推送到 GitHub

```bash
git push origin main
git push origin --tags
```

### 5. 发布到 npm

```bash
cd dist
npm publish --access public
```

## 🐛 常见问题

### Q: 推送到 GitHub 失败？

**A:** 检查 SSH 密钥配置：

```bash
# 测试 SSH 连接
ssh -T git@github.com

# 如果失败，改用 HTTPS
git remote set-url origin https://github.com/zhoumao1/PrintomJs.git
```

### Q: npm 发布失败？

**A:** 确保已登录 npm：

```bash
npm whoami  # 查看当前登录用户
npm login   # 登录
```

### Q: 版本号已存在？

**A:** npm 不允许重复发布相同版本，需要递增版本号：

```bash
# 删除本地标签
git tag -d v1.0.1

# 使用新版本号
./release.sh 1.0.2
```

### Q: 如何撤销发布？

**A:** npm 发布后 72 小时内可以撤销：

```bash
npm unpublish printom-js@1.0.1
```

**注意：** 撤销后该版本号不能再次使用。

## 📝 版本管理建议

### 开发流程

1. **开发新功能** - 在本地开发和测试
2. **提交代码** - `git commit -m "feat: 新功能"`
3. **准备发布** - 确定版本号
4. **执行发布** - `./release.sh 1.1.0 "新增功能"`
5. **验证发布** - 检查 GitHub、npm、演示网站

### 版本号规则

- `1.0.0` → `1.0.1` - 修复 bug
- `1.0.0` → `1.1.0` - 新增功能（向后兼容）
- `1.0.0` → `2.0.0` - 重大更新（可能不兼容）

### Git 提交信息规范

```bash
feat: 新增功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

## 🎯 快速参考

```bash
# 发布新版本（最常用）
./release.sh 1.0.1 "修复bug"

# 仅构建
./build.sh

# 查看当前版本
cat package.json | grep version

# 查看 Git 标签
git tag -l

# 查看 npm 包信息
npm view printom-js

# 查看发布历史
npm view printom-js versions
```

## 📞 需要帮助？

- GitHub Issues: https://github.com/zhoumao1/PrintomJs/issues
- npm 文档: https://docs.npmjs.com/
