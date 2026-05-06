/**
 * Print 插件独立打包脚本
 * 输出混淆、无注释的独立版本
 */

const { build } = require('vite')
const { resolve } = require('path')
const fs = require('fs')
const Terser = require('terser')

const root = resolve(__dirname, '../ui')
const srcDir = resolve(root, 'src/plugins/print')
const outputDir = resolve(__dirname, 'dist')

// 清理输出目录
function cleanOutput() {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true })
  }
  fs.mkdirSync(outputDir, { recursive: true })
}

// 从主包类型文件生成独立包的类型定义
function generateTypeDefinitions() {
  const sourceTypes = resolve(root, 'types/plugins/print.d.ts')
  const targetTypes = resolve(outputDir, 'index.d.ts')

  let content = fs.readFileSync(sourceTypes, 'utf-8')

  // 移除 Vue 导入和 Print 插件相关导出
  content = content
    .replace(/import \{ Vue \} from 'vue\/types\/vue'\n/, '')
    .replace(
      /\n\n\/\*\*\n \* 打印插件\n \*\/\n.*\nexport interface Print[\s\S]*?export const Print: Print/m,
      ''
    )
    .replace(/export interface Print[\s\S]*?export const Print: Print\n/, '')

  // 移除 PrintOptions 和 Printer 接口（独立包使用 PrintomJs）
  // 使用逐行处理方式
  const lines = content.split('\n')
  const newLines = []
  let skipUntilPrinter = false
  let braceCount = 0
  let inInterface = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!skipUntilPrinter) {
      if (line.includes('/** 打印选项 */')) {
        skipUntilPrinter = true
        continue
      }
    } else {
      // 在跳过模式中
      if (line.includes('export interface Printer')) {
        // 遇到 Printer 接口，跳过模式结束
        skipUntilPrinter = false
      } else {
        // 跳过打印选项块的内容
        continue
      }
    }

    newLines.push(line)
  }

  content = newLines.join('\n')

  // 移除 Printer 接口（Vue 插件部分）
  content = content.replace(
    /\nexport interface Printer \{[\s\S]*?\nexport const Print: Print\n/,
    '\n'
  )

  // 添加 PrintomJs 类声明
  const printomJsClass = `/**
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
`
  // 确保以 export default 结尾
  content = content.trim() + '\n\n' + printomJsClass

  fs.writeFileSync(targetTypes, content, 'utf-8')
  console.log('  Generated index.d.ts')
}

// 内联依赖的工具函数
function inlineUtilsPlugin() {
  return {
    name: 'inline-utils',
    resolveId(id) {
      // 内联 @/utils/dom
      if (id === '@/utils/dom') {
        return resolve(root, 'src/utils/dom.js')
      }
      return null
    }
  }
}

