import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Space, Input, Select, Tag, Statistic, Row, Col, Card, message } from 'antd'
import { SearchOutlined, ExportOutlined, BarChartOutlined, SettingOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { leadList } from '../../../mock/leads'

const gradeColors = {
  'A级': 'green',
  'B级': 'gold',
  'C级': 'red',
}

const statusColors = {
  '待分配': 'default',
  '跟进中': 'processing',
  '已转化': 'success',
  '已无效': 'error',
  '培育池': 'warning',
}

export default function LeadList() {
  const navigate = useNavigate()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [gradeFilter, setGradeFilter] = useState('全部')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState(undefined)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 })

  const stats = useMemo(() => {
    const all = gradeFilter === '全部' ? leadList : leadList.filter(l => l.grade === gradeFilter)
    return {
      total: all.length,
      aCount: all.filter(l => l.grade === 'A级').length,
      bCount: all.filter(l => l.grade === 'B级').length,
      cCount: all.filter(l => l.grade === 'C级').length,
    }
  }, [gradeFilter])

  const filteredData = useMemo(() => {
    return leadList.filter(lead => {
      if (gradeFilter !== '全部' && lead.grade !== gradeFilter) return false
      if (statusFilter && lead.status !== statusFilter) return false
      if (searchText && !lead.name.includes(searchText) && !lead.id.includes(searchText) && !lead.industry.includes(searchText)) return false
      return true
    }).sort((a, b) => b.overallScore - a.overallScore)
  }, [gradeFilter, statusFilter, searchText])

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    return filteredData.slice(start, start + pagination.pageSize)
  }, [filteredData, pagination])

  const columns = [
    {
      title: '评分',
      dataIndex: 'overallScore',
      width: 80,
      fixed: 'left',
      sorter: (a, b) => a.overallScore - b.overallScore,
      defaultSortOrder: 'descend',
      render: (score, record) => (
        <div style={{ textAlign: 'center' }}>
          <Tag color={gradeColors[record.grade]} style={{ fontSize: 16, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
            {record.gradeKey === 'A' ? '🟢' : record.gradeKey === 'B' ? '🟡' : '🔴'} {score}
          </Tag>
        </div>
      ),
    },
    {
      title: '线索名称',
      dataIndex: 'name',
      width: 140,
      render: (text, record) => (
        <div>
          <a onClick={() => navigate(`/lead-center/lead-detail?id=${record.id}`)} style={{ fontWeight: 500 }}>
            {text}
          </a>
          <div style={{ fontSize: 12, color: '#999' }}>{record.id}</div>
        </div>
      ),
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 80,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 90,
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      width: 90,
    },
    {
      title: '规模',
      dataIndex: 'companySize',
      width: 80,
      render: (val) => `${val}人`,
    },
    {
      title: '分配人',
      dataIndex: 'assignee',
      width: 80,
      render: (val) => val || <Tag color="default">未分配</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (val) => <Tag color={statusColors[val]}>{val}</Tag>,
    },
    {
      title: 'AI 建议',
      dataIndex: 'aiRecommendation',
      width: 180,
      render: (text) => <span style={{ fontSize: 12, color: '#666' }}>{text}</span>,
    },
    {
      title: '反馈',
      dataIndex: 'feedback',
      width: 60,
      render: (val) => val || '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 150,
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => navigate(`/lead-center/lead-detail?id=${record.id}`)}>
            查看
          </Button>
          <Button type="link" size="small">调整</Button>
          <Button type="link" size="small">重新分配</Button>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  const handleExport = () => {
    message.success(`已导出 ${selectedRowKeys.length || filteredData.length} 条线索`)
  }

  const handleBatchAssign = () => {
    message.success(`已对 ${selectedRowKeys.length} 条线索执行 AI 智能分配`)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 12, overflow: 'hidden' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>线索列表</div>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => navigate('/lead-center/scoring-config')}>
            评分规则
          </Button>
          <Button icon={<BarChartOutlined />} onClick={() => navigate('/lead-center/dashboard')}>
            数据看板
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={12}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="线索总数" value={stats.total} suffix="条" valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="A级线索" value={stats.aCount} suffix="条" valueStyle={{ fontSize: 20, color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="B级线索" value={stats.bCount} suffix="条" valueStyle={{ fontSize: 20, color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="C级线索" value={stats.cCount} suffix="条" valueStyle={{ fontSize: 20, color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      {/* 等级筛选 + 搜索 */}
      <div style={{ flex: 'none' }}>
        <Space size="middle" wrap>
          <Space size="small">
            <span style={{ color: '#666', fontSize: 13 }}>等级筛选：</span>
            {['全部', 'A级', 'B级', 'C级'].map(g => (
              <Button
                key={g}
                type={gradeFilter === g ? 'primary' : 'default'}
                size="small"
                onClick={() => { setGradeFilter(g); setPagination({ ...pagination, current: 1 }) }}
              >
                {g}
              </Button>
            ))}
          </Space>
          <Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            allowClear
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPagination({ ...pagination, current: 1 }) }}
          >
            <Select.Option value="待分配">待分配</Select.Option>
            <Select.Option value="跟进中">跟进中</Select.Option>
            <Select.Option value="已转化">已转化</Select.Option>
            <Select.Option value="已无效">已无效</Select.Option>
            <Select.Option value="培育池">培育池</Select.Option>
          </Select>
          <Input
            placeholder="搜索线索名称/ID/行业"
            style={{ width: 220 }}
            allowClear
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPagination({ ...pagination, current: 1 }) }}
          />
        </Space>
      </div>

      {/* 操作按钮区 */}
      <div style={{ flex: 'none' }}>
        <Space>
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleBatchAssign} disabled={selectedRowKeys.length === 0}>
            AI 智能分配{selectedRowKeys.length > 0 ? ` (${selectedRowKeys.length})` : ''}
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            批量导出
          </Button>
        </Space>
      </div>

      {/* 列表区 */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={pagedData}
        rowKey="id"
        scroll={{ x: 1200, y: 'calc(100vh - 420px)' }}
        pagination={false}
        style={{ flex: 1, overflow: 'hidden' }}
      />

      {/* 分页区 */}
      <div style={{ flex: 'none', display: 'flex', justifyContent: 'flex-end', paddingTop: 12 }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={filteredData.length}
          onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['10', '20', '50']}
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>
    </div>
  )
}
