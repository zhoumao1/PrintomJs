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
 */
function PrintomJs(options) {
  return new PrinterController(options)
}

// 默认导出 PrintomJs
export default PrintomJs
