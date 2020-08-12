import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

export const PublicRoute = ({ isAuthenticated, component: Component, ...rest }) => (
    <Route {...rest} component={(props) => (
        !isAuthenticated ? (
            <Component {...props} />
        ) : (
            <Redirect to="/dashboard" />
        )
    )} />
)

const mapStateToProps = (state) => ({
    isAuthenticated: Boolean(state.auth.uid)
})

export default connect(mapStateToProps)(PublicRoute)
