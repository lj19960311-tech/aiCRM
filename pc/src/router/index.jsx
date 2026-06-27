import Home from '../pages/Home'
import OrderList from '../pages/Sales/OrderList'
import ReturnList from '../pages/Sales/ReturnList'
import PurchaseOrder from '../pages/Purchase/Order'
import PurchaseReturn from '../pages/Purchase/Return'
import WarehouseIn from '../pages/Warehouse/In'
import WarehouseOut from '../pages/Warehouse/Out'
import LeadList from '../pages/LeadCenter/LeadList'
import LeadDetail from '../pages/LeadCenter/LeadDetail'
import Dashboard from '../pages/LeadCenter/Dashboard'
import ScoringConfig from '../pages/LeadCenter/ScoringConfig'
import AssignmentConfig from '../pages/LeadCenter/AssignmentConfig'
import BadCase from '../pages/LeadCenter/BadCase'

export const menuItems = [
  {
    key: 'lead-center',
    label: '线索中心',
    children: [
      { key: '/lead-center/lead-list', label: '线索列表' },
      { key: '/lead-center/dashboard', label: '数据看板' },
      { key: '/lead-center/bad-case', label: 'Bad Case 管理' },
      { key: '/lead-center/config', label: '规则配置', children: [
        { key: '/lead-center/scoring-config', label: '评分规则配置' },
        { key: '/lead-center/assignment-config', label: '分配规则配置' },
      ]},
    ],
  },
  {
    key: 'sales',
    label: '销售中心',
    children: [
      {
        key: 'sales-order',
        label: '商品销售',
        children: [
          { key: '/sales/order', label: '订单列表' },
          { key: '/sales/return', label: '退货单列表' },
        ],
      },
    ],
  },
  {
    key: 'purchase',
    label: '采购中心',
    children: [
      {
        key: 'purchase-order',
        label: '采购管理',
        children: [
          { key: '/purchase/order', label: '采购订单' },
          { key: '/purchase/return', label: '采购退货' },
        ],
      },
    ],
  },
  {
    key: 'warehouse',
    label: '仓储中心',
    children: [
      {
        key: 'warehouse-in',
        label: '入库管理',
        children: [
          { key: '/warehouse/in', label: '入库单' },
          { key: '/warehouse/out', label: '出库单' },
        ],
      },
    ],
  },
]

export const routeConfig = {
  '/home': { label: '首页', component: Home },
  '/lead-center/lead-list': { label: '线索列表', component: LeadList },
  '/lead-center/lead-detail': { label: '线索详情', component: LeadDetail },
  '/lead-center/dashboard': { label: '数据看板', component: Dashboard },
  '/lead-center/scoring-config': { label: '评分规则配置', component: ScoringConfig },
  '/lead-center/assignment-config': { label: '分配规则配置', component: AssignmentConfig },
  '/lead-center/bad-case': { label: 'Bad Case 管理', component: BadCase },
  '/sales/order': { label: '订单列表', component: OrderList },
  '/sales/return': { label: '退货单列表', component: ReturnList },
  '/purchase/order': { label: '采购订单', component: PurchaseOrder },
  '/purchase/return': { label: '采购退货', component: PurchaseReturn },
  '/warehouse/in': { label: '入库单', component: WarehouseIn },
  '/warehouse/out': { label: '出库单', component: WarehouseOut },
}
