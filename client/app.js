import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import AppRouter from './routers/AppRouter'
import { beginAuthenticate } from './actions/auth'

import 'normalize.css/normalize.css'
import './styles/main.less'

const store = configureStore()
const rootElement = document.querySelector('#app')
const tpl = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
)

ReactDom.render(tpl, rootElement)

// Check if user has valid token in local storage
store.dispatch(beginAuthenticate())
