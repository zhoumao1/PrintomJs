/**
 * FlowPrint TypeScript Definitions
 */

export interface PrintOptions {
  /** 目标元素（CSS 选择器、DOM 元素或函数） */
  element: string | HTMLElement | (() => HTMLElement)

  /** 纸张大小，默认 'A4' */
  paper?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal'

  /** 纸张方向，默认 'portrait' */
  orientation?: 'portrait' | 'landscape'

  /** 页边距（单位：mm） */
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }

  /** 页眉配置 */
  header?: {
    left?: string
    center?: string
    right?: string
  } | null

  /** 页脚配置 */
  footer?: {
    left?: string
    center?: string
    right?: string
  } | null

  /** 是否内联外部样式表 */
  inlineStylesheet?: boolean

  /** 预览前回调 */
  beforePreview?: (context: {
    element: HTMLElement
    clonedContent: HTMLElement
    container: HTMLElement
  }) => void | Promise<void>

  /** 预览后回调 */
  afterPreview?: (context: { element: HTMLElement; container: HTMLElement }) => void | Promise<void>

  /** 打印前回调 */
  beforePrint?: (context: {
    element: HTMLElement
    clonedContent: HTMLElement
  }) => void | Promise<void>

  /** 打印后回调 */
  afterPrint?: () => void | Promise<void>
}

export class PrinterController {
  constructor(options: PrintOptions)

  /**
   * 在指定容器中预览打印内容
   * @param container 预览容器（CSS 选择器或 DOM 元素）
   */
  preview(container: string | HTMLElement): Promise<PrinterController>

  /**
   * 执行打印
   */
  exec(): Promise<void>

  /**
   * 更新打印内容（当原始元素内容变化时调用）
   */
  update(): Promise<PrinterController>

  /**
   * 销毁并清理资源
   */
  destroy(): void
}

export class Logger {
  /**
   * 启用日志
   */
  static enable(): void

  /**
   * 禁用日志
   */
  static disable(): void

  /**
   * 启用指定模块的日志
   * @param modules 模块名称数组
   */
  static enableModules(modules: string[]): void

  /**
   * 禁用指定模块的日志
   * @param modules 模块名称数组
   */
  static disableModules(modules: string[]): void
}

export default PrinterController
