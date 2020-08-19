import React from 'react'
import { connect } from 'react-redux'
import { beginLogout } from '../actions/auth'

export class DashboardPage extends React.Component {
    logout = () => {
        this.props.beginLogout()
    }
    render() {
        return (
            <div className="page page__dashboard">
                <h1>Dashboard page</h1>
                <p>You're logged in as <strong>{this.props.auth.user.name} &lt;{this.props.auth.user.email}&gt; </strong></p>
                <button onClick={this.logout}>Logout</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    beginLogout: () => dispatch(beginLogout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
