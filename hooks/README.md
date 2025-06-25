# 购物车系统 Hooks 使用说明

这是一个基于 React Context 和 useReducer 实现的购物车系统，提供完整的购物车管理功能。

## 功能特性

- ✅ 添加商品到购物车
- ✅ 增加/减少商品数量
- ✅ 删除单个商品
- ✅ 清空整个购物车
- ✅ 结账功能（模拟API调用）
- ✅ 自动计算总数量和总金额
- ✅ 加载状态管理
- ✅ TypeScript 完整类型支持

## 快速开始

### 1. 在你的应用根组件中设置 Provider

```tsx
import { CartProvider } from './hooks/useShopSystem';
import App from './App';

function Root() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}
```

### 2. 在组件中使用购物车功能

```tsx
import { useCart, formatPrice } from './hooks/useShopSystem';

function ProductCard({ product }) {
  const { addItem, items, isItemInCart } = useCart();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
      <button onClick={() => addItem(product)}>
        {isItemInCart(items, product.id) ? '已在购物车' : '添加到购物车'}
      </button>
    </div>
  );
}
```

### 3. 购物车组件示例

```tsx
function ShoppingCart() {
  const {
    items,
    totalQuantity,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    isLoading
  } = useCart();

  const handleCheckout = async () => {
    const result = await checkout();
    if (result.success) {
      alert(`结账成功！订单号：${result.orderId}`);
    } else {
      alert(`结账失败：${result.error}`);
    }
  };

  return (
    <div>
      <h2>购物车 ({totalQuantity} 件商品)</h2>
      
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeItem(item.id)}>删除</button>
        </div>
      ))}
      
      <p>总金额：{formatPrice(totalAmount)}</p>
      <button onClick={clearCart}>清空购物车</button>
      <button onClick={handleCheckout} disabled={isLoading || items.length === 0}>
        {isLoading ? '结账中...' : '立即结账'}
      </button>
    </div>
  );
}
```

## API 参考

### useCart Hook

返回一个包含购物车状态和操作方法的对象：

#### 状态属性

- `items: CartItem[]` - 购物车中的商品列表
- `totalQuantity: number` - 商品总数量
- `totalAmount: number` - 商品总金额
- `isLoading: boolean` - 是否正在加载（结账时）

#### 操作方法

- `addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number })` - 添加商品
- `removeItem(id: string)` - 删除指定商品
- `updateQuantity(id: string, quantity: number)` - 更新商品数量
- `decreaseQuantity(id: string)` - 减少商品数量（减到0会删除）
- `clearCart()` - 清空购物车
- `checkout()` - 结账（返回Promise）

### 类型定义

```tsx
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isLoading: boolean;
}
```

### 辅助函数

- `formatPrice(price: number): string` - 格式化价格为中文货币格式
- `getCartItemById(items: CartItem[], id: string): CartItem | undefined` - 根据ID获取商品
- `isItemInCart(items: CartItem[], id: string): boolean` - 检查商品是否在购物车中

## 注意事项

1. **Provider 必须包裹应用**: 确保在使用 `useCart` 的组件外层有 `CartProvider`
2. **商品ID唯一性**: 每个商品必须有唯一的 `id` 属性
3. **数量处理**: 当商品数量设为0或负数时，会自动从购物车中删除
4. **结账功能**: 目前是模拟实现，实际项目中需要连接真实的支付API
5. **状态持久化**: 当前状态不会持久化，刷新页面会重置，如需持久化可以结合 localStorage

## 示例项目

查看 `components/CartExample.tsx` 文件，里面有完整的使用示例，包括：
- 商品展示
- 添加到购物车
- 购物车管理
- 结账流程

运行示例：
```bash
npm run dev
```

然后在你的页面中引入 `CartExample` 组件即可看到完整的购物车系统演示。 