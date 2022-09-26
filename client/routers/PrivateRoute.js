import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Header from '../components/Header'

export const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route {...rest} component={(props) => (
    isAuthenticated ? (
      [
        <Header/>,
        <Component {...props} />,
      ]
    ) : (
      <Redirect to="/"/>
    )
  )}/>
)

const mapStateToProps = (state) => ({
  isAuthenticated: Boolean(state.auth.user),
})

export default connect(mapStateToProps)(PrivateRoute)
