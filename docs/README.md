# FlowPrint

🚀 现代化的 Web 打印解决方案 - 零依赖、智能分页、完美还原

[![npm version](https://img.shields.io/npm/v/flow-print.svg)](https://www.npmjs.com/package/flow-print)
[![license](https://img.shields.io/npm/l/flow-print.svg)](https://github.com/zhoumao1/FlowPrint/blob/main/LICENSE)
[![demo](https://img.shields.io/badge/demo-online-blue.svg)](https://zhoumao1.github.io/FlowPrint/)

## ✨ 特性

- ✅ **零依赖** - 无需任何第三方库
- ✅ **智能分页** - 基于 DOM 的分页算法，非截图方案
- ✅ **样式完美还原** - 完整保留原始样式（参考 rrweb 样式内联方案）
- ✅ **表格跨页** - 智能处理 rowspan/colspan 表格跨页
- ✅ **图片自适应** - 自动检测图片尺寸，智能缩放
- ✅ **文本截断** - 智能文本截断，支持词级和字符级（参考 PagedJS）
- ✅ **打印预览** - 打印前预览效果
- ✅ **内容更新** - 支持动态更新打印内容
- ✅ **自定义页眉页脚** - 支持模板变量 `{current}` 和 `{total}`
- ✅ **生命周期钩子** - 完整的 Hook 机制，支持业务定制
- ✅ **TypeScript** - 完整的类型定义

## 📊 与其他方案对比

| 特性 | FlowPrint | Print.js | html2canvas | window.print() |
|------|-----------|----------|-------------|----------------|
| 零依赖 | ✅ | ❌ | ❌ | ✅ |
| 智能分页 | ✅ | ❌ | ❌ | ❌ |
| 样式完美还原 | ✅ | ❌ | ✅ | ❌ |
| 表格跨页（rowspan/colspan） | ✅ | ❌ | ❌ | ❌ |
| 打印预览 | ✅ | ❌ | ✅ | ❌ |
| 生命周期钩子 | ✅ | ❌ | ❌ | ❌ |
| 文件大小 | 54KB (gzip 26KB) | ~50KB | ~200KB+ | 0 |

## 📦 安装

```bash
npm install flow-print
```

或使用 CDN：

```html
<link rel="stylesheet" href="https://unpkg.com/flow-print/print.css">
<script src="https://unpkg.com/flow-print"></script>
```

## 🚀 快速开始

### ES Module

```javascript
import PrinterController from 'flow-print'
import 'flow-print/print.css'

const printer = new PrinterController({
  element: '#content',
  paper: 'A4',
  orientation: 'portrait'
})

// 预览
await printer.preview('#preview-container')

// 打印
await printer.exec()
```

### UMD (浏览器)

```html
<link rel="stylesheet" href="print.css">
<script src="print.umd.min.js"></script>

<script>
  const { PrinterController } = window.KidneyPrint
  
  const printer = new PrinterController({
    element: '#content'
  })
  
  await printer.exec()
</script>
```

## 📖 API 文档

### 构造函数

```typescript
new PrinterController(options: PrintOptions)
```

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `element` | `string \| HTMLElement \| Function` | - | 目标元素（必填） |
| `paper` | `string \| Object` | `'A4'` | 纸张大小：'A4', 'A3', 'A5', 'Letter', 'Legal' 或自定义 `{ width, height }` |
| `orientation` | `'portrait' \| 'landscape'` | `'portrait'` | 纸张方向：'portrait'（纵向）或 'landscape'（横向） |
| `margin` | `Object` | `{top:20, right:15, bottom:20, left:15}` | 页边距，支持数字（默认 mm）、'20mm'、'20px' 格式 |
| `header` | `Object \| null` | `null` | 页眉配置：`{ height, left, center, right }` |
| `footer` | `Object \| null` | `null` | 页脚配置：`{ height, left, center, right }` |
| `hooks` | `Object` | `{}` | Hook 回调函数 |

### 方法

#### `preview(container)`

在指定容器中预览打印内容。

```javascript
await printer.preview('#preview-container')
```

**参数：**
- `container` - 预览容器（CSS 选择器或 DOM 元素）

**返回：** `Promise<PrinterController>`

#### `exec()`

执行打印。

```javascript
await printer.exec()
```

**返回：** `Promise<void>`

#### `update()`

更新打印内容（当原始元素内容变化时调用）。

```javascript
// 修改内容
document.getElementById('content').innerHTML = '新内容'

// 更新打印
await printer.update()
```

**返回：** `Promise<PrinterController>`

#### `destroy()`

销毁并清理资源。

```javascript
printer.destroy()
```

## 🎨 使用示例

### 基础打印

```javascript
const printer = new PrinterController({
  element: '#content'
})

await printer.exec()
```

### 带页眉页脚

```javascript
const printer = new PrinterController({
  element: '#content',
  header: {
    left: '公司名称',
    center: '文档标题',
    right: '2024-01-01'
  },
  footer: {
    center: '第 {current} / {total} 页'
  }
})

await printer.exec()
```

**支持的变量：**
- `{current}` - 当前页码
- `{total}` - 总页数

### 自定义页面尺寸

```javascript
const printer = new PrinterController({
  element: '#content',
  paper: 'A4',
  orientation: 'portrait',
  margin: {
    top: '20mm',
    bottom: '20mm',
    left: '15mm',
    right: '15mm'
  }
})
```

**预设纸张：**
```javascript
// ISO 标准
paper: 'A3'      // 297mm × 420mm
paper: 'A4'      // 210mm × 297mm（默认）
paper: 'A5'      // 148mm × 210mm

// 北美标准
paper: 'Letter'  // 8.5in × 11in
paper: 'Legal'   // 8.5in × 14in
```

**自定义纸张：**
```javascript
paper: {
  width: '210mm',
  height: '297mm'
}

// 或使用像素
paper: {
  width: '800px',
  height: '1200px'
}
```

### 预览后打印

```javascript
const printer = new PrinterController({
  element: '#content'
})

// 先预览
await printer.preview('#preview-container')

// 内容变化后更新
await printer.update()

// 打印
await printer.exec()
```

## 🔧 高级功能

### Hook 机制

Hook 允许你在特定时机插入自定义逻辑。

```javascript
const printer = new PrinterController({
  element: '#content',
  hooks: {
    // 预处理前
    onBeforeParse(content, chunker) {
      console.log('开始解析')
    },
    
    // 溢出检测时
    onOverflow(overflowInfo, probeNode, node, handler) {
      // 自定义溢出判断
      return overflowInfo
    },
    
    // 分页完成后
    onAfterChunked(pages, chunker) {
      console.log(`分页完成，共 ${pages.length} 页`)
    }
  }
})
```

**可用的 Hook：**

| Hook 名称 | 触发时机 | 参数 |
|-----------|---------|------|
| `onBeforeParse` | 预处理前 | (content, chunker) |
| `onAfterParse` | 预处理后、分页前 | (content, chunker) |
| `onFilter` | 遍历节点时 | (node, chunker) |
| `onOverflow` | 溢出检测时 | (overflowInfo, probeNode, node, handler) |
| `onBreakToken` | 文本截断时 | (breakToken, overflowInfo, handler) |
| `onAfterChunked` | 所有分页完成 | (pages, chunker) |
| `onAfterRendered` | 所有渲染完成 | (pages, chunker) |

### Logger 日志控制

```javascript
import { Logger } from 'flow-print'

// 启用所有日志
Logger.enableAll()

// 只看特定模块
Logger.only('ImageHandler')
Logger.only(['ImageHandler', 'TableHandler'])

// 开启/关闭指定模块
Logger.enable('Chunker', 'Layout')
Logger.disable('TextSplitter')

// 全部关闭
Logger.disableAll()

// 查看当前状态
Logger.status()
```

**可用模块：**
- PrinterController - 入口控制器
- Layout - 布局渲染器
- Chunker - 核心分页切割器
- TextHandler - 文本节点处理
- TableHandler - 表格处理
- ImageHandler - 图片处理

## 📊 实际案例

### 案例 1：报表打印

```javascript
const printer = new PrinterController({
  element: '#report',
  paper: 'A4',
  orientation: 'landscape', // 横向适合宽表格
  header: {
    center: '销售报表 - 2026年4月'
  },
  footer: {
    center: '第 {current} / {total} 页'
  }
})

await printer.exec()
```

### 案例 2：合同文档

```javascript
const printer = new PrinterController({
  element: '#contract',
  paper: 'A4',
  margin: {
    top: '25mm',
    right: '20mm',
    bottom: '25mm',
    left: '20mm'
  },
  header: {
    left: '合同编号: CT-2026-001',
    right: '机密文件'
  },
  footer: {
    center: '第 {current} 页 / 共 {total} 页'
  }
})

// 预览后打印
await printer.preview('#preview')
await printer.exec()
```

### 案例 3：批量打印

```javascript
async function batchPrint(elements) {
  for (const element of elements) {
    const printer = new PrinterController({
      element: element,
      paper: 'A4',
      margin: '15mm'
    })
    
    await printer.exec()
    printer.destroy()
  }
}

// 打印多个订单
const orders = document.querySelectorAll('.order-item')
await batchPrint(Array.from(orders))
```

## 🎯 最佳实践

### 1. 样式建议

```css
/* 打印时隐藏不需要的元素 */
@media print {
  .no-print {
    display: none !important;
  }
}

/* 避免分页时截断 */
.keep-together {
  page-break-inside: avoid;
}

/* 强制分页 */
.page-break {
  page-break-after: always;
}
```

### 2. 表格处理

```html
<!-- 大表格建议添加 thead，自动在每页重复 -->
<table>
  <thead>
    <tr>
      <th>列1</th>
      <th>列2</th>
    </tr>
  </thead>
  <tbody>
    <!-- 数据行 -->
  </tbody>
</table>
```

### 3. 图片优化

```html
<!-- 指定图片尺寸，避免加载时闪烁 -->
<img src="image.jpg" width="400" height="300" alt="图片">

<!-- 大图建议使用 max-width -->
<img src="large.jpg" style="max-width: 100%; height: auto;">
```

## 🐛 常见问题

### Q: 打印时样式丢失？

A: 确保引入了 `print.css`

```javascript
import 'flow-print/print.css'
```

### Q: 表格被截断？

A: 使用 `<thead>` 标签，系统会自动处理表格跨页

```html
<table>
  <thead>
    <tr><th>标题</th></tr>
  </thead>
  <tbody>
    <tr><td>内容</td></tr>
  </tbody>
</table>
```

### Q: 如何调试分页问题？

A: 启用日志查看详细信息

```javascript
import { Logger } from 'flow-print'

Logger.enableAll()
// 或只启用特定模块
Logger.only(['Chunker', 'TableHandler'])
```

### Q: 打印对话框的纸张尺寸不对？

A: 由于浏览器安全限制，`@page size` 无法强制控制系统打印对话框的默认纸张。建议：
1. 使用 `preview()` 让用户提前看到实际效果
2. 提示用户在打印对话框中选择对应的纸张尺寸和方向
3. 优先使用标准纸张（A4、A3、Letter 等）

## 🏗️ 工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│                         FlowPrint 工作流程                        │
└─────────────────────────────────────────────────────────────────┘

   用户调用 new PrinterController({ element: '#content' })
                              │
                              ▼
                    ┌─────────────────┐
                    │  1. 克隆原始内容  │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  2. 样式内联处理  │
                    │  • 内联 CSS      │
                    │  • 处理图片路径   │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  3. 智能分页引擎  │
                    │  • 溢出检测      │
                    │  • 文本截断      │
                    │  • 表格跨页      │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  4. 页面渲染     │
                    │  • 添加页眉页脚   │
                    │  • 应用页码变量   │
                    └─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │ preview()    │          │   exec()     │
        │ 预览到容器    │          │  调用打印对话框 │
        └──────────────┘          └──────────────┘
```

## 📋 TODO 计划

### ✅ 已支持

- [x] 文本节点智能截断
- [x] 普通表格分页
- [x] 合并单元格（rowspan/colspan）跨页处理
- [x] 图片自适应缩放
- [x] 页眉页脚模板变量
- [x] 打印预览
- [x] 内容动态更新

### ⚠️ 不稳定

- [ ] Flex 布局下的图文混合内容
- [ ] Grid 布局下的图文混合内容

### 🚧 计划中

- [ ] Canvas 元素支持
- [ ] SVG 元素优化
- [ ] 背景图片处理
- [ ] 分页性能优化
- [ ] 更多 Hook 扩展点

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

- 💬 Issues: [GitHub Issues](https://github.com/zhoumao1/FlowPrint/issues)
- 📖 在线演示: [https://zhoumao1.github.io/FlowPrint/](https://zhoumao1.github.io/FlowPrint/)
