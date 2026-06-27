import { useState } from 'react'
import { Card, Row, Col, Statistic, Progress, Table, Tag, Space, Select, Divider } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, ThunderboltOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons'
import { dashboardStats, scoreDistribution, gradeDistribution, weeklyTrend, sourceDistribution, aiAdoption, conversionTrend, salesPerformance } from '../../../mock/dashboard'

// 简单的柱状图组件
function BarChart({ data, height = 160 }) {
  const maxVal = Math.max(...data.map(d => d.count))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height, gap: 4, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>{d.count}</div>
          <div
            style={{
              height: Math.max(4, (d.count / maxVal) * (height - 40)),
              background: d.color || '#FF6B00',
              borderRadius: '2px 2px 0 0',
              transition: 'height 0.3s',
            }}
          />
          <div style={{ fontSize: 10, color: '#666', marginTop: 4, transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
            {d.range || d.source || d.date}
          </div>
        </div>
      ))}
    </div>
  )
}

// 简单的折线图组件
function LineChart({ data, dataKeys, height = 160, labels }) {
  const maxVal = Math.max(...dataKeys.flatMap(k => data.map(d => d[k])))
  const colors = ['#FF6B00', '#1890ff', '#52c41a', '#722ed1']

  return (
    <div style={{ position: 'relative', height, padding: '0 4px' }}>
      {/* 背景网格 */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <div key={pct} style={{ position: 'absolute', left: 0, right: 0, top: pct * (height - 30), borderTop: '1px dashed #f0f0f0' }}>
          <span style={{ position: 'absolute', left: 0, fontSize: 9, color: '#ccc', transform: 'translateY(-50%)' }}>
            {Math.round(maxVal * (1 - pct))}
          </span>
        </div>
      ))}
      {/* 线条 */}
      {dataKeys.map((key, ki) => (
        <svg key={key} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: height - 30 }}>
          <polyline
            fill="none"
            stroke={colors[ki % colors.length]}
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100 + '%'
              const y = (1 - d[key] / maxVal) * 100 + '%'
              return `${x},${y}`
            }).join(' ')}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100 + '%'
            const y = (1 - d[key] / maxVal) * 100 + '%'
            return (
              <circle key={i} cx={x} cy={y} r="3" fill={colors[ki % colors.length]} stroke="#fff" strokeWidth="1" />
            )
          })}
        </svg>
      ))}
      {/* X轴标签 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: height - 30, position: 'relative' }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 10, color: '#666' }}>{labels ? labels[i] : d.date || d.month}</span>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>数据看板</div>
        <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
          <Select.Option value="7d">近 7 天</Select.Option>
          <Select.Option value="30d">近 30 天</Select.Option>
          <Select.Option value="90d">近 90 天</Select.Option>
        </Select>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="线索总量"
              value={dashboardStats.totalLeads}
              prefix={<TeamOutlined />}
              suffix="条"
              valueStyle={{ fontSize: 22 }}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
              <ArrowUpOutlined /> 今日 +{dashboardStats.todayNewLeads} 条
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={dashboardStats.avgResponseTime}
              suffix="分钟"
              valueStyle={{ fontSize: 22, color: dashboardStats.avgResponseTime <= 30 ? '#52c41a' : '#faad14' }}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
              <ArrowDownOutlined /> 较上周 ↓ 15%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="高价值转化率"
              value={dashboardStats.highValueConversionRate * 100}
              suffix="%"
              precision={1}
              valueStyle={{ fontSize: 22, color: '#52c41a' }}
              prefix={<TrophyOutlined />}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
              <ArrowUpOutlined /> 目标 25%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="AI 建议采纳率"
              value={dashboardStats.aiAdoptionRate * 100}
              suffix="%"
              precision={1}
              valueStyle={{ fontSize: 22, color: '#1890ff' }}
              prefix={<ThunderboltOutlined />}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
              <ArrowUpOutlined /> 较上周 ↑ 5%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="评分准确率"
              value={dashboardStats.scoringAccuracy * 100}
              suffix="%"
              precision={1}
              valueStyle={{ fontSize: 22 }}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
              <ArrowUpOutlined /> 目标 ≥ 85%
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="线索回收率"
              value={dashboardStats.leadRecycleRate * 100}
              suffix="%"
              precision={1}
              valueStyle={{ fontSize: 22, color: dashboardStats.leadRecycleRate <= 0.15 ? '#52c41a' : '#ff4d4f' }}
            />
            <div style={{ fontSize: 12, color: '#52c41a', marginTop: 4 }}>
              <ArrowDownOutlined /> 目标 ≤ 15%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 评分分布 + 等级分布 */}
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={16}>
          <Card title="评分分布" size="small">
            <BarChart data={scoreDistribution} height={140} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="等级分布" size="small">
            {gradeDistribution.map(g => (
              <div key={g.grade} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Tag color={g.color === '#52c41a' ? 'green' : g.color === '#faad14' ? 'gold' : 'red'}>{g.grade}</Tag>
                  <span style={{ fontSize: 13 }}>{g.count} 条 ({(g.percentage * 100).toFixed(0)}%)</span>
                </div>
                <Progress
                  percent={g.percentage * 100}
                  strokeColor={g.color}
                  size="small"
                  format={() => ''}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={14}>
          <Card title="近 7 天线索趋势" size="small">
            <Space size="middle" style={{ marginBottom: 8 }}>
              <Tag color="orange">新增线索</Tag>
              <Tag color="blue">已分配</Tag>
              <Tag color="green">已转化</Tag>
            </Space>
            <LineChart
              data={weeklyTrend}
              dataKeys={['newLeads', 'assigned', 'converted']}
              height={150}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="月度转化率趋势" size="small">
            <LineChart
              data={conversionTrend}
              dataKeys={['rate']}
              height={150}
              labels={conversionTrend.map(d => d.month)}
            />
          </Card>
        </Col>
      </Row>

      {/* AI 采纳率 + 渠道分布 */}
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Card title="AI 建议采纳率详情" size="small">
            <Table
              columns={[
                { title: '建议类型', dataIndex: 'category', width: 120 },
                { title: '采纳', dataIndex: 'accepted', width: 80, render: v => <Tag color="green">{v}</Tag> },
                { title: '驳回', dataIndex: 'rejected', width: 80, render: v => <Tag color="red">{v}</Tag> },
                { title: '待确认', dataIndex: 'pending', width: 80, render: v => <Tag color="default">{v}</Tag> },
                {
                  title: '采纳率',
                  dataIndex: 'rate',
                  render: (v) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Progress percent={v * 100} size="small" strokeColor={v >= 0.7 ? '#52c41a' : '#faad14'} />
                      <span style={{ fontSize: 12 }}>{(v * 100).toFixed(0)}%</span>
                    </div>
                  ),
                },
              ]}
              dataSource={aiAdoption.byCategory}
              rowKey="category"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="渠道来源分布" size="small">
            {sourceDistribution.map(s => (
              <div key={s.source} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 70, fontSize: 12, color: '#666' }}>{s.source}</span>
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={s.percentage * 100}
                    strokeColor="#FF6B00"
                    size="small"
                    format={() => ''}
                  />
                </div>
                <span style={{ fontSize: 12, width: 60, textAlign: 'right' }}>{s.count} ({(s.percentage * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 销售绩效排行 */}
      <Card title="销售绩效排行" size="small">
        <Table
          columns={[
            { title: '排名', dataIndex: 'rank', width: 60, render: (_, __, idx) => (
              <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? '#cd7f32' : 'default'}>
                {idx + 1}
              </Tag>
            )},
            { title: '销售', dataIndex: 'name', width: 80 },
            { title: '跟进线索', dataIndex: 'leadsCount', width: 90 },
            { title: '已转化', dataIndex: 'convertedCount', width: 80 },
            {
              title: '转化率',
              dataIndex: 'conversionRate',
              width: 100,
              render: (v) => <Tag color={v >= 0.25 ? 'green' : v >= 0.2 ? 'gold' : 'default'}>{(v * 100).toFixed(0)}%</Tag>,
            },
            { title: '平均响应', dataIndex: 'avgResponseTime', width: 100, render: (v) => `${v} 分钟` },
            {
              title: 'AI 采纳率',
              dataIndex: 'aiAcceptRate',
              width: 100,
              render: (v) => (
                <Progress percent={v * 100} size="small" strokeColor={v >= 0.8 ? '#52c41a' : '#faad14'} />
              ),
            },
            {
              title: '综合评分',
              dataIndex: 'score',
              width: 100,
              render: (v) => (
                <span style={{ fontWeight: 600, color: v >= 90 ? '#52c41a' : v >= 80 ? '#1890ff' : '#666' }}>{v}</span>
              ),
            },
          ]}
          dataSource={salesPerformance.map((s, i) => ({ ...s, rank: i + 1 }))}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
