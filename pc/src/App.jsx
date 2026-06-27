import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import OrderList from './pages/Sales/OrderList'
import ReturnList from './pages/Sales/ReturnList'
import PurchaseOrder from './pages/Purchase/Order'
import PurchaseReturn from './pages/Purchase/Return'
import WarehouseIn from './pages/Warehouse/In'
import WarehouseOut from './pages/Warehouse/Out'
import LeadList from './pages/LeadCenter/LeadList'
import LeadDetail from './pages/LeadCenter/LeadDetail'
import Dashboard from './pages/LeadCenter/Dashboard'
import ScoringConfig from './pages/LeadCenter/ScoringConfig'
import AssignmentConfig from './pages/LeadCenter/AssignmentConfig'
import BadCase from './pages/LeadCenter/BadCase'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sales/order" element={<OrderList />} />
        <Route path="/sales/return" element={<ReturnList />} />
        <Route path="/purchase/order" element={<PurchaseOrder />} />
        <Route path="/purchase/return" element={<PurchaseReturn />} />
        <Route path="/warehouse/in" element={<WarehouseIn />} />
        <Route path="/warehouse/out" element={<WarehouseOut />} />
        <Route path="/lead-center/lead-list" element={<LeadList />} />
        <Route path="/lead-center/lead-detail" element={<LeadDetail />} />
        <Route path="/lead-center/dashboard" element={<Dashboard />} />
        <Route path="/lead-center/scoring-config" element={<ScoringConfig />} />
        <Route path="/lead-center/assignment-config" element={<AssignmentConfig />} />
        <Route path="/lead-center/bad-case" element={<BadCase />} />
      </Route>
    </Routes>
  )
}

export default App
