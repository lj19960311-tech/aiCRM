---
name: pc-demo
description: 构建或修改 AI 销售秘书及同类对话式 AI 助手的 PC Demo。适用于 React、Ant Design、Vite 项目中的页面、菜单、路由和 Mock 数据开发；普通后台或其他技术栈项目不自动调用。
---

# AI 销售秘书（PC 端 Demo 构建专家）

## 项目定位

本 skill 用于通过代码构建或修改 **AI 销售秘书及同类对话式 AI 助手** PC 端 demo，使用模拟数据，重点在于界面还原和交互体验。

## 项目识别

执行前先识别当前项目：

1. 如果用户指定了项目目录，以用户指定目录为准。
2. 如果当前项目已有 `package.json`、`src`、路由和样式体系，在现有结构中做最小修改。
3. 只有当前项目明确属于 AI 销售秘书 Demo，且已有 `./pc` 目录时，才使用 `./pc`。
4. 如果是全新项目且用户未指定目录，先确认目标目录和技术栈。
5. 不得因为调用本 skill 而覆盖、重建或迁移现有项目。

## 规范优先级

出现规范不一致时，按以下顺序执行：

1. 用户在当前任务中明确提出的要求
2. 当前项目的 `AGENTS.md`、`package.json` 和现有代码
3. 当前项目已经采用的设计系统和代码风格
4. 本 `SKILL.md` 中的默认规范
5. `references/` 中的示例和历史资料

`references/` 仅作为补充说明。如果与当前项目或本文件冲突，不得覆盖更高优先级规范。

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | 视图层（函数组件） |
| React Router | 7 | 路由（BrowserRouter + Routes/Route） |
| Ant Design | 6 | UI 组件库（按需使用） |
| Vite | 8 | 构建工具 |
| dayjs | 1.x | 日期处理 |

**主题色**：紫色 `#7b6cf0` / `#6d5ef0`，金牌陪练使用橙色 `#b4552d`

---

## 目录结构

```
pc/
├── src/
│   ├── main.jsx              # 入口（BrowserRouter 包裹 App）
│   ├── App.jsx               # 根组件（Routes 路由配置）
│   ├── styles/global.css     # 全局样式 + CSS 变量
│   ├── layouts/
│   │   └── MainLayout.jsx    # 主布局（SideMenu + Outlet）
│   ├── components/
│   │   └── SideMenu/         # 左侧导航菜单（自定义实现，非 antd Menu）
│   ├── pages/
│   │   ├── Home/             # 对话首页
│   │   ├── Skills/           # 专家技能页
│   │   ├── Outputs/          # 文件管理页
│   │   ├── Memory/           # 客户笔记页
│   │   ├── Coach/            # 金牌陪练（销售话术对练）
│   │   └── Present/          # 智能讲解
│   └── router/index.jsx      # 菜单配置 + 路由配置
├── index.html
├── vite.config.js
└── package.json
```

---

## 核心规范索引

| 规范 | 文件 |
|------|------|
| 项目初始化 | [references/pc-init.md](./references/pc-init.md) |
| 菜单配置 | [references/menu-config.md](./references/menu-config.md) |
| Mock 数据 | [references/mock-data.md](./references/mock-data.md) |
| 页面结构（布局/菜单/导航） | [references/page-structure.md](./references/page-structure.md) |
| 页面类型（对话/技能/陪练等） | [references/page-types.md](./references/page-types.md) |
| 代码风格 | [references/code-style.md](./references/code-style.md) |
| 常见问题修复记录 | [references/faq.md](./references/faq.md) |

按任务需要读取参考文件：

- 仅在新建项目时读取 `pc-init.md`；修改现有项目时先检查 `package.json` 和源码。
- 新增或修改菜单时读取 `menu-config.md`。
- 新增页面时读取 `page-structure.md` 和相关的 `page-types.md`。
- 需要模拟数据时读取 `mock-data.md`。
- 遇到已记录的问题时才读取 `faq.md`。
- 编写代码时读取 `code-style.md`，但优先保持现有项目风格。

---

## 当前菜单结构

```
AI销售秘书
├── [+] 新建对话          (/home)
├── 📂 专家技能           (/skills)
├── 📁 我的文件           (/outputs)
├── 📝 客户笔记           (/memory)
└── 智能体
    ├── 🎯 金牌陪练        (/coach)
    └── 🎤 智能讲解        (/present)
```

---

## 开发工作流

新增页面时按以下步骤执行：

1. **确认需求**：页面功能、所属位置（常规导航/智能体）、路由路径
2. **创建页面**：在 `pages/` 下创建模块目录和 `index.jsx`
3. **注册路由**：`App.jsx` 中添加 Route（嵌套在 MainLayout 下）
4. **注册菜单**：`router/index.jsx` 的 `menuItems`/`routeConfig` 添加配置
5. **注册侧边栏**：`components/SideMenu/index.jsx` 的 `navItems` 或 `agentItems` 添加导航项
6. **创建 Mock 数据**：如需模拟数据，在 `mock/` 目录下创建

---

## 验证

使用当前项目已有的开发命令检查页面是否正常渲染。AI 销售秘书默认项目可使用：

```bash
cd ./pc && npm run dev
```

---

## 注意事项

- Demo 项目，重点在于界面展示和交互体验，不需要真实后端
- 所有数据使用 mock 模拟，mock 数据要贴合销售业务实际
- 不需要登录认证、权限控制等复杂逻辑
- 优先保持当前项目已有的样式方式；AI 销售秘书默认使用 inline style 和全局 CSS，不新增 CSS Modules
- 新增页面时同步更新路由配置和侧边栏配置
- 保持代码简洁，避免过度工程化
- 整体紫色主题，陪练页面使用橙色专属配色
