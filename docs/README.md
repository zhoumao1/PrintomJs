# PrintomJs

🚀 现代化的 Web 打印解决方案 — 零依赖、智能分页、完美还原样式

## 安装

```bash
npm install printom-js
```

或使用 CDN：

```html
<link rel="stylesheet" href="https://unpkg.com/printom-js/print.css">
<script src="https://unpkg.com/printom-js"></script>
```

## 快速开始

```javascript
import PrintomJs from 'printom-js'
import 'printom-js/print.css'

const printer = new PrintomJs({
  element: '#content'
})

await printer.exec()
```

---

## API 参考

### 构造函数

```javascript
new PrintomJs(options)
```

**options 参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `element` | `string \| Element \| () => Element` | **必填** | 打印目标元素，CSS 选择器、DOM 元素或返回元素的函数 |
| `paper` | `string \| { width, height }` | `'A4'` | 纸张大小，`'A3' \| 'A4' \| 'A5' \| 'Letter' \| 'Legal'` 或 `{ width, height }` |
| `orientation` | `'portrait' \| 'landscape'` | `'portrait'` | 纸张方向 |
| `margin` | `MarginConfig \| string \| number` | `{top:20, right:15, bottom:20, left:15}` | 页边距，支持 `mm`、`px` 格式 |
| `header` | `string \| HeaderFooterConfig \| null` | `null` | 页眉配置，支持字符串或 `{ left, center, right }` |
| `footer` | `string \| HeaderFooterConfig \| null` | `null` | 页脚配置，支持字符串或 `{ left, center, right }` |
| `inlineStylesheet` | `boolean` | `true` | 是否内联样式表 |
| `repeatTableHeader` | `boolean` | `false` | 是否在每页重复表格表头 |
| `tableWidthStrategy` | `'scale' \| 'remove' \| 'ignore'` | `'scale'` | 表格列宽处理策略 |
| `image` | `ImageHandlerOptions` | — | 图片分页处理配置 |
| `hooks` | `ChunkerHooks` | `{}` | Chunker 层生命周期钩子（15 个） |
| `beforePreview` | `(params) => void` | — | 预览前回调（异步） |
| `afterPreview` | `(params) => void` | — | 预览后回调（异步） |
| `beforePrint` | `(params) => void` | — | 打印前回调（异步） |
| `afterPrint` | `() => void` | — | 打印后回调 |

> **提示：** `header` 和 `footer` 支持模板变量 `{current}`（当前页码）和 `{total}`（总页数）。

---

### 方法

#### `preview(container)`

在指定容器中预览打印效果。

```javascript
await printer.preview('#preview-container')
```

- **参数：** `container` — CSS 选择器或 DOM 元素
- **返回：** `Promise<PrintomJs>` — 返回实例，支持链式调用

#### `exec()`

执行打印，弹出浏览器打印对话框。

```javascript
await printer.exec()
```

- **返回：** `Promise<void>`

#### `update()`

更新打印内容。当原始元素内容变化后调用，重新解析并渲染。

```javascript
document.getElementById('content').innerHTML = '新内容'
await printer.update()
```

- **返回：** `Promise<PrintomJs>` — 返回实例，支持链式调用

#### `destroy()`

销毁实例，清理所有资源。

```javascript
printer.destroy()
```

---

## 生命周期钩子（Hooks）

Hooks 允许在打印流程的关键节点插入自定义逻辑。

### Controller 层回调（4 个）

```javascript
const printer = new PrintomJs({
  element: '#content',
  hooks: {
    beforePreview(context) {
      // 预览前，context = { element, clonedContent, container }
    },
    afterPreview(context) {
      // 预览后，context = { element, container }
    },
    beforePrint(context) {
      // 打印前，context = { element, clonedContent }
    },
    afterPrint() {
      // 打印完成后
    }
  }
})
```

| Hook | 触发时机 | 参数 | 异步 |
|------|---------|------|------|
| `beforePreview` | `preview()` 执行前 | `{ element, clonedContent, container }` | ✅ |
| `afterPreview` | `preview()` 执行后 | `{ element, container }` | ✅ |
| `beforePrint` | `exec()` 执行前 | `{ element, clonedContent }` | ✅ |
| `afterPrint` | `exec()` 执行后 | — | ❌ |

### Chunker 层钩子（15 个）

