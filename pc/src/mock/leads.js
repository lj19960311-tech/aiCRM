import dayjs from 'dayjs'

const sources = ['官网表单', '展会', '广告投放', '社群推荐', '企业微信', 'API对接', '批量导入']
const industries = ['制造业', '金融', '教育', '医疗', '零售', '科技', '物流', '房地产', '能源', '咨询']
const companySizes = [
  { label: '小型企业', range: [10, 99] },
  { label: '中型企业', range: [100, 499] },
  { label: '大型企业', range: [500, 5000] },
]
const jobTitles = ['CEO', 'CTO', '采购经理', '销售总监', '市场总监', '运营经理', 'IT主管', '产品经理', '业务总监', 'VP']
const decisionRoles = ['决策者', '影响者', '使用者', '未知']
const gradeMap = { A: 'A级', B: 'B级', C: 'C级' }

const inquiryTexts = [
  { text: '我们需要一套 CRM 系统来管理全国 30 家门店的销售数据，预计明年 Q1 上线，预算 50-80 万', hasBudget: true, hasTimeline: true, painPoints: ['多门店管理', '销售数据统一'] },
  { text: '想了解下你们的产品，看看是否适合我们团队使用', hasBudget: false, hasTimeline: false, painPoints: [] },
  { text: '目前使用的竞品系统功能不够用，想对比一下你们的产品，预算在 30 万左右', hasBudget: true, hasTimeline: false, painPoints: ['功能不足'], competitor: true },
  { text: '我们是华南地区最大的零售连锁企业，年营收 5 亿，需要系统化管理 200 家门店，预算 200 万，希望 Q2 前上线', hasBudget: true, hasTimeline: true, painPoints: ['多门店管理', '系统化管理'] },
  { text: '帮朋友问一下，你们的产品大概什么价位', hasBudget: false, hasTimeline: false, painPoints: [] },
  { text: '我们需要一个数据分析平台，能整合各渠道的销售数据，预计今年内上线', hasBudget: false, hasTimeline: true, painPoints: ['数据整合'] },
  { text: '学生毕业设计调研，想了解下行业解决方案', hasBudget: false, hasTimeline: false, painPoints: [] },
  { text: '我们公司有 500+ 员工，目前在用 Excel 管理客户信息，效率很低，想引入专业系统，预算 100 万', hasBudget: true, hasTimeline: false, painPoints: ['效率低', 'Excel管理'] },
  { text: '需要一套支持多语言、多币种的国际版系统，我们业务覆盖东南亚 8 个国家', hasBudget: false, hasTimeline: false, painPoints: ['多语言', '多币种'] },
  { text: '之前用过你们的试用版，感觉不错，想正式采购，预算已审批通过', hasBudget: true, hasTimeline: false, painPoints: [] },
]

const behaviorPatterns = [
  { events: [{ event: '浏览产品页', count: 8 }, { event: '下载产品手册', count: 1 }, { event: '参加线上演示', count: 1 }] },
  { events: [{ event: '浏览首页', count: 1 }] },
  { events: [{ event: '浏览产品页', count: 5 }, { event: '下载白皮书', count: 1 }] },
  { events: [{ event: '浏览产品页', count: 3 }, { event: '参加线上直播', count: 1 }, { event: '下载案例集', count: 1 }] },
  { events: [{ event: '浏览定价页', count: 2 }, { event: '浏览产品页', count: 4 }] },
  { events: [{ event: '浏览首页', count: 1 }, { event: '浏览关于页', count: 1 }] },
]

