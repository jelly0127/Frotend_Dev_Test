# Next.js 核心概念与高级特性

## 🔄 ISR（增量静态生成）

### 核心概念
ISR（Incremental Static Regeneration）是 Next.js 提供的一种页面预渲染机制，它允许在构建后不用重新部署整个网站，就能在后台自动更新静态页面。

### 工作流程详解

#### 1. 初始构建阶段
```javascript
// pages/blog/[slug].js
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug)
  
  return {
    props: { post },
    // 设置重新验证时间（秒）
    revalidate: 60, // 60秒后允许重新生成
  }
}
```

#### 2. 用户访问流程
1. **首次访问** - 返回构建时生成的静态页面
2. **触发重新生成** - 超过 revalidate 时间后，后台开始重新生成
3. **无缝更新** - 新页面生成完成后，后续用户看到更新内容

#### 3. 错误处理
```javascript
export async function getStaticProps({ params }) {
  try {
    const post = await fetchPost(params.slug)
    
    return {
      props: { post },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 10, // 错误时更短的重试间隔
    }
  }
}
```

### ISR 优势
- **极致性能** - 静态页面的加载速度
- **动态内容** - 无需重新部署即可更新内容
- **降级保护** - 重新生成失败时仍显示旧版本
- **SEO友好** - 静态页面利于搜索引擎收录

## 🛣️ API Routes 深入解析

### 基本概念
API Routes 是 Next.js 提供的全栈开发能力，允许在同一个项目中创建后端API接口。

### App Router 写法（Next.js 13+）
```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server'

// GET 请求处理
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  
  try {
    const users = await fetchUsers({ page: parseInt(page) })
    
    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST 请求处理
export async function POST(request) {
  try {
    const body = await request.json()
    const newUser = await createUser(body)
    
    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
```

### Pages Router 写法（Next.js 12-）
```javascript
// pages/api/users.js
export default async function handler(req, res) {
  const { method } = req
  
  switch (method) {
    case 'GET':
      try {
        const users = await fetchUsers()
        res.status(200).json({ success: true, data: users })
      } catch (error) {
        res.status(500).json({ success: false, error: error.message })
      }
      break
      
    case 'POST':
      try {
        const newUser = await createUser(req.body)
        res.status(201).json({ success: true, data: newUser })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
```

### 中间件支持
```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // API 路由的统一处理
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // 添加 CORS 头
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    return response
  }
}

export const config = {
  matcher: '/api/:path*'
}
```

## 🏗️ 服务端渲染（SSR）策略

### 1. 静态生成（SSG）
适合内容变化不频繁的页面：
```javascript
// 构建时生成
export async function getStaticProps() {
  const data = await fetchData()
  
  return {
    props: { data },
    // 可选：ISR 支持
    revalidate: 3600, // 1小时
  }
}
```

### 2. 服务端渲染（SSR）
适合需要实时数据的页面：
```javascript
// 每次请求时生成
export async function getServerSideProps(context) {
  const { req, res, params, query } = context
  
  // 可以访问请求头、cookies等
  const userAgent = req.headers['user-agent']
  const data = await fetchRealTimeData()
  
  return {
    props: { data, userAgent }
  }
}
```

### 3. 客户端渲染（CSR）
适合交互性强的页面：
```javascript
import { useEffect, useState } from 'react'

function Dashboard() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData().then(setData)
  }, [])
  
  if (!data) return <Loading />
  
  return <DashboardContent data={data} />
}
```

## 🎯 性能优化最佳实践

### 1. 图片优化
```javascript
import Image from 'next/image'

// 自动优化、懒加载、响应式
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority // 首屏图片
  placeholder="blur" // 模糊占位
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 2. 字体优化
```javascript
// next.config.js
module.exports = {
  optimizeFonts: true, // 自动字体优化
}

// 或使用 next/font
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

### 3. 代码分割
```javascript
import dynamic from 'next/dynamic'

// 动态导入，按需加载
const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // 可选：禁用服务端渲染
})
```

## 🔧 部署与配置

### 1. 生产环境配置
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 严格模式
  reactStrictMode: true,
  
  // 压缩输出
  compress: true,
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
  
  // 头信息配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 2. 部署选项
- **Vercel** - 零配置部署，自动优化
- **Netlify** - 静态站点托管
- **AWS/Azure** - 企业级云部署
- **Docker** - 容器化部署

---

## 🤔 常见面试延伸问题

1. **SSG、SSR、CSR 的选择策略是什么？**
2. **如何处理 Next.js 的水合（Hydration）问题？**
3. **Next.js 13+ App Router 相比 Pages Router 有哪些优势？**
4. **如何在 Next.js 中实现国际化（i18n）？**
5. **Next.js 的编译和构建过程是怎样的？**

