# 🎉 FlowPrint 发布指南

## ✅ 已完成的工作

### 1. 代码准备
- ✅ 包名已更新为 `flowprint`
- ✅ README 已更新（包含对比表格、完整文档）
- ✅ LICENSE 文件已创建（MIT）
- ✅ package.json 已配置完整
- ✅ .gitignore 已创建
- ✅ 构建文件已生成（dist/ 和 docs/）
- ✅ GitHub Pages 演示页面已创建

### 2. Git 提交
- ✅ Git 仓库已初始化
- ✅ 所有文件已提交（2 个 commits）
- ✅ 远程仓库已配置：`git@github.com:zhoumao1/FlowPrint.git`

## 🚧 需要手动完成的步骤

### 步骤 1：推送到 GitHub

由于 SSH 密钥未配置，需要你手动推送：

```bash
cd /Users/jirong/Works/z_other/@kidney-webkit/packages/print-standalone

# 方式 A：使用 SSH（推荐，需要先配置 SSH 密钥）
git push -u origin main

# 方式 B：使用 HTTPS（需要输入 GitHub 用户名和密码/token）
git remote set-url origin https://github.com/zhoumao1/FlowPrint.git
git push -u origin main
```

**如果使用 SSH，需要先配置密钥：**
```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 然后到 GitHub Settings → SSH and GPG keys → New SSH key 添加
```

### 步骤 2：启用 GitHub Pages

推送成功后，在 GitHub 仓库中：

1. 进入仓库：https://github.com/zhoumao1/FlowPrint
2. 点击 **Settings**
3. 左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单中选择：
   - Branch: `main`
   - Folder: `/docs`
5. 点击 **Save**
6. 等待几分钟后，访问：**https://zhoumao1.github.io/FlowPrint/**

### 步骤 3：发布到 npm

```bash
cd /Users/jirong/Works/z_other/@kidney-webkit/packages/print-standalone/dist

# 登录 npm（如果还没登录）
npm login

# 发布
npm publish --access public
```

**首次发布后，用户可以通过以下方式安装：**
```bash
npm install flowprint
```

## 📂 文件结构

```
print-standalone/
├── .git/                    # Git 仓库
├── .gitignore              # Git 忽略文件
├── LICENSE                 # MIT 许可证
├── README.md               # 完整文档
├── package.json            # npm 配置
├── standalone.js           # 入口文件
├── build-standalone.js     # 构建脚本
├── build.sh                # 快速构建
├── publish-standalone.sh   # 发布脚本
├── dist/                   # 构建输出（用于 npm 发布）
│   ├── print.es.min.js     # 54KB
│   ├── print.umd.min.js    # 54KB
│   ├── print.cjs.min.js    # 54KB
│   ├── print.css           # 11KB
│   ├── index.d.ts          # TypeScript 类型
│   ├── package.json
│   ├── README.md
│   └── LICENSE
└── docs/                   # GitHub Pages（演示网站）
    ├── index.html          # 演示页面 ⭐
    ├── print.*.js          # 所有构建文件
    ├── print.css
    ├── index.d.ts
    ├── package.json
    ├── README.md
    └── LICENSE
```

## 🌐 最终访问地址

- **GitHub 仓库**: https://github.com/zhoumao1/FlowPrint
- **在线演示**: https://zhoumao1.github.io/FlowPrint/ （启用 Pages 后）
- **npm 包**: https://www.npmjs.com/package/flowprint （发布后）
- **CDN**: 
  - https://unpkg.com/flowprint
  - https://cdn.jsdelivr.net/npm/flowprint

## 📝 Git 提交历史

```
e4a16f7 Add GitHub Pages demo site
54c1798 Initial commit: FlowPrint v1.0.0
```

## 🎯 后续维护

### 更新版本

1. 修改代码
2. 更新 `package.json` 中的 `version`
3. 重新构建：`./build.sh`
4. 提交并推送：
   ```bash
   git add -A
   git commit -m "Release v1.0.1: 更新说明"
   git tag v1.0.1
   git push origin main --tags
   ```
5. 发布到 npm：
   ```bash
   cd dist
   npm publish
   ```

### 更新演示页面

修改 `docs/index.html` 后：
```bash
git add docs/
git commit -m "Update demo page"
git push origin main
```

GitHub Pages 会自动更新。

## ✨ 完成！

所有准备工作已完成，只需要：
1. 推送到 GitHub
2. 启用 GitHub Pages
3. 发布到 npm

祝发布顺利！🚀
