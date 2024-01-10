import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { authenticate, beginAuthenticate } from 'actions/auth'
import configureStore from './store/configureStore'
import AppRouter from './routers/AppRouter'
import Loader from './components/Loader'
import sockets from './helpers/sockets'

import './styles/bootstrap-theme.scss'
import './styles/main.less'

const store = configureStore()
const appRoot = createRoot(document.getElementById('app'))

appRoot.render(<Loader/>)

// Check if user has valid token in local storage
store.dispatch(beginAuthenticate()).then((data) => {
  if (data && data.user) {
    store.dispatch(authenticate(data.user))
    sockets.connect()
  }

  appRoot.render(
    <Provider store={store}>
      <AppRouter/>
    </Provider>
  )
})
