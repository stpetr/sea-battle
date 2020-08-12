import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import HomePage from '../components/HomePage'
import NotFoundPage from '../components/NotFoundPage'

export const history = createBrowserHistory()

const AppRouter = () => (
    <Router history={history}>
        <Switch>
            <PublicRoute path="/" component={HomePage} exact={true} />
            <Route component={NotFoundPage} />
        </Switch>
    </Router>
)

export default AppRouter
