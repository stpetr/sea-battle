import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import HomePage from '../components/HomePage'
import RegisterPage from '../components/RegisterPage'
import LoginPage from '../components/LoginPage'
import DashboardPage from '../components/DashboardPage'
import GamePage from '../components/GamePage'
import RandomGamePage from '../components/RandomGamePage'
import NotFoundPage from '../components/NotFoundPage'

const AppRouter = () => (
  <BrowserRouter>
    <Switch>
      <PublicRoute path="/" component={HomePage} exact={true}/>
      <PublicRoute path="/register" component={RegisterPage}/>
      <PublicRoute path="/login" component={LoginPage}/>
      <PrivateRoute path="/dashboard" component={DashboardPage}/>
      <PrivateRoute path="/random-game" component={RandomGamePage}/>
      <PrivateRoute path="/game/:id" component={GamePage}/>
      <Route component={NotFoundPage}/>
    </Switch>
  </BrowserRouter>
)

export default AppRouter
