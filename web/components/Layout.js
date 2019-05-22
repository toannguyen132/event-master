import Header from './Header'
import '../assets/style.less'

const Layout = props => (
  <div className="layout">
    <Header />
    {props.children}
  </div>
)

export default Layout
