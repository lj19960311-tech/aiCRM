// 数据看板 Mock 数据

export const dashboardStats = {
  totalLeads: 1286,
  todayNewLeads: 47,
  avgResponseTime: 28,
  highValueConversionRate: 0.23,
  aiAdoptionRate: 0.76,
  leadRecycleRate: 0.12,
  scoringAccuracy: 0.88,
}

// 评分分布
export const scoreDistribution = [
  { range: '90-100', count: 45, color: '#52c41a' },
  { range: '80-89', count: 82, color: '#73d13d' },
  { range: '70-79', count: 126, color: '#faad14' },
  { range: '60-69', count: 185, color: '#faad14' },
  { range: '50-59', count: 168, color: '#fa8c16' },
  { range: '40-49', count: 142, color: '#fa8c16' },
  { range: '30-39', count: 156, color: '#ff4d4f' },
  { range: '20-29', count: 198, color: '#ff4d4f' },
  { range: '0-19', count: 184, color: '#ff4d4f' },
]

// 等级分布
export const gradeDistribution = [
  { grade: 'A级', count: 127, percentage: 0.10, color: '#52c41a' },
  { grade: 'B级', count: 479, percentage: 0.37, color: '#faad14' },
  { grade: 'C级', count: 680, percentage: 0.53, color: '#ff4d4f' },
]

// 近 7 天趋势
export const weeklyTrend = [
  { date: '06-17', newLeads: 38, scored: 36, assigned: 32, converted: 5 },
  { date: '06-18', newLeads: 45, scored: 44, assigned: 40, converted: 7 },
  { date: '06-19', newLeads: 52, scored: 51, assigned: 46, converted: 8 },
  { date: '06-20', newLeads: 41, scored: 40, assigned: 38, converted: 6 },
  { date: '06-21', newLeads: 29, scored: 28, assigned: 25, converted: 4 },
  { date: '06-22', newLeads: 33, scored: 32, assigned: 28, converted: 5 },
  { date: '06-23', newLeads: 47, scored: 45, assigned: 40, converted: 3 },
]

// 渠道来源分布
export const sourceDistribution = [
  { source: '官网表单', count: 386, percentage: 0.30 },
  { source: '展会', count: 257, percentage: 0.20 },
  { source: '广告投放', count: 231, percentage: 0.18 },
  { source: '社群推荐', count: 180, percentage: 0.14 },
  { source: '企业微信', count: 129, percentage: 0.10 },
  { source: 'API对接', count: 64, percentage: 0.05 },
  { source: '批量导入', count: 39, percentage: 0.03 },
]

// AI 建议采纳率
export const aiAdoption = {
  totalSuggestions: 1086,
  accepted: 826,
  rejected: 134,
  pending: 126,
  adoptionRate: 0.76,
  byCategory: [
    { category: '评分建议', accepted: 420, rejected: 45, pending: 35, rate: 0.84 },
    { category: '分配推荐', accepted: 286, rejected: 58, pending: 56, rate: 0.72 },
    { category: '回收触发', accepted: 78, rejected: 18, pending: 22, rate: 0.66 },
    { category: '跟进建议', accepted: 42, rejected: 13, pending: 13, rate: 0.62 },
  ],
}

// 转化率趋势
export const conversionTrend = [
  { month: '1月', rate: 0.10 },
  { month: '2月', rate: 0.12 },
  { month: '3月', rate: 0.14 },
  { month: '4月', rate: 0.16 },
  { month: '5月', rate: 0.19 },
  { month: '6月', rate: 0.23 },
]

// 销售绩效
export const salesPerformance = [
  { id: 'S001', name: '张三', leadsCount: 45, convertedCount: 13, conversionRate: 0.29, avgResponseTime: 12, aiAcceptRate: 0.82, score: 92 },
  { id: 'S005', name: '陈七', leadsCount: 38, convertedCount: 12, conversionRate: 0.32, avgResponseTime: 8, aiAcceptRate: 0.85, score: 95 },
  { id: 'S004', name: '赵六', leadsCount: 32, convertedCount: 8, conversionRate: 0.25, avgResponseTime: 18, aiAcceptRate: 0.78, score: 86 },
  { id: 'S002', name: '李四', leadsCount: 28, convertedCount: 6, conversionRate: 0.22, avgResponseTime: 45, aiAcceptRate: 0.70, score: 78 },
  { id: 'S006', name: '周八', leadsCount: 20, convertedCount: 4, conversionRate: 0.20, avgResponseTime: 35, aiAcceptRate: 0.68, score: 72 },
  { id: 'S003', name: '王五', leadsCount: 52, convertedCount: 9, conversionRate: 0.18, avgResponseTime: 30, aiAcceptRate: 0.65, score: 68 },
]
