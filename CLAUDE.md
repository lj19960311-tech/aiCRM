# CLAUDE.md

本文件为 Claude Code 工作目录指南。

## 语言约束

本项目默认使用简体中文，新增/更新的 skill、规则、记忆等文件应该使用简体中文（可允许部分必须要英文字母的表述，如 API、URL、ID 等）。

## 项目概述

这是一个 AI 产品经理的 Claude Code 工作空间，用于：
- 会议分析（meeting-analysis）
- 需求分析（requirements-analysis）
- 撰写 PRD（prd-writer）
- 同步 PRD 到飞书（feishu-sync）
- 构建 PC 端产品管理后台 Demo（pc-demo）

**工作流程**：会议分析 → 需求分析 → PRD 撰写 → 飞书同步 → PC 端 Demo 开发

## 目录结构

```
pm_agent/
├── CLAUDE.md                          # 本文件
├── prd/                               # PRD 文档目录
│   └── *.md                           # 需求分析文档 & PRD 文档
├── pc/                                # PC 端产品管理后台 Demo
│   ├── CLAUDE.md                      # PC 项目详细指南
│   ├── package.json                   # 项目依赖与脚本
│   ├── vite.config.js                 # Vite 构建配置
│   └── src/
│       ├── main.jsx                   # 应用入口
│       ├── App.jsx                    # 根组件（路由注册）
│       ├── router/index.jsx           # 路由配置 + 菜单配置（menuItems）
│       ├── layouts/MainLayout.jsx     # 主布局（固定 100vh 高度）
│       ├── components/
│       │   ├── SideMenu/index.jsx     # 左侧菜单（含 findLabel 递归查找）
│       │   └── TabNav/index.jsx       # 顶部标签导航
│       ├── pages/
│       │   ├── Home/                  # 首页
│       │   ├── Sales/                 # 销售模块
│       │   │   ├── OrderList/         # 订单列表
│       │   │   └── ReturnList/        # 退货单列表
│       │   ├── Purchase/              # 采购模块
│       │   │   ├── Order/             # 采购订单
│       │   │   └── Return/            # 采购退货
│       │   └── Warehouse/             # 仓储模块
│       │       ├── In/                # 入库单
│       │       └── Out/               # 出库单
│       ├── stores/tabStore.jsx        # 标签页状态管理（Zustand 模式）
│       ├── styles/global.css          # 全局样式
│       └── mock/
│           └── sales.js               # 销售模块模拟数据
└── .claude/
    ├── settings.json                  # Claude Code 权限配置
    ├── settings.local.json            # 本地设置
    └── skills/                        # Claude Code 技能目录
        ├── meeting-analysis/
        │   ├── SKILL.md               # 会议分析技能主文件
        │   └── reference/
        │       └── meeting-analysis-template.md  # 会议分析三段式模板
        ├── pc-demo/
        │   ├── SKILL.md               # PC Demo 技能主文件
        │   └── references/            # PC 参考文档（代码风格、FAQ、页面类型等）
        ├── prd-writer/
        │   ├── SKILL.md               # PRD 撰写技能主文件
        │   └── reference/
        │       └── prd-template.md    # PRD 七段式模板
        ├── feishu-sync/
        │   ├── SKILL.md               # 飞书同步技能主文件
        │   └── reference/
        │       └── feishu-api-reference.md  # 飞书 API 调用参考
        └── requirements-analysis/
            ├── SKILL.md               # 需求分析技能主文件
            └── reference/
                ├── analysis-template.md  # 需求分析五段式模板
                └── system-status.md      # 系统现状记录
```

## 常用命令

### PC 端 Demo 项目

```bash
cd pc
npm install          # 首次运行或添加依赖后执行
npm run dev          # 启动开发服务器（热更新）
npm run build        # 生产构建
npm run lint         # ESLint 检查
npm run preview      # 预览构建产物
```

### PRD 文档

PRD 文档保存在 `prd/` 目录下，使用 Markdown 格式。
- 需求分析文档保存在 `prd/需求分析/` 子目录下
- 会议分析文档保存在 `prd/会议分析/` 子目录下

## 技能说明

### meeting-analysis（会议分析）
当用户提到"会议分析"、"分析会议记录"、"会议整理"、"会议纪要生成"、"整理会议笔记"、"提取会议要点"、"会议需求提取"时使用。在需求分析前进行会议记录的结构化整理和分析。

**工作原则**：
- 严格按三段式模板输出（结构化会议纪要→议题分析报告→产品需求提取）
- 不遗漏关键信息，尤其是决策项和行动项
- 会议中未明确的内容标注为"待确认"，不得自行假设
- 所有提取的需求必须标注优先级（P0/P1/P2）
- 完成后产出文档保存到 `prd/会议分析/` 目录

**工作流定位**：会议分析是需求分析的前置环节，输出文档作为需求分析的输入材料。

### requirements-analysis（需求分析）
当用户提到"需求分析"、"分析需求"、"撰写需求分析"、"需求调研"时使用。在 PRD 撰写前进行 AI 产品相关的需求调研、分析和确认。

**工作原则**：
- 严格按五段式模板输出（需求背景→目标确认→流程分析→功能拆解→待确认事项）
- 必须参考 `reference/system-status.md` 了解现有系统功能
- 业务流程必须使用 Mermaid 语法（现状流程 + 目标流程）
- 所有功能标注优先级（P0/P1/P2）
- 完成后产出文档保存到 `prd/需求分析/` 目录