const leadNames = [
  'XX医疗科技', 'YY教育集团', 'ZZ咨询工作室', 'AA制造股份', 'BB金融服务',
  'CC零售连锁', 'DD物流科技', 'EE能源集团', 'FF房地产管理', 'GG科技股份',
  'HH教育科技', 'II医疗管理', 'JJ制造技术', 'KK金融信息', 'LL咨询服务',
  'MM零售管理', 'NN科技信息', 'OO物流管理', 'PP能源科技', 'QQ房地产',
  'RR制造集团', 'SS教育信息', 'TT医疗集团', 'UU金融服务', 'VV零售科技',
  'WW物流股份', 'XX能源管理', 'YY科技服务', 'ZZ制造信息', 'AA教育服务',
  'BB医疗信息', 'CC金融科技', 'DD零售股份', 'EE物流集团', 'FF能源服务',
  'GG制造管理', 'HH教育股份', 'II医疗科技', 'JJ金融管理', 'KK物流科技',
  'LL零售信息', 'MM能源股份', 'NN科技管理', 'OO制造科技', 'PP教育科技',
  'QQ医疗信息', 'RR金融股份', 'SS物流管理', 'TT零售集团', 'UU能源信息',
  'VV科技股份', 'WW制造服务', 'XX教育集团', 'YY医疗管理', 'ZZ金融信息',
  'AA物流服务', 'BB能源科技', 'CC零售管理', 'DD科技信息', 'EE制造股份',
  'FF教育管理', 'GG医疗信息', 'HH金融集团', 'II物流科技', 'JJ能源管理',
  'KK零售科技', 'LL制造信息', 'MM教育服务', 'NN医疗管理', 'OO金融服务',
  'PP物流股份', 'QQ能源集团', 'RR科技管理', 'SS制造股份', 'TT教育信息',
  'UU医疗科技', 'VV金融管理', 'WW物流服务', 'XX零售股份', 'YY能源科技',
  'ZZ科技信息', 'AA制造管理', 'BB教育股份', 'CC医疗集团', 'DD金融信息',
  'EE物流管理', 'FF零售科技', 'GG能源股份', 'HH科技服务', 'II制造科技',
  'JJ教育服务', 'KK医疗信息', 'LL金融股份', 'MM物流集团', 'NN能源服务',
  'OO零售管理', 'PP科技集团', 'QQ制造服务', 'RR教育科技', 'SS医疗股份',
  'TT金融管理', 'UU物流信息', 'VV零售股份', 'WW能源管理',
]

const assignees = ['张三', '李四', '王五', '赵六', '陈七', '周八']
const leadStatuses = ['待分配', '跟进中', '已转化', '已无效', '培育池']

function generateScore(inquiryIdx, behaviorIdx) {
  let score = 0
  const inquiry = inquiryTexts[inquiryIdx]

  // 职位匹配
  const roles = ['决策者', '影响者', '使用者', '无关', '决策者', '影响者', '无关', '决策者', '影响者', '决策者']
  const roleScore = { '决策者': 15, '影响者': 10, '使用者': 5, '无关': 0 }
  score += roleScore[roles[inquiryIdx % roles.length]] || 5

  // 公司规模
  const sizeIdx = inquiryIdx % 3
  const sizeScore = [3, 7, 10]
  score += sizeScore[sizeIdx]

  // 行业
  const indScore = inquiryIdx % 2 === 0 ? 10 : 6
  score += indScore

  // 预算
  if (inquiry.hasBudget) score += 5
  else if (inquiry.text.includes('预算')) score += 3

  // 行为
  const bEvents = behaviorPatterns[behaviorIdx].events
  const totalVisits = bEvents.reduce((sum, e) => sum + e.count, 0)
  if (totalVisits >= 5) score += 15
  else if (totalVisits >= 3) score += 10
  else score += 5

  if (bEvents.some(e => e.event.includes('下载'))) score += 5
  if (bEvents.some(e => e.event.includes('演示') || e.event.includes('直播'))) score += 10

  // 意图
  if (inquiry.hasTimeline) score += 10
  if (inquiry.hasBudget) score += 8
  if (inquiry.painPoints.length > 0) score += 5
  if (inquiry.competitor) score += 2
  if (inquiry.text.includes('了解一下')) score -= 5
  if (inquiry.text.includes('学生')) score -= 10

  return {
    attribute_score: Math.min(40, score - (inquiry.hasTimeline ? 10 : 0) - (inquiry.hasBudget ? 8 : 0) - (inquiry.painPoints.length > 0 ? 5 : 0) + 5),
    behavior_score: Math.min(35, (totalVisits >= 5 ? 15 : totalVisits >= 3 ? 10 : 5) + (bEvents.some(e => e.event.includes('下载')) ? 10 : 5) + (bEvents.some(e => e.event.includes('演示') || e.event.includes('直播')) ? 10 : 0)),
    intent_score: Math.max(0, (inquiry.hasTimeline ? 10 : 0) + (inquiry.hasBudget ? 8 : 0) + (inquiry.painPoints.length > 0 ? 5 : 0) + (inquiry.competitor ? 2 : 0) + (inquiry.text.includes('了解一下') ? -5 : 0) + (inquiry.text.includes('学生') ? -10 : 0)),
  }
}

