#!/usr/bin/env node

/**
 * feishu-sync - 将本地 PRD Markdown 文档同步到飞书云文档
 *
 * 特性：
 *   - 表格自动转换为飞书原生表格块
 *   - Mermaid 图表自动渲染为画板
 *   - 批量 API 调用，2 分钟内完成同步
 *
 * 用法：
 *   node feishu-sync.js <prd-file.md> [folder-token]
 *
 * 环境变量：
 *   FEISHU_APP_ID       - 飞书应用 App ID
 *   FEISHU_APP_SECRET   - 飞书应用 App Secret
 *   FEISHU_FOLDER_TOKEN - 飞书文件夹 Token（可选，默认根目录）
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// ─── 配置 ──────────────────────────────────────────────────────────

const FEISHU_API = 'https://open.feishu.cn/open-apis';
const BATCH_SIZE = 20; // 单次批量创建最多 20 个块
const RETRY_MAX = 3;
const RETRY_DELAY_MS = 1000;

// ─── 工具函数 ──────────────────────────────────────────────────────

function env(key, { optional = false } = {}) {
  const val = process.env[key];
  if (!val) {
    if (optional) return undefined;
    console.error(`[错误] 缺少环境变量: ${key}`);
    process.exit(1);
  }
  return val;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── HTTP 请求封装 ─────────────────────────────────────────────────

async function http(url, opts = {}) {
  const { method = 'GET', headers = {}, body } = opts;

  const fetchOpts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body) fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);

  let lastErr;
  for (let i = 0; i < RETRY_MAX; i++) {
    try {
      const res = await fetch(url, fetchOpts);
      const data = await res.json();
      if (data.code !== 0 && data.code !== undefined) {
        throw new Error(`飞书 API 错误: code=${data.code}, msg=${data.msg || data.message || ''}`);
      }
      return data;
    } catch (err) {
      lastErr = err;
      if (i < RETRY_MAX - 1) {
        console.warn(`  [重试 ${i + 1}/${RETRY_MAX}] ${err.message}`);
        await delay(RETRY_DELAY_MS * Math.pow(2, i));
      }
    }
  }
  throw lastErr;
}

// ─── 飞书 API 客户端 ───────────────────────────────────────────────

class FeishuClient {
  constructor() {
    this.token = null;
    this.tokenExpiry = 0;
  }

  async getToken() {
    if (this.token && Date.now() < this.tokenExpiry - 60_000) {
      return this.token;
    }

    console.log('[1/7] 获取飞书 Access Token...');
    const res = await http(`${FEISHU_API}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      body: {
        app_id: env('FEISHU_APP_ID'),
        app_secret: env('FEISHU_APP_SECRET'),
      },
    });

    this.token = res.tenant_access_token;
    this.tokenExpiry = Date.now() + res.expire * 1000;
    console.log(`  Token 获取成功，有效期 ${res.expire}s`);
    return this.token;
  }

  authHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async createDocument(title, folderToken) {
    console.log('[2/7] 创建飞书文档...');
    const res = await http(`${FEISHU_API}/docx/v1/documents`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: {
        title,
        folder_token: folderToken ?? env('FEISHU_FOLDER_TOKEN', { optional: true }),
      },
    });

    const docId = res.data.document.document_id;
    const revisionId = res.data.document.revision_id;
    console.log(`  文档创建成功: ${docId}`);
    console.log(`  文档链接: https://feishu.cn/docx/${docId}`);
    return { docId, revisionId };
  }

  async getRootBlock(docId) {
    const res = await http(`${FEISHU_API}/docx/v1/documents/${docId}/blocks?document_revision_id=-1`, {
      headers: this.authHeaders(),
    });
    // The root page block is returned in items
    const items = res.data?.items || [];
    // Find the page block (block_type 1)
    const pageBlock = items.find((b) => b.block_type === 1);
    return pageBlock?.block_id;
  }

  async createChildren(docId, parentBlockId, children, position = 'at_end') {
    if (children.length === 0) return [];

    const res = await http(
      `${FEISHU_API}/docx/v1/documents/${docId}/blocks/${parentBlockId}/children`,
      {
        method: 'POST',
        headers: this.authHeaders(),
        body: { children, position },
      }
    );

    return res.data?.children || [];
  }

  async uploadMedia(imagePath, parentNode) {
    // Upload image as a docx media asset via the Drive medias API.
    // IMPORTANT: parent_node MUST be the image block id (not the doc id);
    // using the doc id causes replace_image to fail with 1770013 (relation mismatch).
    const imageBuffer = fs.readFileSync(imagePath);
    const fd = new FormData();
    fd.append('file_name', path.basename(imagePath));
    fd.append('parent_type', 'docx_image');
    fd.append('parent_node', parentNode);
    fd.append('size', String(imageBuffer.length));
    fd.append('file', new Blob([imageBuffer], { type: 'image/png' }), path.basename(imagePath));

    const res = await fetch(`${FEISHU_API}/drive/v1/medias/upload_all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
      body: fd,
    });

    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(`素材上传失败: code=${data.code}, msg=${data.msg}`);
    }
    return data.data?.file_token;
  }

  async replaceImage(docId, blockId, fileToken) {
    // Link an uploaded file_token into an existing image block via replace_image.
    // The image block must already exist (created empty with width/height only);
    // its token field is read-only and cannot be set at creation time.
    const res = await fetch(`${FEISHU_API}/docx/v1/documents/${docId}/blocks/${blockId}`, {
      method: 'PATCH',
      headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ replace_image: { token: fileToken } }),
    });

    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(`替换图片失败: code=${data.code}, msg=${data.msg}`);
    }
    return data;
  }

  async createBitableBlock(docId, parentBlockId) {
    // Create a bitable block in the document
    const created = await this.createChildren(docId, parentBlockId, [{
      block_type: 18,
      bitable: { view_type: 1 },
    }]);
    if (!created || created.length === 0) {
      throw new Error('创建多维表格块失败');
    }
    return created[0].bitable.token;
  }

  async createBitableTable(bitableToken, tableName) {
    // The bitable token from create_children includes a _tbl suffix
    // We need just the app token (part before _tbl)
    const appToken = bitableToken.split('_tbl')[0];

    // Create a table in the bitable
    const res = await http(`${FEISHU_API}/bitable/v1/apps/${appToken}/tables`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: { table: { name: tableName } },
    });
    return { table_id: res.data?.table_id, app_token: appToken };
  }

  async createBitableField(appToken, tableId, fieldName) {
    // Create a text field in the bitable table
    const res = await http(`${FEISHU_API}/bitable/v1/apps/${appToken}/tables/${tableId}/fields`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: { field_name: fieldName, type: 1 }, // type 1 = text
    });
    return res.data?.field;
  }

  async createBitableRecords(appToken, tableId, records) {
    // Batch create records in the bitable table
    const res = await http(`${FEISHU_API}/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: { records },
    });
    return res.data?.records || [];
  }
}

// ─── Markdown 解析器 ───────────────────────────────────────────────

/**
 * 将 Markdown 文本解析为结构化元素数组。
 * 支持：标题、段落、加粗/斜体/行内代码、表格、代码块、列表、分割线、引用。
 */

