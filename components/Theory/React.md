# React 核心概念深度解析

## 🔄 虚拟DOM工作原理

### 基本概念
虚拟DOM（Virtual DOM）是实际DOM的轻量级JavaScript副本，它在内存中维护一个树形结构，表示页面的结构和内容。

### 核心优势
- **性能优化** - 减少直接DOM操作，批量更新提升效率
- **跨浏览器兼容** - 抽象层屏蔽浏览器差异
- **可预测性** - 声明式编程，状态驱动视图更新

### 详细工作流程

#### 1. 初始渲染阶段
```javascript
// JSX 代码
function App() {
  return (
    <div className="container">
      <h1>Hello World</h1>
      <p>This is a paragraph</p>
    </div>
  )
}

// 对应的虚拟DOM结构
const virtualDOM = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello World' }
      },
      {
        type: 'p',
        props: { children: 'This is a paragraph' }
      }
    ]
  }
}
```

#### 2. 状态更新阶段
```javascript
function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

// 当count从0变为1时，React会：
// 1. 生成新的虚拟DOM树
// 2. 与之前的虚拟DOM树进行diff比较
// 3. 发现只有<p>标签的文本内容发生变化
// 4. 只更新这一个DOM节点的textContent
```

#### 3. Diff算法优化策略
- **同层比较** - 只比较同一层级的节点
- **组件类型比较** - 不同类型组件直接替换
- **Key属性** - 帮助识别列表项的变化

```javascript
// 使用key优化列表渲染
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}> {/* key帮助React识别变化 */}
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

## 🛡️ 错误边界（Error Boundary）

### 基本概念
错误边界是React 16+引入的特殊组件，用来捕获其子组件树中的JavaScript运行时错误，并优雅地进行处理。

### 实现错误边界
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  
  // 捕获错误，更新状态
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  // 错误信息记录
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // 可以将错误报告给错误监控服务
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      // 自定义的错误UI
      return (
        <div className="error-boundary">
          <h2>😵 出现了一个错误</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>点击查看错误详情</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### 使用错误边界
```javascript
function App() {
  return (
    <div>
      <ErrorBoundary>
        <Header />
        <MainContent />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
    </div>
  )
}
```

### 错误边界的限制
- **无法捕获的错误类型**：
  - 事件处理函数中的错误
  - 异步代码（setTimeout、Promise等）
  - 服务端渲染过程中的错误
  - 错误边界组件自身的错误

```javascript
// 这些错误无法被错误边界捕获
function ProblematicComponent() {
  const handleClick = () => {
    // 事件处理函数中的错误
    throw new Error('Event handler error')
  }
  
  useEffect(() => {
    // 异步错误
    setTimeout(() => {
      throw new Error('Async error')
    }, 1000)
  }, [])
  
  return <button onClick={handleClick}>Click me</button>
}
```

## 🪝 Hooks 深度解析

### useState 高级用法
```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => setValue(v => !v), [])
  
  return [value, toggle]
}

// 函数式更新避免闭包陷阱
function Counter() {
  const [count, setCount] = useState(0)
  
  const increment = () => {
    // ✅ 正确：使用函数式更新
    setCount(prevCount => prevCount + 1)
  }
  
  const incrementWrong = () => {
    // ❌ 错误：可能产生闭包陷阱
    setCount(count + 1)
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Correct</button>
    </div>
  )
}
```

### useEffect 最佳实践
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchUser = async () => {
      setLoading(true)
      try {
        const userData = await api.getUser(userId)
        if (!cancelled) {
          setUser(userData)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch user:', error)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchUser()
    
    // 清理函数，防止内存泄漏
    return () => {
      cancelled = true
    }
  }, [userId]) // 依赖数组
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>
  
  return <div>Welcome, {user.name}!</div>
}
```

### 自定义Hooks
```javascript
// 自定义Hook：API数据获取
function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [url])
  
  return { data, loading, error }
}

// 使用自定义Hook
function UserList() {
  const { data: users, loading, error } = useApi('/api/users')
  
  if (loading) return <div>Loading users...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## ⚡ 性能优化技巧

### React.memo 深度优化
```javascript
// 基础用法
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data, onClick }) {
  console.log('ExpensiveComponent rendered')
  return (
    <div onClick={onClick}>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
})

// 自定义比较函数
const OptimizedComponent = React.memo(
  function OptimizedComponent({ user, settings }) {
    return <div>{user.name} - {settings.theme}</div>
  },
  (prevProps, nextProps) => {
    // 自定义比较逻辑
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.settings.theme === nextProps.settings.theme
    )
  }
)
```

### useMemo 和 useCallback 优化
```javascript
function ExpensiveCalculation({ items, multiplier }) {
  // 缓存复杂计算结果
  const expensiveValue = useMemo(() => {
    console.log('Performing expensive calculation...')
    return items.reduce((sum, item) => sum + item.value * multiplier, 0)
  }, [items, multiplier])
  
  // 缓存函数引用
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId)
  }, [])
  
  return (
    <div>
      <p>Total: {expensiveValue}</p>
      {items.map(item => (
        <Item
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  )
}
```

## 🔍 React DevTools 调试

### 性能分析
```javascript
// 在组件中添加 displayName 便于调试
const MyComponent = React.memo(function MyComponent(props) {
  // 组件逻辑
})
MyComponent.displayName = 'MyComponent'

// 使用 Profiler 组件进行性能监控
import { Profiler } from 'react'

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id)
  console.log('Phase:', phase)
  console.log('Duration:', actualDuration)
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  )
}
```

---

## 🤔 常见面试延伸问题

1. **React Fiber 架构的工作原理是什么？**
2. **如何避免React中的内存泄漏？**
3. **React Hooks 的执行顺序是怎样的？**
4. **什么时候应该使用 useLayoutEffect 而不是 useEffect？**
5. **React 18 的并发特性有哪些？**
6. **如何实现React组件的懒加载？**