```javascript
const printer = new PrintomJs({
  element: '#content',
  hooks: {
    // 预处理前，可修改原始 DOM 结构
    onBeforeParse(content, chunker) {
      // content 是原始克隆内容，尚未添加 data-ref
      content.querySelectorAll('.no-print').forEach(el => el.remove())
    },

    // 预处理后、分页前，可调整规范化结果
    onAfterParse(content, chunker) {
      // content 已添加 data-ref，可精准定位节点
      const row = content.querySelector('[data-ref="ref-15"]')
      if (row) row.style.breakAfter = 'page'
    },

    // 遍历每个节点时，返回 false 跳过该节点
    onFilter(node, chunker) {
      return true // 返回 false 则跳过该节点及其子树
    },

    // 节点加入 probe 后、Handler 处理前，可等待资源加载
    async onAfterNodeProbed(probeNode, node, chunker) {
      if (node.tagName === 'IMG') {
        await new Promise(r => probeNode.complete ? r() : probeNode.onload = probeNode.onerror = r)
      }
    },

    // Handler 处理节点前
    onBeforeNodeHandle(node, handler, chunker) {
      console.log(`处理: ${node.nodeName}, Handler: ${handler.constructor.name}`)
    },

    // Handler 处理节点后
    onAfterNodeHandle(result, node, handler, chunker) {
      if (result?.action === 'split') console.log('节点被分割')
    },

    // TextHandler 检测到溢出时，可自定义溢出判断
    onOverflow(overflowInfo, probeNode, node, handler) {
      return { ...overflowInfo, overflow: true } // 可覆盖默认判断
    },

    // 文本截断点确定后，可修改截断位置
    onBreakToken(breakToken, overflowInfo, handler) {
      // 例：标点不独占行
      const punctuation = ['，', '。', '！', '？']
      const last = breakToken.part1[breakToken.part1.length - 1]
      if (punctuation.includes(last)) {
        return { ...breakToken, part1: breakToken.part1.slice(0, -1), part2: last + breakToken.part2 }
      }
      return breakToken
    },

    // 节点追加到页面时（仅 append 路径），可修改渲染节点
    onRenderNode(clone, original, chunker) {
      clone.style.borderLeft = '2px solid #409eff'
      return clone
    },

    // 新页面创建后、内容填充前
    async onBeforePageLayout(page, pageIndex, chunker) {
      console.log(`第 ${pageIndex + 1} 页创建`)
    },

    // 页面内容填充完成、封存前，可添加水印等
    async onAfterPageLayout(page, pageIndex, chunker) {
      const wm = document.createElement('div')
      wm.textContent = 'CONFIDENTIAL'
      wm.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:32px;color:rgba(0,0,0,0.08);'
      page.style.position = 'relative'
      page.appendChild(wm)
    },

    // onAfterPageLayout 之后、页面最终确定前的最后机会
    async onFinalizePage(page, pageIndex, chunker) {
      console.log(`第 ${pageIndex + 1} 页最终确定`)
    },

    // 发生分页时（split/break 后触发）
    async onPageBreak(overflowNode, originalNode, chunker) {
      console.log(`分页: ${originalNode.nodeName}`)
    },

    // 所有内容分页完成后
    onAfterChunked(pages, chunker) {
      console.log(`分页完成，共 ${pages.length} 页`)
    },

    // 所有渲染完成后（整个流程最后一个 hook）
    async onAfterRendered(pages, chunker) {
      console.log(`渲染完成，共 ${pages.length} 页`)
    }
  }
})
```

| Hook | 模式 | 可修改返回值 | 触发频率 |
|------|------|-------------|---------|
| `onBeforeParse` | async | 否 | 1 次 |
| `onAfterParse` | async | 否 | 1 次 |
| `onFilter` | sync | 是（返回 false 跳过） | 每个节点 |
| `onAfterNodeProbed` | async | 否 | 每个节点 |
| `onBeforeNodeHandle` | async | 否 | 每个节点 |
| `onAfterNodeHandle` | async | 否 | 每个节点 |
| `onOverflow` | sync | 是（修改溢出判断） | 溢出时 |
| `onBreakToken` | sync | 是（修改截断点） | 文本截断时 |
| `onRenderNode` | sync | 是（修改节点） | 节点追加时 |
| `onBeforePageLayout` | async | 否 | 每页 |
| `onAfterPageLayout` | async | 否 | 每页 |
| `onFinalizePage` | async | 否 | 每页 |
| `onPageBreak` | async | 否 | 分页时 |
| `onAfterChunked` | async | 否 | 1 次 |
| `onAfterRendered` | async | 否 | 1 次 |

> **注意：** 同步 hook（`onFilter`、`onOverflow`、`onBreakToken`、`onRenderNode`）在热路径上，请勿在其中执行耗时操作。

---

## 支持的页面场景

### ✅ 已支持

| 场景 | 说明 |
|------|------|
| 普通文档流 | 标准的块级元素（div、p、h1-h6 等） |
| 表格 | 包含 rowspan/colspan 的复杂表格，支持跨页自动处理 |
| 图片 | 单图、多图，自动检测尺寸并自适应缩放 |
| 长文本 | 自动截断分页，支持词级和字符级截断 |
| 页眉页脚 | 支持 `{current}` 和 `{total}` 模板变量 |
| CSS 样式 | 完整保留原始样式（通过样式内联实现） |

### ⚠️ 部分支持 / 已知限制

