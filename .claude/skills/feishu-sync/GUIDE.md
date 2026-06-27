# 飞书同步技能 - 完整使用指南

欢迎使用飞书同步技能！本指南将帮助你快速上手并充分利用所有功能。

## 📖 文档导航

### 新手入门（推荐顺序）

1. **[README.md](./README.md)** - 快速开始，5分钟上手
   - 核心特性概览
   - 基础配置
   - 第一个同步示例

2. **[USAGE.md](./USAGE.md)** - 详细使用文档
   - 命令行选项详解
   - Markdown 支持列表
   - 性能优化策略
   - 常见问题解答

3. **[EXAMPLES.md](./EXAMPLES.md)** - 使用示例
   - 基础用法
   - 高级用法
   - 集成示例（Git Hook、CI/CD、VSCode）
   - 故障排查

### 技能开发

4. **[SKILL.md](./SKILL.md)** - Claude Code 技能说明
   - 技能触发条件
   - 工作流说明
   - Claude Code 调用示例

### 版本和测试

5. **[CHANGELOG.md](./CHANGELOG.md)** - 更新日志
   - v2.0 新特性
   - 性能对比
   - 已知限制

6. **测试文档**
   - [prd/test/飞书同步测试文档.md](../prd/test/飞书同步测试文档.md) - 完整测试用例
   - [prd/test/飞书同步测试文档_验证指南.md](../prd/test/飞书同步测试文档_验证指南.md) - 测试验证指南

### 参考资料

7. **[reference/feishu-api-reference.md](./reference/feishu-api-reference.md)** - 飞书 API 详细参考
   - 认证方式
   - 文档 API
   - 表格 API
   - 画板 API
   - 错误码说明

8. **[scripts/feishu-sync.js](./scripts/feishu-sync.js)** - 同步脚本源码
   - 企业级快速版
   - 详细注释

## 🚀 5分钟快速开始

### Step 1: 配置环境变量

```bash
# 创建 .env 文件
cat > .env << EOF
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
FEISHU_FOLDER_TOKEN=fldcn_xxx
EOF

# 加载环境变量
source .env
```

### Step 2: 运行测试

```bash
# 同步测试文档
node .claude/skills/feishu-sync/scripts/feishu-sync.js prd/test/飞书同步测试文档.md
```

### Step 3: 验证结果

- ✅ 检查控制台输出（耗时 <60秒）
- ✅ 复制飞书文档链接
- ✅ 打开验证格式、表格、画板

## 🎯 核心功能速查

| 功能 | 命令 | 说明 |
|------|------|------|
| 同步文件 | `node scripts/feishu-sync.js <file>` | 创建新文档 |
| 批量同步 | `node scripts/feishu-sync.js --batch <folder>` | 同步整个目录 |
| 删除文档 | `node scripts/feishu-sync.js --delete <doc_id>` | 删除指定文档 |
| 查看帮助 | `node scripts/feishu-sync.js` | 显示帮助信息 |
| 功能列表 | `node scripts/feishu-sync.js --list` | 查看支持的功能 |

## ✨ 核心特性（v2.0）

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
  - 自动创建真实表格（非文本）
  - 表头橙色 #FF6B00 + 粗体
  - 文档中保留链接

- **Mermaid 流程图 → 飞书画板**
  - 自动创建节点和连线
  - 支持矩形/菱形/椭圆
  - 文档中保留链接

- **完整 Markdown 支持**
  - 标题、段落、列表、引用
  - 代码块（多种语言语法高亮）
  - 内联样式（粗体/斜体/链接）

### 🔧 生命周期管理

- ✅ 文档创建
- ✅ 文档删除
- ✅ 批量同步
- ✅ 功能查询

## 📊 支持的 Markdown 元素

