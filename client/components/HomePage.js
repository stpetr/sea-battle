import React from 'react';
import { Link } from 'react-router-dom'

export class HomePage extends React.Component {
    render() {
        return (
            <div className="page page__home">
                <h1 className="page__heading">Welcome to our home page!</h1>
                <p>
                    Please <Link to="/register">sign up</Link> or <Link to="/login">sign in</Link> if you already have an account to play the game
                </p>
            </div>
        )
    }
}

export default HomePage
