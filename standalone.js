/**
 * Print 插件独立版本入口
 * 不依赖 Vue，直接导出核心类
 */

import { PrinterController } from '../ui/src/plugins/print/core/index'
import { Logger } from '../ui/src/plugins/print/core/utils/logger'
import '../ui/src/plugins/print/index.less'

export { PrinterController, Logger }

// 默认导出
export default PrinterController
