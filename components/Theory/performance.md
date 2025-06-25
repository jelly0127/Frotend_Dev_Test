# React性能优化与Web优化实践

## ⚡ React.memo 深度优化

### 基本概念
React.memo 是高阶组件，用来缓存函数组件的渲染结果。当父组件重新渲染，但传给子组件的props没变时，会跳过重新渲染，直接复用上一次的结果。

### 适用场景
- **父组件频繁渲染** - 表单输入、计时器等场景下，父组件频繁更新但子组件props不变
- **大页面中的列表组件** - 长列表中的单个列表项优化
- **复杂的展示组件** - 渲染成本高的纯展示组件

### 实际应用示例

#### 基础用法
```javascript
const UserCard = React.memo(function UserCard({ user, onEdit }) {
  console.log('UserCard rendered') // 用于调试
  
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  )
})
```

#### 自定义比较函数
```javascript
const OptimizedUserCard = React.memo(
  function OptimizedUserCard({ user, settings, onEdit }) {
    return (
      <div className={`user-card ${settings.theme}`}>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // 只有这些值变化时才重新渲染
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name &&
      prevProps.settings.theme === nextProps.settings.theme
    )
  }
)
```

## 🧠 useMemo 优化策略

### 基本用法
useMemo 用来缓存复杂计算的结果，只有依赖项发生变化时才重新计算。

### 优化场景
- **复杂计算** - 数据过滤、排序、格式化等
- **引用稳定性** - 传递给子组件的对象/数组保持引用不变
- **防止无限循环** - useEffect依赖项的引用稳定

### 实际应用示例

#### 缓存复杂计算
```javascript
function ProductList({ products, filters, sortBy }) {
  // 缓存复杂的过滤和排序逻辑
  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtering and sorting products...') // 用于调试
    
    let result = products.filter(product => {
      return filters.category ? product.category === filters.category : true
    })
    
    if (sortBy === 'price') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return result
  }, [products, filters.category, sortBy])

  // 缓存传递给子组件的配置对象
  const listConfig = useMemo(() => ({
    showImages: true,
    showPrices: true,
    allowSelection: false
  }), []) // 空依赖数组，配置不变

  return (
    <div>
      <p>Found {filteredAndSortedProducts.length} products</p>
      <ProductGrid 
        products={filteredAndSortedProducts}
        config={listConfig}
      />
    </div>
  )
}
```

## 🌐 CDN优化策略

### CDN核心优势
- **全球加速** - 用户就近访问，减少网络延迟
- **减轻服务器压力** - 静态资源由CDN承担，源站专注业务逻辑
- **高可用性** - 多节点冗余，提供更好的服务稳定性
- **带宽优化** - 压缩、缓存等技术减少传输量

### CDN配置最佳实践
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CDN域名配置
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yoursite.com' 
    : '',
    
  // 图片域名白名单
  images: {
    domains: ['cdn.yoursite.com', 'images.unsplash.com'],
    // 图片格式和质量优化
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // 静态文件缓存
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 🖼️ Next.js图片优化深度解析

### Image组件核心特性
- **自动格式转换** - WebP/AVIF等现代格式
- **响应式图片** - 不同设备自动适配
- **懒加载** - 默认启用，提升首屏性能
- **占位符支持** - 模糊占位、自定义占位

### 高级用法示例

#### 响应式图片画廊
```javascript
import Image from 'next/image'

function OptimizedImageGallery({ images }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={image.id} className="relative aspect-video">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            // 首屏图片优先加载
            priority={index < 3}
            // 占位符
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
            // 图片质量
            quality={85}
            // 加载完成回调
            onLoad={(e) => {
              console.log('Image loaded:', e.target.src)
            }}
          />
        </div>
      ))}
    </div>
  )
}
```

#### 自定义图片加载器
```javascript
// 自定义loader
const cloudinaryLoader = ({ src, width, quality }) => {
  return `https://res.cloudinary.com/demo/image/fetch/w_${width},q_${quality || 75}/${src}`
}

function CloudinaryImage({ src, alt }) {
  return (
    <Image
      loader={cloudinaryLoader}
      src={src}
      alt={alt}
      width={500}
      height={300}
    />
  )
}
```

### 性能优化技巧
- **优先级设置** - 首屏图片使用 `priority` 属性
- **尺寸规划** - 合理设置 `deviceSizes` 和 `imageSizes`
- **格式选择** - 启用 WebP/AVIF 现代格式
- **质量控制** - 根据场景调整 `quality` 参数
- **占位符策略** - 使用模糊占位符提升用户体验

## 📊 性能监控与分析

### 性能指标监控
```javascript
// _app.js - 全局性能监控
export function reportWebVitals(metric) {
  // 核心性能指标
  switch (metric.name) {
    case 'CLS':
      console.log('Cumulative Layout Shift:', metric.value)
      break
    case 'FID':
      console.log('First Input Delay:', metric.value)
      break
    case 'FCP':
      console.log('First Contentful Paint:', metric.value)
      break
    case 'LCP':
      console.log('Largest Contentful Paint:', metric.value)
      break
    case 'TTFB':
      console.log('Time to First Byte:', metric.value)
      break
  }
  
  // 发送到分析服务
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.value * 1000),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
```

### Bundle分析
```javascript
// 分析工具配置
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // 其他配置...
})

// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build:analyze": "npm run build && npx next-bundle-analyzer"
  }
}
```

## 🔄 代码分割优化

### 路由级别分割
```javascript
// 动态导入页面组件
import dynamic from 'next/dynamic'

const DynamicDashboard = dynamic(() => import('../components/Dashboard'), {
  loading: () => <div className="animate-pulse">Loading dashboard...</div>,
  ssr: false // 可选：禁用服务端渲染
})

// 条件性加载
const AdminPanel = dynamic(
  () => import('../components/AdminPanel'),
  { ssr: false }
)

function UserProfile({ user }) {
  return (
    <div>
      <UserInfo user={user} />
      {user.isAdmin && <AdminPanel />}
    </div>
  )
}
```

### 第三方库优化
```javascript
// 按需加载第三方库
const Chart = dynamic(() => import('chart.js'), {
  ssr: false,
})

// 延迟加载非关键功能
const Analytics = dynamic(
  () => import('../lib/analytics'),
  { ssr: false }
)

useEffect(() => {
  // 用户交互后再加载分析工具
  const timer = setTimeout(() => {
    Analytics.then(({ init }) => init())
  }, 2000)
  
  return () => clearTimeout(timer)
}, [])
```

---

## 🤔 常见面试延伸问题

1. **如何识别React应用中的性能瓶颈？**
2. **什么时候不应该使用React.memo？**
3. **useMemo和useCallback的区别是什么？**
4. **如何优化大型列表的渲染性能？**
5. **CDN缓存策略如何设计？**
6. **图片懒加载的原理是什么？**
