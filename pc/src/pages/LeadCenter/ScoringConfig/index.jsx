import { useState } from 'react'
import { Card, Row, Col, Form, InputNumber, Input, Select, Button, Table, Space, Divider, Switch, Tag, message } from 'antd'
import { SaveOutlined, PlusOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons'

export default function ScoringConfig() {
  const [mode, setMode] = useState('ai')

  // 属性评分规则
  const [attributeRules, setAttributeRules] = useState([
    { id: 1, dimension: '职位匹配度', condition: '决策者', score: 15, enabled: true },
    { id: 2, dimension: '职位匹配度', condition: '影响者', score: 10, enabled: true },
    { id: 3, dimension: '职位匹配度', condition: '使用者', score: 5, enabled: true },
    { id: 4, dimension: '职位匹配度', condition: '无关', score: 0, enabled: true },
    { id: 5, dimension: '公司规模', condition: '大型企业(≥500人)', score: 10, enabled: true },
    { id: 6, dimension: '公司规模', condition: '中型企业(100-499人)', score: 7, enabled: true },
    { id: 7, dimension: '公司规模', condition: '小型企业(<100人)', score: 3, enabled: true },
    { id: 8, dimension: '行业匹配度', condition: '目标行业', score: 10, enabled: true },
    { id: 9, dimension: '行业匹配度', condition: '相关行业', score: 6, enabled: true },
    { id: 10, dimension: '行业匹配度', condition: '非目标行业', score: 0, enabled: true },
    { id: 11, dimension: '预算明确度', condition: '有明确预算', score: 5, enabled: true },
    { id: 12, dimension: '预算明确度', condition: '有预算范围', score: 3, enabled: true },
    { id: 13, dimension: '预算明确度', condition: '未提及', score: 0, enabled: true },
  ])

  // 行为评分规则
  const [behaviorRules, setBehaviorRules] = useState([
    { id: 1, dimension: '官网访问频次', condition: '≥5次', score: 15, enabled: true },
    { id: 2, dimension: '官网访问频次', condition: '3-4次', score: 10, enabled: true },
    { id: 3, dimension: '官网访问频次', condition: '1-2次', score: 5, enabled: true },
    { id: 4, dimension: '内容下载', condition: '下载产品相关文档', score: 10, enabled: true },
    { id: 5, dimension: '内容下载', condition: '下载通用资料', score: 5, enabled: true },
    { id: 6, dimension: '活动参与', condition: '参加产品演示/直播', score: 10, enabled: true },
    { id: 7, dimension: '活动参与', condition: '仅浏览', score: 0, enabled: true },
  ])

  // 意图信号规则
  const [intentRules, setIntentRules] = useState([
    { id: 1, type: 'positive', signal: '明确时间线', score: 10, enabled: true },
    { id: 2, type: 'positive', signal: '明确预算', score: 8, enabled: true },
    { id: 3, type: 'positive', signal: '具体痛点描述', score: 5, enabled: true },
    { id: 4, type: 'positive', signal: '竞争对手对比', score: 2, enabled: true },
    { id: 5, type: 'negative', signal: '"只是了解一下"', score: -5, enabled: true },
    { id: 6, type: 'negative', signal: '"帮别人问的"', score: -3, enabled: true },
    { id: 7, type: 'negative', signal: '学生/求职', score: -10, enabled: true },
  ])

  // 等级阈值
  const [gradeThresholds, setGradeThresholds] = useState([
    { grade: 'A级', min: 80, max: 100, color: 'green', action: 'AI 智能分配 → 高转化销售' },
    { grade: 'B级', min: 50, max: 79, color: 'gold', action: '按区域/行业规则分配' },
    { grade: 'C级', min: 0, max: 49, color: 'red', action: '进入培育池 / 自动化营销' },
  ])

  const attrColumns = [
    { title: '维度', dataIndex: 'dimension', width: 120 },
    { title: '条件', dataIndex: 'condition', width: 160 },
    { title: '分数', dataIndex: 'score', width: 80, render: (v) => <Tag color={v > 0 ? 'green' : 'default'}>{v}分</Tag> },
    {
      title: '启用', dataIndex: 'enabled', width: 60,
      render: (v, r) => <Switch size="small" checked={v} onChange={(checked) => {
        setAttributeRules(attributeRules.map(item => item.id === r.id ? { ...item, enabled: checked } : item))
      }} />,
    },
  ]

  const behaviorColumns = [
    { title: '维度', dataIndex: 'dimension', width: 140 },
    { title: '条件', dataIndex: 'condition', width: 160 },
    { title: '分数', dataIndex: 'score', width: 80, render: (v) => <Tag color={v > 0 ? 'green' : 'default'}>{v}分</Tag> },
    {
      title: '启用', dataIndex: 'enabled', width: 60,
      render: (v, r) => <Switch size="small" checked={v} onChange={(checked) => {
        setBehaviorRules(behaviorRules.map(item => item.id === r.id ? { ...item, enabled: checked } : item))
      }} />,
    },
  ]

  const intentColumns = [
    { title: '类型', dataIndex: 'type', width: 80, render: (v) => <Tag color={v === 'positive' ? 'green' : 'red'}>{v === 'positive' ? '正向' : '负向'}</Tag> },
    { title: '信号', dataIndex: 'signal', width: 180 },
    { title: '分数', dataIndex: 'score', width: 80, render: (v) => <Tag color={v > 0 ? 'green' : 'red'}>{v > 0 ? '+' : ''}{v}分</Tag> },
    {
      title: '启用', dataIndex: 'enabled', width: 60,
      render: (v, r) => <Switch size="small" checked={v} onChange={(checked) => {
        setIntentRules(intentRules.map(item => item.id === r.id ? { ...item, enabled: checked } : item))
      }} />,
    },
  ]

  const handleSave = () => {
    message.success('评分规则已保存')
  }

  const handleTest = () => {
    message.info('正在使用测试数据进行评分验证...')
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>评分规则配置</div>
        <Space>
          <Button icon={<ThunderboltOutlined />} onClick={handleTest}>测试评分</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存配置</Button>
        </Space>
      </div>

      {/* 评分模式 */}
      <Card title="评分模式" style={{ marginBottom: 12 }} size="small">
        <Form layout="inline">
          <Form.Item label="评分模式">
            <Select value={mode} onChange={setMode} style={{ width: 200 }}>
              <Select.Option value="rule">规则引擎评分</Select.Option>
              <Select.Option value="ai">AI 智能评分</Select.Option>
              <Select.Option value="hybrid">混合模式（AI + 规则校验）</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="基础模型">
            <Select value="sonnet4" style={{ width: 160 }}>
              <Select.Option value="sonnet4">Claude Sonnet 4</Select.Option>
              <Select.Option value="haiku45">Claude Haiku 4.5</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Temperature">
            <InputNumber min={0} max={1} step={0.1} defaultValue={0.1} style={{ width: 80 }} />
          </Form.Item>
        </Form>
        <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          当前：{mode === 'ai' ? 'AI 智能评分' : mode === 'rule' ? '规则引擎评分' : '混合模式'} | 模型：Claude Sonnet 4 | Temperature：0.1
        </div>
      </Card>

      {/* 属性评分规则 */}
      <Card title="属性评分规则 (Attribute Score, 0-40分)" style={{ marginBottom: 12 }} size="small"
        extra={<Button type="link" size="small" icon={<PlusOutlined />}>添加规则</Button>}
      >
        <Table columns={attrColumns} dataSource={attributeRules} rowKey="id" pagination={false} size="small" />
      </Card>

      {/* 行为评分规则 */}
      <Card title="行为评分规则 (Behavior Score, 0-35分)" style={{ marginBottom: 12 }} size="small"
        extra={<Button type="link" size="small" icon={<PlusOutlined />}>添加规则</Button>}
      >
        <Table columns={behaviorColumns} dataSource={behaviorRules} rowKey="id" pagination={false} size="small" />
      </Card>

      {/* 意图评分规则 */}
      <Card title="意图评分规则 (Intent Score, 0-25分)" style={{ marginBottom: 12 }} size="small"
        extra={<Button type="link" size="small" icon={<PlusOutlined />}>添加信号</Button>}
      >
        <Row gutter={12}>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500 }}>正向信号</div>
            <Table columns={intentColumns} dataSource={intentRules.filter(r => r.type === 'positive')} rowKey="id" pagination={false} size="small" />
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500 }}>负向信号</div>
            <Table columns={intentColumns} dataSource={intentRules.filter(r => r.type === 'negative')} rowKey="id" pagination={false} size="small" />
          </Col>
        </Row>
      </Card>

      {/* 等级阈值 */}
      <Card title="等级阈值配置" size="small">
        <Table
          columns={[
            { title: '等级', dataIndex: 'grade', width: 100, render: (v, r) => <Tag color={r.color}>{v}</Tag> },
            { title: '最低分', dataIndex: 'min', width: 100 },
            { title: '最高分', dataIndex: 'max', width: 100 },
            { title: '分配策略', dataIndex: 'action', render: (v) => <span style={{ fontSize: 12 }}>{v}</span> },
            {
              title: '操作', width: 100,
              render: () => <Button type="link" size="small">编辑</Button>,
            },
          ]}
          dataSource={gradeThresholds}
          rowKey="grade"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