async function buildStandalone() {
  console.log('Building standalone print plugin...')

  cleanOutput()

  const entry = resolve(__dirname, 'standalone.js')

  // 构建 ES 模块
  console.log('  Building ES module...')
  await build({
    root,
    configFile: false,
    base: './',
    plugins: [inlineUtilsPlugin()],
    css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
    resolve: {
      alias: {
        '@': resolve(root, 'src')
      }
    },
    build: {
      target: 'es2015',
      outDir: resolve(outputDir, '_tmp_es'),
      emptyOutDir: true,
      lib: {
        entry,
        formats: ['es'],
        fileName: () => 'print.es.js'
      },
      rollupOptions: {
        output: {
          assetFileNames: 'print.css'
        }
      },
      minify: false
    }
  })

  // 构建 UMD 模块
  console.log('  Building UMD module...')
  await build({
    root,
    configFile: false,
    base: './',
    plugins: [inlineUtilsPlugin()],
    css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
    resolve: {
      alias: {
        '@': resolve(root, 'src')
      }
    },
    build: {
      target: 'es2015',
      outDir: resolve(outputDir, '_tmp_umd'),
      emptyOutDir: true,
      lib: {
        entry,
        name: 'PrintomJs',
        formats: ['umd'],
        fileName: () => 'print.umd.js'
      },
      rollupOptions: {
        output: {
          assetFileNames: 'print.css'
        }
      },
      minify: false
    }
  })

  // 构建 CommonJS 模块
  console.log('  Building CommonJS module...')
  await build({
    root,
    configFile: false,
    base: './',
    plugins: [inlineUtilsPlugin()],
    css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
    resolve: {
      alias: {
        '@': resolve(root, 'src')
      }
    },
    build: {
      target: 'es2015',
      outDir: resolve(outputDir, '_tmp_cjs'),
      emptyOutDir: true,
      lib: {
        entry,
        formats: ['cjs'],
        fileName: () => 'print.cjs.js'
      },
      rollupOptions: {
        output: {
          assetFileNames: 'print.css'
        }
      },
      minify: false
    }
  })

  // 复制文件到输出目录
  const tmpEs = resolve(outputDir, '_tmp_es')
  const tmpUmd = resolve(outputDir, '_tmp_umd')
  const tmpCjs = resolve(outputDir, '_tmp_cjs')

  fs.copyFileSync(resolve(tmpEs, 'print.es.js'), resolve(outputDir, 'print.es.js'))
  fs.copyFileSync(resolve(tmpUmd, 'print.umd.js'), resolve(outputDir, 'print.umd.js'))
  fs.copyFileSync(resolve(tmpCjs, 'print.cjs.js'), resolve(outputDir, 'print.cjs.js'))

  // 复制 CSS（从任一临时目录）
  if (fs.existsSync(resolve(tmpEs, 'print.css'))) {
    fs.copyFileSync(resolve(tmpEs, 'print.css'), resolve(outputDir, 'print.css'))
  }

  // 清理临时目录
  fs.rmSync(tmpEs, { recursive: true })
  fs.rmSync(tmpUmd, { recursive: true })
  fs.rmSync(tmpCjs, { recursive: true })

  // 混淆和压缩
  console.log('  Minifying and obfuscating...')

  const terserOptions = {
    compress: {
      drop_console: false, // 保留 console（如果需要完全移除可设为 true）
      drop_debugger: true,
      pure_funcs: ['console.debug'], // 移除 console.debug
      passes: 2
    },
    mangle: {
      toplevel: true, // 混淆顶层作用域
      properties: false // 不混淆属性名（避免破坏 API）
    },
    format: {
      comments: false // 移除所有注释
    }
  }

  // 压缩 ES 模块
  const esContent = fs.readFileSync(resolve(outputDir, 'print.es.js'), 'utf-8')
  const minEs = await Terser.minify(esContent, terserOptions)
  if (minEs.error) throw minEs.error
  fs.writeFileSync(resolve(outputDir, 'print.es.min.js'), minEs.code)

  // 压缩 UMD 模块
  const umdContent = fs.readFileSync(resolve(outputDir, 'print.umd.js'), 'utf-8')
  const minUmd = await Terser.minify(umdContent, terserOptions)
  if (minUmd.error) throw minUmd.error
  fs.writeFileSync(resolve(outputDir, 'print.umd.min.js'), minUmd.code)

  // 压缩 CommonJS 模块
  const cjsContent = fs.readFileSync(resolve(outputDir, 'print.cjs.js'), 'utf-8')
  const minCjs = await Terser.minify(cjsContent, terserOptions)
  if (minCjs.error) throw minCjs.error
  fs.writeFileSync(resolve(outputDir, 'print.cjs.min.js'), minCjs.code)

  // 生成类型定义文件
  generateTypeDefinitions()

  console.log('Done! Output:', outputDir)
  console.log('\nFiles generated:')
  console.log('  - print.es.js (ES module, unminified)')
  console.log('  - print.es.min.js (ES module, minified + obfuscated)')
  console.log('  - print.umd.js (UMD, unminified)')
  console.log('  - print.umd.min.js (UMD, minified + obfuscated)')
  console.log('  - print.cjs.js (CommonJS, unminified)')
  console.log('  - print.cjs.min.js (CommonJS, minified + obfuscated)')
  console.log('  - print.css (styles)')
}

buildStandalone().catch(err => {
  console.error(err)
  process.exit(1)
})
