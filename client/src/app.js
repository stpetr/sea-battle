import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import AppRouter from './routers/AppRouter'
import Loader from './components/Loader'
import { authenticate, beginAuthenticate } from './actions/auth'
import sockets from './helpers/sockets'

import './styles/bootstrap-theme.scss'
import './styles/main.less'

const store = configureStore()
const rootElement = document.getElementById('app')
const tpl = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
)

ReactDom.render(<Loader/>, rootElement)

// Check if user has valid token in local storage
store.dispatch(beginAuthenticate()).then((data) => {
  if (data && data.user) {
    store.dispatch(authenticate(data.user))
    sockets.connect()
  }

  ReactDom.render(tpl, rootElement)
})
