# 飞书同步脚本 - 问题排查指南

遇到问题？按照以下步骤排查和解决。

## 目录

1. [认证问题](#认证问题)
2. [同步失败](#同步失败)
3. [性能问题](#性能问题)
4. [内容转换问题](#内容转换问题)
5. [环境问题](#环境问题)
6. [其他问题](#其他问题)

## 认证问题

### 问题：`缺少环境变量 FEISHU_APP_ID 或 FEISHU_APP_SECRET`

**原因**：未配置飞书应用的 App ID 或 App Secret

**解决**：

```bash
# 检查环境变量
echo $FEISHU_APP_ID
echo $FEISHU_APP_SECRET

# 如果为空，配置环境变量
export FEISHU_APP_ID=cli_xxx
export FEISHU_APP_SECRET=xxx

# 或使用 .env 文件
cat > .env << EOF
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
EOF
source .env
```

### 问题：`获取 token 失败`

**原因**：
1. App ID 或 App Secret 错误
2. 应用未开通权限
3. 网络连接问题

**解决**：

```bash
# 1. 验证 App ID 格式
if [[ ! "$FEISHU_APP_ID" =~ ^cli_ ]]; then
  echo "❌ App ID 格式错误，应以 cli_ 开头"
fi

# 2. 手动测试 token 获取
curl -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": \"$FEISHU_APP_ID\",
    \"app_secret\": \"$FEISHU_APP_SECRET\"
  }"

# 3. 检查返回结果
# 正常应返回：{"code":0,"msg":"ok","tenant_access_token":"t-cafebabe"}
```

**检查清单**：
- [ ] App ID 和 App Secret 正确
- [ ] 应用已开通 `docx`、`sheets`、`whiteboard` 权限
- [ ] 网络可以访问 `open.feishu.cn`

### 问题：`认证失败` 或 `权限不足`

**原因**：
1. Token 过期
2. 应用权限不足
3. API 调用错误

**解决**：

```bash
# 1. 重新获取 token（脚本会自动处理）

# 2. 检查应用权限
# 登录飞书开放平台 → 应用管理 → 权限管理
# 确保已开通：
# - docx:document
# - sheets:spreadsheet
# - whiteboard:whiteboard
# - drive:drive

# 3. 检查 API 调用权限
# 某些 API 可能需要额外权限
```

## 同步失败

### 问题：`创建文档失败`

**原因**：
1. Token 无效
2. 文件夹 Token 错误（如果指定了）
3. 飞书服务异常

**解决**：

```bash
# 1. 检查 Token
node scripts/feishu-sync.js --help

# 2. 不指定文件夹，使用默认位置
unset FEISHU_FOLDER_TOKEN
node scripts/feishu-sync.js file.md

# 3. 检查文件夹 Token 格式
# 应为 fldcn_xxx 格式
echo $FEISHU_FOLDER_TOKEN
```

### 问题：`创建块失败`

**原因**：
1. Block 格式错误
2. 单次请求超过 50 个 Block
3. 父 Block ID 错误

**解决**：

```bash
# 1. 减少并发数
PARALLEL_LIMIT=1 node scripts/feishu-sync.js file.md

# 2. 增加延迟
SLEEP_MS=500 node scripts/feishu-sync.js file.md

# 3. 检查文档内容
# 可能包含不支持的 Markdown 元素
head -50 file.md
```

### 问题：`网络请求失败` 或 `ETIMEDOUT`

**原因**：
1. 网络连接问题
2. 防火墙限制
3. 代理配置问题

**解决**：

```bash
# 1. 检查网络连接
ping open.feishu.cn

# 2. 检查代理配置
echo $HTTPS_PROXY
echo $HTTP_PROXY

# 3. 如果使用代理，确保配置正确
export HTTPS_PROXY=http://proxy.company.com:8080

# 4. 测试 HTTPS 连接
curl -I https://open.feishu.cn
```

## 性能问题

### 问题：同步耗时超过 2 分钟

**正常耗时参考**：
- 100 Block：<10秒
- 500 Block：<45秒
- 1000 Block：<90秒
- 2000 Block：<120秒

**排查步骤**：

```bash
# 1. 检查文档大小
wc -l file.md
node -e "console.log(require('fs').readFileSync('file.md', 'utf-8').split('\n').length)"

# 2. 检查网络延迟
ping open.feishu.cn
curl -w "@curl-format.txt" -o /dev/null -s "https://open.feishu.cn"

# 3. 减少并发测试
PARALLEL_LIMIT=5 node scripts/feishu-sync.js file.md

# 4. 增加日志输出
# 在脚本中添加 console.log 调试
```

**优化建议**：
- [ ] 检查网络连接质量
- [ ] 减少并发数（如果网络不稳定）
- [ ] 拆分大文档
- [ ] 避开网络高峰时段

### 问题：遇到限流（`99991429`）

**原因**：超过飞书 API 限流（3次/秒）

**解决**：

```bash
# 1. 增加延迟
SLEEP_MS=500 node scripts/feishu-sync.js file.md

# 2. 减少并发
PARALLEL_LIMIT=5 node scripts/feishu-sync.js file.md

# 3. 等待后重试
# 限流通常在 10-30 秒后自动解除
sleep 30
node scripts/feishu-sync.js file.md
```

## 内容转换问题

### 问题：表格没有转换为飞书表格

**原因**：
1. 表格格式不符合标准
2. 表格创建失败

**解决**：

```bash
# 1. 检查表格格式
# 正确格式：
# | 表头1 | 表头2 |
# |-------|-------|
# | 数据1 | 数据2 |

# 2. 验证表格行
grep "^\|" file.md | head -5

# 3. 简化表格测试
cat > test-table.md << EOF
# 测试表格

| 功能 | 优先级 |
|------|--------|
| 录入 | P0 |
| 分配 | P0 |
EOF

node scripts/feishu-sync.js test-table.md
```

**检查清单**：
- [ ] 第一行是表头
- [ ] 第二行是分隔符（|---|）
- [ ] 数据行对齐
- [ ] 没有空行打断表格

### 问题：流程图没有转为画板

**原因**：
1. Mermaid 语法错误
2. 画板创建失败

**解决**：

```bash
# 1. 检查 Mermaid 语法
# 正确格式：
# ```mermaid
# graph LR
#     A[节点1] --> B[节点2]
# ```

# 2. 简化测试
cat > test-mermaid.md << EOF
# 测试流程图

\`\`\`mermaid
graph LR
    A[开始] --> B[结束]
\`\`\`
EOF

node scripts/feishu-sync.js test-mermaid.md
```

**注意**：当前版本画板功能为简化实现，复杂的 Mermaid 语法可能不支持。

### 问题：代码块没有语法高亮

**原因**：
1. 语言标识错误
2. 飞书不支持该语言

**解决**：

```bash
# 1. 检查语言标识
# 支持的语言：javascript, python, bash, java, go, etc.

# 2. 正确格式：
# ```javascript
# console.log('hello')
# ```

# 3. 测试
cat > test-code.md << EOF
# 测试代码块

\`\`\`javascript
console.log('hello')
\`\`\`
EOF

node scripts/feishu-sync.js test-code.md
```

### 问题：格式错乱（标题、列表等）

**原因**：
1. Markdown 语法错误
2. 脚本解析问题

**解决**：

```bash
# 1. 验证 Markdown 语法
# 使用在线 Markdown 预览工具验证

# 2. 简化测试
# 逐步添加内容，定位问题

# 3. 检查特殊字符
# 某些特殊字符可能导致解析错误
cat -A file.md | grep -E '[\x00-\x1F\x7F]'
```

## 环境问题

### 问题：`node: command not found`

**原因**：未安装 Node.js

**解决**：

```bash
# macOS
brew install node

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm

# 验证安装
node --version
npm --version
```

### 问题：`Cannot find module 'xxx'`

**原因**：脚本引用了不存在的模块

**解决**：

```bash
# 1. 检查脚本中的 import/require
grep -n "require\|import" scripts/feishu-sync.js

# 2. 当前版本应只使用 Node.js 内置模块
# 如有第三方模块依赖，需安装：
# npm install <module-name>

# 3. 或移除未使用的 import
# 脚本中导入的 node-html-parser 和 spawn 当前未使用
```

### 问题：`EACCES` 权限错误

**原因**：文件权限不足

**解决**：

```bash
# 1. 检查文件权限
ls -l scripts/feishu-sync.js

# 2. 添加执行权限
chmod +x scripts/feishu-sync.js

# 3. 检查目录权限
ls -ld .
```

## 其他问题

### 问题：脚本运行无输出

**原因**：
1. 脚本卡住
2. 输出被重定向

**解决**：

```bash
# 1. 检查进程
ps aux | grep feishu-sync

# 2. 添加调试输出
# 在脚本开头添加：
# console.log('Script started')

# 3. 检查是否静默失败
node scripts/feishu-sync.js file.md 2>&1 | tee debug.log
```

### 问题：中文乱码

**原因**：文件编码问题

**解决**：

```bash
# 1. 检查文件编码
file -I file.md

# 2. 转换为 UTF-8
iconv -f GBK -t UTF-8 file.md > file-utf8.md
node scripts/feishu-sync.js file-utf8.md

# 3. 确保终端支持 UTF-8
echo $LANG  # 应为 en_US.UTF-8 或 zh_CN.UTF-8
```

### 问题：如何查看详细错误信息？

**方法**：

```bash
# 1. 查看完整错误堆栈
node scripts/feishu-sync.js file.md 2>&1

# 2. 保存到文件
node scripts/feishu-sync.js file.md 2>&1 | tee error.log

# 3. 在脚本中添加 try-catch
# 已在脚本中添加，会输出完整错误信息
```

## 收集诊断信息

遇到无法解决的问题时，收集以下信息：

```bash
# 1. 环境信息
node --version
uname -a
echo $FEISHU_APP_ID | head -c 10

# 2. 脚本版本
head -5 scripts/feishu-sync.js

# 3. 错误日志
node scripts/feishu-sync.js file.md 2>&1 | tail -50

# 4. 网络诊断
ping -c 4 open.feishu.cn
curl -I https://open.feishu.cn

# 5. 文档信息
wc -l file.md
head -20 file.md
```

将以上信息提供给技术支持。

## 获取更多帮助

1. **查看文档**：
   - [README.md](./README.md) - 快速开始
   - [USAGE.md](./USAGE.md) - 详细使用
   - [EXAMPLES.md](./EXAMPLES.md) - 使用示例

2. **运行测试**：
   ```bash
   bash scripts/test-sync.sh
   ```

3. **提交 Issue**：
   - 提供完整的错误信息
   - 提供复现步骤
   - 提供诊断信息

4. **联系维护者**：
   - 通过项目渠道联系

---

**问题仍未解决？** 请提交 Issue 并附上完整的诊断信息。
