# AI 销售秘书 PC 端 Demo 初始化指南

## 项目定位

本指南仅用于新建 AI 销售秘书 PC 端 demo。修改现有项目时不得套用本初始化结构，应优先读取项目的 `package.json` 和现有源码。用户指定目录时以用户指定目录为准；仅在明确采用默认结构时使用 `./pc`。

---

## 技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| React 19 + Hooks | 视图层 | 函数组件 + Hooks，不使用 class 组件 |
| React Router 7 | 路由 | 使用 `BrowserRouter` + `Routes` / `Route`，支持嵌套路由 |
| Ant Design 6 | UI 组件库 | 按需直接使用 antd 组件 |
| Vite 8 | 构建工具 | 开发服务器 + 构建，配合 `@vitejs/plugin-react` |
| dayjs 1.x | 日期处理 | 日期格式化与计算 |

---

## 初始化项目

仅当目标目录还没有项目且用户已确认新建时，按以下步骤初始化。以下示例使用默认的 `./pc`：

### 1. 创建项目

```bash
cd ./pc
npm create vite@latest . -- --template react
```

### 2. 安装依赖

```bash
npm install antd @ant-design/icons react-router-dom dayjs
```

### 3. 启动开发服务器

```bash
npm run dev
```

---

## 目录结构

```
pc/
├── public/
├── src/
│   ├── main.jsx            # 入口文件
│   ├── App.jsx             # 根组件，包含 Routes 路由配置
│   ├── router/
│   │   └── index.jsx       # 路由配置 + 菜单配置
│   ├── layouts/
│   │   └── MainLayout.jsx  # 主布局（SideMenu + Outlet）
│   ├── components/
│   │   └── SideMenu/       # 左侧菜单组件
│   ├── pages/
│   │   ├── Home/           # 首页
│   │   └── [模块名]/       # 按业务模块组织页面
│   │       └── index.jsx   # 页面入口
│   ├── mock/               # 模拟数据
│   │   └── [模块名].js
│   └── styles/             # 全局样式
│       └── global.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 布局与状态

- 使用 `SideMenu + Outlet` 的左右两栏布局，不创建 `TabNav` 多标签页导航。
- 页面内部状态优先使用 React Hooks；只有确有跨组件共享需求时才引入 Context。
- 默认主色为紫色 `#7b6cf0` / `#6d5ef0`，金牌陪练使用橙色 `#b4552d`。
