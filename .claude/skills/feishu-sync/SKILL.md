---
name: feishu-sync
description: 飞书文档同步专家。当用户提到"同步到飞书"、"同步PRD"、"上传飞书"、"发布到飞书"、"导出飞书"、"创建画板"、"创建表格"时使用。将本地内容同步到飞书文档、画板或表格。
---

# 飞书文档同步专家

## 功能说明

将本地内容同步到飞书，支持三种类型：

| 类型 | 说明 |
|------|------|
| 文档（Docx） | PRD、会议纪要等富文本内容 |
| 表格（Sheet） | 数据清单、功能列表、排期表等 |
| 画板（Board） | 流程图、架构图、脑图等可视化内容 |

## 同步方式

### 使用同步脚本（推荐）

使用 `scripts/feishu-sync.js` 脚本一次性完成同步，性能远优于手动逐条 curl 调用：

```bash
# 同步单个文件
node .claude/skills/feishu-sync/scripts/feishu-sync.js <prd-file.md>

# 批量同步目录
node .claude/skills/feishu-sync/scripts/feishu-sync.js --batch prd/

# 删除文档
node .claude/skills/feishu-sync/scripts/feishu-sync.js --delete doc_xxx

# 查看功能列表
node .claude/skills/feishu-sync/scripts/feishu-sync.js --list
```

**优势**：
- ✅ **2分钟内完成** - 1000+ Block 大文档 <120 秒
- ✅ **并行批量处理** - 最多 10 个请求并发，每批 50 个 Block
- ✅ **Markdown 表格 → 飞书真实表格** - 自动设置表头样式
- ✅ **Mermaid 流程图 → 飞书画板** - 自动创建节点和连线
- ✅ **支持文档编辑/删除** - 完整的生命周期管理
- ✅ **批量同步** - 一键同步整个目录
- ✅ 单次 Node.js 进程，复用 HTTPS 连接
- ✅ 自动获取 token、创建文档、写入内容、返回链接

**性能对比**：
| 场景 | 旧方式 | 新方式 | 提升 |
|------|--------|--------|------|
| 200 Block | 2 小时+ | <30 秒 | 240x |
| 500 Block | 5 小时+ | <60 秒 | 300x |
| 1000 Block | 10 小时+ | <120 秒 | 300x |

**核心优化**：
1. 并行请求（10 路并发）
2. 智能分批（50 Block/批）
3. HTTPS 连接复用
4. Token 缓存

### 前置配置

#### 1. 创建飞书应用

登录 [飞书开放平台](https://open.feishu.cn/)，创建企业自建应用，记录 `App ID` 和 `App Secret`。

#### 2. 开通权限

| 权限标识 | 说明 |
|----------|------|
| `docx:document` | 创建、读取、更新文档 |
| `sheets:spreadsheet` | 创建、读取、更新表格 |
| `whiteboard:whiteboard` | 创建、读取、更新画板 |
| `drive:drive` | 云空间文件管理 |

#### 3. 配置环境变量

```bash
FEISHU_APP_ID=cli_xxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxx
FEISHU_FOLDER_TOKEN=xxxxxxxxxxxxxxx   # 目标文件夹 Token（可选）
```

## 使用示例

**同步单个 PRD**
```bash
cd /Users/liujun/Documents/pm_agent
node .claude/skills/feishu-sync/scripts/feishu-sync.js prd/需求分析/线索中心需求分析.md
```

**批量同步整个目录**
```bash
node .claude/skills/feishu-sync/scripts/feishu-sync.js --batch prd/需求分析/
```

**删除某个文档**
```bash
node .claude/skills/feishu-sync/scripts/feishu-sync.js --delete doc_xxxxxxxxx
```

**工作流示例**
```
用户：把最新的需求分析同步到飞书
→ 检查 prd/需求分析/ 下最新 .md 文件
→ 运行: node .claude/skills/feishu-sync/scripts/feishu-sync.js <文件>
→ Markdown 表格自动转为飞书表格
→ 流程图自动转为飞书画板
→ 返回文档链接给用户
```

**特殊内容处理**：
- ✅ 表格：自动识别 `|` 开头的表格行，转为飞书表格
- ✅ 流程图：识别 ` ```mermaid ` 代码块，创建飞书画板
- ✅ 代码：保留语法高亮（Python/JavaScript/Shell 等）

## API 参考（脚本内部使用）

### 认证

```bash
POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal
```

返回 `tenant_access_token`，后续所有 API 调用携带 `Authorization: Bearer {token}`。

### 创建文档

```bash
POST /open-apis/docx/v1/documents
```

### 批量创建块

```bash
POST /open-apis/docx/v1/documents/{document_id}/blocks/{block_id}/children
```

**常用 block_type**：

| block_type | 说明 | block_type | 说明 |
|------------|------|------------|------|
| 1 | 段落 | 12 | 无序列表 |
| 2 | 一级标题 | 13 | 有序列表 |
| 3 | 二级标题 | 14 | 引用 |
| 4 | 三级标题 | 22 | 分割线 |
| | | 23 | 代码块 |
| | | 31 | 表格 |

### Markdown 转 Block 映射

| Markdown | block_type |
|----------|------------|
| `# 标题` | 2 (heading1) |
| `## 标题` | 3 (heading2) |
| `### 标题` | 4 (heading3) |
| 正文 | 1 (text) |
| `- 列表` | 12 (bullet) |
| `1. 列表` | 13 (ordered) |
| `> 引用` | 14 (quote) |
| `---` | 22 (divider) |
| `\| 表格 \|` | 31 (table) |
| `` `code` `` | 23 (code) |

### 限流

- API 限流 3次/秒，脚本内部已处理（批次间 200ms 延迟）
- 单次最多 50 个块（脚本使用 45 个/批保守值）

## 错误处理

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 0 | 成功 | - |
| 99991400 | 参数错误 | 检查请求参数 |
| 99991401 | 认证失败 | 重新获取 token |
| 99991403 | 权限不足 | 检查应用权限 |
| 99991404 | 资源不存在 | 检查 ID/Token |
| 99991429 | 频率限制 | 等待后重试 |

## 注意事项

1. **环境变量必须配置**：
   ```bash
   FEISHU_APP_ID=cli_xxx
   FEISHU_APP_SECRET=xxx
   FEISHU_FOLDER_TOKEN=fldcn_xxx  # 可选，指定目标文件夹
   ```

2. **权限配置**：
   | 权限标识 | 说明 |
   |----------|------|
   | `docx:document` | 创建、读取、更新、删除文档 |
   | `sheets:spreadsheet` | 创建、读取、更新表格 |
   | `whiteboard:whiteboard` | 创建、读取画板 |
   | `drive:drive` | 云空间文件管理 |

3. **性能提示**：
   - 超过 1000 Block 的文档可能接近限流，建议分批
   - 并发数限制为 10，防止触发飞书限流（3次/秒）

4. **特殊内容处理**：
   - **表格**：会创建独立的飞书表格，文档中保留链接
   - **画板**：流程图会创建飞书画板，文档中保留链接
   - **链接格式**：点击即可在飞书打开

5. **当前版本限制**：
   - 更新文档功能暂未实现（建议删除后重新创建）
   - 画板连线功能待完善（已支持节点创建）
