import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Row, Col, Descriptions, Tag, Progress, Table, Button, Space, Timeline, Typography, Divider, message } from 'antd'
import { ArrowLeftOutlined, ThunderboltOutlined, CopyOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { getLeadById, salesTeam } from '../../../mock/leads'
import { useNavigate } from 'react-router-dom'

const gradeColors = {
  'A级': '#52c41a',
  'B级': '#faad14',
  'C级': '#ff4d4f',
}

export default function LeadDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const leadId = searchParams.get('id')
  const [lead, setLead] = useState(null)
  const [showReasoning, setShowReasoning] = useState(false)
  const [typedReasoning, setTypedReasoning] = useState('')

  useEffect(() => {
    if (leadId) {
      const found = getLeadById(leadId)
      setLead(found)
    }
  }, [leadId])

  // 打字机效果
  useEffect(() => {
    if (lead && lead.aiRecommendation) {
      setTypedReasoning('')
      const text = lead.aiRecommendation
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setTypedReasoning(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 50)
      return () => clearInterval(timer)
    }
  }, [lead])

  if (!lead) {
    return <div style={{ padding: 16 }}>线索不存在</div>
  }

  const scoreColor = gradeColors[lead.grade]

  const scoreColumns = [
    { title: '维度', dataIndex: 'name', width: 120 },
    {
      title: '得分',
      dataIndex: 'score',
      width: 150,
      render: (score, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, color: scoreColor }}>{score}</span>
          <span style={{ color: '#999' }}>/ {record.max}</span>
        </div>
      ),
    },
    {
      title: '进度',
      dataIndex: 'score',
      render: (score, record) => (
        <Progress
          percent={Math.round((score / record.max) * 100)}
          strokeColor={scoreColor}
          size="small"
          format={() => ''}
        />
      ),
    },
    {
      title: '评分依据',
      dataIndex: 'basis',
      render: (text) => <span style={{ fontSize: 12, color: '#666' }}>{text}</span>,
    },
  ]

  const scoreData = [
    { name: '属性评分', score: lead.scoreBreakdown.attribute_score, max: 40, basis: `职位: ${lead.signals.decisionRole} | 规模: ${lead.companySize}人 | 行业: ${lead.industry}` },
    { name: '行为评分', score: lead.scoreBreakdown.behavior_score, max: 35, basis: lead.behaviors.map(b => `${b.event} ×${b.count}`).join('；') || '无行为数据' },
    { name: '意图评分', score: lead.scoreBreakdown.intent_score, max: 25, basis: lead.signals.painPoints.length > 0 ? `痛点: ${lead.signals.painPoints.join('、')}` : '无明显意图信号' },
  ]

  const followUpTimeline = [
    { color: 'blue', children: `线索进入，来源: ${lead.source}` },
    { color: 'orange', children: `AI 评分完成: ${lead.overallScore}分 (${lead.grade})，置信度: ${lead.confidence}` },
    { color: 'green', children: lead.assignee ? `分配给 ${lead.assignee}` : '等待分配' },
    { color: 'gray', children: lead.status === '跟进中' ? '销售跟进中...' : `当前状态: ${lead.status}` },
  ]

  const availableSales = salesTeam.slice(0, 3)

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
      {/* 返回按钮 */}
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/lead-center/lead-list')} style={{ marginBottom: 8, padding: 0 }}>
        返回线索列表
      </Button>

      {/* 头部信息 */}
      <Card style={{ marginBottom: 12 }}>
        <Row gutter={24} align="middle">
          <Col span={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor }}>{lead.overallScore}</div>
              <Tag color={gradeColors[lead.grade]} style={{ fontSize: 14, padding: '4px 12px' }}>{lead.grade}</Tag>
              <Tag color={lead.confidence > 0.8 ? 'green' : lead.confidence > 0.6 ? 'gold' : 'red'}>
                置信度 {(lead.confidence * 100).toFixed(0)}%
              </Tag>
            </div>
            <Descriptions column={2} style={{ marginTop: 12 }} size="small">
              <Descriptions.Item label="线索名称">{lead.name}</Descriptions.Item>
              <Descriptions.Item label="线索ID">{lead.id}</Descriptions.Item>
              <Descriptions.Item label="行业">{lead.industry}</Descriptions.Item>
              <Descriptions.Item label="公司规模">{lead.companySize} 人</Descriptions.Item>
              <Descriptions.Item label="职位">{lead.jobTitle}</Descriptions.Item>
              <Descriptions.Item label="来源">{lead.source}</Descriptions.Item>
              <Descriptions.Item label="联系人手机">{lead.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="联系人邮箱">{lead.contactEmail}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>AI 提取信号</div>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ fontSize: 13 }}>
                  <Tag color={lead.signals.budgetConfirmed ? 'green' : 'default'}>
                    {lead.signals.budgetConfirmed ? '预算已确认' : '未确认预算'}
                  </Tag>
                  {lead.signals.budgetRange && (
                    <span style={{ color: '#666', marginLeft: 8 }}>
                      ¥{(lead.signals.budgetRange.min / 10000).toFixed(0)}万 - ¥{(lead.signals.budgetRange.max / 10000).toFixed(0)}万
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#666' }}>时间线: </span>
                  {lead.signals.timeline || <Tag color="default">未明确</Tag>}
                </div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#666' }}>决策角色: </span>
                  <Tag color="blue">{lead.signals.decisionRole}</Tag>
                </div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#666' }}>痛点: </span>
                  {lead.signals.painPoints.length > 0
                    ? lead.signals.painPoints.map(p => <Tag key={p} color="orange">{p}</Tag>)
                    : <Tag color="default">未识别</Tag>}
                </div>
                <div style={{ fontSize: 13 }}>
                  <Tag color={lead.signals.competitorMentioned ? 'red' : 'default'}>
                    {lead.signals.competitorMentioned ? '提及竞品' : '未提及竞品'}
                  </Tag>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>AI 跟进建议</div>
          <Typography.Text style={{ fontSize: 14 }}>
            {typedReasoning}
            {typedReasoning.length < lead.aiRecommendation.length && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
          </Typography.Text>
        </div>
      </Card>

      {/* 评分明细 */}
      <Card title="评分明细" style={{ marginBottom: 12 }}>
        <Table columns={scoreColumns} dataSource={scoreData} rowKey="name" pagination={false} size="small" />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="link" size="small" onClick={() => setShowReasoning(!showReasoning)}>
            {showReasoning ? '收起推理过程' : '查看完整推理过程'}
          </Button>
        </div>
        {showReasoning && (
          <Card size="small" style={{ marginTop: 8, background: '#f6f8fa' }}>
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8 }}>
              <strong>AI 推理过程：</strong>
              <br />
              1. 属性评分：{lead.jobTitle} → 角色为{lead.signals.decisionRole}，得{lead.scoreBreakdown.attribute_score > 20 ? '高' : '中低'}分
              <br />
              2. 行为评分：{lead.behaviors.length} 次互动，总计{lead.behaviors.reduce((s, b) => s + b.count, 0)} 次浏览/下载，
                {lead.behaviors.some(b => b.event.includes('演示') || b.event.includes('直播')) ? '包含演示/直播参与，加分' : '无深度互动'}
              <br />
              3. 意图评分：
                {lead.signals.budgetConfirmed ? '有明确预算 +8分；' : '未提及预算；'}
                {lead.signals.timeline ? `有时间线(${lead.signals.timeline}) +10分；` : '无明确时间线；'}
                {lead.signals.painPoints.length > 0 ? `有${lead.signals.painPoints.length}个痛点 +5分` : '无明显痛点'}
              <br />
              4. 综合评分：{lead.overallScore}分 → {lead.grade}级线索
            </div>
          </Card>
        )}
      </Card>

      {/* AI 分配推荐 */}
      <Card title="AI 分配推荐" style={{ marginBottom: 12 }}>
        <Table
          columns={[
            { title: '销售', dataIndex: 'name', width: 100 },
            { title: '行业专长', dataIndex: 'industryExpertise', width: 180, render: (v) => v.map(t => <Tag key={t} size="small">{t}</Tag>) },
            { title: '区域', dataIndex: 'region', width: 80 },
            { title: '转化率', dataIndex: 'conversionRate', width: 100, render: (v) => `${(v * 100).toFixed(0)}%` },
            { title: '响应时间', dataIndex: 'avgResponseTime', width: 100, render: (v) => `${v} 分钟` },
            { title: '当前负载', dataIndex: 'currentLoad', width: 100, render: (v) => `${v} 条线索` },
            { title: '操作', width: 80, render: (_, r) => <Button type="link" size="small" onClick={() => message.success(`已将线索分配给 ${r.name}`)}>分配</Button> },
          ]}
          dataSource={availableSales}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 需求描述 & 跟进记录 */}
      <Row gutter={12}>
        <Col span={12}>
          <Card title="客户需求描述" size="small">
            <div style={{ padding: '8px 0', color: '#333', lineHeight: 1.8, fontSize: 13 }}>
              {lead.inquiryText}
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ fontSize: 12, color: '#999' }}>行为事件记录</div>
            <Timeline style={{ marginTop: 8 }} items={lead.behaviors.map((b, i) => ({
              color: 'blue',
              children: <span style={{ fontSize: 13 }}>{b.event} ×{b.count} 次</span>,
            }))} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="跟进记录" size="small">
            <Timeline items={followUpTimeline.map(item => ({
              color: item.color,
              children: <span style={{ fontSize: 13 }}>{item.children}</span>,
            }))} />
          </Card>
        </Col>
      </Row>

      {/* 底部操作 */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <Button type="primary" icon={<ThunderboltOutlined />}>AI 智能分配</Button>
        <Button icon={<CopyOutlined />}>转交其他销售</Button>
        <Button>手动调整评分</Button>
        <Button>标记为无效</Button>
        <Button icon={<LikeOutlined />}>采纳 AI 建议</Button>
        <Button icon={<DislikeOutlined />} danger>驳回 AI 建议</Button>
      </div>
    </div>
  )
}
