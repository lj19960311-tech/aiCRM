# Mock 数据规范

## 设计原则

1. AI 销售秘书是**对话式 AI 助手**，不是传统的 CRUD 后台
2. Mock 数据用于还原对话交互、内容展示等业务场景
3. 数据应贴合销售业务实际，如客户画像、销售话术、产品资料等
4. 使用合理的业务场景数据，避免 "test1"、"aaa" 等无意义数据

## 常见 Mock 数据类型

### 1. 对话消息数据

```js
// mock/chatMessages.js

export const mockChatHistory = [
  {
    id: 'msg_1',
    role: 'user',
    content: '帮我分析一下农夫山泉这个客户',
    timestamp: '2026-08-26 10:30',
  },
  {
    id: 'msg_2',
    role: 'assistant',
    content: '好的，我来为您分析农夫山泉的客户情况...',
    timestamp: '2026-08-26 10:30',
  },
];
```

### 2. 客户笔记数据

```js
// mock/memoryData.js

export const mockMemoryItems = [
  {
    id: 1,
    customerName: '农夫山泉',
    contactPerson: '张经理',
    industry: '食品饮料',
    notes: '对大包装水有需求，关注物流成本优化',
    lastUpdated: '2026-08-25',
    tags: ['重点客户', '饮用水'],
  },
  {
    id: 2,
    customerName: '娃哈哈集团',
    contactPerson: '李总监',
    industry: '食品饮料',
    notes: '整车物流合作意向，需要冷链方案',
    lastUpdated: '2026-08-24',
    tags: ['物流合作', '饮料'],
  },
];
```

### 3. 销售陪练场景数据

```js
// mock/coachData.js

export const mockCoachScenarios = [
  {
    id: 1,
    title: '客户异议处理',
    description: '客户认为产品价格偏高，需要说服',
    difficulty: '中等',
    role: '客户',
    openingLine: '你们的价格比竞品高了 15%，我需要考虑一下',
  },
  {
    id: 2,
    title: '新品推介',
    description: '向客户推荐新上市的无糖茶饮系列',
    difficulty: '简单',
    role: '经销商',
    openingLine: '这个新品有什么卖点？和我们现有产品线会不会冲突？',
  },
];

export const mockCoachDialogue = [
  {
    id: 'd1',
    role: 'customer',
    content: '你们的价格比竞品高了 15%',
    timestamp: '00:00',
  },
  {
    id: 'd2',
    role: 'sales',
    content: '感谢您的反馈。我们的定价确实略高，但这是因为...',
    timestamp: '00:15',
    score: 75,
    feedback: '可以先肯定客户的价格敏感度，再强调产品差异化价值',
  },
];
```

### 4. 专家技能数据

```js
// mock/skillsData.js

export const mockSkills = [
  {
    id: 'skill_1',
    name: '客户分析专家',
    description: '深度分析客户画像、购买行为和商机潜力',
    category: '分析',
    icon: '📊',
    usageCount: 128,
  },
  {
    id: 'skill_2',
    name: '话术优化专家',
    description: '根据场景和客户需求生成销售话术',
    category: '沟通',
    icon: '💬',
    usageCount: 95,
  },
  {
    id: 'skill_3',
    name: '方案撰写专家',
    description: '快速生成物流方案、合作方案等文档',
    category: '文档',
    icon: '📝',
    usageCount: 67,
  },
];
```

### 5. 文件管理数据

```js
// mock/outputsData.js

export const mockFiles = [
  {
    id: 'file_1',
    name: '农夫山泉客户分析报告.pdf',
    type: 'pdf',
    size: '2.3 MB',
    createdAt: '2026-08-25',
    starred: true,
  },
  {
    id: 'file_2',
    name: '娃哈哈物流合作方案.docx',
    type: 'docx',
    size: '1.8 MB',
    createdAt: '2026-08-24',
    starred: false,
  },
];
```

### 6. 智能讲解数据

```js
// mock/presentData.js

export const mockPresentationSlides = [
  {
    id: 1,
    title: '万联易达平台介绍',
    subtitle: '数字化供应链管理解决方案',
    sections: [
      { title: '平台概述', content: '万联易达是...' },
      { title: '核心能力', content: '智能采购、智能仓储...' },
      { title: '成功案例', content: '已服务 500+ 企业...' },
    ],
  },
];
```

## 命名约定

| 业务场景 | 文件名 | 导出函数/变量 |
|---------|--------|-------------|
| 对话消息 | `chatMessages.js` | `mockChatHistory` |
| 客户笔记 | `memoryData.js` | `mockMemoryItems` |
| 销售陪练 | `coachData.js` | `mockCoachScenarios`、`mockCoachDialogue` |
| 专家技能 | `skillsData.js` | `mockSkills` |
| 文件管理 | `outputsData.js` | `mockFiles` |
| 智能讲解 | `presentData.js` | `mockPresentationSlides` |
