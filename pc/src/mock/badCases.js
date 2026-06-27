import dayjs from 'dayjs'

const reasons = ['评分偏高', '评分偏低', '分配不合理', 'AI编造信息', '行业不匹配', '地域不匹配', '负载已饱和']
const types = ['评分偏差', '分配偏差', '无效误判']
const statuses = ['待处理', '处理中', '已修复', '已忽略']

export function generateBadCases(count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    id: `BC${String(i + 1).padStart(4, '0')}`,
    leadId: `L${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
    leadName: `${['XX', 'YY', 'ZZ', 'AA', 'BB'][i % 5]}${['医疗科技', '教育集团', '咨询工作室', '制造股份', '金融服务'][i % 5]}`,
    type: types[i % types.length],
    aiScore: Math.floor(Math.random() * 40) + 60,
    adjustedScore: Math.floor(Math.random() * 40) + 10,
    aiAssignee: ['张三', '李四', '王五'][i % 3],
    actualAssignee: ['赵六', '陈七', '周八'][i % 3],
    reason: reasons[i % reasons.length],
    detail: `AI 给出的评分/分配与实际情况存在较大偏差，销售跟进后发现线索质量与评分不符`,
    reportedBy: ['销售A', '销售B', '销售C', '主管D'][i % 4],
    status: statuses[i % statuses.length],
    createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm'),
    handledAt: i % 3 === 2 ? dayjs().subtract(Math.floor(Math.random() * 15), 'day').format('YYYY-MM-DD HH:mm') : null,
    fixAction: ['调整评分权重', '更新匹配规则', '优化Prompt', '增加负向信号', '调整阈值'][i % 5],
    scoreDiff: Math.abs(Math.floor(Math.random() * 40) + 15),
  }))
}

export const badCaseList = generateBadCases(30)

export function getBadCaseById(id) {
  return badCaseList.find(item => item.id === id)
}
