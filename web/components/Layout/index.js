import Header from '../Header'


const Index = props => (
  <div className="wrapper">
    <Header />
    {props.children}
  </div>
)

export default Index