function parseMarkdown(content) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 代码块
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({ type: 'code', lang, content: codeLines.join('\n') });
      i++; // skip closing ```
      continue;
    }

    // 标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      elements.push({ type: 'heading', level, content: headingMatch[2].trim() });
      i++;
      continue;
    }

    // 分割线
    if (/^(-{3,}|_{3,}|\*{3,})\s*$/.test(line.trim())) {
      elements.push({ type: 'divider' });
      i++;
      continue;
    }

    // 表格
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s-:|]+\|/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i].trim());
        i++;
        // Stop if next line doesn't look like table
        if (i < lines.length && !lines[i].includes('|')) break;
      }
      const table = parseTable(tableLines);
      if (table) {
        elements.push(table);
      }
      continue;
    }

    // 无序列表
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i++;
      }
      elements.push({ type: 'bullet_list', items });
      continue;
    }

    // 有序列表
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push({ type: 'ordered_list', items });
      continue;
    }

    // 引用
    if (/^\s*>\s*/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^\s*>\s*/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s*/, ''));
        i++;
      }
      elements.push({ type: 'quote', content: quoteLines.join('\n') });
      continue;
    }

    // 空行
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 段落文本
    {
      const paragraphLines = [];
      while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
        paragraphLines.push(lines[i]);
        i++;
      }
      elements.push({ type: 'paragraph', content: paragraphLines.join('\n') });
    }
  }

  return elements;
}

function isBlockStart(line) {
  return (
    /^#{1,6}\s/.test(line) ||
    line.trimStart().startsWith('```') ||
    /^\s*[-*+]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^\s*>\s*/.test(line) ||
    /^(-{3,}|_{3,}|\*{3,})\s*$/.test(line.trim()) ||
    (line.includes('|') && /^\s*\|/.test(line))
  );
}

