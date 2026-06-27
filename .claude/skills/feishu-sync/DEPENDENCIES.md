# 飞书同步脚本 - 依赖说明

## 运行环境要求

### Node.js 版本

- **最低版本**：Node.js 14.x
- **推荐版本**：Node.js 16.x 或更高
- **验证命令**：`node --version`

### 系统依赖

脚本仅使用 Node.js 内置模块，**无需额外安装 npm 包**：

- `fs` - 文件系统操作
- `path` - 路径处理
- `https` - HTTPS 请求
- `child_process` - 子进程（备用）

**注意**：脚本中导入了 `node-html-parser` 和 `spawn`，但当前版本未实际使用，可以安全忽略。

## 环境变量依赖

### 必需环境变量

```bash
FEISHU_APP_ID=cli_xxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxx
```

**配置方式**：

1. **方式一：.env 文件**（推荐）
   ```bash
   # 在项目根目录创建 .env 文件
   cat > .env << EOF
   FEISHU_APP_ID=cli_xxx
   FEISHU_APP_SECRET=xxx
   FEISHU_FOLDER_TOKEN=fldcn_xxx
   EOF
   
   # 加载环境变量
   source .env
   ```

2. **方式二：命令行导出**
   ```bash
   export FEISHU_APP_ID=cli_xxx
   export FEISHU_APP_SECRET=xxx
   ```

3. **方式三：直接在命令前指定**
   ```bash
   FEISHU_APP_ID=cli_xxx FEISHU_APP_SECRET=xxx node feishu-sync.js file.md
   ```

### 可选环境变量

```bash
FEISHU_FOLDER_TOKEN=fldcn_xxxxxxxxxxxx  # 目标文件夹 Token
```

如果不设置，文档将创建在飞书应用的默认文件夹。

## 飞书应用配置

### 1. 创建应用

