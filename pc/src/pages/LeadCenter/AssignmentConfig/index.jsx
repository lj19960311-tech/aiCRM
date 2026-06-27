import { useState } from 'react'
import { Card, Row, Col, Form, Select, InputNumber, Switch, Button, Table, Space, Tag, Slider, message } from 'antd'
import { SaveOutlined, ThunderboltOutlined, SettingOutlined } from '@ant-design/icons'
import { salesTeam } from '../../../mock/leads'

export default function AssignmentConfig() {
  const [strategy, setStrategy] = useState('ai')

  const assignmentColumns = [
    { title: '销售员', dataIndex: 'name', width: 100 },
    { title: '行业专长', dataIndex: 'industryExpertise', width: 200, render: (v) => v.map(t => <Tag key={t} size="small">{t}</Tag>) },
    { title: '负责区域', dataIndex: 'region', width: 80 },
    {
      title: '当前负载',
      dataIndex: 'currentLoad',
      width: 150,
      render: (val, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Slider value={val} max={30} style={{ flex: 1 }} disabled />
          <span style={{ fontSize: 12, width: 50 }}>{val}/30</span>
        </div>
      ),
    },
    { title: '转化率', dataIndex: 'conversionRate', width: 80, render: (v) => `${(v * 100).toFixed(0)}%` },
    { title: '响应速度', dataIndex: 'avgResponseTime', width: 100, render: (v) => `${v} 分钟` },
    {
      title: '负载上限',
      dataIndex: 'maxLoad',
      width: 120,
      render: (val, record) => (
        <InputNumber defaultValue={30} min={5} max={50} size="small" style={{ width: 80 }} />
      ),
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 60,
      render: () => <Switch defaultChecked size="small" />,
    },
  ]

  const salesData = salesTeam.map(s => ({ ...s, enabled: true, maxLoad: 30 }))

  const handleSave = () => {
    message.success('分配规则已保存')
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>分配规则配置</div>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => message.info('打开高级设置')}>高级设置</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存配置</Button>
        </Space>
      </div>

      {/* 分配策略 */}
      <Card title="分配策略" style={{ marginBottom: 12 }} size="small">
        <Form layout="inline">
          <Form.Item label="分配模式">
            <Select value={strategy} onChange={setStrategy} style={{ width: 220 }}>
              <Select.Option value="ai">AI 智能推荐分配</Select.Option>
              <Select.Option value="rule">规则引擎分配</Select.Option>
              <Select.Option value="manual">纯手动分配</Select.Option>
              <Select.Option value="hybrid">混合模式（AI 推荐 + 人工确认）</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          当前：{strategy === 'ai' ? 'AI 智能推荐' : strategy === 'rule' ? '规则引擎分配' : strategy === 'manual' ? '纯手动分配' : '混合模式'}
        </div>
      </Card>

      {/* 匹配维度权重 */}
      <Card title="AI 匹配维度权重" style={{ marginBottom: 12 }} size="small">
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>行业专长匹配</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#FF6B00' }}>40%</div>
              <div style={{ fontSize: 12, color: '#999' }}>销售的历史行业经验是否覆盖线索行业</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>地域匹配</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>25%</div>
              <div style={{ fontSize: 12, color: '#999' }}>销售负责区域是否覆盖线索所在地区</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>历史转化率</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#52c41a' }}>20%</div>
              <div style={{ fontSize: 12, color: '#999' }}>销售对该行业/规模的成交率</div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>当前负载</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#722ed1' }}>10%</div>
              <div style={{ fontSize: 12, color: '#999' }}>销售当前跟进线索数，避免过载</div>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>响应速度</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#13c2c2' }}>5%</div>
              <div style={{ fontSize: 12, color: '#999' }}>销售的平均响应时间</div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 规则分配配置 */}
      <Card title="规则引擎分配配置" style={{ marginBottom: 12 }} size="small">
        <Form layout="vertical" size="small">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="轮询策略">
                <Select defaultValue="round-robin">
                  <Select.Option value="round-robin">轮询分配</Select.Option>
                  <Select.Option value="weighted">加权轮询（按转化率加权）</Select.Option>
                  <Select.Option value="least-load">最少负载优先</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="地域优先">
                <Switch defaultChecked />
                <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>优先按地域匹配</span>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="行业优先">
                <Switch defaultChecked />
                <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>优先按行业匹配</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 回收规则 */}
      <Card title="线索回收规则" style={{ marginBottom: 12 }} size="small">
        <Form layout="inline" size="small">
          <Form.Item label="超时回收">
            <InputNumber defaultValue={48} min={1} max={168} addonAfter="小时" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="A级线索超时">
            <InputNumber defaultValue={4} min={1} max={24} addonAfter="小时" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="回收后动作">
            <Select defaultValue="reassign" style={{ width: 160 }}>
              <Select.Option value="reassign">重新分配</Select.Option>
              <Select.Option value="pool">进入公共池</Select.Option>
              <Select.Option value="notify">通知主管处理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="启用自动回收">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Card>

      {/* HITL 触发条件 */}
      <Card title="人在环 (HITL) 触发条件" style={{ marginBottom: 12 }} size="small">
        <Table
          columns={[
            { title: '场景', dataIndex: 'scenario', width: 180 },
            { title: '触发条件', dataIndex: 'condition', width: 250 },
            { title: '触发动作', dataIndex: 'action', render: (v) => <Tag color="orange">{v}</Tag> },
            { title: '启用', dataIndex: 'enabled', width: 60, render: () => <Switch defaultChecked size="small" /> },
          ]}
          dataSource={[
            { scenario: 'AI 分配结果', condition: 'AI 分配置信度 < 0.7', action: '转人工确认' },
            { scenario: '评分争议', condition: '销售对 AI 评分"点踩"', action: '进入人工复核' },
            { scenario: '批量异常', condition: '连续 10 条被标记无效', action: '暂停自动分配' },
            { scenario: '高价值线索', condition: 'A级线索 4h 未查看', action: '通知销售主管' },
          ]}
          rowKey="scenario"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 销售团队配置 */}
      <Card title="销售团队配置" size="small"
        extra={<Button type="link" size="small">添加销售</Button>}
      >
        <Table
          columns={assignmentColumns}
          dataSource={salesData}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
