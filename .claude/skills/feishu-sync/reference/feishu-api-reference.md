# 飞书开放平台 API 参考

## 认证

### 获取 Tenant Access Token

```
POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal
Content-Type: application/json

{
  "app_id": "cli_xxxx",
  "app_secret": "xxxx"
}

Response:
{
  "code": 0,
  "tenant_access_token": "t-xxxx",
  "expire": 7200
}
```

所有后续请求需在 Header 中携带：
```
Authorization: Bearer {tenant_access_token}
```

## 云文档 API

### 创建文档

```
POST https://open.feishu.cn/open-apis/docx/v1/documents
Content-Type: application/json
Authorization: Bearer {token}

{
  "folder_token": "fldcnxxxx",
  "title": "文档标题"
}

Response:
{
  "code": 0,
  "data": {
    "document": {
      "document_id": "doxcnxxxx",
      "revision_id": 1
    }
  }
}
```

### 获取文档块列表

```
GET https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}/blocks?document_revision_id=-1
Authorization: Bearer {token}
```

### 批量创建子块

```
POST https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}/blocks/{block_id}/children
Content-Type: application/json
Authorization: Bearer {token}

{
  "children": [
    {
      "block_type": 2,
      "text": {
        "elements": [
          { "text_run": { "content": "Hello World" } }
        ]
      }
    }
  ],
  "position": "at_end"
}

Response:
{
  "code": 0,
  "data": {
    "children": [
      { "block_id": "xxxx" }
    ]
  }
}
```

### 更新块内容

```
POST https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}/blocks/{block_id}/children
Content-Type: application/json

{
  "children": [...],
  "position": "before",
  "sibling_block_id": "xxxx"
}
```

### 删除块

```
DELETE https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}/blocks/{block_id}
Authorization: Bearer {token}
```

## 块类型对照

| block_type | 名称 | 说明 |
|------------|------|------|
| 1 | Page | 页面根块 |
| 2 | Text | 普通文本/段落 |
| 3 | Heading1 | 一级标题 |
| 4 | Heading2 | 二级标题 |
| 5 | Heading3 | 三级标题 |
| 6 | Heading4 | 四级标题 |
| 7 | Heading5 | 五级标题 |
| 8 | Heading6 | 六价标题 |
| 11 | Bullet | 无序列表 |
| 12 | Ordered | 有序列表 |
| 13 | Code | 代码块 |
| 14 | Quote | 引用块 |
| 18 | Table | 表格 |
| 19 | TableCell | 表格单元格 |
| 22 | Divider | 分割线 |
| 27 | Image | 图片 |
| 31 | Iframe | 嵌入式内容 |

## 文本元素样式

```json
{
  "text_run": {
    "content": "文本内容",
    "text_element_style": {
      "bold": true,
      "italic": false,
      "strikethrough": false,
      "inline_code": false
    }
  }
}
```

## 表格块结构

### 创建表格

表格通过批量创建子块实现，结构如下：

```
Page (根块)
  └── Table (block_type: 18)
        ├── TableCell (19, cell_name: "0_0")
        │     └── Text (2, paragraph)
        ├── TableCell (19, cell_name: "0_1")
        │     └── Text (2, paragraph)
        ├── TableCell (19, cell_name: "1_0")
        │     └── Text (2, paragraph)
        └── ...
```

### 创建步骤

1. **先创建 Table 块**：

```json
{
  "block_type": 18,
  "table": {
    "cells": [],
    "property": {
      "row_size": 3,
      "column_size": 3,
      "column_width": [200, 200, 200],
      "merge_info": []
    }
  }
}
```

2. **再为 Table 创建 TableCell 子块**：

```json
{
  "block_type": 19,
  "table_cell": {
    "cell_name": "0_0",
    "child_blocks": [
      {
        "block_type": 2,
        "text": {
          "elements": [
            { "text_run": { "content": "单元格内容" } }
          ]
        }
      }
    ]
  }
}
```

### 表格合并单元格

`merge_info` 数组，每个元素对应一个合并区域：

```json
"merge_info": [
  { "row_index": 0, "col_index": 0, "row_span": 1, "col_span": 2 }
]
```

## 图片上传

> 注意：往 docx 文档插入图片**不能**用 `/im/v1/images`（IM 图片接口，仅支持
> `image_type=message/avatar`，传 `docx_image` 会返回 234001）。文档图片必须走
> 云文档素材接口，分三步完成。

### 1. 创建空的图片块（block_type 27，不传 token）

`token` 是只读字段，创建时传 token 会返回 1770001（invalid param）。只传宽高：

```
POST https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}/blocks/{parent_block_id}/children
Authorization: Bearer {token}

{
  "children": [
    { "block_type": 27, "image": { "width": 800, "height": 400 } }
  ],
  "position": "at_end"
}
```

响应中的 `children[0].block_id` 即图片块 id。

### 2. 上传素材（parent_node 必须为图片块 id）

`parent_node` 必须是**图片块 id**（不是文档 id）；用文档 id 会导致下一步
`replace_image` 返回 1770013（relation mismatch）。

```
POST https://open.feishu.cn/open-apis/drive/v1/medias/upload_all
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form:
  file_name:   "diagram.png"
  parent_type:  "docx_image"
  parent_node:  "{图片块 block_id}"
  size:         1239
  file:         (binary)
```

响应：`{ "code": 0, "data": { "file_token": "xxxx" } }`

### 3. 替换图片（replace_image 写入 token）

```
PATCH https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}/blocks/{图片块 block_id}
Authorization: Bearer {token}

{ "replace_image": { "token": "{file_token}" } }
```

所需权限：`drive:drive` 或 `docs:document.media:upload`（非 `im:resource`）。

## 画板 (MindNote) API

### 创建画板

```
POST https://open.feishu.cn/open-apis/sheets/v2/spreadsheets
Content-Type: application/json

{
  "folder_token": "fldcnxxxx",
  "title": "画板标题"
}
```

### 画板中插入内容

通过画板的 block API 写入内容，支持：
- 文本框
- 图片
- 连接线
- 便签

## 速率限制

- 获取 Token：50 次/分钟
- 创建文档：50 次/分钟
- 批量创建块：50 次/分钟，单次最多 20 个子块
- 上传文件：20 次/分钟

## 错误码

| 错误码 | 说明 | 处理 |
|--------|------|------|
| 0 | 成功 | - |
| 99991400 | 请求参数错误 | 检查参数格式 |
| 99991401 | 认证失败 | 重新获取 Token |
| 99991403 | 权限不足 | 检查应用权限 |
| 99991429 | 频率限制 | 等待后重试 |