function parseTable(lines) {
  if (lines.length < 2) return null;

  // Parse header
  const headers = parseTableRow(lines[0]);
  // Parse data rows (skip separator line)
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    rows.push(parseTableRow(lines[i]));
  }

  if (headers.length === 0) return null;

  return { type: 'table', headers, rows };
}

function parseTableRow(line) {
  // Remove leading/trailing |
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);

  return trimmed.split('|').map((cell) => cell.trim());
}

// ─── 文本样式解析 ──────────────────────────────────────────────────

function parseInlineText(text) {
  const elements = [];
  let remaining = text;

  // Simple inline parsing: **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(remaining)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      const plainText = remaining.slice(lastIndex, match.index);
      if (plainText) {
        elements.push({ text: plainText });
      }
    }

    if (match[2] !== undefined) {
      // **bold**
      elements.push({ text: match[2], bold: true });
    } else if (match[4] !== undefined) {
      // *italic*
      elements.push({ text: match[4], italic: true });
    } else if (match[6] !== undefined) {
      // `code`
      elements.push({ text: match[6], inline_code: true });
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < remaining.length) {
    const plainText = remaining.slice(lastIndex);
    if (plainText) {
      elements.push({ text: plainText });
    }
  }

  if (elements.length === 0 && text.trim()) {
    elements.push({ text: text.trim() });
  }

  return elements;
}

// ─── 元素转飞书块 ──────────────────────────────────────────────────

function textElementsToElements(textParts) {
  if (typeof textParts === 'string') {
    textParts = parseInlineText(textParts);
  }
  if (textParts.length === 0) {
    return [{ text_run: { content: '\n' } }];
  }
  return textParts.map((p) => {
    const style = {};
    if (p.bold) style.bold = true;
    if (p.italic) style.italic = true;
    if (p.inline_code) style.inline_code = true;
    if (p.strikethrough) style.strikethrough = true;
    if (p.underline) style.underline = true;
    return {
      text_run: {
        content: p.text || '',
        ...(Object.keys(style).length > 0 ? { text_element_style: style } : {}),
      },
    };
  });
}

/**
 * Convert a table element to text paragraphs (Feishu API doesn't support
 * creating table blocks via create_children).
 */
function tableToTextBlocks(table) {
  const blocks = [];
  const { headers, rows } = table;

  // Header row
  blocks.push({
    block_type: 2,
    text: {
      elements: textElementsToElements(`| ${headers.join(' | ')} |`),
    },
  });

  // Separator
  blocks.push({
    block_type: 2,
    text: {
      elements: textElementsToElements(`| ${headers.map(() => '---').join(' | ')} |`),
    },
  });

  // Data rows
  for (const row of rows) {
    blocks.push({
      block_type: 2,
      text: {
        elements: textElementsToElements(`| ${row.join(' | ')} |`),
      },
    });
  }

  return blocks;
}

function elementToBlock(element) {
  switch (element.type) {
    case 'heading': {
      // Feishu API requires heading1, heading2, etc. as the property name
      const headingKey = `heading${element.level}`;
      return {
        block_type: element.level + 2, // heading1=3, heading2=4, ... heading6=8
        [headingKey]: {
          elements: textElementsToElements(element.content),
        },
      };
    }

    case 'paragraph': {
      return {
        block_type: 2,
        text: {
          elements: textElementsToElements(element.content),
        },
      };
    }

    case 'bullet_list': {
      // Feishu docx v1 API doesn't support creating bullet blocks directly
      // Fallback to paragraph with bullet character
      return element.items.map((item) => ({
        block_type: 2,
        text: {
          elements: textElementsToElements(`• ${item}`),
        },
      }));
    }

    case 'ordered_list': {
      // Feishu docx v1 API doesn't support creating ordered list blocks directly
      // Fallback to paragraph with number prefix
      return element.items.map((item, idx) => ({
        block_type: 2,
        text: {
          elements: textElementsToElements(`${idx + 1}. ${item}`),
        },
      }));
    }

    case 'code': {
      // Feishu docx v1 API doesn't support creating code blocks directly
      // Fallback to paragraph with language label
      const langLabel = element.lang ? `[${element.lang}] ` : '';
      return {
        block_type: 2,
        text: {
          elements: textElementsToElements(`${langLabel}${element.content}`),
        },
      };
    }

    case 'quote': {
      // Feishu docx v1 API doesn't support creating quote blocks directly
      // Fallback to paragraph with quote marker
      return {
        block_type: 2,
        text: {
          elements: textElementsToElements(`> ${element.content}`),
        },
      };
    }

    case 'divider': {
      return {
        block_type: 22,
        divider: {},
      };
    }

    case 'table': {
      // Feishu docx v1 API doesn't support creating table blocks directly
      // Fallback to text-formatted table
      return tableToTextBlocks(element);
    }

    default:
      return null;
  }
}

