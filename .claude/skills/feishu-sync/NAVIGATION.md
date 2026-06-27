# 飞书同步技能文档导航

## 🚀 快速导航

### 我想...

| 目标 | 查看文档 |
|------|----------|
| **快速开始**（5分钟） | [README.md](./README.md) |
| **学习所有功能** | [USAGE.md](./USAGE.md) 或 [GUIDE.md](./GUIDE.md) |
| **查看示例** | [EXAMPLES.md](./EXAMPLES.md) |
| **遇到问题** | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| **了解更新** | [CHANGELOG.md](./CHANGELOG.md) |
| **贡献代码** | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| **查看 API** | [reference/feishu-api-reference.md](./reference/feishu-api-reference.md) |
| **运行测试** | [scripts/test-sync.sh](./scripts/test-sync.sh) |
| **测试验证** | [prd/test/飞书同步测试文档_验证指南.md](../prd/test/飞书同步测试文档_验证指南.md) |

## 📚 按角色导航

### 🎓 新手用户

**学习路径**：
```
README.md → 运行测试 → 同步自己的文档 → USAGE.md
```

**推荐文档**：
1. [README.md](./README.md) - 5分钟快速开始
2. [USAGE.md](./USAGE.md) - 详细使用文档
3. [EXAMPLES.md](./EXAMPLES.md) - 基础用法示例

### 💼 日常用户

**使用场景**：
- 同步需求分析文档
- 批量同步 PRD
- 删除旧文档

**推荐文档**：
1. [USAGE.md](./USAGE.md) - 所有命令行选项
2. [EXAMPLES.md](./EXAMPLES.md) - 高级用法和集成示例
3. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 问题排查

### 👨‍💻 开发者

**学习路径**：
```
SKILL.md → 脚本源码 → CONTRIBUTING.md → API 参考
```

**推荐文档**：
1. [SKILL.md](./SKILL.md) - Claude Code 技能说明
2. [scripts/feishu-sync.js](./scripts/feishu-sync.js) - 同步脚本源码
3. [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
4. [reference/feishu-api-reference.md](./reference/feishu-api-reference.md) - API 参考

### 🧪 测试者

**测试流程**：
```
运行测试 → 验证功能 → 记录结果 → 提交报告
```

**推荐文档**：
1. [scripts/test-sync.sh](./scripts/test-sync.sh) - 快速测试脚本
2. [prd/test/飞书同步测试文档.md](../prd/test/飞书同步测试文档.md) - 测试用例
3. [prd/test/飞书同步测试文档_验证指南.md](../prd/test/飞书同步测试文档_验证指南.md) - 验证指南
4. [prd/test/飞书同步测试报告模板.md](../prd/test/飞书同步测试报告模板.md) - 报告模板

## 📖 按主题导航

### 快速开始

- [README.md](./README.md) - 5分钟快速开始
- [SUMMARY.md](./SUMMARY.md) - 升级总结和核心特性
- [UPGRADE.md](./UPGRADE.md) - 升级说明

### 详细使用

- [USAGE.md](./USAGE.md) - 详细使用文档
- [GUIDE.md](./GUIDE.md) - 完整使用指南
- [EXAMPLES.md](./EXAMPLES.md) - 使用示例

### 技术文档

- [SKILL.md](./SKILL.md) - Claude Code 技能说明
- [reference/feishu-api-reference.md](./reference/feishu-api-reference.md) - 飞书 API 参考
- [DEPENDENCIES.md](./DEPENDENCIES.md) - 依赖说明

### 开发贡献

- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [DOCUMENTATION.md](./DOCUMENTATION.md) - 文档清单
- [scripts/feishu-sync.js](./scripts/feishu-sync.js) - 脚本源码

### 问题排查

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 问题排查指南
- [CHANGELOG.md](./CHANGELOG.md) - 更新日志（已知限制）

### 测试验证

- [scripts/test-sync.sh](./scripts/test-sync.sh) - 快速测试脚本
- [prd/test/飞书同步测试文档.md](../prd/test/飞书同步测试文档.md) - 测试用例
- [prd/test/飞书同步测试文档_验证指南.md](../prd/test/飞书同步测试文档_验证指南.md) - 验证指南
- [prd/test/飞书同步测试报告模板.md](../prd/test/飞书同步测试报告模板.md) - 报告模板

### 文档总览

- [INDEX.md](./INDEX.md) - 完整文档总览
- [DOCUMENTATION.md](./DOCUMENTATION.md) - 文档清单

## 🔍 按问题导航

| 问题 | 查看文档 |
|------|----------|
| 如何安装和配置？ | [README.md](./README.md) |
| 支持哪些功能？ | [USAGE.md](./USAGE.md) |
| 如何批量同步？ | [EXAMPLES.md](./EXAMPLES.md) |
| 同步失败怎么办？ | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| 如何集成到 Git？ | [EXAMPLES.md](./EXAMPLES.md) |
| 如何贡献代码？ | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| API 详细说明？ | [reference/feishu-api-reference.md](./reference/feishu-api-reference.md) |
| 性能如何？ | [CHANGELOG.md](./CHANGELOG.md) |
| 需要什么环境？ | [DEPENDENCIES.md](./DEPENDENCIES.md) |
| 如何运行测试？ | [scripts/test-sync.sh](./scripts/test-sync.sh) |

## 🎯 常用命令速查

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

## 📊 文档统计

- **核心文档**：9个
- **问题排查**：1个
- **测试文档**：3个
- **工具脚本**：2个
- **参考资料**：1个
- **升级文档**：1个
- **总计**：17个文档

## 🚀 推荐阅读顺序

### 新用户（按顺序）

1. [README.md](./README.md) - 5分钟快速开始
2. [USAGE.md](./USAGE.md) - 学习所有功能
3. [EXAMPLES.md](./EXAMPLES.md) - 查看实际示例
4. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 了解问题排查

### 开发者（按顺序）

1. [SKILL.md](./SKILL.md) - 了解技能调用
2. [scripts/feishu-sync.js](./scripts/feishu-sync.js) - 阅读脚本源码
3. [CONTRIBUTING.md](./CONTRIBUTING.md) - 学习贡献流程
4. [reference/feishu-api-reference.md](./reference/feishu-api-reference.md) - 查看 API 详细说明

### 测试者（按顺序）

1. [scripts/test-sync.sh](./scripts/test-sync.sh) - 运行快速测试
2. [prd/test/飞书同步测试文档_验证指南.md](../prd/test/飞书同步测试文档_验证指南.md) - 阅读验证指南
3. [prd/test/飞书同步测试报告模板.md](../prd/test/飞书同步测试报告模板.md) - 填写测试报告

## 📞 获取帮助

1. **查看文档**：从 [README.md](./README.md) 或本导航开始
2. **运行测试**：`bash scripts/test-sync.sh`
3. **排查问题**：[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. **提交反馈**：提供完整的诊断信息

---

**开始使用** → [README.md](./README.md)

**查看所有文档** → 本目录下各 `.md` 文件
