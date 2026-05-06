/**
 * 打印插件类型声明
 */

/** 纸张尺寸 */
export type PaperSize =
  | 'A4'
  | 'A3'
  | 'A5'
  | 'Letter'
  | 'Legal'
  | { width: number | string; height: number | string }

/** 纸张方向 */
export type Orientation = 'portrait' | 'landscape'

/** 页边距配置 */
export interface MarginConfig {
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}

/** 页眉/页脚内容配置 */
export interface HeaderFooterConfig {
  left?: string
  center?: string
  right?: string
}

/** 溢出信息 */
export interface OverflowInfo {
  overflow: boolean
  maxBottom: number
  bottomBound: number
  maxRight: number
  rightBound: number
}

/** 文本截断信息 */
export interface BreakToken {
  node: Node
  offset: number
  part1: string | null
  part2: string | null
}

/** Chunker Hook 配置 */
export interface ChunkerHooks {
  /**
   * 开始解析内容之前（async）
   * 此时 content 是原始克隆内容，尚未添加 data-ref，也未做表格规范化。
   * 适合：改写原始结构、插入/删除元素、给元素打标记。
   */
  onBeforeParse?: (content: HTMLElement, chunker: any) => void | Promise<void>

  /**
   * 内容预处理完成、分页开始之前（async）
   * 此时 content 已具备：
   *   - data-ref 索引（可用 `[data-ref="..."]` 选择器精准定位）
   *   - 自动补全的 colgroup（无 colgroup 的表格已基于实际渲染宽度补全）
   *   - 规范化后的列宽（按 tableWidthStrategy 处理）
   *   - 补全的 rowspan 占位单元格
   * 适合：基于规范化结果做微调（修改自动 colgroup、给行/单元格打 break 标记等）。
   */
  onAfterParse?: (content: HTMLElement, chunker: any) => void | Promise<void>

  /** 遍历每个节点时，返回 false 跳过该节点及子树（sync） */
  onFilter?: (node: Node, chunker: any) => boolean | void

  /** 节点加入 probe 后、Handler 处理前，可等待资源加载（async） */
  onAfterNodeProbed?: (probeNode: Node, node: Node, chunker: any) => void | Promise<void>

  /** Handler 处理节点之前（async） */
  onBeforeNodeHandle?: (node: Node, handler: any, chunker: any) => void | Promise<void>

  /** Handler 处理节点之后（async） */
  onAfterNodeHandle?: (result: any, node: Node, handler: any, chunker: any) => void | Promise<void>

  /** TextHandler 检测到溢出时，可修改溢出判断（sync） */
  onOverflow?: (
    overflowInfo: OverflowInfo,
    probeNode: Node,
    node: Node,
    handler: any
  ) => OverflowInfo | void

  /** 文本截断点确定后，可修改截断位置（sync） */
  onBreakToken?: (
    breakToken: BreakToken,
    overflowInfo: OverflowInfo,
    handler: any
  ) => BreakToken | void

  /** 节点追加到页面时，可修改渲染节点（sync，仅 append 路径） */
  onRenderNode?: (clone: Node, original: Node, chunker: any) => Node | void

  /** 新页面创建后、内容填充前（async） */
  onBeforePageLayout?: (page: HTMLElement, pageIndex: number, chunker: any) => void | Promise<void>

  /** 页面内容填充完成、封存前（async） */
  onAfterPageLayout?: (page: HTMLElement, pageIndex: number, chunker: any) => void | Promise<void>

  /** 页面最终确定，onAfterPageLayout 之后的最后机会（async） */
  onFinalizePage?: (page: HTMLElement, pageIndex: number, chunker: any) => void | Promise<void>

  /** 发生分页时触发（async） */
  onPageBreak?: (overflowNode: Node, originalNode: Node, chunker: any) => void | Promise<void>

  /** 所有内容分页完成后（async） */
  onAfterChunked?: (pages: HTMLElement[], chunker: any) => void | Promise<void>

  /** 所有渲染完成后，整个流程最后一个 hook（async） */
  onAfterRendered?: (pages: HTMLElement[], chunker: any) => void | Promise<void>
}

/** 预览/打印回调参数 */
export interface PreviewCallbackParams {
  element: HTMLElement
  clonedContent?: HTMLElement
  container?: HTMLElement
}