| 场景 | 说明 |
|------|------|
| Flex 布局下的图文混合 | 复杂 flex 内容（如 `display:flex` 容器内的图片+文字）在分页时可能出现非预期截断 |
| Grid 布局 | 复杂 Grid 布局内容在分页时可能出现非预期截断 |
| Canvas 元素 | 暂不支持 |
| SVG 元素 | 基础支持，优化中 |
| 背景图片 | 暂不支持 |

### 🛠️ 建议

- 对于图文混合内容，建议使用**文档流布局**（而非 flex/grid）以获得最佳分页效果
- 大表格建议使用 `<thead>` 标签，系统会自动在每页重复表头

---

## 图片处理配置（ImageHandlerOptions）

通过 `image` 选项可以精细控制图片的分页行为：

```javascript
const printer = new PrintomJs({
  element: '#content',
  image: {
    // 当前页剩余空间 / 整页高度 达到该阈值时，优先缩放塞入当前页
    // 默认 0.4，值越大图片越容易被压扁塞入
    remainingRatioThreshold: 0.4,

    // 缩放后宽度必须保留的最小比例，否则宁可移页
    // 默认 0.3，值越小图片越容易被压缩
    minScaleRatio: 0.3,

    // 等待图片加载的超时时间（毫秒），默认 5000
    loadTimeout: 5000,

    // 加载失败占位的最小高度（px），默认 80
    placeholderMinHeight: 80,

    // 图片加载失败时的占位文案
    errorPlaceholderText: '图片加载失败'
  }
})
```

**详细说明：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `remainingRatioThreshold` | `number \| (ctx) => number` | `0.4` | 剩余空间阈值，支持回调动态调整 |
| `minScaleRatio` | `number \| (ctx) => number` | `0.3` | 最小缩放比例，支持回调动态调整 |
| `loadTimeout` | `number` | `5000` | 图片加载超时（毫秒） |
| `placeholderMinHeight` | `number` | `80` | 加载失败占位高度（px） |
| `errorPlaceholderText` | `string` | — | 加载失败占位文案 |

**回调示例：**

```javascript
image: {
  // 图表允许压得更狠
  remainingRatioThreshold: (ctx) => {
    const src = ctx.imageAttributes?.src || ''
    return src.includes('chart') ? 0.6 : 0.4
  },

  // 截图要求清晰，宁可移页
  minScaleRatio: (ctx) => {
    const src = ctx.imageAttributes?.src || ''
    if (src.includes('screenshot')) return 0.5
    return 0.3
  }
}
```

回调上下文 `ctx` 包含：
- `node` - 原始图片节点
- `pageHeight`、`pageWidth` - 整页尺寸
- `renderedWidth`、`renderedHeight` - 图片渲染尺寸
- `remainingHeight`、`currentPageUsed` - 当前页剩余/已用高度
- `remainingRatio` - 剩余空间比例
- `scaleToFitCurrent` - 塞入当前页的缩放比例
- `imageAttributes` - 图片属性快照（src、alt、width、height 等）

---

## 场景示例

### 带页眉页脚

```javascript
const printer = new PrintomJs({
  element: '#contract',
  header: {
    left: '合同编号: CT-2026-001',
    right: '机密文件'
  },
  footer: {
    center: '第 {current} / {total} 页'
  }
})
await printer.exec()
```

### 横向打印大表格

```javascript
const printer = new PrintomJs({
  element: '#report-table',
  paper: 'A4',
  orientation: 'landscape',
  margin: 15
})
await printer.exec()
```

### 先预览后打印

```javascript
const printer = new PrintomJs({ element: '#content' })

await printer.preview('#preview-container')
await printer.exec()
printer.destroy()
```

### 使用 Hook 添加水印

```javascript
const printer = new PrintomJs({
  element: '#content',
  hooks: {
    onAfterPageLayout(page, pageIndex) {
      const wm = document.createElement('div')
      wm.textContent = 'CONFIDENTIAL'
      wm.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:32px;color:rgba(0,0,0,0.08);pointer-events:none;'
      page.style.position = 'relative'
      page.appendChild(wm)
    }
  }
})
await printer.exec()
```

### 批量打印

```javascript
async function batchPrint(elements) {
  for (const el of elements) {
    const printer = new PrintomJs({
      element: el,
      paper: 'A4',
      margin: '15mm'
    })
    await printer.exec()
    printer.destroy()
  }
}

const items = document.querySelectorAll('.order-card')
await batchPrint(Array.from(items))
```

---

## 常见问题

**样式丢失？** 确保引入了 `print.css`：`import 'printom-js/print.css'`

**表格被截断？** 使用 `<thead>` 标签，系统会自动在每页重复表头

**打印对话框纸张不对？** 由于浏览器安全限制，建议使用 `preview()` 让用户预览实际效果

**Flex/Grid 布局内容分页异常？** 建议将图文混合内容改为文档流布局，或使用 `onFilter` 跳过部分复杂元素

---

## License

MIT