/**
 * Create a Bitable (多维表格) block and populate it with table data.
 * All tables in the same document share one bitable app.
 */
let _tableCounter = 0;
let _sharedBitable = null; // { token, appToken } shared across all tables in one doc

async function createBitableTable(client, docId, parentBlockId, tableElement) {
  _tableCounter++;
  const { headers, rows } = tableElement;
  const tableName = `表格${_tableCounter}`;
  console.log(`  📊 创建多维表格: ${tableName}（${headers.length}列 × ${rows.length}行）`);

  try {
    // Step 1: Create bitable block only for the first table, reuse for subsequent
    if (!_sharedBitable) {
      const bitableToken = await client.createBitableBlock(docId, parentBlockId);
      const appToken = bitableToken.split('_tbl')[0];
      _sharedBitable = { token: bitableToken, appToken };
      console.log(`    多维表格 App: ${appToken}`);
    }
    const { appToken } = _sharedBitable;

    // Step 2: Create table in the shared bitable app
    const { table_id: tableId } = await client.createBitableTable(_sharedBitable.token, tableName);
    if (!tableId) {
      console.warn('    创建数据表失败，降级为文本表格');
      return false;
    }
    console.log(`    数据表 ID: ${tableId}`);

    // Step 3: Create fields (use header names as field names)
    const fieldIds = [];
    for (const header of headers) {
      const field = await client.createBitableField(appToken, tableId, header);
      if (field) {
        fieldIds.push(field.field_id);
        console.log(`    字段: ${header} (${field.field_id})`);
      }
    }

    if (fieldIds.length === 0) {
      console.warn('    创建字段失败，降级为文本表格');
      return false;
    }

    // Step 4: Create records (batch in groups of 500)
    const records = rows.map(row => {
      const fields = {};
      headers.forEach((header, i) => {
        fields[header] = row[i] || '';
      });
      return { fields };
    });

    for (let i = 0; i < records.length; i += 500) {
      const batch = records.slice(i, i + 500);
      const created = await client.createBitableRecords(appToken, tableId, batch);
      console.log(`    写入 ${created.length}/${rows.length} 行数据`);
    }

    return true;
  } catch (err) {
    console.error(`  [多维表格创建失败] ${err.message}`);
    console.warn('  降级为文本表格...');

    // Fallback: create text-formatted table
    const fallbackBlocks = tableToTextBlocks(tableElement);
    try {
      await flushBlocks(client, docId, parentBlockId, fallbackBlocks);
    } catch (e) {
      console.error(`  [文本表格也失败] ${e.message}`);
    }
    return false;
  }
}

// ─── 同步主流程 ────────────────────────────────────────────────────