| 元素 | 支持 | 说明 |
|------|------|------|
| 标题 (#, ##, ###) | ✅ | 1-4级 |
| 段落 | ✅ | 多行合并 |
| 无序列表 (-, *, +) | ✅ | 支持嵌套 |
| 有序列表 (1., 2.) | ✅ | 支持嵌套 |
| 引用 (> ) | ✅ | 支持嵌套 |
| 代码块 (```) | ✅ | 多语言语法高亮 |
| 分割线 (---) | ✅ | - |
| 链接 [text](url) | ✅ | 可点击 |
| 粗体 **text** | ✅ | - |
| 斜体 *text* | ✅ | - |
| 表格 | 🔄 | → 飞书表格 + 链接 |
| Mermaid | 🔄 | → 飞书画板 + 链接 |

## 🔧 常见问题

### Q: 同步失败，提示"认证失败"

**A**: 检查环境变量是否正确配置：
```bash
echo $FEISHU_APP_ID
echo $FEISHU_APP_SECRET
```

### Q: 表格没有转换为飞书表格

**A**: 确保表格格式正确：
```markdown
| 表头1 | 表头2 |
|-------|-------|
| 数据1 | 数据2 |
```

### Q: 耗时超过 2 分钟

**A**: 可能原因：
- 网络延迟（检查网络）
- 飞书限流（等待后重试）
- 文档过大（>2000 Block，建议拆分）

### Q: 如何更新已有文档？

**A**: 当前版本暂不支持直接更新，建议：
1. 删除旧文档：`--delete <doc_id>`
2. 重新同步：创建新文档

## 🧪 测试验证

### 运行快速测试

```bash
# 方式1：使用测试脚本
bash .claude/skills/feishu-sync/scripts/test-sync.sh

# 方式2：手动测试
node .claude/skills/feishu-sync/scripts/feishu-sync.js prd/test/飞书同步测试文档.md
```

### 验证清单

- [ ] 耗时 <60秒
- [ ] 表格转为飞书表格（2个）
- [ ] 流程图转为飞书画板（2个）
- [ ] 代码块语法高亮正确
- [ ] 所有样式正确

## 📚 完整文档列表

```
.claude/skills/feishu-sync/
├── GUIDE.md                    # 本文件 - 完整使用指南
├── README.md                   # 快速开始指南
├── USAGE.md                    # 详细使用文档
├── EXAMPLES.md                 # 使用示例
├── SKILL.md                    # Claude Code 技能说明
├── CHANGELOG.md                # 更新日志
├── INDEX.md                    # 文档索引
│
├── scripts/
│   ├── feishu-sync.js         # 同步主脚本（v2.0）
│   └── test-sync.sh           # 快速测试脚本
│
├── reference/
│   └── feishu-api-reference.md # 飞书 API 参考
│
└── test/
    ├── 飞书同步测试文档.md       # 测试用例
    └── 飞书同步测试文档_验证指南.md # 验证指南
```

## 🎓 学习路径

### 初级用户

1. 阅读 [README.md](./README.md)
2. 运行快速测试
3. 同步自己的文档

### 中级用户

1. 阅读 [USAGE.md](./USAGE.md)
2. 了解所有命令行选项
3. 阅读 [EXAMPLES.md](./EXAMPLES.md) 的集成示例
4. 配置 Git Hook 或 CI/CD

### 高级用户/开发者

1. 阅读 [SKILL.md](./SKILL.md)
2. 查看 [scripts/feishu-sync.js](./scripts/feishu-sync.js) 源码
3. 阅读 [reference/feishu-api-reference.md](./reference/feishu-api-reference.md)
4. 自定义扩展功能

## 🔗 相关链接

- [飞书开放平台](https://open.feishu.cn/) - 官方文档
- [文档 API](https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/docx-overview)
- [表格 API](https://open.feishu.cn/document/server-docs/docs/sheets-v2)
- [画板 API](https://open.feishu.cn/document/server-docs/docs/board-v1/overview)

## 📞 获取帮助

遇到问题？

1. 查看 [USAGE.md](./USAGE.md) 的常见问题章节
2. 运行测试验证环境：`bash scripts/test-sync.sh`
3. 查看 [CHANGELOG.md](./CHANGELOG.md) 了解已知限制
4. 检查 [EXAMPLES.md](./EXAMPLES.md) 的故障排查部分

---

**开始使用**：查看 [README.md](./README.md) 开始你的第一次同步！
