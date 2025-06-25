#Discuss how to effectively use code splitting and lazy loading in a large project to improve application performance.

##1.代码分割，Next自动分割，打包成单独的 chunk，无需额外配置
###1.1 按需分割第三方库，如 moment、chart.js、monaco-editor 这类大包，遇到用到时再按需 import()
###1.2 按业务模块按路由/角色拆分，减少主业务代码干扰
###1.3 骨架屏与渐进式加载体验，Suspense fallback 配合骨架屏，避免“白屏”现象
###1.4 监控/分析 Bundle 体积，用 webpack-bundle-analyzer 或 Next.js 内置分析器查找“大 chunk”，重点拆分
##2.组件级懒加载（next/dynamic）
##3. 图片/资源懒加载 
###3.1 用 Next.js <Image /> 或第三方 lazyload 库实现“可见才加载”
###3.2 对长页面的表格、列表，结合虚拟滚动（如 react-window react-virtualized）


#Describe how to keep the CSS file size minimal in a Tailwind CSS
project.

##1.使用 JIT（Just-In-Time）模式（Tailwind v3/v4 默认）
##2. 配置 content 字段，精确扫描文件
##3.避免滥用动态 class 拼接,对于 className={'bg-' + color} 这种动态拼接，JIT 可能检测不到，用 safelist、或提前写好所有变体。
##4.精简/自定义 Tailwind 主题，只扩展和覆盖实际要用的 colors、spacing、fontSize 等，不要全量引入自定义变量。
##5.精简第三方/自定义插件使用，组件库（如 daisyUI、shadcn/ui）也建议只用到的组件导入。
##6.监控实际包体积，及时分析