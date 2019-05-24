import Link from 'next/link'
import { Avatar } from 'antd'
import styled from 'styled-components'

const linkStyle = {
  marginRight: 15
}

const HeaderContainer = styled.div`
  background-color: #445362;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .header-left {
    ul{
      padding-left: 0;
      margin-bottom: 0;
      li{
        display: inline-block;
      }
    }
    a{
      color: #fff;
      cursor: pointer;
      display: block;
      padding: 5px 20px;
      &:hover{
        color: #eaeaea;
      }
    }
  }
  .header-right {
    .username{
      margin-right: 15px;
      vertical-align: middle;
    }
   }
`

const Header = () => (
  <HeaderContainer>
    <div className="header-left">
      <ul>
        <li>
          <Link href="/">
            <a style={linkStyle}>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a style={linkStyle}>Login</a>
          </Link>
        </li>
      </ul>
    </div>

    <div className="header-right">
      <span className='username'>{'Welcome, Guest'}</span>
      <Avatar size={35} />
    </div>
  </HeaderContainer>
)

export default Header
