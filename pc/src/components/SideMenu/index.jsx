import { Layout, Menu } from 'antd'
import { UserOutlined, BellOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { menuItems as rawMenuItems } from '../../router'
import { useTab } from '../../stores/tabStore'

const { Sider } = Layout

function findLabel(key, items) {
  for (const item of items) {
    if (item.key === key) return item.label
    if (item.children) {
      const found = findLabel(key, item.children)
      if (found) return found
    }
  }
  return null
}

// 给菜单项添加样式
function processMenuItems(items, level = 1) {
  return items.map(item => {
    const fontSize = level === 1 ? 15 : level === 2 ? 14 : 13
    const result = {
      ...item,
      style: { fontSize, fontWeight: level === 1 ? 500 : 400 },
      label: item.label,
    }
    if (item.children) {
      result.children = processMenuItems(item.children, level + 1)
    }
    return result
  })
}

const menuItems = processMenuItems(rawMenuItems)

// 收集所有叶子菜单 key
function getLeafKeys(items) {
  const keys = new Set()
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      getLeafKeys(item.children).forEach(k => keys.add(k))
    } else {
      keys.add(item.key)
    }
  }
  return keys
}

const leafKeys = getLeafKeys(rawMenuItems)

export default function SideMenu() {
  const navigate = useNavigate()
  const { addTab } = useTab()

  const handleMenuClick = ({ key }) => {
    // 只导航叶子菜单项，忽略父级菜单
    if (!leafKeys.has(key)) return
    if (key === '/home') {
      navigate('/')
    } else {
      navigate(key)
    }
    addTab({ key, label: findLabel(key, rawMenuItems) || key })
  }

  return (
    <Sider
      width={200}
      style={{
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#FF6B00',
        }}
      >
        PC后台
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['/home']}
        defaultOpenKeys={['lead-center', 'sales', 'purchase', 'warehouse']}
        style={{ height: 'calc(100vh - 56px - 60px)', borderRight: 0, flex: 1 }}
        items={menuItems}
        onClick={handleMenuClick}
      />
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
        }}
      >
        <UserOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
      </div>
    </Sider>
  )
}
