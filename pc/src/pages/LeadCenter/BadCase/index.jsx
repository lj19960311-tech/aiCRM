import { useState, useMemo } from 'react'
import { Table, Button, Space, Input, Select, Tag, Drawer, Form, Row, Col, Pagination, Statistic, Card, message } from 'antd'
import { SearchOutlined, ExportOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { badCaseList } from '../../../mock/badCases'

const typeColors = {
  '评分偏差': 'orange',
  '分配偏差': 'blue',
  '无效误判': 'red',
}

const statusColors = {
  '待处理': 'default',
  '处理中': 'processing',
  '已修复': 'success',
  '已忽略': 'error',
}

export default function BadCase() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [typeFilter, setTypeFilter] = useState(undefined)
  const [statusFilter, setStatusFilter] = useState(undefined)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 })
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [currentCase, setCurrentCase] = useState(null)

  const stats = useMemo(() => {
    return {
      total: badCaseList.length,
      pending: badCaseList.filter(c => c.status === '待处理').length,
      processing: badCaseList.filter(c => c.status === '处理中').length,
      fixed: badCaseList.filter(c => c.status === '已修复').length,
    }
  }, [])

  const filteredData = useMemo(() => {
    return badCaseList.filter(item => {
      if (typeFilter && item.type !== typeFilter) return false
      if (statusFilter && item.status !== statusFilter) return false
      if (searchText && !item.leadName.includes(searchText) && !item.id.includes(searchText) && !item.reason.includes(searchText)) return false
      return true
    })
  }, [typeFilter, statusFilter, searchText])

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    return filteredData.slice(start, start + pagination.pageSize)
  }, [filteredData, pagination])

  const columns = [
    {
      title: '案例ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '线索',
      dataIndex: 'leadName',
      width: 120,
      render: (text, record) => (
        <div>
          <a>{text}</a>
          <div style={{ fontSize: 11, color: '#999' }}>{record.leadId}</div>
        </div>
      ),
    },
    {
      title: '问题类型',
      dataIndex: 'type',
      width: 100,
      render: (val) => <Tag color={typeColors[val]}>{val}</Tag>,
    },
    {
      title: '评分偏差',
      key: 'scoreDiff',
      width: 100,
      render: (_, record) => (
        record.type === '评分偏差' ? (
          <div>
            <span style={{ color: '#999', textDecoration: 'line-through' }}>AI: {record.aiScore}</span>
            <span style={{ margin: '0 4px' }}>→</span>
            <span style={{ color: '#52c41a', fontWeight: 500 }}>实际: {record.adjustedScore}</span>
            <div style={{ fontSize: 11, color: '#ff4d4f' }}>偏差: {record.scoreDiff}分</div>
          </div>
        ) : record.type === '分配偏差' ? (
          <div>
            <span style={{ color: '#999' }}>AI: {record.aiAssignee}</span>
            <span style={{ margin: '0 4px' }}>→</span>
            <span style={{ color: '#52c41a', fontWeight: 500 }}>实际: {record.actualAssignee}</span>
          </div>
        ) : (
          <Tag color="red">无效误判</Tag>
        )
      ),
    },
    {
      title: '原因',
      dataIndex: 'reason',
      width: 100,
      render: (val) => <span style={{ fontSize: 12 }}>{val}</span>,
    },
    {
      title: '上报人',
      dataIndex: 'reportedBy',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (val) => <Tag color={statusColors[val]}>{val}</Tag>,
    },
    {
      title: '修复方案',
      dataIndex: 'fixAction',
      width: 120,
      render: (val, record) => record.status === '已修复' ? <Tag color="green">{val}</Tag> : <span style={{ fontSize: 12, color: '#999' }}>-</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => { setCurrentCase(record); setDrawerVisible(true) }}>
            查看
          </Button>
          {record.status === '待处理' && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} onClick={() => message.success('已标记为已修复')}>
                修复
              </Button>
              <Button type="link" size="small" icon={<CloseOutlined />} danger onClick={() => message.info('已忽略')}>
                忽略
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16, gap: 12, overflow: 'hidden' }}>
      {/* 页面标题 */}
      <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>Bad Case 管理</div>

      {/* 统计卡片 */}
      <Row gutter={12}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Bad Case 总数" value={stats.total} suffix="条" valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="待处理" value={stats.pending} suffix="条" valueStyle={{ fontSize: 20, color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="处理中" value={stats.processing} suffix="条" valueStyle={{ fontSize: 20, color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已修复" value={stats.fixed} suffix="条" valueStyle={{ fontSize: 20, color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      {/* 筛选区 */}
      <div style={{ flex: 'none' }}>
        <Space size="middle" wrap>
          <Select
            placeholder="问题类型"
            style={{ width: 120 }}
            allowClear
            value={typeFilter}
            onChange={(val) => { setTypeFilter(val); setPagination({ ...pagination, current: 1 }) }}
          >
            <Select.Option value="评分偏差">评分偏差</Select.Option>
            <Select.Option value="分配偏差">分配偏差</Select.Option>
            <Select.Option value="无效误判">无效误判</Select.Option>
          </Select>
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            allowClear
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPagination({ ...pagination, current: 1 }) }}
          >
            <Select.Option value="待处理">待处理</Select.Option>
            <Select.Option value="处理中">处理中</Select.Option>
            <Select.Option value="已修复">已修复</Select.Option>
            <Select.Option value="已忽略">已忽略</Select.Option>
          </Select>
          <Input
            placeholder="搜索线索/ID/原因"
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPagination({ ...pagination, current: 1 }) }}
          />
          <Button icon={<ExportOutlined />}>导出 Bad Case</Button>
        </Space>
      </div>

      {/* 操作按钮区 */}
      <div style={{ flex: 'none' }}>
        <Space>
          <Button type="primary" icon={<CheckOutlined />} disabled={selectedRowKeys.length === 0}>
            批量修复{selectedRowKeys.length > 0 ? ` (${selectedRowKeys.length})` : ''}
          </Button>
          <Button danger icon={<CloseOutlined />} disabled={selectedRowKeys.length === 0}>
            批量忽略
          </Button>
        </Space>
      </div>

      {/* 列表区 */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={pagedData}
        rowKey="id"
        scroll={{ x: 1000, y: 'calc(100vh - 350px)' }}
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

      {/* 详情抽屉 */}
      <Drawer
        title={`Bad Case 详情 - ${currentCase?.id}`}
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {currentCase && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color={typeColors[currentCase.type]}>{currentCase.type}</Tag>
              <Tag color={statusColors[currentCase.status]}>{currentCase.status}</Tag>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>线索信息</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{currentCase.leadName} ({currentCase.leadId})</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>问题描述</div>
              <div style={{ fontSize: 13 }}>{currentCase.detail}</div>
            </div>

            {currentCase.type === '评分偏差' && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>评分对比</div>
                <div>
                  AI 评分: <span style={{ fontWeight: 600, color: '#ff4d4f' }}>{currentCase.aiScore}分</span>
                  <span style={{ margin: '0 8px' }}>→</span>
                  调整后: <span style={{ fontWeight: 600, color: '#52c41a' }}>{currentCase.adjustedScore}分</span>
                </div>
                <div style={{ fontSize: 12, color: '#ff4d4f', marginTop: 4 }}>偏差: {currentCase.scoreDiff}分</div>
              </div>
            )}

            {currentCase.type === '分配偏差' && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>分配对比</div>
                <div>
                  AI 分配: <span style={{ fontWeight: 600 }}>{currentCase.aiAssignee}</span>
                  <span style={{ margin: '0 8px' }}>→</span>
                  实际分配: <span style={{ fontWeight: 600 }}>{currentCase.actualAssignee}</span>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>驳回原因</div>
              <Tag color="orange">{currentCase.reason}</Tag>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>上报人</div>
              <div>{currentCase.reportedBy}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>修复方案</div>
              {currentCase.status === '已修复' ? (
                <Tag color="green">{currentCase.fixAction}</Tag>
              ) : (
                <Select style={{ width: '100%' }} placeholder="选择修复方案">
                  <Select.Option value="adjust-weight">调整评分权重</Select.Option>
                  <Select.Option value="update-prompt">优化 Prompt</Select.Option>
                  <Select.Option value="add-signal">增加负向信号</Select.Option>
                  <Select.Option value="update-rule">更新匹配规则</Select.Option>
                  <Select.Option value="adjust-threshold">调整阈值</Select.Option>
                </Select>
              )}
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setDrawerVisible(false)}>取消</Button>
              <Button type="primary" onClick={() => { message.success('处理完成'); setDrawerVisible(false) }}>
                确认处理
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
