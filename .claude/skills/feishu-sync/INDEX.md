# 飞书同步技能文档总览

本目录包含飞书同步技能的完整文档体系，帮助你快速上手和深入使用。

## 📚 文档结构

```
.claude/skills/feishu-sync/
│
├── 🚀 快速开始
│   ├── README.md              # 5分钟快速开始
│   ├── USAGE.md               # 详细使用文档
│   └── GUIDE.md               # 完整使用指南
│
├── 🔧 开发相关
│   ├── SKILL.md               # Claude Code 技能说明
│   ├── CONTRIBUTING.md        # 贡献指南
│   └── DEPENDENCIES.md        # 依赖说明
│
├── 📖 参考资料
│   ├── EXAMPLES.md            # 使用示例（基础/高级/集成）
│   ├── CHANGELOG.md           # 更新日志（v2.0 新特性）
│   └── reference/
│       └── feishu-api-reference.md  # 飞书 API 详细参考
│
├── 🧪 测试验证
│   ├── TROUBLESHOOTING.md     # 问题排查指南
│   └── test/
│       ├── 飞书同步测试文档.md
│       └── 飞书同步测试文档_验证指南.md
│
├── 📁 脚本工具
│   └── scripts/
│       ├── feishu-sync.js     # 同步主脚本（v2.0 企业级）
│       └── test-sync.sh       # 快速测试脚本
│
└── 📑 本文档
    └── INDEX.md               # 本文件 - 文档总览
```

## 🎯 快速导航

### 我是新手，想快速开始

1. **[README.md](./README.md)** - 5分钟上手
   - 环境配置
   - 第一个同步示例
   - 核心特性概览

2. **[USAGE.md](./USAGE.md)** - 学习更多用法
   - 所有命令行选项
   - Markdown 支持列表
   - 常见问题解答

### 我想了解所有功能

- **[GUIDE.md](./GUIDE.md)** - 完整使用指南
  - 文档导航
  - 核心功能速查
  - 学习路径

### 我遇到问题了

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - 问题排查指南
  - 认证问题
  - 同步失败
  - 性能问题
  - 内容转换问题

### 我想查看示例

- **[EXAMPLES.md](./EXAMPLES.md)** - 使用示例
  - 基础用法
  - 高级用法
  - 集成示例（Git Hook、CI/CD、VSCode）

### 我是开发者

- **[SKILL.md](./SKILL.md)** - Claude Code 技能调用
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - 贡献代码指南
- **[reference/feishu-api-reference.md](./reference/feishu-api-reference.md)** - API 参考

### 我想了解更新

- **[CHANGELOG.md](./CHANGELOG.md)** - 版本更新日志
  - v2.0 新特性
  - 性能对比
  - 已知限制

## 📊 核心特性（v2.0）

### ⚡ 性能优化

- **2分钟内完成同步**（1000+ Block）
- **并行批量处理**（10 路并发）
- **智能分批**（50 Block/批）

**性能对比**：
| 文档大小 | 旧方式 | 新方式 | 提升 |
|----------|--------|--------|------|
| 200 Block | 2小时+ | <30秒 | 240x |
| 500 Block | 5小时+ | <60秒 | 300x |
| 1000 Block | 10小时+ | <120秒 | 300x |

### 📊 内容转换

- **Markdown 表格 → 飞书表格**
- **Mermaid 流程图 → 飞书画板**
- **完整 Markdown 支持**

### 🔧 生命周期管理

- ✅ 文档创建
- ✅ 文档删除
- ✅ 批量同步
- ✅ 功能查询

## 🚀 常用命令速查

```bash
# 同步单个文件
node scripts/feishu-sync.js <file.md>

# 批量同步
node scripts/feishu-sync.js --batch <folder>

# 删除文档
node scripts/feishu-sync.js --delete <doc_id>

# 功能列表
node scripts/feishu-sync.js --list

# 快速测试
bash scripts/test-sync.sh
```

## 📖 学习路径推荐

### 初级用户

```
README.md → 运行测试 → 同步自己的文档 → USAGE.md
```

### 中级用户

```
USAGE.md → EXAMPLES.md → 集成到工作流 → TROUBLESHOOTING.md
```

### 高级用户/开发者

```
SKILL.md → 脚本源码 → CONTRIBUTING.md → API 参考
```

## 🔍 按问题查找文档

| 问题类型 | 查看文档 |
|----------|----------|
| 如何开始使用？ | [README.md](./README.md) |
| 支持哪些 Markdown 元素？ | [USAGE.md](./USAGE.md) |
| 如何批量同步？ | [EXAMPLES.md](./EXAMPLES.md) |
| 同步失败怎么办？ | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| 如何集成到 Git？ | [EXAMPLES.md](./EXAMPLES.md) |
| 如何贡献代码？ | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| API 详细说明？ | [reference/feishu-api-reference.md](./reference/feishu-api-reference.md) |
| 最新更新内容？ | [CHANGELOG.md](./CHANGELOG.md) |
| 需要什么环境？ | [DEPENDENCIES.md](./DEPENDENCIES.md) |

## 📁 重要文件说明

### 核心脚本

- **[scripts/feishu-sync.js](./scripts/feishu-sync.js)**
  - 企业级快速版同步脚本
  - 支持并行、批量、表格、画板
  - 详细注释，适合学习和修改

### 测试文件

- **[prd/test/飞书同步测试文档.md](../prd/test/飞书同步测试文档.md)**
  - 完整测试用例
  - 包含所有支持的 Markdown 元素
  - 用于验证功能

### 配置文件

- **`.env`**（需自行创建）
  ```bash
  FEISHU_APP_ID=cli_xxx
  FEISHU_APP_SECRET=xxx
  FEISHU_FOLDER_TOKEN=fldcn_xxx
  ```

## 🎓 文档维护

### 文档更新日志

- 2026-06-27: 创建完整文档体系
- 2026-06-27: 发布 v2.0 企业级快速版

### 贡献文档

欢迎贡献文档改进：
1. 发现文档错误？提交 Issue
2. 想添加新示例？提交 Pull Request
3. 改进文档结构？提交建议

## 🔗 外部资源

- [飞书开放平台](https://open.feishu.cn/) - 官方文档
- [文档 API](https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/docx-overview)
- [表格 API](https://open.feishu.cn/document/server-docs/docs/sheets-v2)
- [画板 API](https://open.feishu.cn/document/server-docs/docs/board-v1/overview)
- [Node.js 官方文档](https://nodejs.org/)

## 📞 获取帮助

1. **查看文档**：从 [README.md](./README.md) 开始
2. **运行测试**：`bash scripts/test-sync.sh`
3. **排查问题**：[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. **提交 Issue**：提供完整诊断信息

---

**开始使用** → [README.md](./README.md)

**查看所有文档** → 本目录下各 `.md` 文件