### prd-writer（PRD 撰写）
当用户提到"写PRD"、"撰写需求"、"产品需求"、"需求背景"、"功能设计"、"撰写产品需求文档"时使用。根据标准模板输出，包含需求背景、目标、流程图、功能清单（含触发动作、打标签、提示词）、系统改造等章节。

**核心差异**：AI PRD 写任务定义（Input-Output）而非功能逻辑（If-Then），关注模型选型、提示词策略、RAG、评测与幻觉抑制。

**七段式模板**：项目背景→用户场景→AI 任务定义→功能需求→评测验收→数据安全→附录

**关键约束**：
- 必须基于需求分析文档（.md 文件），不接受口头需求
- 需求不清晰时必须询问用户，不得自行假设
- 评测指标必须量化（黄金数据集、准确率、TTFT 等）

### feishu-sync（飞书同步）
当用户提到"同步到飞书"、"同步PRD"、"上传飞书"、"发布到飞书"、"导出飞书"时使用。将本地 `prd/` 目录下的 Markdown PRD 文档自动同步到飞书云文档。

**前置配置**：
- 需在 `.env` 文件中配置飞书应用的 App ID 和 App Secret
- 应用需开通 `docx:document`、`drive:drive` 等权限

**支持功能**：
- 首次创建飞书文档
- 增量更新已有文档内容
- Markdown 格式自动转换为飞书文档块

### pc-demo（PC 端 Demo）
当用户提到"PC后台"、"供应链后台"、"后台页面"、"新增页面"、"添加菜单"、"PC端开发"、"后台列表"、"后台详情"、"管理后台"、"新建页面"、"开发页面"、"页面模板"等关键词时使用。即使用户只是简单提到要做一个后台页面或管理界面，也应该触发此 skill。

**技术栈**：React + Ant Design 5 + React Router 6 + Vite
**主题色**：#FF6B00（橙白主色调）
**数据**：全部使用 Mock 模拟，无真实后端

**详细规范**参见 `pc/CLAUDE.md` 及 `.claude/skills/pc-demo/references/` 目录下的参考文档。

## 核心架构说明

### 菜单-路由-标签三联机制

这是本项目最重要的架构模式，理解它需要同时阅读多个文件：

1. **菜单配置**在 `router/index.jsx` 的 `menuItems` 中定义
2. **路由注册**在 `App.jsx` 中通过 `routeConfig` 注册
3. **标签管理**通过 `stores/tabStore.jsx` 维护打开的页面标签

**关键约束**：
- 菜单 `key`、路由 `path`、页面标题三者必须一致（如 `/sales/order`）
- 菜单 key 必须带前导斜杠 `/`
- 点击菜单时调用 `addTab({ key, label })` 添加标签
- `SideMenu` 中的 `findLabel` 函数递归查找菜单 label，找不到返回 `null`

### 布局架构

```
┌─────────────────────────────────────┐ 100vh
│ Header: Logo + Title                │ 固定
├────────┬────────────────────────────┤
│ Side   │ TabNav: [Tab1] [Tab2] ...  │ 固定
│ Menu   ├────────────────────────────┤
│ (不滚动)│ Page Content              │ flex:1, 内部滚动
│        ├────────────────────────────┤
│        │ Pagination (底部固定)      │ 固定
└────────┴────────────────────────────┘
```

- 整体固定高度 `height: 100vh; overflow: hidden`
- 左侧菜单不滚动，高度 `calc(100vh - 116px)`
- 内容区 flex 布局，内部滚动
- 列表 Table 表头固定：`scroll={{ x, y: 'calc(100vh - 300px)' }}`
- 分页固定在页面底部，不随列表滚动

### 新增页面流程

1. 在 `pages/` 下创建模块目录和页面组件
2. 在 `App.jsx` 添加 Route，**path 必须与菜单 key 一致（带前导斜杠）**
3. 在 `router/index.jsx` 的 `menuItems` 添加菜单项
4. 在 `mock/` 下创建模拟数据文件（列表页需要）
5. 验证页面、菜单、标签名称三者一致

### 当前菜单结构

```
├── 线索中心
│   ├── 线索列表 (/lead-center/lead-list)
│   ├── 数据看板 (/lead-center/dashboard)
│   ├── Bad Case 管理 (/lead-center/bad-case)
│   └── 规则配置
│       ├── 评分规则配置 (/lead-center/scoring-config)
│       └── 分配规则配置 (/lead-center/assignment-config)
├── 销售中心
│   └── 商品销售
│       ├── 订单列表 (/sales/order)
│       └── 退货单列表 (/sales/return)
├── 采购中心
│   └── 采购管理
│       ├── 采购订单 (/purchase/order)
│       └── 采购退货 (/purchase/return)
└── 仓储中心
    └── 入库管理
        ├── 入库单 (/warehouse/in)
        └── 出库单 (/warehouse/out)
```

## 注意事项

- Demo 项目，重点在于界面展示和交互体验，不需要真实后端接口
- 所有数据使用 Mock 模拟，mock 数据要贴合业务实际
- 不需要登录认证、权限控制等复杂逻辑
- 新增页面时必须同步更新菜单配置和路由配置
- 保持代码简洁，避免过度工程化
- PRD 撰写必须基于需求分析文档，需求不清晰时必须询问用户
