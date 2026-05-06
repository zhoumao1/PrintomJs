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

  // 1. 移除 Vue 导入
  content = content.replace(/import \{ Vue \} from 'vue\/types\/vue'\n/, '')

  // 2. 截取到 "打印插件" 注释之前的内容（保留所有类型定义）
  const splitIndex = content.indexOf('\n\n/**\n * 打印插件\n */')
  if (splitIndex !== -1) {
    content = content.substring(0, splitIndex)
  }

  // 3. 追加 PrintomJs 类声明
  const printomJsClass = `

/**
 * PrintomJs 主类
 * 现代化的 Web 打印解决方案
 */
export class PrintomJs {
  constructor(options: PrintOptions)
  preview(container: HTMLElement | string): Promise<PrintomJs>
  exec(): Promise<void>
  update(): Promise<PrintomJs>
  destroy(): void
}

export default PrintomJs
`

  content = content.trim() + printomJsClass

  fs.writeFileSync(targetTypes, content, 'utf-8')
  console.log('  Generated index.d.ts')
}

// 内联依赖的工具函数
function inlineUtilsPlugin() {
  return {
    name: 'inline-utils',
    resolveId(id) {
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
      alias: { '@': resolve(root, 'src') }
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
        output: { assetFileNames: 'print.css' }
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
      alias: { '@': resolve(root, 'src') }
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
        output: { assetFileNames: 'print.css' }
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
      alias: { '@': resolve(root, 'src') }
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
        output: { assetFileNames: 'print.css' }
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
      drop_console: false,
      drop_debugger: true,
      pure_funcs: ['console.debug'],
      passes: 2
    },
    mangle: {
      toplevel: true,
      properties: false
    },
    format: { comments: false }
  }

  const esContent = fs.readFileSync(resolve(outputDir, 'print.es.js'), 'utf-8')
  const minEs = await Terser.minify(esContent, terserOptions)
  if (minEs.error) throw minEs.error
  fs.writeFileSync(resolve(outputDir, 'print.es.min.js'), minEs.code)

  const umdContent = fs.readFileSync(resolve(outputDir, 'print.umd.js'), 'utf-8')
  const minUmd = await Terser.minify(umdContent, terserOptions)
  if (minUmd.error) throw minUmd.error
  fs.writeFileSync(resolve(outputDir, 'print.umd.min.js'), minUmd.code)

  const cjsContent = fs.readFileSync(resolve(outputDir, 'print.cjs.js'), 'utf-8')
  const minCjs = await Terser.minify(cjsContent, terserOptions)
  if (minCjs.error) throw minCjs.error
  fs.writeFileSync(resolve(outputDir, 'print.cjs.min.js'), minCjs.code)

  // 生成类型定义文件
  generateTypeDefinitions()

  // 复制 README.md 到 docs 目录
  fs.copyFileSync(resolve(__dirname, 'README.md'), resolve(__dirname, 'docs/README.md'))

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