export function generateLeads(count = 100) {
  return Array.from({ length: count }, (_, i) => {
    const inquiryIdx = i % inquiryTexts.length
    const behaviorIdx = i % behaviorPatterns.length
    const scores = generateScore(inquiryIdx, behaviorIdx)
    const overall = Math.max(0, Math.min(100, scores.attribute_score + scores.behavior_score + scores.intent_score))
    const grade = overall >= 80 ? 'A' : overall >= 50 ? 'B' : 'C'
    const inquiry = inquiryTexts[inquiryIdx]
    const behaviors = behaviorPatterns[behaviorIdx].events
    const sizeInfo = companySizes[i % 3]
    const companySize = Math.floor(Math.random() * (sizeInfo.range[1] - sizeInfo.range[0])) + sizeInfo.range[0]
    const daysAgo = Math.floor(Math.random() * 30)
    const source = sources[i % sources.length]

    return {
      id: `L${String(i + 1).padStart(4, '0')}`,
      name: leadNames[i % leadNames.length],
      source,
      industry: industries[i % industries.length],
      companySize,
      jobTitle: jobTitles[i % jobTitles.length],
      contactPhone: `1${38 + (i % 10)}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}****`,
      contactEmail: `a***@${['company.com', 'corp.cn', 'group.com', 'tech.cn'][i % 4]}`,
      inquiryText: inquiry.text,
      behaviors,
      overallScore: overall,
      scoreBreakdown: scores,
      grade: gradeMap[grade],
      gradeKey: grade,
      signals: {
        budgetConfirmed: inquiry.hasBudget,
        budgetRange: inquiry.hasBudget ? { min: 300000, max: 2000000 } : null,
        timeline: inquiry.hasTimeline ? '2026-Q1' : null,
        decisionRole: decisionRoles[i % decisionRoles.length],
        painPoints: inquiry.painPoints,
        competitorMentioned: inquiry.competitor || false,
      },
      confidence: (0.6 + Math.random() * 0.35).toFixed(2),
      assignee: ['待分配', '培育池'].includes(leadStatuses[i % leadStatuses.length]) ? null : assignees[i % assignees.length],
      status: leadStatuses[i % leadStatuses.length],
      createdAt: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD HH:mm'),
      updatedAt: dayjs().subtract(Math.floor(Math.random() * daysAgo), 'day').format('YYYY-MM-DD HH:mm'),
      aiRecommendation: grade === 'A' ? '高意向，建议24h内安排演示' : grade === 'B' ? '中意向，建议发送产品资料' : '低意向，建议邮件培育',
      feedback: Math.random() > 0.85 ? (Math.random() > 0.5 ? '👍' : '👎') : null,
      feedbackReason: null,
    }
  })
}

export const leadList = generateLeads(100)

export function getLeadById(id) {
  return leadList.find(lead => lead.id === id)
}

export function getLeadsByGrade(grade) {
  if (!grade || grade === '全部') return leadList
  return leadList.filter(lead => lead.grade === gradeMap[grade])
}

// 销售团队数据
export const salesTeam = [
  { id: 'S001', name: '张三', industryExpertise: ['制造业', '零售'], region: '华东', currentLoad: 15, conversionRate: 0.28, avgResponseTime: 12 },
  { id: 'S002', name: '李四', industryExpertise: ['金融', '医疗'], region: '华北', currentLoad: 8, conversionRate: 0.22, avgResponseTime: 45 },
  { id: 'S003', name: '王五', industryExpertise: ['教育', '科技'], region: '华南', currentLoad: 22, conversionRate: 0.18, avgResponseTime: 30 },
  { id: 'S004', name: '赵六', industryExpertise: ['物流', '能源'], region: '西南', currentLoad: 10, conversionRate: 0.25, avgResponseTime: 18 },
  { id: 'S005', name: '陈七', industryExpertise: ['制造', '金融', '零售'], region: '华东', currentLoad: 18, conversionRate: 0.32, avgResponseTime: 8 },
  { id: 'S006', name: '周八', industryExpertise: ['医疗', '教育'], region: '华北', currentLoad: 5, conversionRate: 0.20, avgResponseTime: 35 },
]

export function getSalesById(id) {
  return salesTeam.find(s => s.id === id)
}
