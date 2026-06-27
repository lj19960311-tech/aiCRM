# 飞书 API 调用参考

## API 基础信息

### 域名

```
https://open.feishu.cn/open-apis/
```

### 认证方式

```bash
POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal

{
  "app_id": "cli_xxx",
  "app_secret": "xxx"
}
```

返回 `tenant_access_token`（有效期 7200 秒），后续调用携带 `Authorization: Bearer {token}`。

---

## 文档（Docx）API

### 创建文档

```bash
POST /open-apis/docx/v1/documents

{
  "title": "文档标题",
  "folder_token": "fldcn_xxx"
}
```

### 创建块（写入内容）

```bash
POST /open-apis/docx/v1/documents/{document_id}/blocks/{block_id}/children

{
  "children": [
    {
      "block_type": 1,
      "text": {
        "elements": [{
          "text_run": {
            "content": "正文内容",
            "text_element_style": { "bold": false }
          }
        }]
      }
    }
  ]
}
```

### 更新块

```bash
PATCH /open-apis/docx/v1/documents/{document_id}/blocks/{block_id}

{
  "text": {
    "elements": [{
      "text_run": { "content": "新内容" }
    }]
  }
}
```

### 删除块

```bash
DELETE /open-apis/docx/v1/documents/{document_id}/blocks/{block_id}
```

### 行内样式

`text_element_style` 支持：

| 字段 | 类型 | 说明 |
|------|------|------|
| `bold` | boolean | 粗体 |
| `italic` | boolean | 斜体 |
| `strikethrough` | boolean | 删除线 |
| `underline` | boolean | 下划线 |
| `link` | object | `{ url: "https://..." }` 超链接 |

---

## 表格（Sheet）API

### 创建表格

```bash
POST /open-apis/sheets/v2/spreadsheets

{
  "title": "表格标题",
  "folder_token": "fldcn_xxx"
}
```

### 写入数据

```bash
PUT /open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values

{
  "valueRange": {
    "range": "'Sheet1'!A1:C3",
    "values": [
      ["姓名", "部门", "职位"],
      ["张三", "技术部", "工程师"],
      ["李四", "产品部", "经理"]
    ]
  }
}
```

### 读取数据

```bash
GET /open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/values?range='Sheet1'!A1:Z100
```

### 创建新工作表

```bash
POST /open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/sheets

{
  "sheet": {
    "title": "新功能表",
    "index": 1
  }
}
```

### 设置单元格样式

```bash
POST /open-apis/sheets/v2/spreadsheets/{spreadsheet_token}/ranges/style

{
  "style": {
    "range": "'Sheet1'!A1:D1",
    "style": {
      "foregroundColor": "#FF6B00",
      "bold": true
    }
  }
}
```

---

## 画板（Board）API

### 创建画板

```bash
POST /open-apis/board/v1/boards

{
  "title": "画板标题",
  "folder_token": "fldcn_xxx"
}
```

### 添加节点

```bash
POST /open-apis/board/v1/boards/{board_token}/nodes

{
  "nodes": [
    {
      "node_type": "text",
      "position": { "x": 100, "y": 100 },
      "size": { "width": 200, "height": 60 },
      "content": "节点文本"
    }
  ]
}
```

### 添加连线

```bash
POST /open-apis/board/v1/boards/{board_token}/edges

{
  "edges": [
    {
      "edge_type": "line",
      "start_node_id": "node_xxx",
      "end_node_id": "node_yyy",
      "start_side": "bottom",
      "end_side": "top"
    }
  ]
}
```

### 节点类型参考

| node_type | 说明 |
|-----------|------|
| `text` | 文本框 |
| `rectangle` | 矩形 |
| `ellipse` | 椭圆 |
| `diamond` | 菱形 |
| `line` | 连线 |
| `arrow` | 箭头 |
| `stick_note` | 便签 |

---

## 完整同步流程

```
1. 获取 tenant_access_token
2. 根据类型创建对应文档（Docx/Sheet/Board）
3. 解析本地内容并写入
4. 返回飞书链接
```

**限流**：3次/秒，建议每次写入后 `sleep 0.5`
**单次上限**：文档单次最多 50 个块

---

## 错误码

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 0 | 成功 | - |
| 99991400 | 参数错误 | 检查请求参数 |
| 99991401 | 认证失败 | 重新获取 token |
| 99991403 | 权限不足 | 检查应用权限 |
| 99991404 | 资源不存在 | 检查 ID/Token |
| 99991429 | 频率限制 | 等待后重试 |

---

## 参考链接

- [文档 API](https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/docx-overview)
- [表格 API](https://open.feishu.cn/document/server-docs/docs/sheets-v2)
- [画板 API](https://open.feishu.cn/document/server-docs/docs/board-v1/overview)