/** 图片分页处理配置 */
export interface ImageHandlerOptions {
  /**
   * 当前页剩余空间 / 整页高度 达到该阈值时，优先缩放塞入当前页。
   *
   * 支持：
   * - 数字（默认 0.4）
   * - 回调函数，参数为计算后的图片上下文，可基于图片属性动态返回阈值
   *
   * @example
   * // 固定阈值
   * remainingRatioThreshold: 0.4
   *
   * // 回调：基于图片尺寸动态调整
   * remainingRatioThreshold: (ctx) => ctx.renderedHeight > 500 ? 0.3 : 0.5
   *
   * // 回调：基于图片 src 路径特征调整
   * remainingRatioThreshold: (ctx) => {
   *   const src = ctx.imageAttributes?.src || ''
   *   if (src.includes('chart') || src.includes('screenshot')) return 0.6
   *   return 0.4
   * }
   */
  remainingRatioThreshold?: number | ((context: ImageThresholdContext) => number)

  /**
   * 缩放后宽度必须保留的最小比例，否则宁可移页。
   *
   * 支持：
   * - 数字（默认 0.3）
   * - 回调函数，可基于图片属性动态返回最小缩放比
   *
   * @example
   * // 固定最小缩放比
   * minScaleRatio: 0.3
   *
   * // 回调：横版图允许压得更狠
   * minScaleRatio: (ctx) =>
   *   ctx.imageAttributes?.width > ctx.imageAttributes?.height ? 0.2 : 0.3
   *
   * // 回调：图表/截图要求清晰，宁可移页
   * minScaleRatio: (ctx) => {
   *   const src = ctx.imageAttributes?.src || ''
   *   if (src.includes('chart')) return 0.5
   *   return 0.3
   * }
   */
  minScaleRatio?: number | ((context: ImageThresholdContext) => number)

  /** 等待图片加载的超时时间（毫秒），默认 5000 */
  loadTimeout?: number

  /** 加载失败占位的最小高度（px），默认 80 */
  placeholderMinHeight?: number

  /** 图片加载失败时的占位文案 */
  errorPlaceholderText?: string
}

/**
 * 图片阈值回调的上下文参数
 */
export interface ImageThresholdContext {
  /** 原始图片节点 */
  node: Node

  /** 整页内容区高度（px） */
  pageHeight: number

  /** 整页内容区宽度（px） */
  pageWidth: number

  /** 图片在 probe 中的实际渲染宽度（px） */
  renderedWidth: number

  /** 图片在 probe 中的实际渲染高度（px，含 marginBottom） */
  renderedHeight: number

  /** 当前页剩余可用高度（px） */
  remainingHeight: number

  /** 当前页已用高度（px） */
  currentPageUsed: number

  /**
   * 剩余空间占整页的比例（remainingHeight / pageHeight）
   * 用于判断剩余空间是否足够
   */
  remainingRatio: number

  /**
   * 若缩放塞入当前页，缩放后的最终比例
   * 即 remainingHeight / renderedHeight
   */
  scaleToFitCurrent: number

  /** 图片原始渲染宽度（px），用于缩放计算基准 */
  originalWidth: number

  /** 图片原始渲染高度（px），用于缩放计算基准 */
  originalHeight: number

  /** 图片元素本身（IMG 节点），可用于读取 HTML 属性 */
  imageElement: HTMLImageElement | null

  /**
   * 图片的 HTML 属性快照
   * - src：图片地址
   * - alt：alt 文案
   * - width/height：HTML width/height 属性值
   * - 'data-id'：自定义 data 属性
   * - style：内联样式字符串
   *
   * 用于回调中做条件判断（如根据 src 路径特征决定阈值）
   */
  imageAttributes: {
    src: string
    alt: string
    width: string | null
    height: string | null
    'data-id': string | null
    style: string | null
  } | null
}

/**
 * PrintomJs 主类
 * 现代化的 Web 打印解决方案
 */
export class PrintomJs {
  constructor(options: any)
  preview(container: HTMLElement | string): Promise<PrintomJs>
  exec(): Promise<void>
  update(): Promise<PrintomJs>
  destroy(): void
  static PrinterController: any
}

export default PrintomJs
