import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderPublic from '../components/HeaderPublic'
import Footer from '../components/Footer'

export const PublicRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route {...rest} component={(props) => (
    !isAuthenticated ? (
      [
        <HeaderPublic/>,
        <Component {...props} />,
        <Footer/>,
      ]
    ) : (
      <Redirect to="/dashboard"/>
    )
  )}/>
)

const mapStateToProps = (state) => ({
  isAuthenticated: Boolean(state.auth.user),
})

export default connect(mapStateToProps)(PublicRoute)
