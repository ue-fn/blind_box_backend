# 盲盒功能测试指南

## 1. 创建盲盒

**接口**: `POST /blind-box/create`

**请求体示例**:
```json
{
  "name": "神秘盲盒",
  "description": "包含多种精美款式的神秘盲盒",
  "imageUrl": "https://example.com/box.jpg",
  "stock": 100,
  "price": 25.99,
  "items": [
    {
      "name": "稀有款式A",
      "description": "非常稀有的款式",
      "imageUrl": "https://example.com/item1.jpg",
      "quantity": 5
    },
    {
      "name": "普通款式B",
      "description": "常见的款式",
      "imageUrl": "https://example.com/item2.jpg",
      "quantity": 15
    },
    {
      "name": "特殊款式C",
      "description": "特殊限定款式",
      "imageUrl": "https://example.com/item3.jpg",
      "quantity": 10
    }
  ]
}
```

## 2. 获取所有盲盒

**接口**: `GET /blind-box/all`

## 3. 获取盲盒详情

**接口**: `GET /blind-box/{id}`

## 4. 购买盲盒

**接口**: `POST /blind-box/purchase`

**请求体示例**:
```json
{
  "userId": 1,
  "boxId": 1
}
```

## 5. 揭晓盲盒

**接口**: `POST /blind-box/reveal`

**请求体示例**:
```json
{
  "orderId": 1
}
```

## 6. 获取用户订单

**接口**: `GET /blind-box/orders/{userId}`

## 测试流程

1. 首先创建一个盲盒
2. 查看盲盒列表确认创建成功
3. 购买盲盒（需要先有用户）
4. 揭晓盲盒查看获得的款式
5. 查看用户订单历史

## 注意事项

- 购买盲盒时会根据款式的quantity权重进行随机选择
- 库存会自动减少
- 订单状态会正确更新
- 所有接口都有统一的返回格式