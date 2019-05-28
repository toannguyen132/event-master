// eslint-disable
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import { initStore } from '../redux'
import { getProfile } from '../redux/actions/user'
import { deauthenticate } from '../redux/actions/authentication'
import Head from 'next/head'
import initialize from '../utils/initialize'

const authPathRex = /^\/(profile|create-event)/
const requireAuth = (path) => authPathRex.test(path)

export default withRedux(initStore, { debug: false })(

  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {

      const newProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}

      // init token
      initialize(ctx)

      // verify authentication
      const token = ctx.store.getState().authentication.token
      const currentUser = ctx.store.getState().user.currentUser

      const pathname = ctx.pathname


      if (token){
        try{
          // fetch user if server is rendering or current user is empty
          if (ctx.req || !currentUser.email) {
            await ctx.store.dispatch(getProfile())
          }
        } catch (e) {
          ctx.store.dispatch(deauthenticate())
          if (requireAuth(pathname)){
            Router.push('/')
          }
        }
      }

      return {
        pageProps: {
          ...newProps
        }
      }
    }

    render() {
      const { Component, pageProps, store } = this.props
      return (
        <Container>
          <Head>
            <title>My page</title>
          </Head>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Container>
      )
    }
  }
)