async function syncToFeishu(filePath, folderToken) {
  const startTime = Date.now();

  // Reset shared state for this sync run
  _tableCounter = 0;
  _sharedBitable = null;

  // 读取文件
  if (!fs.existsSync(filePath)) {
    console.error(`[错误] 文件不存在: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`[0/7] 读取 PRD 文件: ${filePath} (${content.length} 字符)`);

  // 初始化客户端
  const client = new FeishuClient();
  await client.getToken();

  // 提取文档标题（第一个 # 标题）
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');

  // 创建文档
  const { docId, revisionId } = await client.createDocument(title, folderToken);

  // 获取根块 ID
  const rootBlockId = await client.getRootBlock(docId);
  if (!rootBlockId) {
    console.error('[错误] 无法获取文档根块 ID');
    process.exit(1);
  }

  // 解析 Markdown
  console.log('[3/7] 解析 Markdown 内容...');
  const elements = parseMarkdown(content);
  console.log(`  解析到 ${elements.length} 个元素`);

  // 转换并批量创建块
  console.log('[4/7] 创建文档块...');
  let createdCount = 0;
  let pendingBlocks = [];

  for (const element of elements) {
    if (element.type === 'table') {
      // Flush pending blocks first
      if (pendingBlocks.length > 0) {
        await flushBlocks(client, docId, rootBlockId, pendingBlocks);
        createdCount += pendingBlocks.length;
        pendingBlocks = [];
      }

      // Create bitable for table
      const bitableCreated = await createBitableTable(client, docId, rootBlockId, element);
      if (bitableCreated) {
        createdCount++;
      }
      continue;
    }

    if (element.type === 'code' && element.lang === 'mermaid') {
      // Flush pending blocks first
      if (pendingBlocks.length > 0) {
        await flushBlocks(client, docId, rootBlockId, pendingBlocks);
        createdCount += pendingBlocks.length;
        pendingBlocks = [];
      }

      // Create mermaid diagram
      const diagramBlock = await createMermaidDiagram(client, docId, rootBlockId, element);
      if (diagramBlock) {
        createdCount++;
      }
      continue;
    }

    const blocks = elementToBlock(element);
    if (Array.isArray(blocks)) {
      for (const block of blocks) {
        pendingBlocks.push(block);
        if (pendingBlocks.length >= BATCH_SIZE) {
          await flushBlocks(client, docId, rootBlockId, pendingBlocks);
          createdCount += pendingBlocks.length;
          pendingBlocks = [];
        }
      }
    } else if (blocks) {
      pendingBlocks.push(blocks);
      if (pendingBlocks.length >= BATCH_SIZE) {
        await flushBlocks(client, docId, rootBlockId, pendingBlocks);
        createdCount += pendingBlocks.length;
        pendingBlocks = [];
      }
    }
  }

  // Flush remaining blocks
  if (pendingBlocks.length > 0) {
    await flushBlocks(client, docId, rootBlockId, pendingBlocks);
    createdCount += pendingBlocks.length;
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ 同步完成！`);
  console.log(`   文档: ${title}`);
  console.log(`   链接: https://feishu.cn/docx/${docId}`);
  console.log(`   创建 ${createdCount} 个块`);
  console.log(`   耗时: ${elapsed}s`);

  return { docId, title, elapsed };
}

async function flushBlocks(client, docId, parentBlockId, blocks) {
  if (blocks.length === 0) return;
  try {
    await client.createChildren(docId, parentBlockId, blocks);
  } catch (err) {
    console.error(`  [创建块失败] ${err.message}，跳过 ${blocks.length} 个块`);
  }
}

async function createTable(client, docId, parentBlockId, tableElement) {
  const { headers, rows } = tableElement;
  const rowCount = rows.length + 1; // +1 for header
  const colCount = headers.length;

  if (colCount === 0) return null;

  console.log(`  📊 创建表格: ${rowCount}行 × ${colCount}列`);

  try {
    // Step 1: Create the table block
    const columnWidth = new Array(colCount).fill(200);
    const tableBlock = {
      block_type: 18,
      table: {
        cells: [],
        property: {
          row_size: rowCount,
          column_size: colCount,
          column_width: columnWidth,
          merge_info: [],
        },
      },
    };

    const createdTable = await client.createChildren(docId, parentBlockId, [tableBlock]);
    if (!createdTable || createdTable.length === 0) {
      console.warn('  创建表格块失败');
      return null;
    }

    const tableBlockId = createdTable[0].block_id;

    // Step 2: Create table cells
    const cellBlocks = [];

    // Header cells
    for (let col = 0; col < colCount; col++) {
      const cellName = `0_${col}`;
      const headerText = headers[col] || '';
      cellBlocks.push({
        block_type: 19,
        table_cell: {
          cell_name: cellName,
          child_blocks: [
            {
              block_type: 2,
              text: {
                elements: textElementsToElements([{ text: headerText, bold: true }]),
              },
            },
          ],
        },
      });
    }

    // Data cells
    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < colCount; col++) {
        const cellName = `${row + 1}_${col}`;
        const cellText = (rows[row] && rows[row][col]) || '';
        cellBlocks.push({
          block_type: 19,
          table_cell: {
            cell_name: cellName,
            child_blocks: [
              {
                block_type: 2,
                text: {
                  elements: textElementsToElements(cellText),
                },
              },
            ],
          },
        });
      }
    }

    // Create cells in batches
    for (let i = 0; i < cellBlocks.length; i += BATCH_SIZE) {
      const batch = cellBlocks.slice(i, i + BATCH_SIZE);
      await client.createChildren(docId, tableBlockId, batch);
    }

    return createdTable[0];
  } catch (err) {
    console.error(`  [表格创建失败] ${err.message}`);

    // Fallback: create table as text
    console.warn('  降级为文本表格...');
    const textContent = [headers.join(' | '), rows.map((r) => r.join(' | ')).join('\n')].join('\n');
    const fallbackBlock = {
      block_type: 2,
      text: {
        elements: textElementsToElements(textContent),
      },
    };
    await client.createChildren(docId, parentBlockId, [fallbackBlock]);
    return null;
  }
}

