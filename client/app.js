import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import AppRouter from './routers/AppRouter'

import 'normalize.css/normalize.css'

const store = configureStore()

const tpl = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
)

ReactDom.render(tpl, document.querySelector('#app'))