1. 登录 [飞书开放平台](https://open.feishu.cn/)
2. 进入「开发者后台」
3. 创建「企业自建应用」
4. 记录 `App ID` 和 `App Secret`

### 2. 开通权限

在应用管理后台，为应用开通以下权限：

| 权限名称 | 权限标识 | 用途 |
|----------|----------|------|
| 文档 | `docx:document` | 创建、读取、更新、删除文档 |
| 表格 | `sheets:spreadsheet` | 创建、读取、更新表格 |
| 画板 | `whiteboard:whiteboard` | 创建、读取画板 |
| 云空间 | `drive:drive` | 文件夹管理 |

**操作步骤**：
1. 进入「权限管理」
2. 点击「添加权限」
3. 搜索并勾选上述权限
4. 提交审核（企业自建应用通常即时生效）

### 3. 获取文件夹 Token（可选）

如果要指定文档创建位置：

1. 在飞书云文档中创建目标文件夹
2. 右键文件夹 → 「获取链接」
3. 链接格式：`https://bytedance.feishu.cn/drive/folder/fldcn_xxx`
4. 提取 `fldcn_xxx` 部分作为 `FEISHU_FOLDER_TOKEN`

## 网络要求

### 出站连接

脚本需要访问以下域名：

- `open.feishu.cn` - 飞书 API
- `bytedance.feishu.cn` - 飞书文档访问（返回链接）

### 网络延迟

- **推荐延迟**：<100ms
- **可接受延迟**：<500ms
- **超时设置**：Node.js 默认超时，无需配置

### 代理配置（如需要）

如果在企业网络环境中：

```bash
# 使用环境变量配置代理
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080

# 然后运行脚本
node feishu-sync.js file.md
```

## 系统资源要求

### 内存

- **最小**：128 MB
- **推荐**：512 MB
- 大文档（2000+ Block）可能需要 1-2 GB

### CPU

- 单核即可
- 并发处理时会使用多核（最多 10 线程）

### 磁盘

- 脚本本身：<100 KB
- 临时文件：无（不生成临时文件）
- 日志输出：控制台，无文件写入

## 限流说明

### 飞书 API 限制

- **频率限制**：3次/秒
- **单次批量上限**：50 个 Block

### 脚本防护策略

- **并发数**：最多 10 个请求并发
- **批次间隔**：200ms
- **实际速率**：约 2.5次/秒（安全余量）

### 超出限流处理

如果遇到限流错误（错误码 99991429）：

1. **自动重试**：脚本会在下一批次自动重试
2. **手动调整**：减少并发数或增加延迟
   ```bash
   # 减少并发
   PARALLEL_LIMIT=5 node feishu-sync.js file.md
   
   # 增加延迟
   SLEEP_MS=500 node feishu-sync.js file.md
   ```

## 兼容性

### 操作系统

- ✅ macOS
- ✅ Linux
- ✅ Windows（WSL 或 Git Bash）
- ✅ Docker 容器

### Node.js 版本兼容性

| Node.js 版本 | 状态 | 说明 |
|--------------|------|------|
| 14.x | ✅ 支持 | 最低要求 |
| 16.x | ✅ 推荐 | 长期支持版本 |
| 18.x | ✅ 支持 | 当前版本 |
| 20.x | ✅ 支持 | 最新版本 |

### 字符编码

- **文件编码**：UTF-8（推荐）
- **特殊字符**：支持 emoji、中文、Unicode

## 验证安装

### 1. 验证 Node.js

```bash
node --version
# 应输出：v16.x.x 或更高
```

### 2. 验证脚本

```bash
# 检查文件是否存在
ls -lh .claude/skills/feishu-sync/scripts/feishu-sync.js

# 检查可执行权限
node .claude/skills/feishu-sync/scripts/feishu-sync.js --help
```

### 3. 验证环境变量

```bash
# 检查是否配置
echo $FEISHU_APP_ID
echo $FEISHU_APP_SECRET

# 应输出非空值
```

### 4. 运行测试

```bash
# 运行快速测试
bash .claude/skills/feishu-sync/scripts/test-sync.sh

# 或手动测试
node .claude/skills/feishu-sync/scripts/feishu-sync.js prd/test/飞书同步测试文档.md
```

## 故障排查

### 问题：找不到 node 命令

**解决**：
```bash
# 安装 Node.js
# macOS
brew install node

# Ubuntu/Debian
sudo apt-get install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm
```

### 问题：权限错误

**解决**：
```bash
# 检查文件权限
ls -l .claude/skills/feishu-sync/scripts/feishu-sync.js

# 添加执行权限（如果需要）
chmod +x .claude/skills/feishu-sync/scripts/feishu-sync.js
```

### 问题：环境变量未生效

**解决**：
```bash
# 确保已加载
source .env

# 或直接在命令中指定
FEISHU_APP_ID=xxx FEISHU_APP_SECRET=xxx node feishu-sync.js file.md
```

### 问题：HTTPS 证书错误

**解决**（仅开发环境）：
```bash
# 临时禁用证书验证（不推荐生产环境）
export NODE_TLS_REJECT_UNAUTHORIZED=0

# 运行脚本
node feishu-sync.js file.md
```

## 最小化部署

如果需要在受限环境中运行，可以简化配置：

```bash
# 仅需 3 个文件
- feishu-sync.js      # 脚本
- .env                # 环境变量
- test.md             # 测试文件

# 无需安装任何 npm 包
# 无需额外依赖
```

## 安全建议

1. **保护 App Secret**
   - 不要提交到 Git
   - 使用 `.env` 文件并添加到 `.gitignore`
   - 定期轮换密钥

2. **网络访问控制**
   - 限制脚本运行的服务器访问外网
   - 使用防火墙规则

3. **权限最小化**
   - 只开通必需的飞书权限
   - 定期审查应用权限

## 参考资料

- [Node.js 官方文档](https://nodejs.org/)
- [飞书开放平台](https://open.feishu.cn/)
- [飞书 API 文档](https://open.feishu.cn/document)
