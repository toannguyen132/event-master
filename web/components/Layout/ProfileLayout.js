import { Component } from 'react'
import { Layout, Menu } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { profileMenu } from '../../model/menus'

const { Content, Sider } = Layout

const Wrapper = styled(Layout)`
  box-shadow: 0 10px 20px 0 rgba(0,0,0,0.05)
`
const Sidebar = styled(Sider)`
  background: #eaf5ee;
`
export const LayoutContent = styled(Content)`
  padding: 30px;
  background-color: #fff;
`

class ProfileLayout extends Component {
  
  render() { 
    const {children, activeKey = 'profile'} = this.props

    return (
      <Wrapper>
        <Sidebar>
          <Menu 
            selectedKeys={[activeKey]}
            style={{ height: '100%' }}
          >
            {profileMenu.map(mi => (
              <Menu.Item key={mi.key} title={mi.label}>
                <Link href={mi.url}>
                  <span>
                    {mi.icon} {mi.label}
                  </span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sidebar>
        <LayoutContent>
          {children}
        </LayoutContent>
      </Wrapper>
    )
  }
}
 
export default ProfileLayout