import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { beginLogout } from '../actions/auth'
import { beginCreatePrivateGame } from '../actions/game'

export class DashboardPage extends React.Component {
    logout = () => {
        this.props.beginLogout()
    }
    createPrivateGame = () => {
        this.props.beginCreatePrivateGame().then(({ game }) => {
            this.props.history.push(`/games/private/${game._id}`)
        })
    }
    render() {
        return (
            <div className="page page__dashboard">
                <h1>Dashboard page</h1>
                <p>You're logged in as <strong>{this.props.auth.user.name} &lt;{this.props.auth.user.email}&gt; </strong></p>
                <button onClick={this.logout}>Logout</button>

                <hr/>

                <p>You can create a private game and send the link to your friend to play together</p>
                <p>
                    <button onClick={this.createPrivateGame}>Create private game</button>
                </p>

                <Link to="/random-game">Play with a random player</Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    games: state.games,
})

const mapDispatchToProps = (dispatch) => ({
    beginLogout: () => dispatch(beginLogout()),
    beginCreatePrivateGame: () => dispatch(beginCreatePrivateGame()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
