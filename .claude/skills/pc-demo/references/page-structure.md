# 页面结构规范

## 整体布局

AI 销售秘书采用**左右两栏布局**，左侧为侧边导航，右侧为内容区。**不使用 TabNav 多标签页导航**。

```
┌──────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────────┐ │
│ │          │ │                                     │ │
│ │ SideMenu │ │           Content Area              │ │
│ │          │ │         (Outlet 渲染)                │ │
│ │  248px   │ │              flex: 1                │ │
│ │          │ │                                     │ │
│ │          │ │                                     │ │
│ └──────────┘ └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 一、左侧侧边栏（SideMenu）

自定义实现，**不使用 antd Menu**。文件位于 `components/SideMenu/index.jsx`。

### 结构区域

| 区域 | 内容 | 高度/尺寸 |
|------|------|-----------|
| 顶部 | Logo + "AI销售秘书" + 搜索框 | padding 20px 18px 12px |
| 新建对话 | 黑色按钮 "[+] 新建对话" | 全宽，圆角 10px |
| 导航列表 | 专家技能、我的文件、客户笔记 | flex: 1，可滚动 |
| 智能体 | 金牌陪练、智能讲解 | 位于导航列表下方 |
| 历史对话 | 可折叠的对话历史列表 | 位于最底部 |

### 样式规范

| 属性 | 值 |
|------|------|
| 宽度 | 248px |
| 背景色 | `#fbfbfc` |
| 右边框 | `1px solid #ececef` |
| 导航项高度 | ~32px（padding 7px 8px） |
| 导航项圆角 | 8px |
| 字号 | 13px（导航项），12px（分组标题/历史对话） |
| 选中背景 | 紫色 `#f0eefb` / 橙色 `#fdf1e7`（陪练） |
| 选中文字色 | 紫色 `#6d5ef0` / 橙色 `#b4552d`（陪练） |
| hover 背景 | `#f0eefb`（未选中时） |

### 交互行为

- 搜索框支持输入清空（点击 X 清空）
- 历史对话支持折叠/展开（箭头旋转动画）
- 导航项 hover 时有背景色变化（0.15s transition）
- 当前路由匹配时高亮显示

---

## 二、右侧内容区（Outlet）

由 `layouts/MainLayout.jsx` 包裹，内部根据路由渲染不同页面。

### 布局规范

```jsx
// MainLayout.jsx
<div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
  <SideMenu />
  <main style={{ flex: 1, height: '100%', position: 'relative', overflow: 'hidden', display: 'flex' }}>
    <div style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
      <Outlet />
    </div>
  </main>
</div>
```

### 滚动策略

- 整个内容区使用 `height: 100vh; overflow: hidden`
- 内部滚动容器使用 `overflowY: 'auto'`
- 侧边栏和内容区独立滚动

---

## 三、路由结构

路由在 `App.jsx` 中定义，使用嵌套路由：

```
/
├── /home         新建对话（首页）
├── /skills       专家技能
├── /outputs      我的文件
├── /memory       客户笔记
├── /coach        金牌陪练
└── /present      智能讲解
```

路由与菜单 key 必须保持一致（含前导斜杠）。
