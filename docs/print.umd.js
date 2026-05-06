(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.KidneyPrint = {}));
})(this, function(exports2) {
  "use strict";var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

  function getElement(el) {
    const type = typeof el;
    if (type === "function") {
      el = el();
    }
    if (type === "string") {
      try {
        el = document.querySelector(el);
      } catch (err) {
      }
    }
    if (el !== Object(el)) {
      return null;
    }
    return el["_isVue"] === true && el.$el !== void 0 ? el.$el : el;
  }
  const MM_TO_PX = 3.7795275591;
  const PAPER_SIZES = {
    A3: { width: 297, height: 420 },
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    Letter: { width: 216, height: 279 },
    Legal: { width: 216, height: 356 }
  };
  const DEFAULT_MARGIN = {
    top: 20,
    right: 15,
    bottom: 20,
    left: 15
  };
  function mmToPx(mm) {
    return mm * MM_TO_PX;
  }
  function parseSizeValue(value) {
    if (typeof value === "number") {
      return mmToPx(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      const mmMatch = trimmed.match(/^([\d.]+)\s*mm$/i);
      if (mmMatch) {
        return mmToPx(parseFloat(mmMatch[1]));
      }
      const pxMatch = trimmed.match(/^([\d.]+)\s*px$/i);
      if (pxMatch) {
        return parseFloat(pxMatch[1]);
      }
      const numMatch = trimmed.match(/^([\d.]+)$/);
      if (numMatch) {
        return mmToPx(parseFloat(numMatch[1]));
      }
    }
    return 0;
  }
  function getPaperSize(paper, orientation = "portrait") {
    let size;
    if (typeof paper === "string") {
      size = PAPER_SIZES[paper] || PAPER_SIZES.A4;
    } else if (typeof paper === "object" && paper.width && paper.height) {
      size = paper;
    } else {
      size = PAPER_SIZES.A4;
    }
    let { width, height } = size;
    if (typeof paper === "object" && paper.width && paper.height) {
      width = parseSizeValue(width);
      height = parseSizeValue(height);
    } else {
      width = mmToPx(width);
      height = mmToPx(height);
    }
    if (orientation === "landscape") {
      return {
        width: Math.max(width, height),
        height: Math.min(width, height)
      };
    }
    return {
      width: Math.min(width, height),
      height: Math.max(width, height)
    };
  }
  function parseMarginValue(value) {
    if (typeof value === "number") {
      return mmToPx(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      const mmMatch = trimmed.match(/^([\d.]+)\s*mm$/i);
      if (mmMatch) {
        return mmToPx(parseFloat(mmMatch[1]));
      }
      const pxMatch = trimmed.match(/^([\d.]+)\s*px$/i);
      if (pxMatch) {
        return parseFloat(pxMatch[1]);
      }
      const numMatch = trimmed.match(/^([\d.]+)$/);
      if (numMatch) {
        return mmToPx(parseFloat(numMatch[1]));
      }
    }
    return 0;
  }
  function getMargin(margin) {
    const m = __spreadValues(__spreadValues({}, DEFAULT_MARGIN), margin || {});
    return {
      top: parseMarginValue(m.top),
      right: parseMarginValue(m.right),
      bottom: parseMarginValue(m.bottom),
      left: parseMarginValue(m.left)
    };
  }
  const URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/g;
  const RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|#)/;
  const DATA_URI = /^(data:)([^,]*),(.*)/i;
  function absoluteToStylesheet(cssText, baseUrl) {
    if (!cssText || !baseUrl) return cssText;
    if (!cssText.includes("url(")) return cssText;
    return cssText.replace(URL_IN_CSS_REF, (match, quote1, path1, quote2, path2, path3) => {
      const filePath = path1 || path2 || path3;
      const quote = quote1 || quote2 || "";
      if (!filePath || !RELATIVE_PATH.test(filePath) || DATA_URI.test(filePath)) {
        return match;
      }
      let absolutePath;
      if (filePath[0] === "/") {
        const origin = baseUrl.split("/").slice(0, 3).join("/");
        absolutePath = origin + filePath;
      } else {
        const stack = baseUrl.split("/");
        stack.pop();
        const parts = filePath.split("/");
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (part === ".") {
            continue;
          } else if (part === "..") {
            stack.pop();
          } else {
            stack.push(part);
          }
        }
        absolutePath = stack.join("/");
      }
      return `url(${quote}${absolutePath}${quote})`;
    });
  }
  function getCssRulesString(sheet) {
    try {
      const rules = sheet.rules || sheet.cssRules;
      if (!rules) return null;
      let cssText = "";
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if ("styleSheet" in rule && rule.styleSheet) {
          const importedCss = getCssRulesString(rule.styleSheet);
          if (importedCss) {
            cssText += importedCss;
          }
          continue;
        }
        cssText += rule.cssText || "";
      }
      return cssText;
    } catch (err) {
      return null;
    }
  }
  class StyleInliner {
    constructor(options = {}) {
      this.inlineStylesheet = true;
      this.baseUrl = this.getBaseUrl();
    }
    /**
     * 获取当前页面的 base URL
     */
    getBaseUrl() {
      const a = document.createElement("a");
      a.href = "";
      return a.href;
    }
    /**
     * 收集所有样式
     */
    collectStyles() {
      let allCssText = "";
      Array.from(document.styleSheets).forEach((sheet) => {
        let cssText = getCssRulesString(sheet);
        if (cssText) {
          if (sheet.href) {
            cssText = absoluteToStylesheet(cssText, sheet.href);
          } else {
            cssText = absoluteToStylesheet(cssText, this.baseUrl);
          }
          allCssText += cssText + "\n";
        }
      });
      return allCssText;
    }
    /**
     * 克隆节点并内联样式
     */
    process(node) {
      const clone = node.cloneNode(true);
      this.inlineStyles(clone);
      return clone;
    }
    /**
     * 内联样式
     */
    inlineStyles(root) {
      if (!this.inlineStylesheet) return;
      const links = root.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => {
        const sheet = this.findCorrespondingStylesheet(link);
        if (sheet) {
          const cssText = getCssRulesString(sheet);
          if (cssText) {
            const style = document.createElement("style");
            style.textContent = absoluteToStylesheet(cssText, sheet.href || this.baseUrl);
            link.parentNode.replaceChild(style, link);
          }
        }
      });
      const styles = root.querySelectorAll("style");
      styles.forEach((style) => {
        var _a;
        let cssText = (_a = style.textContent) == null ? void 0 : _a.trim();
        if (!cssText && style.sheet) {
          cssText = getCssRulesString(style.sheet);
        }
        if (cssText) {
          style.textContent = absoluteToStylesheet(cssText, this.baseUrl);
        }
      });
      const allElements = root.querySelectorAll("[style]");
      allElements.forEach((el) => {
        if (el.style && el.style.cssText) {
          el.style.cssText = absoluteToStylesheet(el.style.cssText, this.baseUrl);
        }
      });
    }
    /**
     * 找到 link 标签对应的 stylesheet（延迟查找，避免内存泄露）
     */
    findCorrespondingStylesheet(link) {
      const sheets = Array.from(document.styleSheets);
      return sheets.find((sheet) => sheet.href === link.href) || null;
    }
  }
  function generateDeepSelector(baseClass, depth = 20, styles = { "margin-top": "0 !important" }) {
    const selectors = [];
    let currentSuffix = "";
    for (let i = 1; i <= depth; i++) {
      currentSuffix += " *:first-child";
      selectors.push(`${baseClass}${currentSuffix}`);
    }
    const styleBody = Object.entries(styles).map(([prop, value]) => `    ${prop}: ${value};`).join("\n");
    return `${selectors.join(",\n")}
{
${styleBody}
}`;
  }
  const cssOutput = generateDeepSelector(".k-print-body", 20);
  function getPrintStyles(paperStyle = "", paperSize = null, orientation = "portrait") {
    let pageSize = "auto";
    if (paperSize && paperSize.width && paperSize.height) {
      const standardSizes = [
        // ISO 标准
        { name: "A3", width: 1122.5196850527, height: 1587.401574822 },
        // 297mm × 420mm
        { name: "A4", width: 793.700787411, height: 1122.5196850527 },
        // 210mm × 297mm
        { name: "A5", width: 559.3700787468, height: 793.700787411 },
        // 148mm × 210mm
        { name: "B4", width: 944.8818897638, height: 1334.6456692913 },
        // 250mm × 353mm
        { name: "B5", width: 665.1968503937, height: 944.8818897638 },
        // 176mm × 250mm
        // JIS 标准
        { name: "JIS-B4", width: 971.3385826772, height: 1375.748031496 },
        // 257mm × 364mm
        { name: "JIS-B5", width: 687.874015748, height: 971.3385826772 },
        // 182mm × 257mm
        // 北美标准
        { name: "letter", width: 816, height: 1056 },
        // 8.5in × 11in
        { name: "legal", width: 816, height: 1344 },
        // 8.5in × 14in
        { name: "ledger", width: 1056, height: 1632 }
        // 11in × 17in
      ];
      const w = Math.min(paperSize.width, paperSize.height);
      const h = Math.max(paperSize.width, paperSize.height);
      const tolerance = 1;
      const matched = standardSizes.find(
        (size) => Math.abs(size.width - w) < tolerance && Math.abs(size.height - h) < tolerance
      );
      if (matched) {
        pageSize = orientation === "landscape" ? `${matched.name} landscape` : matched.name;
      } else {
        const widthMm = (paperSize.width * 25.4 / 96).toFixed(2);
        const heightMm = (paperSize.height * 25.4 / 96).toFixed(2);
        pageSize = `${widthMm}mm ${heightMm}mm`;
      }
    }
    return `
body {
  background: #fff;
  padding: 20px;
}
.k-print-page {
  ${paperStyle}
  background: #fff;
  display: flex;
  flex-direction: column;
}
.k-print-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.k-print-header-left,
.k-print-header-center,
.k-print-header-right {
  font-size: 14px;
  color: #333;
}
.k-print-header-left {
  text-align: left;
}
.k-print-header-center {
  text-align: center;
}
.k-print-header-right {
  text-align: right;
}
.k-print-body {
  flex: 1;
  overflow: hidden;
  /* 用户 element 容器的样式覆盖（保证打印布局正确） */
  display: block !important;
  width: auto !important;
  height: auto !important;
  max-width: none !important;
  max-height: none !important;
  min-width: 0 !important;
  min-height: 0 !important;
  margin: 0 !important;
  float: none !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.ivu-table-header table, .ivu-table-body table, .el-table__header, .el-table__body{
  width: 100% !important;
}
.k-print-footer {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 10px;
  padding: 10px 20px;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}
.k-print-footer-left,
.k-print-footer-center,
.k-print-footer-right {
  font-size: 12px;
  color: #666;
}
.k-print-footer-left {
  text-align: left;
}
.k-print-footer-center {
  text-align: center;
}
.k-print-footer-right {
  text-align: right;
}

${cssOutput}

@media print {
  @page {
    margin: 0;
    size: ${pageSize};
  }
  * {
		-webkit-print-color-adjust: exact;
		mso-print-color: yes;
		// 火狐
		print-color-adjust: exact;
		color-adjust: exact;
	}
  body {
    padding: 0;
  }
  .k-print-page {
    box-shadow: none !important;
    margin: 0 !important;
    page-break-after: always;
  }
}
`;
  }
  const PREVIEW_EXTRA_STYLES = `
body {
  background: #f0f0f0;
}
.k-print-page {
  margin: 20px auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

`;
  class PageElementFactory {
    /**
     * 创建 Header
     * @param {string|object|null} header - header 配置
     * @param {number} current - 当前页码（用于占位符替换）
     * @param {number} total - 总页数（用于占位符替换）
     * @param {boolean} keepPlaceholder - 是否保留占位符（用于创建模板）
     * @returns {HTMLElement}
     */
    static createHeader(header, current = 1, total = 1, keepPlaceholder = false) {
      const el = document.createElement("div");
      el.className = "k-print-header";
      if (!header) {
        el.style.display = "none";
        return el;
      }
      if (typeof header === "string") {
        if (keepPlaceholder) {
          el.innerHTML = header;
        } else {
          el.innerHTML = header.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
        }
      } else if (typeof header === "object") {
        const hasContent = header.left || header.center || header.right;
        if (hasContent) {
          const left = document.createElement("div");
          left.className = "k-print-header-left";
          if (header.left) {
            const text = String(header.left);
            left.textContent = keepPlaceholder ? text : text.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
          }
          el.appendChild(left);
          const center = document.createElement("div");
          center.className = "k-print-header-center";
          if (header.center) {
            const text = String(header.center);
            center.textContent = keepPlaceholder ? text : text.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
          }
          el.appendChild(center);
          const right = document.createElement("div");
          right.className = "k-print-header-right";
          if (header.right) {
            const text = String(header.right);
            right.textContent = keepPlaceholder ? text : text.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
          }
          el.appendChild(right);
        }
      }
      return el;
    }
    /**
     * 创建 Footer
     * @param {string|object|null} footer - footer 配置
     * @param {number} current - 当前页码
     * @param {number} total - 总页数
     * @param {boolean} keepPlaceholder - 是否保留占位符（用于创建模板）
     * @returns {HTMLElement}
     */
    static createFooter(footer, current = 1, total = 1, keepPlaceholder = false) {
      const el = document.createElement("div");
      el.className = "k-print-footer";
      if (!footer) {
        el.style.display = "none";
        return el;
      }
      if (typeof footer === "string") {
        if (keepPlaceholder) {
          el.innerHTML = footer;
        } else {
          el.innerHTML = footer.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
        }
      } else if (typeof footer === "object") {
        const hasContent = footer.left || footer.center || footer.right;
        if (hasContent) {
          const left = document.createElement("div");
          left.className = "k-print-footer-left";
          if (footer.left) {
            const text = String(footer.left);
            left.textContent = keepPlaceholder ? text : text.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
          }
          el.appendChild(left);
          const center = document.createElement("div");
          center.className = "k-print-footer-center";
          if (footer.center) {
            const text = String(footer.center);
            center.textContent = keepPlaceholder ? text : text.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
          }
          el.appendChild(center);
          const right = document.createElement("div");
          right.className = "k-print-footer-right";
          if (footer.right) {
            const text = String(footer.right);
            right.textContent = keepPlaceholder ? text : text.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
          }
          el.appendChild(right);
        }
      }
      return el;
    }
    /**
     * 基于用户 content 创建页面容器
     * @param {HTMLElement} sourceElement - 用户的原始 element
     * @param {Object} options
     * @param {Object} [options.margin] - 边距（传入则设置 padding）
     * @param {boolean} [options.isProbe=false] - 是否是测高容器
     * @param {number} [options.pageIndex] - 页码（用于生成唯一 ID）
     * @returns {HTMLElement}
     *
     * 设计说明：
     * - 保留用户 element 的 class、data-* 等属性，保证样式上下文
     * - 清除 id，避免重复 ID 问题
     * - 清理影响测高的关键样式（position、transform、overflow）
     * - 测高容器和展示容器使用相同的结构，保证测高准确
     */
    static createBodyFromSource(sourceElement, options = {}) {
      const { margin, isProbe = false, pageIndex = 0 } = options;
      const specialTags = ["TABLE", "THEAD", "TBODY", "TFOOT", "TR", "UL", "OL", "DL", "SELECT"];
      const isSpecialTag = specialTags.includes(sourceElement.tagName);
      let el;
      if (isSpecialTag) {
        el = document.createElement("div");
        el.className = "k-print-body";
        if (sourceElement.className) {
          el.className += " " + sourceElement.className;
        }
        Array.from(sourceElement.attributes).forEach((attr) => {
          if (attr.name.startsWith("data-")) {
            el.setAttribute(attr.name, attr.value);
          }
        });
      } else {
        el = sourceElement.cloneNode(false);
        el.innerHTML = "";
        if (el.id) {
          el.id = "";
        }
      }
      if (!el.classList.contains("k-print-body")) {
        el.classList.add("k-print-body");
      }
      this.cleanPrintStyles(el);
      if (!isProbe && margin) {
        el.style.paddingTop = `${margin.top}px`;
        el.style.paddingRight = `${margin.right}px`;
        el.style.paddingBottom = `${margin.bottom}px`;
        el.style.paddingLeft = `${margin.left}px`;
      } else if (isProbe) {
        el.style.padding = "0";
      }
      return el;
    }
    /**
     * 清理影响打印的样式
     * @param {HTMLElement} element
     *
     * 清理策略：
     * 1. 必须清理：会破坏测高的样式（position: fixed/absolute、transform、overflow）
     * 2. 保留 position: relative/sticky（作为定位上下文）
     * 3. 其他样式通过 CSS 覆盖（在 styles.js 中定义）
     */
    static cleanPrintStyles(element) {
      const originalPosition = element.style.position;
      if (originalPosition === "fixed" || originalPosition === "absolute") {
        element.style.position = "";
      }
      element.style.transform = "";
      element.style.overflow = "";
      element.style.overflowX = "";
      element.style.overflowY = "";
      element.style.clip = "";
      element.style.clipPath = "";
    }
    /**
     * 创建 Body
     * @param {Object} options
     * @param {Object} [options.margin] - 边距（传入则设置 padding，不传则无 padding）
     * @returns {HTMLElement}
     *
     * 使用说明：
     * - Probe 模式：不传 margin，创建无 padding 的 body（用于测高）
     * - Page 模式：传入 margin，创建有 padding 的 body（用于展示）
     *
     * 尺寸关系：
     * - Probe 高度 = paperSize.height - margin.top - margin.bottom - headerHeight - footerHeight
     * - ProbeContent 无 padding，可用高度 = Probe 高度
     * - PageBody 有 padding，内容区高度 = body 高度 - padding = Probe 高度
     * - 结论：测高准确 ✅
     */
    static createBody(options = {}) {
      const { margin } = options;
      const el = document.createElement("div");
      el.className = "k-print-body";
      if (margin) {
        el.style.paddingTop = `${margin.top}px`;
        el.style.paddingRight = `${margin.right}px`;
        el.style.paddingBottom = `${margin.bottom}px`;
        el.style.paddingLeft = `${margin.left}px`;
      }
      return el;
    }
  }
  const PREFIX = "[k-print]";
  const modules = {};
  let globalEnabled = false;
  function getCallerLine() {
    const stack = new Error().stack;
    if (!stack) return "";
    const lines = stack.split("\n");
    const callerLine = lines[3] || lines[2] || "";
    const match = callerLine.match(/:(\d+)(?::\d+)?\)?$/);
    return match ? match[1] : "";
  }
  function isEnabled(moduleName) {
    if (moduleName in modules) return modules[moduleName];
    return globalEnabled;
  }
  function makePrefix(moduleName) {
    getCallerLine();
    return `${PREFIX}[${moduleName}]`;
  }
  function createLogger(moduleName) {
    const log2 = (...args) => {
      if (!isEnabled(moduleName)) return;
      console.log(makePrefix(moduleName), ...args);
    };
    log2.warn = (...args) => {
      if (!isEnabled(moduleName)) return;
      console.warn(makePrefix(moduleName), ...args);
    };
    log2.error = (...args) => {
      console.error(makePrefix(moduleName), ...args);
    };
    return log2;
  }
  const Logger = {
    /** 开启所有模块 */
    enableAll() {
      globalEnabled = true;
      Object.keys(modules).forEach((k) => {
        modules[k] = true;
      });
    },
    /** 关闭所有模块 */
    disableAll() {
      globalEnabled = false;
      Object.keys(modules).forEach((k) => {
        modules[k] = false;
      });
    },
    /** 开启指定模块 */
    enable(...names) {
      names.forEach((n) => {
        modules[n] = true;
      });
    },
    /** 关闭指定模块 */
    disable(...names) {
      names.forEach((n) => {
        modules[n] = false;
      });
    },
    /** 只开启指定模块，关闭其余 */
    only(names) {
      const list = Array.isArray(names) ? names : [names];
      globalEnabled = false;
      Object.keys(modules).forEach((k) => {
        modules[k] = false;
      });
      list.forEach((n) => {
        modules[n] = true;
      });
    },
    /** 获取所有已注册模块的状态 */
    status() {
      return { globalEnabled, modules: __spreadValues({}, modules) };
    }
  };
  const log$9 = createLogger("Previewer");
  class Previewer {
    /**
     * 创建测量容器
     */
    static createProbe(paperSize, margin, header, footer, styles) {
      let headerHeight = 0;
      let footerHeight = 0;
      if (header || footer) {
        const tempContainer = document.createElement("div");
        tempContainer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: ${paperSize.width}px;
        visibility: hidden;
      `;
        document.body.appendChild(tempContainer);
        const printStyles = getPrintStyles({ width: paperSize.width, height: paperSize.height });
        const allStyles = printStyles + "\n" + (styles || "");
        const styleEl = document.createElement("style");
        styleEl.textContent = allStyles;
        tempContainer.appendChild(styleEl);
        tempContainer.offsetHeight;
        if (header) {
          const headerEl = PageElementFactory.createHeader(header);
          tempContainer.appendChild(headerEl);
          tempContainer.offsetHeight;
          headerHeight = headerEl.offsetHeight;
          const headerStyle = window.getComputedStyle(headerEl);
          log$9("Header 测量:", {
            headerHeight,
            clientHeight: headerEl.clientHeight,
            scrollHeight: headerEl.scrollHeight,
            padding: [headerStyle.paddingTop, headerStyle.paddingBottom],
            border: [headerStyle.borderTopWidth, headerStyle.borderBottomWidth],
            childCount: headerEl.children.length
          });
          if (headerEl.children.length > 0) ;
          tempContainer.removeChild(headerEl);
        }
        if (footer) {
          const footerEl = PageElementFactory.createFooter(footer);
          tempContainer.appendChild(footerEl);
          tempContainer.offsetHeight;
          footerHeight = footerEl.offsetHeight;
          if (footerEl.children.length > 0) ;
        }
        document.body.removeChild(tempContainer);
      }
      const contentWidth = paperSize.width - margin.left - margin.right;
      const contentHeight = paperSize.height - margin.top - margin.bottom - headerHeight - footerHeight;
      const probe = document.createElement("div");
      probe.className = "k-print-probe";
      probe.style.cssText = `
      position: fixed;
      top: 0;
      left: -9999px;
      width: ${contentWidth}px;
      height: ${contentHeight}px;
      overflow: hidden;
      visibility: hidden;
      pointer-events: none;
      box-sizing: border-box;
    `;
      if (styles) {
        const styleEl = document.createElement("style");
        styleEl.textContent = styles;
        probe.appendChild(styleEl);
      }
      document.body.appendChild(probe);
      probe.dataset.headerHeight = headerHeight;
      probe.dataset.footerHeight = footerHeight;
      return probe;
    }
    /**
     * 销毁测量容器
     */
    static destroy(probe) {
      if (probe && probe.parentNode) {
        probe.parentNode.removeChild(probe);
      }
    }
    /**
     * 检测溢出
     */
    static isOverflow(probe) {
      let contentContainer = probe.firstChild;
      if (contentContainer && contentContainer.tagName === "STYLE") {
        contentContainer = contentContainer.nextSibling;
      }
      if (!contentContainer) return false;
      const probeRect = probe.getBoundingClientRect();
      const contentRect = contentContainer.getBoundingClientRect();
      return contentRect.bottom > probeRect.bottom;
    }
    /**
     * 获取容器高度信息
     */
    static getHeightInfo(probe) {
      let contentContainer = probe.firstChild;
      if (contentContainer && contentContainer.tagName === "STYLE") {
        contentContainer = contentContainer.nextSibling;
      }
      const actualHeight = contentContainer ? contentContainer.scrollHeight : 0;
      return {
        available: probe.clientHeight,
        actual: actualHeight,
        overflow: probe.scrollHeight > probe.clientHeight
      };
    }
  }
  class NodeWalker {
    constructor(root) {
      this.walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
            if (["SCRIPT", "STYLE"].includes(node.tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
    }
    nextNode() {
      return this.walker.nextNode();
    }
  }
  class OverflowDetector {
    /**
     * 检测节点是否溢出
     * @param {Node} probeNode - probe 中的节点
     * @param {Node} originalNode - 原始节点
     * @param {Element} probe - probe 容器
     * @returns {{overflow: boolean, maxBottom: number, maxRight: number, bottomBound: number, rightBound: number}}
     */
    check(probeNode, originalNode, probe) {
      const probeRect = probe.getBoundingClientRect();
      const bottomBound = probeRect.bottom;
      const rightBound = probeRect.right;
      if (originalNode.nodeType === Node.TEXT_NODE && originalNode.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(probeNode);
        const rects = range.getClientRects();
        let maxBottom = 0;
        let maxRight = 0;
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
          if (rect.width > 0 && rect.right > maxRight) {
            maxRight = rect.right;
          }
          if (rect.height > 0 && rect.bottom > maxBottom) {
            maxBottom = rect.bottom;
          }
        }
        const overflow2 = maxBottom > bottomBound;
        const reason2 = overflow2 ? "底部溢出" : "未溢出";
        return {
          overflow: overflow2,
          maxBottom,
          maxRight,
          bottomBound,
          rightBound,
          reason: reason2,
          isInline: true,
          // 文本节点总是 inline
          rectsCount: rects.length
        };
      }
      const nodeRect = probeNode.getBoundingClientRect();
      const overflow = nodeRect.bottom > bottomBound;
      const computedStyle = window.getComputedStyle(probeNode);
      const isInline = computedStyle.display.includes("inline");
      const reason = overflow ? "底部溢出" : "未溢出";
      return {
        overflow,
        maxBottom: nodeRect.bottom,
        maxRight: nodeRect.right,
        bottomBound,
        rightBound,
        reason,
        isInline,
        rectsCount: 1
      };
    }
  }
  class AncestorBuilder {
    /**
     * 更新祖先栈
     * @param {Node} node - 当前节点
     * @param {Node} lastNode - 上一个节点
     * @param {Array} ancestorStack - 祖先栈
     * @param {Element} root - 根元素
     */
    updateStack(node, lastNode, ancestorStack, root) {
      if (!lastNode) {
        ancestorStack.length = 0;
        let parent = node.parentNode;
        while (parent && parent !== root && parent.nodeType === Node.ELEMENT_NODE) {
          ancestorStack.unshift(parent);
          parent = parent.parentNode;
        }
        return;
      }
      if (lastNode.contains(node)) {
        if (lastNode.nodeType === Node.ELEMENT_NODE) {
          ancestorStack.push(lastNode);
        }
      } else {
        while (ancestorStack.length > 0) {
          const top = ancestorStack[ancestorStack.length - 1];
          if (top.contains(node)) {
            break;
          }
          ancestorStack.pop();
        }
      }
    }
    /**
     * 在 probe 中同步祖先链
     * @param {Element} probeRoot - probe 根元素
     * @param {Array} ancestorStack - 祖先栈
     * @param {Array} probeAncestorStack - probe 祖先栈
     * @returns {Element} 最后一个祖先元素
     */
    syncProbe(probeRoot, ancestorStack, probeAncestorStack) {
      var _a, _b, _c, _d;
      let syncDepth = 0;
      while (syncDepth < ancestorStack.length && syncDepth < probeAncestorStack.length && ((_a = ancestorStack[syncDepth].dataset) == null ? void 0 : _a.ref) === ((_b = probeAncestorStack[syncDepth].dataset) == null ? void 0 : _b.ref)) {
        syncDepth++;
      }
      while (probeAncestorStack.length > syncDepth) {
        probeAncestorStack.pop();
      }
      let cursor = probeAncestorStack.length > 0 ? probeAncestorStack[probeAncestorStack.length - 1] : probeRoot;
      for (let i = syncDepth; i < ancestorStack.length; i++) {
        const ancestor = ancestorStack[i];
        let existing = null;
        for (const child of cursor.childNodes) {
          if (child.nodeType === Node.ELEMENT_NODE && ((_c = child.dataset) == null ? void 0 : _c.ref) === ((_d = ancestor.dataset) == null ? void 0 : _d.ref)) {
            existing = child;
            break;
          }
        }
        const probeNode = existing != null ? existing : ancestor.cloneNode(false);
        if (!existing) {
          cursor.appendChild(probeNode);
        }
        probeAncestorStack.push(probeNode);
        cursor = probeNode;
      }
      return cursor;
    }
    /**
     * 追加节点到页面（重建祖先链）
     * @param {Element} page - 页面元素
     * @param {Node} node - 要追加的节点
     * @param {Array} ancestorStack - 祖先栈
     */
    appendToPage(page, node, ancestorStack) {
      var _a, _b;
      let cursor = page;
      for (const ancestor of ancestorStack) {
        let found = null;
        for (const child of cursor.childNodes) {
          if (child.nodeType === Node.ELEMENT_NODE && child.tagName === ancestor.tagName && child.className === ancestor.className && ((_a = child.dataset) == null ? void 0 : _a.ref) === ((_b = ancestor.dataset) == null ? void 0 : _b.ref)) {
            found = child;
            break;
          }
        }
        if (!found) {
          found = ancestor.cloneNode(false);
          cursor.appendChild(found);
        }
        cursor = found;
      }
      cursor.appendChild(node);
      if (node.nodeType === Node.TEXT_NODE && node._splitFrom) {
        cursor.dataset.splitFrom = node._splitFrom;
        delete node._splitFrom;
      }
    }
  }
  class BaseHandler {
    constructor(chunker) {
      this.chunker = chunker;
    }
    /**
     * 判断是否能处理该节点
     * @param {Node} node - 节点
     * @returns {boolean}
     */
    canHandle(node) {
      throw new Error("canHandle() must be implemented");
    }
    /**
     * 在 chunk 开始前对内容进行预处理（可选）
     * 子类可覆盖此方法以执行一次性的内容规范化
     * @param {Element} _content - 内容根元素
     */
    preprocess(_content) {
    }
    /**
     * 处理节点（异步）
     * @param {Node} node - 节点
     * @param {Object} context - 上下文
     * @returns {Promise<Object>} Result 对象
     */
    handle(node, context) {
      return __async(this, null, function* () {
        throw new Error("handle() must be implemented");
      });
    }
    /**
     * 检测溢出（辅助方法）
     * @param {Node} probeNode - probe 中的节点
     * @param {Node} originalNode - 原始节点
     * @returns {Object} 溢出信息
     */
    checkOverflow(probeNode, originalNode) {
      return this.chunker.overflowDetector.check(probeNode, originalNode, this.chunker.probe);
    }
    /**
     * 在 probe 中重建祖先链（辅助方法）
     * @param {Element} probeRoot - probe 根元素
     * @param {Array} ancestorStack - 祖先栈
     * @param {Array} probeAncestorStack - probe 祖先栈
     * @returns {Element} 最后一个祖先元素
     */
    syncProbeAncestors(probeRoot, ancestorStack, probeAncestorStack) {
      return this.chunker.ancestorBuilder.syncProbe(probeRoot, ancestorStack, probeAncestorStack);
    }
    /**
     * 追加节点到页面（辅助方法）
     * @param {Element} page - 页面元素
     * @param {Node} node - 节点
     * @param {Array} ancestorStack - 祖先栈
     */
    appendToPage(page, node, ancestorStack) {
      this.chunker.ancestorBuilder.appendToPage(page, node, ancestorStack);
    }
    /**
     * 标记分割节点（辅助方法）
     * @param {Node} newNode - 新节点
     * @param {Node} originalNode - 原始节点
     */
    markSplitNode(newNode, originalNode) {
      this.chunker.markSplitNode(newNode, originalNode);
    }
    /**
     * 获取节点高度（辅助方法）
     * @param {Node} node - 节点
     * @returns {number}
     */
    getNodeHeight(node) {
      return this.chunker.getNodeHeight(node);
    }
    /**
     * 记录日志（辅助方法）
     * @param {Node} node - 节点
     * @param {Object} heightInfo - 高度信息
     * @param {number} nodeHeight - 节点高度
     * @param {boolean} isTruncated - 是否被截断
     */
    logNode(node, heightInfo, nodeHeight, isTruncated) {
      this.chunker.logNode(node, heightInfo, nodeHeight, isTruncated);
    }
  }
  const log$8 = createLogger("TextSplitter");
  class TextSplitter {
    /**
     * 在已渲染的文本节点上找溢出点（参考 PagedJS）
     * @param {Text} textNode - 原始文本节点
     * @param {Text} probeNode - probe 中已经完整渲染的文本节点
     * @param {Function} isOverflow - 溢出检测函数
     * @param {Function} getProbe - 获取 probe 容器的函数
     * @returns {{part1: string, part2: string}}
     */
    splitIncremental(textNode, probeNode, isOverflow, getProbe) {
      var _a, _b;
      const fullText = textNode.textContent;
      let breakPoint = 0;
      const words = this.splitWords(fullText);
      let lastWordEnd = 0;
      log$8("开始按词查找溢出点", {
        totalWords: words.length,
        fullTextLength: fullText.length
      });
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        probeNode.textContent = fullText.slice(0, word.end);
        const overflow = isOverflow();
        log$8(`检测第 ${i + 1} 个词`, {
          wordText: word.text,
          wordEnd: word.end,
          testText: this.formatText(fullText.slice(0, word.end)),
          overflow
        });
        if (overflow) {
          log$8("检测到溢出，开始逐字符查找", {
            searchRange: `${lastWordEnd} - ${word.end}`
          });
          breakPoint = this.findCharBreak(probeNode, lastWordEnd, word.end, isOverflow, fullText);
          break;
        }
        lastWordEnd = word.end;
        breakPoint = word.end;
      }
      probeNode.textContent = fullText;
      if (breakPoint === 0) {
        log$8("截断点为 0，整个文本移到下一页");
        return { part1: "", part2: fullText };
      }
      if (breakPoint >= fullText.length) {
        breakPoint = fullText.length;
      }
      const originalBreakPoint = breakPoint;
      breakPoint = this.adjustToWordBoundary(fullText, breakPoint);
      if (originalBreakPoint !== breakPoint) {
        log$8("单词边界调整", {
          original: originalBreakPoint,
          adjusted: breakPoint
        });
      }
      const part1 = fullText.slice(0, breakPoint);
      const part2 = fullText.slice(breakPoint);
      log$8("文本截断完成", {
        dataRef: ((_b = (_a = textNode.parentElement) == null ? void 0 : _a.dataset) == null ? void 0 : _b.ref) || "unknown",
        originalLength: fullText.length,
        breakPoint,
        original: this.formatText(fullText),
        part1: this.formatText(part1),
        part2: this.formatText(part2)
      });
      return { part1, part2 };
    }
    /**
     * 二分法找文本截断点（旧方法，保留兼容）
     * @param {Text} textNode - 原始文本节点
     * @param {Text} probeNode - probe 中的测试节点
     * @param {Function} isOverflow - 溢出检测函数
     * @returns {{part1: string, part2: string}}
     */
    split(textNode, probeNode, isOverflow) {
      var _a, _b;
      const fullText = textNode.textContent;
      let lo = 0;
      let hi = fullText.length;
      let bestSplit = 0;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        probeNode.textContent = fullText.slice(0, mid);
        if (isOverflow()) {
          hi = mid - 1;
        } else {
          bestSplit = mid;
          lo = mid + 1;
        }
      }
      const part1 = fullText.slice(0, bestSplit);
      const part2 = fullText.slice(bestSplit);
      log$8("文本截断", {
        dataRef: ((_b = (_a = textNode.parentElement) == null ? void 0 : _a.dataset) == null ? void 0 : _b.ref) || "unknown",
        originalLength: fullText.length,
        breakPoint: bestSplit,
        original: this.formatText(fullText),
        part1: this.formatText(part1),
        part2: this.formatText(part2)
      });
      return { part1, part2 };
    }
    /**
     * 格式化文本用于日志显示
     */
    formatText(text, maxLen = 30) {
      if (text.length <= maxLen) return text;
      const half = Math.floor(maxLen / 2);
      return text.slice(0, half) + "..." + text.slice(-half);
    }
    /**
     * 调整到单词边界
     */
    adjustToWordBoundary(text, position) {
      if (position === 0 || position >= text.length) {
        return position;
      }
      if (/\s/.test(text[position])) {
        return position;
      }
      const wordBoundaryRegex = /[\s\u3000-\u303F\uFF00-\uFF60\u4E00-\u9FFF.,;!?，。；！？、]/;
      let adjusted = position;
      while (adjusted > 0 && !wordBoundaryRegex.test(text[adjusted - 1])) {
        adjusted--;
      }
      if (position - adjusted > 20) {
        return position;
      }
      return adjusted;
    }
    /**
     * 按词分割文本（参考 PagedJS）
     */
    splitWords(text) {
      const words = [];
      let start = 0;
      let inWord = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const isWhitespace = /\s/.test(char);
        if (!isWhitespace && !inWord) {
          start = i;
          inWord = true;
        } else if (isWhitespace && inWord) {
          words.push({
            text: text.slice(start, i),
            start,
            end: i
          });
          inWord = false;
        }
      }
      if (inWord) {
        words.push({
          text: text.slice(start),
          start,
          end: text.length
        });
      }
      return words;
    }
    /**
     * 字符级精确查找
     * @param {Text} probeNode - probe 中的文本节点
     * @param {number} start - 开始位置
     * @param {number} end - 结束位置
     * @param {Function} isOverflow - 溢出检测函数
     * @param {string} fullText - 完整文本
     * @returns {number} 截断点
     */
    findCharBreak(probeNode, start, end, isOverflow, fullText) {
      log$8("开始字符级查找", {
        start,
        end,
        searchText: this.formatText(fullText.slice(start, end))
      });
      let probe = probeNode.parentElement;
      while (probe && !probe.classList.contains("k-print-probe")) {
        probe = probe.parentElement;
      }
      const bottomBound = probe ? probe.getBoundingClientRect().bottom : 0;
      for (let i = start + 1; i <= end; i++) {
        probeNode.textContent = fullText.slice(0, i);
        const range = document.createRange();
        range.selectNodeContents(probeNode);
        const rects = range.getClientRects();
        let maxBottom = 0;
        for (let j = 0; j < rects.length; j++) {
          if (rects[j].height > 0 && rects[j].bottom > maxBottom) {
            maxBottom = rects[j].bottom;
          }
        }
        const overflow = isOverflow();
        if (i % 5 === 0 || overflow || i === start + 1) {
          log$8(`  字符 ${i}:`, {
            char: fullText[i - 1],
            maxBottom: maxBottom.toFixed(2),
            bottomBound: bottomBound.toFixed(2),
            剩余空间: (bottomBound - maxBottom).toFixed(2),
            overflow
          });
        }
        if (overflow) {
          log$8("找到字符级截断点", {
            position: i - 1,
            char: fullText[i - 1],
            testText: this.formatText(fullText.slice(0, i - 1))
          });
          return i - 1;
        }
      }
      log$8("字符级查找完成，未溢出", {
        position: end
      });
      return end;
    }
  }
  const log$7 = createLogger("TextHandler");
  class TextHandler extends BaseHandler {
    constructor(chunker) {
      super(chunker);
      this.textSplitter = new TextSplitter();
    }
    /**
     * 判断是否能处理该节点
     */
    canHandle(node) {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    }
    /**
     * 处理文本节点
     */
    handle(node, context) {
      return __async(this, null, function* () {
        var _a, _b;
        const { probe } = context;
        const probeNode = context.probeNode;
        const textContent = node.textContent;
        const textLength = textContent.length;
        const textPreview = textLength > 50 ? textContent.substring(0, 50) + "..." : textContent;
        log$7("📝 处理文本节点:", {
          长度: textLength,
          预览: textPreview.replace(/\n/g, "\\n")
        });
        const overflowInfo = this.checkOverflow(probeNode, node);
        const modifiedOverflowInfo = this.chunker.hooks.trigger(
          "onOverflow",
          overflowInfo,
          probeNode,
          node,
          this
        );
        const finalOverflowInfo = modifiedOverflowInfo || overflowInfo;
        if (!finalOverflowInfo.overflow) {
          const heightInfo2 = Previewer.getHeightInfo(probe);
          const nodeHeight2 = this.getNodeHeight(probeNode);
          this.logNode(node, heightInfo2, nodeHeight2, false);
          log$7("✅ 未溢出，返回 append:", {
            原因: finalOverflowInfo.reason || "未知",
            isInline: finalOverflowInfo.isInline,
            矩形数量: finalOverflowInfo.rectsCount,
            maxBottom: finalOverflowInfo.maxBottom.toFixed(2),
            bottomBound: finalOverflowInfo.bottomBound.toFixed(2),
            剩余底部空间: (finalOverflowInfo.bottomBound - finalOverflowInfo.maxBottom).toFixed(2),
            节点高度: nodeHeight2.toFixed(2)
          });
          return {
            action: "append",
            node: node.cloneNode(false)
          };
        }
        const heightInfo = Previewer.getHeightInfo(probe);
        const nodeHeight = this.getNodeHeight(probeNode);
        log$7("⚠️ 溢出检测详情:", {
          原因: finalOverflowInfo.reason || "未知",
          isInline: finalOverflowInfo.isInline,
          矩形数量: finalOverflowInfo.rectsCount,
          maxBottom: finalOverflowInfo.maxBottom.toFixed(2),
          bottomBound: finalOverflowInfo.bottomBound.toFixed(2),
          超出底部距离: (finalOverflowInfo.maxBottom - finalOverflowInfo.bottomBound).toFixed(2),
          maxRight: ((_a = finalOverflowInfo.maxRight) == null ? void 0 : _a.toFixed(2)) || "0",
          rightBound: ((_b = finalOverflowInfo.rightBound) == null ? void 0 : _b.toFixed(2)) || "0"
        });
        this.logNode(node, heightInfo, nodeHeight, false);
        log$7("🔪 开始文本分割...");
        const { part1, part2 } = this.textSplitter.splitIncremental(
          node,
          probeNode,
          () => {
            const checkResult = this.checkOverflow(probeNode, node);
            return checkResult.overflow;
          },
          () => probe
        );
        log$7("🔪 文本分割结果:", {
          part1长度: part1 ? part1.length : 0,
          part2长度: part2 ? part2.length : 0,
          part1预览: part1 ? (part1.length > 30 ? part1.substring(0, 30) + "..." : part1).replace(/\n/g, "\\n") : "null",
          part2预览: part2 ? (part2.length > 30 ? part2.substring(0, 30) + "..." : part2).replace(/\n/g, "\\n") : "null"
        });
        const breakToken = { node, offset: part1 ? part1.length : 0, part1, part2 };
        const modifiedToken = this.chunker.hooks.trigger(
          "onBreakToken",
          breakToken,
          finalOverflowInfo,
          this
        );
        const finalToken = modifiedToken || breakToken;
        if (!finalToken.part1 || finalToken.part1.length === 0) {
          log$7("⚠️ part1 为空，返回 break 动作（整个文本节点换页）");
          return {
            action: "break",
            node: node.cloneNode(false)
          };
        }
        const part1Node = document.createTextNode(finalToken.part1);
        const part2Node = finalToken.part2 ? document.createTextNode(finalToken.part2) : null;
        this.markSplitNode(part1Node, node);
        if (part2Node) {
          this.markSplitNode(part2Node, node);
        }
        log$7("↩️ 返回 split 动作:", {
          part1长度: part1Node.textContent.length,
          part2长度: part2Node ? part2Node.textContent.length : 0
        });
        return {
          action: "split",
          part1: part1Node,
          part2: part2Node
        };
      });
    }
  }
  const log$6 = createLogger("NormalizeRowspan");
  function normalizeSection(rows) {
    const totalRows = rows.length;
    log$6(`── normalizeSection: ${totalRows} 行 ──`);
    let totalCols = 0;
    const grid = Array.from({ length: totalRows }, () => []);
    rows.forEach((row, ri) => {
      let ci = 0;
      const rowRef = row.getAttribute("data-ref") || row.getAttribute("data-id") || `row${ri}`;
      const childCount = row.children.length;
      Array.from(row.children).forEach((td, tdIdx) => {
        const skippedFrom = ci;
        while (grid[ri][ci] != null) ci++;
        if (ci > skippedFrom) {
          log$6(`  [grid] row${ri} td${tdIdx}: 跳过已占列 ${skippedFrom}→${ci}`);
        }
        const rowspan = parseInt(td.getAttribute("rowspan") || "1");
        const colspan = parseInt(td.getAttribute("colspan") || "1");
        const ref = td.getAttribute("data-ref") || "";
        const text = td.textContent.substring(0, 20).replace(/\n/g, " ");
        log$6(
          `  [grid] row${ri}(${rowRef}) td${tdIdx}: col=${ci}, rs=${rowspan}, cs=${colspan}, ref=${ref}, "${text}"`
        );
        const cellInfo = {
          ownerRow: ri,
          ownerCol: ci,
          rowspan,
          colspan,
          el: td
        };
        for (let dr = 0; dr < rowspan; dr++) {
          for (let dc = 0; dc < colspan; dc++) {
            const r = ri + dr;
            const c = ci + dc;
            if (r < totalRows) {
              if (!grid[r]) grid[r] = [];
              grid[r][c] = cellInfo;
            }
          }
        }
        ci += colspan;
        totalCols = Math.max(totalCols, ci);
      });
      log$6(`  [grid] row${ri}(${rowRef}): ${childCount} 个子元素, 扫描后 totalCols=${totalCols}`);
    });
    log$6(`── Step 2: 占位插入, grid ${totalRows}×${totalCols} ──`);
    rows.forEach((row, ri) => {
      const rowRef = row.getAttribute("data-ref") || row.getAttribute("data-id") || `row${ri}`;
      let insertedCount = 0;
      for (let ci = 0; ci < totalCols; ci++) {
        const cell = grid[ri][ci];
        if (!cell) continue;
        const isOwner = cell.ownerRow === ri && cell.ownerCol === ci;
        if (isOwner) continue;
        const isSameRowColspan = cell.ownerRow === ri && cell.ownerCol !== ci;
        if (isSameRowColspan) continue;
        if (ci > cell.ownerCol) continue;
        const rowsLeft = cell.ownerRow + cell.rowspan - ri;
        const ownerRef = cell.el.getAttribute("data-ref") || "";
        const ownerText = cell.el.textContent.substring(0, 20).replace(/\n/g, " ");
        log$6(
          `  [占位] row${ri}(${rowRef}) col=${ci}: owner=row${cell.ownerRow}col${cell.ownerCol}, ownerRef=${ownerRef}, rs=${cell.rowspan}, cs=${cell.colspan}, rowsLeft=${rowsLeft}, "${ownerText}"`
        );
        const placeholder = document.createElement(cell.el.tagName);
        placeholder.innerHTML = cell.el.innerHTML;
        Array.from(cell.el.attributes).forEach((attr) => {
          if (["rowspan", "colspan", "data-ref"].includes(attr.name)) return;
          placeholder.setAttribute(attr.name, attr.value);
        });
        placeholder.setAttribute("data-rowspan-hidden", "true");
        placeholder.setAttribute("data-owner-ref", ownerRef);
        placeholder.setAttribute("rowspan", String(rowsLeft));
        if (cell.colspan > 1) placeholder.setAttribute("colspan", String(cell.colspan));
        placeholder.style.display = "none";
        let colCursor = 0;
        let insertBefore = null;
        const childrenBefore = Array.from(row.children);
        for (const child of childrenBefore) {
          if (colCursor >= ci) {
            insertBefore = child;
            break;
          }
          const childCs = parseInt(child.getAttribute("colspan") || "1");
          colCursor += childCs;
        }
        const insertRef = insertBefore ? insertBefore.getAttribute("data-ref") || insertBefore.textContent.substring(0, 15) : null;
        log$6(
          `    插入位置: colCursor=${colCursor}, insertBefore=${insertRef ? `"${insertRef}"` : "null(末尾)"}, 当前行子元素数=${childrenBefore.length}`
        );
        if (insertBefore) {
          row.insertBefore(placeholder, insertBefore);
        } else {
          row.appendChild(placeholder);
        }
        insertedCount++;
      }
      if (insertedCount > 0) {
        log$6(
          `  [占位] row${ri}(${rowRef}): 共插入 ${insertedCount} 个占位, 插入后子元素数=${row.children.length}`
        );
      }
    });
  }
  function normalizeTableRowspan(content) {
    const tables = content.querySelectorAll("table");
    log$6(`═══ normalizeTableRowspan: 发现 ${tables.length} 个表格 ═══`);
    tables.forEach((table, tableIdx) => {
      const tableRef = table.getAttribute("data-ref") || `table${tableIdx}`;
      log$6(`── 表格 ${tableIdx}(${tableRef}): ──`);
      const sections = [
        ...Array.from(table.querySelectorAll(":scope > thead")),
        ...Array.from(table.querySelectorAll(":scope > tbody")),
        ...Array.from(table.querySelectorAll(":scope > tfoot"))
      ];
      if (sections.length > 0) {
        log$6(`  sections: ${sections.map((s) => s.tagName).join(", ")}`);
        sections.forEach((section) => {
          const rows = Array.from(section.querySelectorAll(":scope > tr"));
          log$6(`  ${section.tagName}: ${rows.length} 行`);
          if (rows.length > 0) normalizeSection(rows);
        });
      } else {
        const rows = Array.from(table.querySelectorAll(":scope > tr"));
        log$6(`  无 section 包裹, 直接 TR: ${rows.length} 行`);
        if (rows.length > 0) normalizeSection(rows);
      }
      const allRows = table.querySelectorAll("tr");
      log$6(`  ── 处理后行概况 ──`);
      allRows.forEach((row, ri) => {
        const cells = Array.from(row.children).map((td) => {
          const rs = td.getAttribute("rowspan") || "1";
          const cs = td.getAttribute("colspan") || "1";
          const hidden = td.hasAttribute("data-rowspan-hidden") ? "🔲" : "▪️";
          const text = td.textContent.substring(0, 10).replace(/\n/g, " ");
          return `${hidden}rs${rs}cs${cs}"${text}"`;
        });
        log$6(`    row${ri}: [${cells.join(", ")}]`);
      });
    });
  }
  function ensureTableColgroup(content, probeContainer) {
    const tablesToFix = [];
    content.querySelectorAll("table").forEach((table) => {
      if (table.querySelector(":scope > colgroup")) return;
      tablesToFix.push(table);
    });
    if (tablesToFix.length === 0) return;
    const isDetached = !content.isConnected;
    let measureWrap = null;
    if (isDetached) {
      if (!probeContainer || !probeContainer.isConnected) return;
      measureWrap = document.createElement("div");
      measureWrap.style.cssText = "position:absolute;visibility:hidden;left:0;top:0;width:100%;pointer-events:none;";
      probeContainer.appendChild(measureWrap);
      measureWrap.appendChild(content);
    }
    try {
      tablesToFix.forEach((table) => {
        const refRow = table.querySelector(":scope > thead > tr") || table.querySelector(":scope > tbody > tr") || table.querySelector(":scope > tr");
        if (!refRow) return;
        const widths = [];
        Array.from(refRow.children).forEach((cell) => {
          const colspan = parseInt(cell.getAttribute("colspan") || "1");
          const rect = cell.getBoundingClientRect();
          if (!rect.width) return;
          const perColWidth = Math.round(rect.width / colspan);
          for (let i = 0; i < colspan; i++) {
            widths.push(perColWidth);
          }
        });
        if (widths.length === 0) return;
        const colgroup = document.createElement("colgroup");
        colgroup.setAttribute("data-auto-generated", "true");
        widths.forEach((w) => {
          const col = document.createElement("col");
          col.setAttribute("width", String(w));
          colgroup.appendChild(col);
        });
        table.insertBefore(colgroup, table.firstChild);
      });
    } finally {
      if (measureWrap) {
        if (measureWrap.contains(content)) {
          measureWrap.removeChild(content);
        }
        measureWrap.remove();
      }
    }
  }
  function normalizeTableWidth(content, strategy, containerEl) {
    if (strategy === "ignore") return;
    const containerWidth = containerEl == null ? void 0 : containerEl.clientWidth;
    if (!containerWidth) return;
    content.querySelectorAll("table").forEach((table) => {
      const colgroup = table.querySelector("colgroup");
      if (!colgroup) return;
      const cols = Array.from(colgroup.querySelectorAll("col[width]"));
      if (cols.length === 0) return;
      if (strategy === "remove") {
        cols.forEach((col) => col.removeAttribute("width"));
        return;
      }
      if (strategy === "scale") {
        const totalWidth = cols.reduce((sum, col) => {
          const width = parseInt(col.getAttribute("width") || 0);
          return sum + width;
        }, 0);
        if (totalWidth > containerWidth) {
          const scale = containerWidth / totalWidth;
          cols.forEach((col) => {
            const width = parseInt(col.getAttribute("width") || 0);
            const scaledWidth = Math.floor(width * scale);
            col.setAttribute("width", scaledWidth);
          });
        }
      }
    });
  }
  const log$5 = createLogger("TableHandler");
  class TableHandler extends BaseHandler {
    constructor(chunker) {
      super(chunker);
      this.currentPage = 1;
      this.lastAppendedRow = null;
      this._rebuiltRefCounter = 0;
      this._content = null;
      this._refMapping = {};
    }
    /**
     * 预处理（chunk 开始前一次性调用）
     * 1. 补全被 rowspan 隐藏的占位单元格
     * 2. 自动补全缺失的 colgroup（保证分页后列宽稳定）
     * 3. 根据 tableWidthStrategy 规范化列宽
     */
    preprocess(content) {
      this._content = content;
      normalizeTableRowspan(content);
      ensureTableColgroup(content, this.chunker.probe);
      normalizeTableWidth(content, this.chunker.tableWidthStrategy, this.chunker.probe);
    }
    /**
     * 在新页添加表格结构（colgroup + thead）
     * - colgroup：结构性，始终添加
     * - thead   ：内容性，由 includeThead 控制
     * @param {Element} newPage    - 目标页面（输出页或 probe）
     * @param {Element} currentRow - 当前行（用于查找原始 table）
     * @param {boolean} includeThead - 是否包含 thead
     */
    applyTableStructure(newPage, currentRow, includeThead) {
      const table = currentRow.closest("table");
      if (!table) return;
      let thead = table.querySelector("thead");
      let colgroup = table.querySelector("colgroup");
      if (!thead || !colgroup) {
        let parent = table.parentElement;
        while (parent && parent !== document.body) {
          const tables = parent.querySelectorAll(":scope > * table, :scope > * > * table");
          if (tables.length > 1) {
            for (const t of tables) {
              if (!thead) thead = t.querySelector("thead");
              if (!colgroup) colgroup = t.querySelector("colgroup");
              if (thead && colgroup) break;
            }
            if (thead && colgroup) break;
          }
          parent = parent.parentElement;
        }
      }
      const newTable = newPage.querySelector("table");
      if (!newTable) return;
      if (colgroup && !newTable.querySelector("colgroup")) {
        newTable.insertBefore(colgroup.cloneNode(true), newTable.firstChild);
      }
      if (includeThead && thead) {
        const clonedThead = thead.cloneNode(true);
        clonedThead.setAttribute("data-repeated-header", "true");
        const tbody = newTable.querySelector("tbody");
        if (tbody) {
          newTable.insertBefore(clonedThead, tbody);
        } else {
          const existingColgroup = newTable.querySelector("colgroup");
          if (existingColgroup) {
            newTable.insertBefore(clonedThead, existingColgroup.nextSibling);
          } else {
            newTable.insertBefore(clonedThead, newTable.firstChild);
          }
        }
      }
    }
    canHandle(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const tag = node.tagName;
      return tag === "TABLE" || tag === "TBODY" || tag === "THEAD" || tag === "TFOOT" || tag === "TR";
    }
    handle(node, context) {
      return __async(this, null, function* () {
        const tag = node.tagName;
        if (tag !== "TR") return this.handleContainer(node, context);
        return this.handleTableRow(node, context);
      });
    }
    handleContainer(node, context) {
      const { probeNode } = context;
      const overflowInfo = this.checkOverflow(probeNode, node);
      if (!overflowInfo.overflow) {
        const heightInfo = Previewer.getHeightInfo(context.probe);
        const nodeHeight = this.getNodeHeight(probeNode);
        this.logNode(node, heightInfo, nodeHeight, false);
        return { action: "append", node: probeNode, reuseProbeNode: false };
      }
      const styles = window.getComputedStyle(node);
      if (styles.breakInside === "avoid") {
        return { action: "break", node: node.cloneNode(true), skipChildren: true };
      }
      return { action: "append", node: probeNode, reuseProbeNode: true };
    }
    handleTableRow(node, context) {
      var _a, _b;
      const { probeParent } = context;
      const rowId = node.getAttribute("data-id") || node.getAttribute("data-ref") || "?";
      log$5(
        `🔍 进入 handleTableRow: ${rowId}, lastAppendedRow=`,
        ((_a = this.lastAppendedRow) == null ? void 0 : _a.getAttribute("data-ref")) || ((_b = this.lastAppendedRow) == null ? void 0 : _b.getAttribute("data-id")) || "null"
      );
      log$5(
        `🔍 ${rowId} 原始children:`,
        Array.from(node.children).map((td) => ({
          hidden: td.hasAttribute("data-rowspan-hidden"),
          ownerRef: td.getAttribute("data-owner-ref"),
          rowspan: td.getAttribute("rowspan"),
          text: td.textContent.trim().slice(0, 10)
        }))
      );
      if (context.probeNode && context.probeNode.parentNode) {
        context.probeNode.parentNode.removeChild(context.probeNode);
        context.probeNode = null;
      }
      const probeRow = node.cloneNode(true);
      probeParent.appendChild(probeRow);
      const overflowInfo = this.checkOverflow(probeRow, node);
      const heightInfo = Previewer.getHeightInfo(context.probe);
      const nodeHeight = this.getNodeHeight(probeRow);
      log$5(
        `${overflowInfo.overflow ? "⚠️" : "✅"} ${rowId} | 行高=${nodeHeight}px, 容器=${heightInfo.actual}px/${heightInfo.available}px, 溢出=${overflowInfo.overflow}`
      );
      if (!overflowInfo.overflow) {
        this.logNode(node, heightInfo, nodeHeight, false);
        const cleanedRow = this.cleanRow(node);
        this.lastAppendedRow = node;
        return { action: "append", node: cleanedRow, skipChildren: true };
      }
      log$5(`⚠️ 溢出 break: ${rowId}`);
      const cutRow = this.lastAppendedRow;
      let outputRow;
      if (cutRow && this.hasCrossingCells(cutRow)) {
        const cutId = cutRow.getAttribute("data-id") || cutRow.getAttribute("data-ref") || "?";
        log$5(`  切割行: ${cutId}`);
        log$5(
          `🔍 cutRow children:`,
          Array.from(cutRow.children).map((td) => ({
            hidden: td.hasAttribute("data-rowspan-hidden"),
            rowspan: td.getAttribute("rowspan"),
            dataRef: td.getAttribute("data-ref"),
            text: td.textContent.trim().slice(0, 10)
          }))
        );
        const snap = this.captureSnapshot(cutRow);
        log$5(`  跨线单元格: ${snap.crossingCells.length}`);
        snap.crossingCells.forEach(
          (c) => log$5(
            `    col=${c.col} P2=${c.rowsInPage2} pageRef=${c.pageRef} "${c.content.substring(
              0,
              20
            )}"`
          )
        );
        this.fixPage1Rowspans(snap, context.currentPage);
        log$5(`  已修正 Page${this.currentPage} rowspan`);
        outputRow = this.rebuildPage2FirstRow(node, snap);
        log$5(`  重建后: 列=${outputRow.children.length}`, this.describeRow(outputRow));
        const zhangSanTD = this.findTDAtCol(outputRow, 1);
        log$5(
          `🔍 outputRow 张三 rowspan:`,
          zhangSanTD == null ? void 0 : zhangSanTD.getAttribute("rowspan"),
          zhangSanTD == null ? void 0 : zhangSanTD.textContent.trim().slice(0, 10)
        );
      } else {
        log$5("  无跨线单元格");
        outputRow = this.cleanRow(node);
      }
      this.currentPage++;
      this.lastAppendedRow = outputRow;
      log$5(`📄 → Page${this.currentPage}: ${rowId}, 列=${outputRow.children.length}`);
      return { action: "break", node: outputRow, skipChildren: true };
    }
    // ── 工具方法 ──
    describeRow(tr) {
      return Array.from(tr.children).map((td) => ({
        rs: td.getAttribute("rowspan"),
        cs: td.getAttribute("colspan"),
        txt: td.textContent.substring(0, 12)
      }));
    }
    hasCrossingCells(tr) {
      return Array.from(tr.children).some((td) => {
        const rs = parseInt(td.getAttribute("rowspan") || "1");
        return rs > 1;
      });
    }
    captureSnapshot(splitTR) {
      const crossingCells = [];
      let col = 0;
      Array.from(splitTR.children).forEach((td) => {
        const colspan = parseInt(td.getAttribute("colspan") || "1");
        const rowspan = parseInt(td.getAttribute("rowspan") || "1");
        const isHidden = td.hasAttribute("data-rowspan-hidden");
        if (isHidden && rowspan > 1) {
          const rowsInPage2 = rowspan - 1;
          const ownerRef = td.getAttribute("data-owner-ref");
          const ownerTD = document.querySelector(`[data-ref="${ownerRef}"]`) || this._content && this._content.querySelector(`[data-ref="${ownerRef}"]`);
          const pageRef = this._refMapping[ownerRef] || ownerRef;
          if (ownerTD) {
            crossingCells.push({
              col,
              colspan,
              rowsInPage2,
              content: ownerTD.innerHTML,
              attrs: this.getAttrsExcept(ownerTD, ["rowspan", "colspan", "data-ref"]),
              tagName: ownerTD.tagName.toLowerCase(),
              pageRef
            });
          } else {
            log$5(`    ⚠️ owner ${ownerRef} 不可达，使用占位信息兜底`);
            crossingCells.push({
              col,
              colspan,
              rowsInPage2,
              content: td.innerHTML,
              attrs: this.getAttrsExcept(td, [
                "rowspan",
                "colspan",
                "data-ref",
                "data-rowspan-hidden",
                "data-owner-ref",
                "style"
              ]),
              tagName: td.tagName.toLowerCase(),
              pageRef
            });
          }
        } else if (!isHidden && rowspan > 1) {
          crossingCells.push({
            col,
            colspan,
            rowsInPage2: rowspan - 1,
            content: td.innerHTML,
            attrs: this.getAttrsExcept(td, ["rowspan", "colspan", "data-ref"]),
            tagName: td.tagName.toLowerCase(),
            pageRef: td.getAttribute("data-ref")
          });
        }
        col += colspan;
      });
      return { crossingCells };
    }
    fixPage1Rowspans(snapshot, outputPage) {
      snapshot.crossingCells.forEach(({ pageRef, rowsInPage2 }) => {
        var _a;
        const targetTD = pageRef ? outputPage.querySelector(`[data-ref="${pageRef}"]`) : null;
        if (targetTD) {
          const before = targetTD.getAttribute("rowspan");
          const currentRowspan = parseInt(before || "1");
          const newRowspan = currentRowspan - rowsInPage2;
          if (newRowspan <= 1) targetTD.removeAttribute("rowspan");
          else targetTD.setAttribute("rowspan", String(newRowspan));
          const after = targetTD.getAttribute("rowspan");
          log$5(
            `    fixPage1: [data-ref="${pageRef}"] rowspan: ${before} → ${after}, parentTag=${(_a = targetTD.parentElement) == null ? void 0 : _a.tagName}, 在outputPage内=${outputPage.contains(targetTD)}`
          );
        } else {
          log$5(
            `    fixPage1: ⚠️ 未找到 [data-ref="${pageRef}"], outputPage子元素数=${outputPage.childNodes.length}`
          );
        }
      });
    }
    rebuildPage2FirstRow(firstTR, snapshot) {
      const clone = firstTR.cloneNode(true);
      snapshot.crossingCells.forEach(
        ({ col, colspan, rowsInPage2, content, attrs, tagName, pageRef }) => {
          const newTD = document.createElement(tagName);
          newTD.innerHTML = content;
          if (attrs) this.applyAttrsString(newTD, attrs);
          if (rowsInPage2 > 1) newTD.setAttribute("rowspan", String(rowsInPage2));
          if (colspan > 1) newTD.setAttribute("colspan", String(colspan));
          const rebuiltRef = `ref-rebuilt-${++this._rebuiltRefCounter}`;
          newTD.setAttribute("data-ref", rebuiltRef);
          const originalRef = Object.keys(this._refMapping).find((k) => this._refMapping[k] === pageRef) || pageRef;
          if (originalRef) this._refMapping[originalRef] = rebuiltRef;
          const existingTD = this.findTDAtCol(clone, col);
          if (existingTD == null ? void 0 : existingTD.hasAttribute("data-rowspan-hidden")) {
            existingTD.replaceWith(newTD);
          } else if (existingTD) {
            clone.insertBefore(newTD, existingTD);
          } else {
            clone.appendChild(newTD);
          }
        }
      );
      clone.querySelectorAll("[data-rowspan-hidden]").forEach((el) => el.remove());
      return clone;
    }
    cleanRow(tr) {
      const clone = tr.cloneNode(true);
      clone.querySelectorAll("[data-rowspan-hidden]").forEach((el) => el.remove());
      return clone;
    }
    findTDAtCol(tr, targetCol) {
      let col = 0;
      for (const td of Array.from(tr.children)) {
        if (col === targetCol) return td;
        col += parseInt(td.getAttribute("colspan") || "1");
        if (col > targetCol) return null;
      }
      return null;
    }
    getAttrsExcept(el, exclude) {
      return Array.from(el.attributes).filter((a) => !exclude.includes(a.name)).map((a) => `${a.name}="${a.value}"`).join(" ");
    }
    applyAttrsString(el, attrs) {
      if (!attrs) return;
      const temp = document.createElement("div");
      temp.innerHTML = `<span ${attrs}></span>`;
      const span = temp.firstElementChild;
      if (span) {
        Array.from(span.attributes).forEach((a) => el.setAttribute(a.name, a.value));
      }
    }
  }
  const log$4 = createLogger("ImageHandler");
  const DEFAULT_IMAGE_OPTIONS = {
    remainingRatioThreshold: 0.4,
    minScaleRatio: 0.3,
    loadTimeout: 5e3,
    placeholderMinHeight: 80,
    errorPlaceholderText: "图片加载失败"
  };
  class ImageHandler extends BaseHandler {
    constructor(chunker) {
      super(chunker);
      this.options = __spreadValues(__spreadValues({}, DEFAULT_IMAGE_OPTIONS), chunker.imageOptions || {});
    }
    canHandle(node) {
      return node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG" && !node.closest("table");
    }
    handle(node, context) {
      return __async(this, null, function* () {
        var _a;
        const probeNode = context.probeNode;
        const parentEl = probeNode.parentElement;
        const parentComputed = parentEl ? window.getComputedStyle(parentEl) : null;
        const originalLayout = this.parseOriginalLayout(probeNode, parentComputed);
        const renderNode = yield this.prepareRenderableNode(context.probeNode);
        const metrics = this.getMetrics(renderNode, context.probe, node);
        const scaleToFitCurrent = metrics.remainingHeight / metrics.renderedHeight;
        log$4("📏 metrics", {
          tag: renderNode.tagName,
          dataId: node.getAttribute("data-id") || node.getAttribute("data-ref"),
          renderedHeight: metrics.renderedHeight,
          remainingHeight: metrics.remainingHeight,
          pageHeight: metrics.pageHeight,
          currentPageUsed: metrics.currentPageUsed,
          remainingRatio: metrics.remainingRatio,
          scaleToFitCurrent,
          originalWidth: metrics.originalWidth,
          originalHeight: metrics.originalHeight,
          // 🔴 新增：原始布局属性日志
          layout: originalLayout,
          src: node.tagName === "IMG" ? (_a = node.src) == null ? void 0 : _a.slice(-40) : "-"
        });
        if (metrics.renderedHeight <= 0) {
          log$4("⚠️ renderedHeight <= 0, append");
          return this.createAppendResult(renderNode);
        }
        if (metrics.renderedHeight <= metrics.remainingHeight) {
          log$4("✅ 当前页放得下, append");
          return this.createAppendResult(renderNode);
        }
        if (metrics.currentPageUsed <= 1) {
          log$4("📄 空页, 超大图缩放");
          const emptyPageScale = metrics.pageHeight / metrics.renderedHeight;
          if (emptyPageScale > 0 && emptyPageScale < 1) {
            this.applyScale(renderNode, emptyPageScale, metrics, originalLayout);
            log$4("  缩放比:", emptyPageScale);
          }
          return this.createAppendResult(renderNode);
        }
        const thresholdCtx = __spreadProps(__spreadValues({ node }, metrics), { scaleToFitCurrent });
        const threshold = this.resolveThreshold(this.options.remainingRatioThreshold, thresholdCtx);
        const minScale = this.resolveThreshold(this.options.minScaleRatio, thresholdCtx);
        const shouldScaleCurrent = metrics.remainingRatio >= threshold && scaleToFitCurrent >= minScale;
        log$4("🔍 缩放决策", {
          scaleToFitCurrent,
          remainingRatio: metrics.remainingRatio,
          remainingRatioThreshold: threshold,
          minScaleRatio: minScale,
          shouldScaleCurrent
        });
        if (shouldScaleCurrent) {
          this.applyScale(renderNode, scaleToFitCurrent, metrics, originalLayout);
          log$4("✅ 缩放放入当前页, scale:", scaleToFitCurrent);
          return this.createAppendResult(renderNode);
        }
        log$4("⚠️ break 到下一页");
        const breakNode = renderNode.cloneNode(true);
        if (metrics.renderedHeight > metrics.pageHeight) {
          const breakScale = metrics.pageHeight / metrics.renderedHeight;
          log$4("  超大图, 新页缩放比:", breakScale);
          this.applyScale(breakNode, breakScale, metrics, originalLayout);
        }
        return {
          action: "break",
          node: breakNode,
          skipChildren: true
        };
      });
    }
    resolveThreshold(option, ctx) {
      if (typeof option === "function") {
        return option(ctx);
      }
      return option;
    }
    createAppendResult(renderNode) {
      if (renderNode.tagName === "IMG") {
        return {
          action: "append",
          node: renderNode,
          reuseProbeNode: true,
          skipChildren: true
        };
      }
      return {
        action: "append",
        node: renderNode.cloneNode(true),
        skipChildren: true
      };
    }
    prepareRenderableNode(probeNode) {
      return __async(this, null, function* () {
        if (probeNode.tagName !== "IMG") {
          return probeNode;
        }
        const status = yield this.waitForImage(probeNode);
        if (status === "loaded") {
          return probeNode;
        }
        const placeholder = this.createErrorPlaceholder(probeNode);
        if (probeNode.parentNode) {
          probeNode.parentNode.replaceChild(placeholder, probeNode);
        }
        return placeholder;
      });
    }
    waitForImage(img) {
      if (img.complete) {
        return Promise.resolve(img.naturalWidth > 0 ? "loaded" : "error");
      }
      return new Promise((resolve) => {
        let settled = false;
        let timer = null;
        const cleanup = () => {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleError);
        };
        const finish = (status) => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(status);
        };
        const handleLoad = () => finish("loaded");
        const handleError = () => finish("error");
        img.addEventListener("load", handleLoad);
        img.addEventListener("error", handleError);
        timer = setTimeout(() => {
          const rect = img.getBoundingClientRect();
          finish(
            img.complete && (img.naturalWidth > 0 || rect.width > 0 && rect.height > 0) ? "loaded" : "error"
          );
        }, this.options.loadTimeout);
      });
    }
    createErrorPlaceholder(img) {
      var _a;
      const { width, height } = this.resolveBoxSize(img);
      const placeholder = document.createElement("div");
      placeholder.className = "k-print-image-error";
      placeholder.setAttribute("data-print-image-error", "true");
      const icon = document.createElement("span");
      icon.className = "k-icon-image-error k-print-image-error__icon";
      const text = document.createElement("span");
      text.className = "k-print-image-error__text";
      text.textContent = this.options.errorPlaceholderText;
      placeholder.appendChild(icon);
      placeholder.appendChild(text);
      this.recordOriginalSize(placeholder, width, height);
      this.applySize(
        placeholder,
        width > 0 ? width : ((_a = img.parentElement) == null ? void 0 : _a.getBoundingClientRect().width) || 160,
        height > 0 ? Math.max(height, this.options.placeholderMinHeight) : this.options.placeholderMinHeight
      );
      return placeholder;
    }
    getMetrics(node, probe, originalNode) {
      const probeRect = probe.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const marginBottom = this.parsePx(style.marginBottom);
      const renderedHeight = nodeRect.height + marginBottom;
      const renderedWidth = nodeRect.width;
      const remainingHeight = Math.max(0, probeRect.bottom - nodeRect.top);
      const currentPageUsed = Math.max(0, nodeRect.top - probeRect.top);
      return {
        pageHeight: probeRect.height,
        pageWidth: probeRect.width,
        renderedWidth,
        renderedHeight,
        remainingHeight,
        currentPageUsed,
        remainingRatio: probeRect.height > 0 ? remainingHeight / probeRect.height : 0,
        originalWidth: this.getRecordedSize(node, "printOriginalWidth") || renderedWidth,
        originalHeight: this.getRecordedSize(node, "printOriginalHeight") || renderedHeight,
        imageElement: node.tagName === "IMG" ? node : null,
        imageAttributes: node.tagName === "IMG" ? {
          src: node.src,
          alt: node.alt,
          width: node.getAttribute("width"),
          height: node.getAttribute("height"),
          "data-id": node.getAttribute("data-id"),
          style: node.getAttribute("style")
        } : null
      };
    }
    resolveBoxSize(node) {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const width = rect.width || this.parsePx(style.width) || this.parsePx(node.getAttribute("width")) || node.offsetWidth || 0;
      const height = rect.height || this.parsePx(style.height) || this.parsePx(node.getAttribute("height")) || node.offsetHeight || 0;
      return {
        width: this.roundSize(width),
        height: this.roundSize(height)
      };
    }
    /**
     * 解析原始 img 节点的布局属性（在 probe 渲染完成后调用）
     * 通过对比 img computedWidth 和父容器 computedWidth 判断是否为响应式
     * return: { isWidthPercent, isWidthPx, isHeightPercent, isHeightPx, hasFixedSize, objectFit }
     */
    parseOriginalLayout(node, parentComputed) {
      const result = {};
      result.attrWidth = node.getAttribute("width");
      result.attrHeight = node.getAttribute("height");
      result.styleWidth = node.style.width;
      result.styleHeight = node.style.height;
      result.styleMaxWidth = node.style.maxWidth;
      result.styleMaxHeight = node.style.maxHeight;
      result.styleObjectFit = node.style.objectFit;
      const computed = window.getComputedStyle(node);
      result.computedWidth = computed.width;
      result.computedHeight = computed.height;
      result.computedMaxWidth = computed.maxWidth;
      result.computedObjectFit = computed.objectFit;
      result.styleObjectFit = node.style.objectFit || (computed.objectFit !== "fill" && computed.objectFit !== "none" && computed.objectFit !== "" ? computed.objectFit : "");
      result.isHeightPercent = computed.height.endsWith("%");
      result.isHeightPx = parseFloat(computed.height) > 0 && !computed.height.endsWith("%");
      result.hasFixedSize = !!(result.attrWidth || result.attrHeight || result.styleWidth && result.styleWidth !== "auto" || result.styleHeight && result.styleHeight !== "auto");
      if (result.hasFixedSize) {
        result.isWidthPx = true;
        result.isWidthPercent = false;
      } else if (parentComputed) {
        const nodeWidth = parseFloat(computed.width);
        const parentWidth = parseFloat(parentComputed.width);
        const isResponsive = nodeWidth >= parentWidth - 5 || nodeWidth >= parentWidth * 0.98;
        result.isWidthPx = !isResponsive && nodeWidth > 0;
        result.isWidthPercent = isResponsive;
      } else {
        result.isWidthPx = parseFloat(computed.width) > 0;
        result.isWidthPercent = false;
      }
      log$4("📐 原始布局属性", result);
      return result;
    }
    /**
     * 基于原始布局属性计算缩放策略
     * return: 'none' | 'height' | 'both'
     */
    computeScaleStrategy(layout) {
      if (layout.hasFixedSize) {
        log$4("📐 策略: 有固定尺寸 → both");
        return "both";
      }
      if (layout.isWidthPercent || !layout.isWidthPx) {
        log$4("📐 策略: 宽度响应式 → height");
        return "height";
      }
      log$4("📐 策略: 固定px → both");
      return "both";
    }
    /**
     * 检测是否应该强制覆盖宽高
     * return: 'none' | 'height' | 'both'
     */
    detectScaleStrategy(img, metrics) {
      const parent = img.parentElement;
      if (!parent || parent === document.body) {
        log$4("🗂️ 策略: no parent → both");
        return "both";
      }
      const parentStyle = window.getComputedStyle(parent);
      const display = parentStyle.display;
      if (display !== "flex" && display !== "grid") {
        log$4("🗂️ 策略: parent 不是 flex/grid → height", { parentDisplay: display });
        return "height";
      }
      const hasWidthConstraint = parentStyle.width !== "auto" && parentStyle.width !== "100%" && parentStyle.maxWidth !== "none";
      const hasHeightConstraint = parentStyle.height !== "auto" && parentStyle.height !== "100%" && parentStyle.maxHeight !== "none";
      const hasFlexConstraint = parentStyle.flexBasis !== "auto" || parentStyle.flexGrow !== "0" || parentStyle.flexShrink !== "1";
      const hasGridConstraint = parentStyle.gridTemplateColumns !== "none";
      const hasConstraint = hasWidthConstraint || hasHeightConstraint || hasFlexConstraint || hasGridConstraint;
      log$4("🗂️ 策略检测", {
        parentDisplay: display,
        flexBasis: parentStyle.flexBasis,
        flexGrow: parentStyle.flexGrow,
        gridTemplateColumns: parentStyle.gridTemplateColumns,
        width: parentStyle.width,
        maxWidth: parentStyle.maxWidth,
        hasConstraint
      });
      if (hasConstraint) {
        return "none";
      }
      return "height";
    }
    applyScale(node, scale, metrics = null, originalLayout = null) {
      if (!(scale > 0 && scale < 1)) return;
      const originalWidth = (metrics == null ? void 0 : metrics.originalWidth) || this.getRecordedSize(node, "printOriginalWidth");
      const originalHeight = (metrics == null ? void 0 : metrics.originalHeight) || this.getRecordedSize(node, "printOriginalHeight");
      if (!(originalWidth > 0) || !(originalHeight > 0)) return;
      const strategy = originalLayout ? this.computeScaleStrategy(originalLayout) : this.detectScaleStrategy(node, __spreadProps(__spreadValues({}, metrics), { originalWidth, originalHeight }));
      const targetHeight = originalHeight * scale;
      const objectFit = (originalLayout == null ? void 0 : originalLayout.styleObjectFit) || "contain";
      log$4("📐 originalLayout", originalLayout, "objectFit:", objectFit);
      log$4("📐 applyScale", {
        strategy,
        originalWidth,
        originalHeight,
        targetHeight,
        objectFit
      });
      if (strategy === "none") {
        node.dataset.printScale = String(this.roundSize(scale));
        return;
      }
      if (strategy === "height") {
        this.recordOriginalSize(node, originalWidth, originalHeight);
        node.style.maxHeight = `${this.roundSize(targetHeight)}px`;
        node.style.maxWidth = "100%";
        node.style.objectFit = objectFit;
        node.dataset.printScale = String(this.roundSize(scale));
        return;
      }
      this.applySize(node, originalWidth * scale, originalHeight * scale);
      node.style.objectFit = objectFit;
      node.dataset.printScale = String(this.roundSize(scale));
    }
    applySize(node, width, height) {
      if (!(width > 0) || !(height > 0)) return;
      this.recordOriginalSize(node, width, height);
      node.style.maxWidth = `${this.roundSize(width)}px`;
      node.style.maxHeight = `${this.roundSize(height)}px`;
    }
    recordOriginalSize(node, width, height) {
      if (!node.dataset.printOriginalWidth && width > 0) {
        node.dataset.printOriginalWidth = String(this.roundSize(width));
      }
      if (!node.dataset.printOriginalHeight && height > 0) {
        node.dataset.printOriginalHeight = String(this.roundSize(height));
      }
      if (node.dataset.printOriginalStyleWidth === void 0) {
        node.dataset.printOriginalStyleWidth = node.style.width || "";
      }
      if (node.dataset.printOriginalStyleHeight === void 0) {
        node.dataset.printOriginalStyleHeight = node.style.height || "";
      }
    }
    getRecordedSize(node, key) {
      var _a;
      return this.parsePx((_a = node.dataset) == null ? void 0 : _a[key]);
    }
    parsePx(value) {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    roundSize(value) {
      return Math.round(value * 100) / 100;
    }
  }
  const log$3 = createLogger("ElementHandler");
  class ElementHandler extends BaseHandler {
    /**
     * 判断是否能处理该节点
     */
    canHandle(node) {
      return node.nodeType === Node.ELEMENT_NODE;
    }
    hasStandaloneImage(node) {
      if (!node || node.tagName === "IMG" || node.closest("table")) return false;
      return !!node.querySelector("img:not(table img)");
    }
    /**
     * 处理元素节点
     */
    handle(node, context) {
      return __async(this, null, function* () {
        var _a, _b;
        const { probe } = context;
        const probeNode = context.probeNode;
        const overflowInfo = this.checkOverflow(probeNode, node);
        if (!overflowInfo.overflow) {
          const heightInfo = Previewer.getHeightInfo(probe);
          const nodeHeight = this.getNodeHeight(probeNode);
          this.logNode(node, heightInfo, nodeHeight, false);
          return {
            action: "append",
            node: probeNode,
            reuseProbeNode: true
            // 标记需要克隆
          };
        }
        const styles = window.getComputedStyle(node);
        const hasStandaloneImage = this.hasStandaloneImage(node);
        if (hasStandaloneImage && styles.breakInside !== "avoid") {
          log$3(`🖼️ 容器溢出但包含图片，继续下钻: <${node.tagName}> [${((_a = node.dataset) == null ? void 0 : _a.ref) || "no-ref"}]`);
          return {
            action: "append",
            node: probeNode,
            reuseProbeNode: true
          };
        }
        log$3(`📦 元素整体移到下一页: <${node.tagName}> [${((_b = node.dataset) == null ? void 0 : _b.ref) || "no-ref"}]`);
        return {
          action: "break",
          // 触发封页
          node: node.cloneNode(true),
          // 深克隆，包含所有子节点
          skipChildren: true
          // 跳过子节点遍历
        };
      });
    }
  }
  class HookManager {
    constructor(hooks = {}) {
      this.hooks = {};
      Object.keys(hooks).forEach((name) => {
        this.register(name, hooks[name]);
      });
    }
    /**
     * 注册 Hook
     * @param {string} name - Hook 名称
     * @param {Function} callback - 回调函数
     */
    register(name, callback) {
      if (!this.hooks[name]) {
        this.hooks[name] = [];
      }
      this.hooks[name].push(callback);
    }
    /**
     * 触发 Hook
     * @param {string} name - Hook 名称
     * @param {...any} args - 参数
     * @returns {any} 最后一个 Hook 的返回值（可用于修改参数）
     */
    trigger(name, ...args) {
      const callbacks = this.hooks[name];
      if (!callbacks || callbacks.length === 0) {
        return args[0];
      }
      let result = args[0];
      for (const callback of callbacks) {
        const hookResult = callback(...args);
        if (hookResult !== void 0) {
          result = hookResult;
          args[0] = hookResult;
        }
      }
      return result;
    }
    /**
     * 触发异步 Hook
     * @param {string} name - Hook 名称
     * @param {...any} args - 参数
     * @returns {Promise<any>}
     */
    triggerAsync(name, ...args) {
      return __async(this, null, function* () {
        const callbacks = this.hooks[name];
        if (!callbacks || callbacks.length === 0) {
          return args[0];
        }
        let result = args[0];
        for (const callback of callbacks) {
          const hookResult = yield callback(...args);
          if (hookResult !== void 0) {
            result = hookResult;
            args[0] = hookResult;
          }
        }
        return result;
      });
    }
  }
  const log$2 = createLogger("FlexPreprocess");
  const FLEX_DISPLAYS = ["flex", "inline-flex", "grid", "inline-grid"];
  const IMG_LOAD_TIMEOUT = 5e3;
  function preprocessFlexLayout(content, probeContainer, hooks) {
    return __async(this, null, function* () {
      const isDetached = !content.isConnected;
      let measureWrap = null;
      let savedContentStyle = null;
      if (isDetached) {
        if (!probeContainer || !probeContainer.isConnected) return;
        measureWrap = document.createElement("div");
        measureWrap.className = "k-print-body";
        probeContainer.appendChild(measureWrap);
        savedContentStyle = content.style.cssText;
        content.style.cssText += ";padding:0!important;margin:0!important;border:none!important;";
        measureWrap.appendChild(content);
      }
      try {
        const containers = findFlexContainers(content);
        if (containers.length === 0) return;
        log$2(`找到 ${containers.length} 个 flex/grid 容器`);
        yield Promise.all(containers.map((c) => waitAllImages(c)));
        probeContainer.offsetHeight;
        let totalLocked = 0;
        for (const container of containers) {
          totalLocked += lockItemWidths(container);
        }
        if (totalLocked > 0) {
          log$2(`共锁定 ${totalLocked} 个 flex-item 宽度`);
          hooks.register("onAfterNodeProbed", applyPrecalcWidth);
        }
      } finally {
        if (measureWrap) {
          if (savedContentStyle !== null) {
            content.style.cssText = savedContentStyle;
          }
          if (measureWrap.contains(content)) {
            measureWrap.removeChild(content);
          }
          measureWrap.remove();
        }
      }
    });
  }
  function applyPrecalcWidth(probeNode, originalNode) {
    var _a;
    const w = (_a = originalNode.dataset) == null ? void 0 : _a.precalcWidth;
    if (!w) return;
    probeNode.style.flex = `0 0 ${w}px`;
    probeNode.style.width = `${w}px`;
  }
  function findFlexContainers(content) {
    const result = [];
    const all = content.querySelectorAll("*");
    for (const el of all) {
      const display = window.getComputedStyle(el).display;
      if (FLEX_DISPLAYS.includes(display)) {
        result.push(el);
      }
    }
    return result;
  }
  function lockItemWidths(container) {
    const children = Array.from(container.children);
    if (children.length <= 1) return 0;
    let count = 0;
    children.forEach((item) => {
      log$2("flex-item width:", item.getBoundingClientRect().width, item);
      const width = item.offsetWidth;
      if (width > 0) {
        item.dataset.precalcWidth = String(width);
        count++;
      }
    });
    return count;
  }
  function waitAllImages(container) {
    const images = container.querySelectorAll("img");
    if (images.length === 0) return Promise.resolve();
    return Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          let timer = null;
          const done = () => {
            if (timer) clearTimeout(timer);
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
            resolve();
          };
          img.addEventListener("load", done);
          img.addEventListener("error", done);
          timer = setTimeout(done, IMG_LOAD_TIMEOUT);
        });
      })
    );
  }
  createLogger("Chunker");
  class Chunker {
    constructor(options = {}) {
      this.probe = options.probe;
      this.overflowDetector = new OverflowDetector();
      this.ancestorBuilder = new AncestorBuilder();
      this.refCounter = 0;
      this.repeatTableHeader = !!options.repeatTableHeader;
      this.tableWidthStrategy = options.tableWidthStrategy || "scale";
      this.imageOptions = options.image || {};
      this.hooks = new HookManager(options.hooks || {});
      this.handlers = [];
      this.tableHandler = new TableHandler(this);
      this.registerHandler(new TextHandler(this));
      this.registerHandler(this.tableHandler);
      this.registerHandler(new ImageHandler(this));
      this.registerHandler(new ElementHandler(this));
      this.sourceElement = null;
      this.pageCounter = 0;
    }
    /**
     * 创建新页面容器（基于用户 element，保留样式上下文）
     */
    createNewPage() {
      if (!this.sourceElement) {
        const page2 = document.createElement("div");
        const probeContent2 = PageElementFactory.createBody();
        return { page: page2, probeContent: probeContent2 };
      }
      const page = PageElementFactory.createBodyFromSource(this.sourceElement, {
        isProbe: false,
        pageIndex: this.pageCounter
      });
      const probeContent = PageElementFactory.createBodyFromSource(this.sourceElement, {
        isProbe: true,
        pageIndex: this.pageCounter
      });
      this.pageCounter++;
      return { page, probeContent };
    }
    /**
     * 重置 probe（保留 style 标签，添加新的 probeContent）
     */
    resetProbe(probeContent) {
      this.probe.innerHTML = "";
      if (this.probeStyleEl) this.probe.appendChild(this.probeStyleEl);
      this.probe.appendChild(probeContent);
    }
    /**
     * 注册 Handler
     */
    registerHandler(handler) {
      this.handlers.push(handler);
    }
    /**
     * 查找能处理该节点的 Handler
     */
    findHandler(node) {
      return this.handlers.find((h) => h.canHandle(node));
    }
    /**
     * 处理 Handler 返回的结果
     */
    /**
     * 跳过节点的所有子节点，返回下一个兄弟节点或祖先的兄弟节点
     */
    skipNodeChildren(node, walker) {
      let nextNode = null;
      while (nextNode = walker.nextNode()) {
        if (!node.contains(nextNode)) {
          return nextNode;
        }
      }
      return "END";
    }
    processResult(result, node, walker, state) {
      return __async(this, null, function* () {
        const { currentPage, pages, ancestorStack } = state;
        switch (result.action) {
          case "append": {
            let nodeToAppend = result.reuseProbeNode ? result.node.cloneNode(false) : result.node;
            const modifiedNode = this.hooks.trigger("onRenderNode", nodeToAppend, node, this);
            if (modifiedNode && modifiedNode !== nodeToAppend) {
              nodeToAppend = modifiedNode;
            }
            this.ancestorBuilder.appendToPage(currentPage, nodeToAppend, ancestorStack);
            if (result.skipChildren) {
              const skipToNode = this.skipNodeChildren(node, walker);
              return { skipToNode };
            }
            return null;
          }
          case "split": {
            if (result.part1) {
              this.ancestorBuilder.appendToPage(currentPage, result.part1, ancestorStack);
            }
            if (currentPage.childNodes.length > 0) {
              yield this.hooks.triggerAsync("onAfterPageLayout", currentPage, pages.length, this);
              yield this.hooks.triggerAsync("onFinalizePage", currentPage, pages.length, this);
              pages.push(currentPage);
            }
            yield this.hooks.triggerAsync("onPageBreak", result.part2, node, this);
            const { page: newPage, probeContent: newProbeContent } = this.createNewPage();
            yield this.hooks.triggerAsync("onBeforePageLayout", newPage, pages.length, this);
            this.resetProbe(newProbeContent);
            const newProbeAncestorStack = [];
            if (result.part2) {
              this.ancestorBuilder.appendToPage(newPage, result.part2, ancestorStack);
              const probeParent2 = this.ancestorBuilder.syncProbe(
                newProbeContent,
                ancestorStack,
                newProbeAncestorStack
              );
              probeParent2.appendChild(result.part2.cloneNode(false));
            }
            const skipToNode = result.skipChildren ? this.skipNodeChildren(node, walker) : null;
            return {
              currentPage: newPage,
              probeContent: newProbeContent,
              probeAncestorStack: newProbeAncestorStack,
              skipToNode
            };
          }
          case "break": {
            const probeNode = state.probeNode;
            if (probeNode && probeNode.parentNode) {
              probeNode.parentNode.removeChild(probeNode);
            }
            if (currentPage.childNodes.length > 0) {
              yield this.hooks.triggerAsync("onAfterPageLayout", currentPage, pages.length, this);
              yield this.hooks.triggerAsync("onFinalizePage", currentPage, pages.length, this);
              pages.push(currentPage);
            }
            yield this.hooks.triggerAsync("onPageBreak", result.node, node, this);
            const { page: breakNewPage, probeContent: breakNewProbeContent } = this.createNewPage();
            yield this.hooks.triggerAsync("onBeforePageLayout", breakNewPage, pages.length, this);
            this.resetProbe(breakNewProbeContent);
            const breakNewProbeAncestorStack = [];
            this.markSplitNode(result.node, node);
            this.ancestorBuilder.appendToPage(breakNewPage, result.node, ancestorStack);
            if (node.tagName === "TR") {
              this.tableHandler.applyTableStructure(breakNewPage, node, this.repeatTableHeader);
            }
            const breakProbeParent2 = this.ancestorBuilder.syncProbe(
              breakNewProbeContent,
              ancestorStack,
              breakNewProbeAncestorStack
            );
            if (node.tagName === "TR") {
              this.tableHandler.applyTableStructure(this.probe, node, this.repeatTableHeader);
            }
            const probeClone = result.node.cloneNode(true);
            this.markSplitNode(probeClone, node);
            breakProbeParent2.appendChild(probeClone);
            const skipToNode = result.skipChildren ? this.skipNodeChildren(node, walker) : null;
            return {
              currentPage: breakNewPage,
              probeContent: breakNewProbeContent,
              probeAncestorStack: breakNewProbeAncestorStack,
              skipToNode
            };
          }
          default:
            return null;
        }
      });
    }
    /**
     * 分页切割（异步）
     */
    chunk(content) {
      return __async(this, null, function* () {
        this.sourceElement = content;
        this.pageCounter = 0;
        yield this.hooks.triggerAsync("onBeforeParse", content, this);
        this.addDataRef(content);
        this.handlers.forEach((h) => {
          var _a;
          return (_a = h.preprocess) == null ? void 0 : _a.call(h, content);
        });
        yield preprocessFlexLayout(content, this.probe, this.hooks);
        yield this.hooks.triggerAsync("onAfterParse", content, this);
        const pages = [];
        this.probeStyleEl = this.probe.querySelector("style");
        let { page: currentPage, probeContent } = this.createNewPage();
        yield this.hooks.triggerAsync("onBeforePageLayout", currentPage, 0, this);
        this.resetProbe(probeContent);
        const ancestorStack = [];
        let probeAncestorStack = [];
        const walker = new NodeWalker(content);
        let node;
        let lastNode = null;
        let skipToNode = null;
        while (node = skipToNode || walker.nextNode()) {
          skipToNode = null;
          const shouldProcess = this.hooks.trigger("onFilter", node, this);
          if (shouldProcess === false) {
            let filterSkipNode = null;
            while (filterSkipNode = walker.nextNode()) {
              if (!node.contains(filterSkipNode)) {
                node = filterSkipNode;
                break;
              }
            }
            if (!filterSkipNode) break;
          }
          this.ancestorBuilder.updateStack(node, lastNode, ancestorStack, content);
          const probeParent = this.ancestorBuilder.syncProbe(
            probeContent,
            ancestorStack,
            probeAncestorStack
          );
          const probeNode = node.cloneNode(false);
          probeParent.appendChild(probeNode);
          yield this.hooks.triggerAsync("onAfterNodeProbed", probeNode, node, this);
          const handler = this.findHandler(node);
          if (!handler) {
            lastNode = node;
            continue;
          }
          yield this.hooks.triggerAsync("onBeforeNodeHandle", node, handler, this);
          const context = {
            probe: this.probe,
            currentPage,
            pages,
            ancestorStack,
            probeAncestorStack,
            probeContent,
            probeParent,
            probeNode
          };
          const result = yield handler.handle(node, context);
          yield this.hooks.triggerAsync("onAfterNodeHandle", result, node, handler, this);
          if (!result) {
            lastNode = node;
            continue;
          }
          const processResult = yield this.processResult(result, node, walker, {
            currentPage,
            pages,
            ancestorStack,
            probeContent,
            probeAncestorStack,
            probeParent,
            probeNode
          });
          if (processResult) {
            currentPage = processResult.currentPage || currentPage;
            probeContent = processResult.probeContent || probeContent;
            probeAncestorStack = processResult.probeAncestorStack || probeAncestorStack;
            if (processResult.skipToNode) {
              if (processResult.skipToNode === "END") {
                break;
              }
              lastNode = node;
              skipToNode = processResult.skipToNode;
              continue;
            }
          }
          lastNode = node;
        }
        if (currentPage.childNodes.length > 0) {
          yield this.hooks.triggerAsync("onAfterPageLayout", currentPage, pages.length, this);
          yield this.hooks.triggerAsync("onFinalizePage", currentPage, pages.length, this);
          pages.push(currentPage);
        }
        yield this.hooks.triggerAsync("onAfterChunked", pages, this);
        yield this.hooks.triggerAsync("onAfterRendered", pages, this);
        return pages;
      });
    }
    /**
     * 给所有元素添加 data-ref
     */
    addDataRef(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
      let node;
      while (node = walker.nextNode()) {
        if (!node.dataset.ref) {
          node.dataset.ref = `ref-${++this.refCounter}`;
        }
      }
    }
    /**
     * 获取节点高度
     */
    getNodeHeight(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        return Math.round(rect.height);
      } else {
        return node.offsetHeight || 0;
      }
    }
    /**
     * 日志输出
     */
    logNode(node, heightInfo, nodeHeight, isTruncated) {
      var _a, _b, _c;
      const isText = node.nodeType === Node.TEXT_NODE;
      const dataRef = isText ? ((_b = (_a = node.parentElement) == null ? void 0 : _a.dataset) == null ? void 0 : _b.ref) || "unknown" : ((_c = node.dataset) == null ? void 0 : _c.ref) || "unknown";
      isText ? `TextNode [${dataRef}]` : `<${node.tagName.toLowerCase()}> [${dataRef}]`;
      isText ? this.formatContent(node.textContent) : `<${node.tagName.toLowerCase()}>`;
    }
    /**
     * 格式化内容用于日志
     */
    formatContent(text, maxLen = 40) {
      if (text.length <= maxLen) return text;
      const half = Math.floor(maxLen / 2);
      return text.slice(0, half) + "..." + text.slice(-half);
    }
    /**
     * 标记分割节点
     */
    markSplitNode(newNode, originalNode) {
      var _a, _b, _c;
      const ref = originalNode.nodeType === Node.ELEMENT_NODE ? (_a = originalNode.dataset) == null ? void 0 : _a.ref : (_c = (_b = originalNode.parentElement) == null ? void 0 : _b.dataset) == null ? void 0 : _c.ref;
      if (ref) {
        if (newNode.nodeType === Node.ELEMENT_NODE) {
          newNode.dataset.splitFrom = ref;
        } else if (newNode.parentElement) {
          newNode._splitFrom = ref;
        }
      }
    }
  }
  createLogger("Layouter");
  class Layouter {
    /**
     * 渲染单页
     */
    /**
     * 渲染单个页面
     * @param {HTMLElement|string} content - 页面内容
     * @param {Object} options - 配置选项
     * @param {HTMLElement} [options.headerTemplate] - 页眉模板（用于克隆，提升性能）
     * @param {HTMLElement} [options.footerTemplate] - 页脚模板（用于克隆，提升性能）
     * @returns {HTMLElement}
     */
    static renderPage(content, options = {}) {
      const {
        paperSize,
        margin,
        header,
        footer,
        current = 1,
        total = 1,
        headerTemplate,
        footerTemplate
      } = options;
      const page = document.createElement("div");
      page.className = "k-print-page";
      if (paperSize) {
        page.style.width = `${paperSize.width}px`;
        page.style.height = `${paperSize.height}px`;
      }
      let headerEl;
      if (headerTemplate) {
        headerEl = headerTemplate.cloneNode(true);
        this._replacePageNumbers(headerEl, current, total);
      } else {
        headerEl = PageElementFactory.createHeader(header, current, total);
      }
      page.appendChild(headerEl);
      if (content instanceof Node) {
        if (margin) {
          content.style.paddingTop = `${margin.top}px`;
          content.style.paddingRight = `${margin.right}px`;
          content.style.paddingBottom = `${margin.bottom}px`;
          content.style.paddingLeft = `${margin.left}px`;
        }
        page.appendChild(content);
      } else if (typeof content === "string") {
        const bodyEl = PageElementFactory.createBody({ margin });
        bodyEl.innerHTML = content;
        page.appendChild(bodyEl);
      }
      let footerEl;
      if (footerTemplate) {
        footerEl = footerTemplate.cloneNode(true);
        this._replacePageNumbers(footerEl, current, total);
      } else {
        footerEl = PageElementFactory.createFooter(footer, current, total);
      }
      page.appendChild(footerEl);
      return page;
    }
    /**
     * 替换元素中的页码占位符
     * @param {HTMLElement} element - 要替换的元素
     * @param {number} current - 当前页码
     * @param {number} total - 总页数
     * @private
     */
    static _replacePageNumbers(element, current, total) {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      textNodes.forEach((textNode) => {
        if (textNode.textContent.includes("{current}") || textNode.textContent.includes("{total}")) {
          textNode.textContent = textNode.textContent.replace(/\{current\}/g, current).replace(/\{total\}/g, total);
        }
      });
    }
  }
  const log$1 = createLogger("Layout");
  class LayoutRenderer {
    constructor(options = {}) {
      this.options = options;
    }
    /**
     * 渲染打印布局（支持多页，异步）
     */
    render(_0) {
      return __async(this, arguments, function* (content, options = {}) {
        const { paperSize, margin, header, footer, styles } = options;
        log$1("🚀 开始渲染布局", { paperSize, margin });
        const container = document.createElement("div");
        container.className = "k-print-container";
        const paperStyle = `width: ${paperSize.width}px; height: ${paperSize.height}px;`;
        const printStyles = getPrintStyles(paperStyle, paperSize, this.options.orientation);
        const allStyles = printStyles + "\n" + (styles || "");
        const styleEl = document.createElement("style");
        styleEl.textContent = allStyles;
        container.appendChild(styleEl);
        const probe = Previewer.createProbe(paperSize, margin, header, footer, allStyles);
        parseFloat(probe.dataset.headerHeight) || 0;
        parseFloat(probe.dataset.footerHeight) || 0;
        probe.getBoundingClientRect();
        try {
          const chunker = new Chunker(__spreadValues({ probe }, this.options));
          const pageBoxes = yield chunker.chunk(content);
          log$1(`📄 渲染 ${pageBoxes.length} 页`);
          const headerTemplate = PageElementFactory.createHeader(header, 1, pageBoxes.length, true);
          const footerTemplate = PageElementFactory.createFooter(footer, 1, pageBoxes.length, true);
          pageBoxes.forEach((pageContent, index) => {
            const page = Layouter.renderPage(pageContent, {
              paperSize,
              margin,
              header,
              footer,
              current: index + 1,
              total: pageBoxes.length,
              headerTemplate,
              footerTemplate
            });
            container.appendChild(page);
          });
        } catch (e) {
          log$1.warn("分页失败，使用单页模式", e);
          const page = Layouter.renderPage(content, {
            paperSize,
            margin,
            header,
            footer,
            current: 1,
            total: 1
          });
          container.appendChild(page);
        } finally {
          Previewer.destroy(probe);
        }
        return container;
      });
    }
    /**
     * 获取完整的 HTML（用于 iframe 打印）
     */
    getFullHtml(layout, options = {}) {
      const { paperSize, preview = false } = options;
      const paperStyle = paperSize ? `width: ${paperSize.width}px; height: ${paperSize.height}px;` : "";
      const previewExtraStyle = preview ? PREVIEW_EXTRA_STYLES : "";
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>打印</title>
          <style>
            ${getPrintStyles(paperStyle, paperSize, this.options.orientation)}
            ${previewExtraStyle}
          </style>
        </head>
        <body>
          ${layout.outerHTML}
        </body>
      </html>
    `;
    }
  }
  class PrintExecutor {
    constructor() {
      this.iframe = null;
      this.previewIframe = null;
    }
    /**
     * 在容器中预览
     */
    preview(html, container) {
      this.cleanupPreview();
      const iframe = document.createElement("iframe");
      iframe.style.border = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      container.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      this.previewIframe = iframe;
      return iframe;
    }
    /**
     * 清理预览
     */
    cleanupPreview() {
      if (this.previewIframe && this.previewIframe.parentNode) {
        this.previewIframe.parentNode.removeChild(this.previewIframe);
      }
      this.previewIframe = null;
    }
    /**
     * 执行打印
     */
    print(html, options = {}) {
      const { afterPrint } = options;
      return new Promise((resolve, reject) => {
        try {
          const iframe = document.createElement("iframe");
          iframe.style.position = "absolute";
          iframe.style.left = "-9999px";
          iframe.style.top = "-9999px";
          iframe.style.width = "0";
          iframe.style.height = "0";
          iframe.style.border = "0";
          document.body.appendChild(iframe);
          this.iframe = iframe;
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          doc.open();
          doc.write(html);
          doc.close();
          const onLoad = () => {
            try {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
              setTimeout(() => {
                this.cleanup();
                if (afterPrint) afterPrint();
                resolve();
              }, 1e3);
            } catch (err) {
              this.cleanup();
              reject(err);
            }
          };
          if (iframe.contentDocument.readyState === "complete") {
            onLoad();
          } else {
            iframe.onload = onLoad;
          }
          setTimeout(() => {
            if (this.iframe) {
              try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => {
                  this.cleanup();
                  if (afterPrint) afterPrint();
                  resolve();
                }, 1e3);
              } catch (err) {
              }
            }
          }, 3e3);
        } catch (err) {
          this.cleanup();
          reject(err);
        }
      });
    }
    /**
     * 清理
     */
    cleanup() {
      if (this.iframe && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      this.iframe = null;
    }
    /**
     * 销毁
     */
    destroy() {
      this.cleanup();
      this.cleanupPreview();
    }
  }
  const log = createLogger("PrinterController");
  class PrinterController {
    constructor(options = {}) {
      this.options = __spreadValues({
        paper: "A4",
        orientation: "portrait",
        margin: { top: 20, right: 15, bottom: 20, left: 15 }
      }, options);
      this.normalizeOptions();
      this.element = getElement(options.element);
      this.styleInliner = new StyleInliner({
        inlineStylesheet: options.inlineStylesheet
      });
      this.layoutRenderer = new LayoutRenderer(this.options);
      this.printExecutor = new PrintExecutor(this.options);
      this.clonedContent = null;
      this.collectedStyles = null;
      this.previewContainer = null;
      this.cachedLayout = null;
      this.process();
    }
    /**
     * 规范化配置
     */
    normalizeOptions() {
      if (this.options.header) {
        if (typeof this.options.header === "object" && !this.options.header.left && !this.options.header.center && !this.options.header.right) {
          this.options.header = null;
        }
      }
      if (this.options.footer) {
        if (typeof this.options.footer === "object" && !this.options.footer.left && !this.options.footer.center && !this.options.footer.right) {
          this.options.footer = null;
        }
      }
      if (this.options.margin) {
        if (typeof this.options.margin === "object" && !this.options.margin.top && !this.options.margin.right && !this.options.margin.bottom && !this.options.margin.left) {
          this.options.margin = { top: 20, right: 15, bottom: 20, left: 15 };
        }
      }
    }
    /**
     * 初始处理
     */
    process() {
      if (!this.element) {
        log.warn("未找到目标元素");
        return;
      }
      this.collectedStyles = this.styleInliner.collectStyles();
      this.clonedContent = this.styleInliner.process(this.element);
    }
    /**
     * 在指定容器预览
     */
    preview(container) {
      return __async(this, null, function* () {
        if (!this.clonedContent) {
          log.warn("没有可预览的内容");
          return this;
        }
        const previewEl = getElement(container);
        if (!previewEl) {
          log.warn("未找到预览容器");
          return this;
        }
        this.previewContainer = previewEl;
        if (this.options.beforePreview) {
          yield this.options.beforePreview({
            element: this.element,
            clonedContent: this.clonedContent,
            container: previewEl
          });
        }
        previewEl.innerHTML = "";
        const paperSize = getPaperSize(this.options.paper, this.options.orientation);
        const margin = getMargin(this.options.margin);
        this.cachedLayout = yield this.layoutRenderer.render(this.clonedContent.cloneNode(true), {
          paperSize,
          margin,
          header: this.options.header,
          footer: this.options.footer,
          styles: this.collectedStyles
        });
        const html = this.layoutRenderer.getFullHtml(this.cachedLayout, { paperSize, preview: true });
        this.printExecutor.preview(html, previewEl);
        if (this.options.afterPreview) {
          yield this.options.afterPreview({
            element: this.element,
            container: previewEl
          });
        }
        return this;
      });
    }
    /**
     * 执行打印
     */
    exec() {
      return __async(this, null, function* () {
        if (!this.clonedContent) {
          log.warn("没有可打印的内容");
          return;
        }
        if (this.options.beforePrint) {
          yield this.options.beforePrint({
            element: this.element,
            clonedContent: this.clonedContent
          });
        }
        let layout;
        if (this.cachedLayout) {
          log("使用缓存的布局（已预览）");
          layout = this.cachedLayout;
        } else {
          log("重新渲染布局（未预览）");
          const paperSize2 = getPaperSize(this.options.paper, this.options.orientation);
          const margin = getMargin(this.options.margin);
          layout = yield this.layoutRenderer.render(this.clonedContent.cloneNode(true), {
            paperSize: paperSize2,
            margin,
            header: this.options.header,
            footer: this.options.footer,
            styles: this.collectedStyles
          });
        }
        const paperSize = getPaperSize(this.options.paper, this.options.orientation);
        const html = this.layoutRenderer.getFullHtml(layout, { paperSize });
        return this.printExecutor.print(html, {
          afterPrint: () => {
            if (this.options.afterPrint) {
              this.options.afterPrint();
            }
          }
        });
      });
    }
    /**
     * 更新数据
     * 当原始元素内容发生变化时调用，重新处理并更新预览
     */
    update() {
      return __async(this, null, function* () {
        log("更新打印内容");
        if (!this.element) {
          log.warn("未找到目标元素");
          return this;
        }
        this.cachedLayout = null;
        this.process();
        if (this.previewContainer) {
          log("检测到预览容器，自动重新预览");
          yield this.preview(this.previewContainer);
        }
        return this;
      });
    }
    /**
     * 销毁清理
     */
    destroy() {
      if (this.previewContainer) {
        this.previewContainer.innerHTML = "";
      }
      this.printExecutor.destroy();
      this.element = null;
      this.clonedContent = null;
      this.previewContainer = null;
      this.cachedLayout = null;
    }
  }
  exports2.Logger = Logger;
  exports2.PrinterController = PrinterController;
  exports2.default = PrinterController;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
