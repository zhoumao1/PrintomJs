/**
 * PrintomJs - 现代化的 Web 打印解决方案
 * 不依赖 Vue，直接导出核心类
 *
 * 使用方式：
 *   import PrintomJs from 'printom-js'
 *   const printer = new PrintomJs({ element: '#content' })
 *   await printer.preview('#preview-container')
 *   await printer.exec()
 */

import { PrinterController } from '../ui/src/plugins/print/core/index'
import '../ui/src/plugins/print/index.less'

/**
 * PrintomJs 构造函数
 * @param {Object} options - 配置选项
 * @returns {PrinterController} 打印控制器实例
 */
function PrintomJs(options) {
  return new PrinterController(options)
}

// 静态属性（用于高级用法，如访问内部类）
PrintomJs.PrinterController = PrinterController

// 默认导出 PrintomJs
export default PrintomJs