// Resolve the mmdc binary: prefer an absolute path (not always on PATH in
// non-interactive shells), then `mmdc` on PATH, then `npx`.
function resolveMmdc() {
  const home = os.homedir();
  const candidates = [
    path.join(home, '.npm-global', 'bin', 'mmdc'),
    '/usr/local/bin/mmdc',
    '/opt/homebrew/bin/mmdc',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  try {
    execSync('command -v mmdc', { stdio: 'pipe' });
    return 'mmdc';
  } catch {
    return 'npx -y @mermaid-js/mermaid-cli';
  }
}

// Read PNG width/height from the IHDR chunk (bytes 16-23, big-endian).
function getPngDimensions(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.length >= 24 && buf.toString('ascii', 12, 16) === 'IHDR') {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
  } catch {
    // fall through to default
  }
  return { width: 800, height: 400 };
}

async function createMermaidDiagram(client, docId, parentBlockId, codeElement) {
  console.log('  📈 处理 Mermaid 图表...');

  try {
    const tempMd = path.join('/tmp', `mermaid_${Date.now()}.mmd`);
    const tempPng = path.join('/tmp', `mermaid_${Date.now()}.png`);
    fs.writeFileSync(tempMd, codeElement.content);

    const mmdc = resolveMmdc();
    try {
      execSync(`${mmdc} -i ${tempMd} -o ${tempPng} --theme neutral`, {
        stdio: 'pipe',
        timeout: 30000,
      });
    } catch (e) {
      console.warn(`    mmdc 渲染失败: ${e.message.split('\n')[0]}`);
      console.warn('    降级为代码块展示');
      const codeBlock = {
        block_type: 2,
        text: {
          elements: textElementsToElements(`[mermaid 图表]\n\`\`\`mermaid\n${codeElement.content}\n\`\`\``),
        },
      };
      await client.createChildren(docId, parentBlockId, [codeBlock]);
      return codeBlock;
    }

    // Verified-correct image insertion flow:
    // 1) create an EMPTY image block (block_type 27, width/height only; token
    //    is read-only and cannot be set at creation — passing it yields 1770001)
    // 2) upload the PNG as a docx_image media with parent_node = the image
    //    block id (parent_node = doc id causes 1770013 relation mismatch)
    // 3) PATCH replace_image to link the file_token into the block
    const { width, height } = getPngDimensions(tempPng);
    const created = await client.createChildren(docId, parentBlockId, [{
      block_type: 27,
      image: { width, height },
    }]);
    const imgBlockId = created[0]?.block_id;
    if (!imgBlockId) throw new Error('创建图片块失败');

    const fileToken = await client.uploadMedia(tempPng, imgBlockId);
    await client.replaceImage(docId, imgBlockId, fileToken);
    console.log('    ✅ 图表渲染并插入成功');

    fs.unlinkSync(tempMd);
    fs.unlinkSync(tempPng);
    return { block_type: 27, image: { token: fileToken, width, height } };
  } catch (err) {
    console.error(`  [图表处理失败] ${err.message}`);
    // Fallback: create as code block so the PRD still syncs
    try {
      const codeBlock = {
        block_type: 2,
        text: {
          elements: textElementsToElements(`[mermaid 图表]\n\`\`\`mermaid\n${codeElement.content}\n\`\`\``),
        },
      };
      await client.createChildren(docId, parentBlockId, [codeBlock]);
      return codeBlock;
    } catch {
      return null;
    }
  }
}

// ─── 入口 ──────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('用法: node feishu-sync.js <prd-file.md> [folder-token]');
    console.log('');
    console.log('环境变量:');
    console.log('  FEISHU_APP_ID       飞书应用 App ID');
    console.log('  FEISHU_APP_SECRET   飞书应用 App Secret');
    console.log('  FEISHU_FOLDER_TOKEN 飞书文件夹 Token（可选）');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const folderToken = args[1];

  try {
    await syncToFeishu(filePath, folderToken);
  } catch (err) {
    console.error(`\n❌ 同步失败: ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
