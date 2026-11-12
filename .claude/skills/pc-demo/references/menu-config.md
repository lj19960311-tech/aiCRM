# 菜单配置规范

## 数据结构

AI 销售秘书的菜单采用**自定义侧边栏**实现（非 antd Menu），结构在 `components/SideMenu/index.jsx` 中定义。

### 三类菜单项

```jsx
// 1. 新建对话按钮（独立于导航列表）
// 位于侧边栏顶部，黑色背景，点击导航到 /home

// 2. navItems - 常规导航项（专家技能、我的文件、客户笔记）
const navItems = [
  {
    key: '/skills',
    label: '专家技能',
    icon: <SVGIcon />,
    activeBg: '#f0eefb',     // 选中时背景（浅紫）
    activeColor: '#6d5ef0',  // 选中时文字色
  },
  {
    key: '/outputs',
    label: '我的文件',
    icon: <SVGIcon />,
    activeBg: '#f0eefb',
    activeColor: '#6d5ef0',
    margin: '14px 0 2px',   // 可选，用于分组间距
  },
  {
    key: '/memory',
    label: '客户笔记',
    icon: <SVGIcon />,
    activeBg: '#f0eefb',
    activeColor: '#6d5ef0',
  },
]

// 3. agentItems - 智能体项（金牌陪练、智能讲解）
const agentItems = [
  {
    key: '/coach',
    label: '金牌陪练',
    emoji: '🎯',
    badge: '智能体',
    badgeColor: '#c77b4a',
    badgeBg: '#fdf1e7',
    activeBg: '#fdf1e7',     // 选中时背景（橙色系）
    activeColor: '#b4552d',  // 选中时文字色（橙色）
  },
  {
    key: '/present',
    label: '智能讲解',
    emoji: '🎤',
    badge: '内测预览',
    badgeColor: '#6d5ef0',
    badgeBg: '#f0eefb',
    activeBg: '#f0eefb',
    activeColor: '#6d5ef0',
  },
]
```

## 完整菜单结构

```
┌─────────────────────────┐
│  🟣 AI销售秘书           │  ← Logo + 系统名
│  [搜索框]                │
├─────────────────────────┤
│  [+] 新建对话            │  ← 黑色按钮，导航到 /home
├─────────────────────────┤
│  📂 专家技能             │  ← navItems
│  📁 我的文件             │
│  📝 客户笔记             │
├─────────────────────────┤
│  智能体                  │  ← 分组标题
│  🎯 金牌陪练 [智能体]    │  ← agentItems
│  🎤 智能讲解 [内测预览]  │
├─────────────────────────┤
│  ▾ 历史对话              │  ← 可折叠
│  ⏱ 到底怎么提升销售技巧  │
│  ⏱ 娃哈哈整车物流方案    │
│  ⏱ 农夫山泉客户分析      │
└─────────────────────────┘
```

## 配置规则

1. **key 命名规则**：
   - 常规导航和智能体使用路径格式，如 `/skills`、`/coach`
   - key 必须与 `App.jsx` 中的路由 path 完全一致

2. **label 字段**：
   - 使用简洁中文名称
   - 与页面标题保持一致

3. **图标**：
   - navItems 使用内联 SVG 图标（stroke="currentColor"）
   - agentItems 使用 emoji 表情图标

4. **Badge 标签**：
   - 仅智能体项需要配置 badge
   - 用于标识类型（"智能体"、"内测预览"等）

5. **配色方案**：
   - 常规导航：紫色系（`#f0eefb` 背景 + `#6d5ef0` 文字）
   - 金牌陪练：橙色系（`#fdf1e7` 背景 + `#b4552d` 文字）
   - 智能讲解：紫色系（同常规导航）

6. **历史对话**：
   - 使用 `histData` 数组管理
   - 支持折叠/展开
   - 点击跳转到 `/home`

## 新增菜单项步骤

1. 在 `SideMenu/index.jsx` 的 `navItems` 或 `agentItems` 中添加配置
2. 在 `App.jsx` 添加对应的 Route
3. 在 `pages/` 下创建页面组件
