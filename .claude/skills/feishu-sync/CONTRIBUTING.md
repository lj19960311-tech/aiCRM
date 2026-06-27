# 飞书同步技能 - 贡献指南

欢迎为飞书同步技能贡献代码！本指南将帮助你快速开始开发。

## 项目结构

```
.claude/skills/feishu-sync/
├── scripts/
│   ├── feishu-sync.js         # 同步主脚本（核心）
│   └── test-sync.sh           # 快速测试脚本
│
├── reference/
│   └── feishu-api-reference.md # 飞书 API 参考
│
├── 文档/
│   ├── README.md              # 快速开始
│   ├── USAGE.md               # 详细使用文档
│   ├── EXAMPLES.md            # 使用示例
│   ├── SKILL.md               # Claude Code 技能说明
│   ├── CHANGELOG.md           # 更新日志
│   ├── GUIDE.md               # 完整使用指南
│   ├── DEPENDENCIES.md        # 依赖说明
│   └── CONTRIBUTING.md        # 本文件
│
└── test/
    ├── 飞书同步测试文档.md       # 测试用例
    └── 飞书同步测试文档_验证指南.md # 验证指南
```

## 开发环境

### 1. 环境配置

```bash
# 配置飞书应用环境变量
export FEISHU_APP_ID=cli_xxx
export FEISHU_APP_SECRET=xxx
export FEISHU_FOLDER_TOKEN=fldcn_xxx
```

### 2. 验证环境

```bash
# 运行测试
node scripts/feishu-sync.js test/飞书同步测试文档.md

# 应输出飞书文档链接
```

## 代码风格

### JavaScript 规范

- **缩进**：2 个空格
- **引号**：单引号 `'`
- **分号**：不使用
- **变量命名**：驼峰命名 `camelCase`
- **常量命名**：大写下划线 `UPPER_CASE`

### 注释规范

```javascript
// ========== 模块分隔 ==========
// 简短说明
function functionName() {
  // 详细说明（如需要）
}

/**
 * 函数说明
 *
 * @param {Type} param - 参数说明
 * @returns {Type} 返回值说明
 */
function example(param) {
  // ...
}
```

### 错误处理

```javascript
// 使用 try-catch 包裹异步操作
try {
  await someAsyncOperation()
} catch (err) {
  throw new Error(`操作失败: ${err.message}`)
}

// 提供有用的错误信息
if (!token) {
  throw new Error('缺少环境变量 FEISHU_APP_ID 或 FEISHU_APP_SECRET')
}
```

## 核心模块说明

### 1. API 封装 (`apiRequest`)

```javascript
async function apiRequest(method, urlPath, body, useToken = true)
```

**职责**：
- 封装 HTTPS 请求
- 处理 token 认证
- 统一错误处理

**修改注意**：
- 保持向后兼容
- 添加新的 API 时，参考 `reference/feishu-api-reference.md`

### 2. Token 管理 (`getToken`)

```javascript
async function getToken()
```

**职责**：
- 获取并缓存 token
- 避免重复请求

**修改注意**：
- 当前实现为进程级缓存
- 如需支持 token 刷新，需添加过期检测

### 3. Markdown 解析 (`parseMarkdownToBlocks`)

```javascript
async function parseMarkdownToBlocks(md, token)
```

**职责**：
- 解析 Markdown
- 转换为飞书 Block
- 处理特殊内容（表格、流程图）

**修改注意**：
- 添加新元素支持时，需同时更新 `USAGE.md` 的支持列表
- 确保向后兼容

### 4. 批量写入 (`createBlocksBatched`)

```javascript
async function createBlocksBatched(token, documentId, parentBlockId, blocks)
```

**职责**：
- 分批处理 Block
- 并行发送请求
- 限流防护

**修改注意**：
- 修改并发数或批次大小时，需测试限流情况
- 确保错误处理完善

## 新增功能开发

### 示例：添加新 Markdown 元素支持

#### 1. 确定需求

例如：支持任务列表（Task List）

```markdown
- [x] 完成任务1
- [ ] 待完成任务2
```

#### 2. 实现解析

在 `parseMarkdownToBlocks` 中添加：

```javascript
// 任务列表
else if (/^[\s]*-\s*\[[x\s]\]\s/.test(line)) {
  const isChecked = line.includes('[x]')
  const text = line.replace(/^[\s]*-\s*\[[x\s]\]\s/, '').trim()
  blocks.push(taskItem(text, isChecked))
  i++
}
```

添加 Block 生成器：

```javascript
function taskItem(text, checked) {
  return {
    block_type: 2,
    text: { elements: parseInline(text) },
    todo: { checked }
  }
}
```

#### 3. 更新文档

- [ ] 更新 `USAGE.md` 的支持列表
- [ ] 在测试文档中添加示例
- [ ] 更新 `CHANGELOG.md`

#### 4. 测试验证

```bash
# 运行测试
node scripts/feishu-sync.js test/飞书同步测试文档.md

# 验证任务列表显示正确
```

### 示例：优化性能

#### 1. 识别瓶颈

使用性能分析：

```bash
# Node.js 性能分析
node --prof scripts/feishu-sync.js test.md
node --prof-process isolate-*.log
```

#### 2. 优化策略

常见优化方向：
- 减少 API 调用次数
- 增加并发数（注意限流）
- 优化数据结构
- 缓存中间结果

#### 3. 测试对比

```bash
# 优化前
time node scripts/feishu-sync.js test.md

# 优化后
time node scripts/feishu-sync.js test.md

# 对比耗时
```

## 测试指南

### 单元测试

当前暂无单元测试框架，建议：

1. **手动测试**：使用测试文档验证
2. **对比测试**：与旧版本对比输出
3. **边界测试**：测试空文件、超大文件等

### 集成测试

```bash
# 完整流程测试
bash scripts/test-sync.sh

# 验证清单
- [ ] 耗时 <60秒（200 Block）
- [ ] 所有格式正确
- [ ] 表格转换正确
- [ ] 画板创建正确
```

### 性能测试

```bash
# 测试不同大小文档
for size in 100 500 1000 2000; do
  echo "Testing ${size} blocks..."
  time node scripts/feishu-sync.js "test-${size}.md"
done
```

## 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**：
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `style` - 代码格式
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试
- `chore` - 构建/工具

**Scope**：
- `script` - 脚本
- `doc` - 文档
- `api` - API 相关
- `test` - 测试

**示例**：
```
feat(script): 支持任务列表解析

- 添加任务列表 Markdown 解析
- 生成飞书 Todo Block
- 更新测试文档

Closes #123
```

### Pull Request 检查清单

- [ ] 代码符合风格规范
- [ ] 通过所有测试
- [ ] 更新相关文档
- [ ] 添加/更新测试用例
- [ ] 性能无明显下降
- [ ] 向后兼容（如适用）

## 常见问题

### Q: 如何调试脚本？

**A**:
```bash
# 使用 console.log
console.log('Debug:', variable)

# 使用 Node.js 调试器
node --inspect scripts/feishu-sync.js file.md

# 然后在 Chrome 打开 chrome://inspect
```

### Q: 如何测试限流情况？

**A**:
```bash
# 减少延迟，触发限流
SLEEP_MS=50 node scripts/feishu-sync.js file.md

# 观察错误处理是否正确
```

### Q: 如何添加新的飞书 API？

**A**:
1. 查阅 `reference/feishu-api-reference.md`
2. 在 `apiRequest` 基础上封装新方法
3. 添加错误处理
4. 更新文档

## 代码审查要点

### 功能审查

- [ ] 需求是否完整实现
- [ ] 边界情况是否处理
- [ ] 错误处理是否完善
- [ ] 是否有内存泄漏风险

### 代码质量

- [ ] 代码风格一致
- [ ] 命名清晰
- [ ] 注释充分
- [ ] 复杂度合理

### 性能审查

- [ ] 是否有性能瓶颈
- [ ] 并发策略合理
- [ ] 限流处理正确
- [ ] 资源使用合理

### 文档审查

- [ ] 文档是否同步更新
- [ ] 示例是否正确
- [ ] 注释是否清晰
- [ ] 错误信息是否友好

## 路线图

### 短期计划

- [ ] 支持文档增量更新
- [ ] 完善画板连线功能
- [ ] 添加更多图表类型支持
- [ ] 编写单元测试

### 中期计划

- [ ] 支持更多 Markdown 扩展语法
- [ ] 添加配置文件支持
- [ ] 支持自定义样式
- [ ] 添加进度条显示

### 长期计划

- [ ] 支持双向同步
- [ ] 添加 GUI 界面
- [ ] 支持更多云文档平台
- [ ] 性能进一步优化

## 获取帮助

- **文档**：查看 `GUIDE.md` 和 `USAGE.md`
- **代码**：阅读 `scripts/feishu-sync.js` 源码和注释
- **API**：参考 `reference/feishu-api-reference.md`
- **讨论**：提交 Issue 或联系维护者

## 贡献者

感谢所有贡献者！
- 需要帮助？提交 Issue
- 想贡献代码？提交 Pull Request

---

**开始贡献**：
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feat/AmazingFeature`)
3. 提交修改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feat/AmazingFeature`)
5. 开启 Pull Request
