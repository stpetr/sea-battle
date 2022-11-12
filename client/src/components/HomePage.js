import React from 'react';
import { Link } from 'react-router-dom'

export class HomePage extends React.Component {
  render() {
    return (
      <div className="page page__home container">
        <h1 className="page__heading">Sea Battle Game</h1>

        <div className="card mb-3" style={{ maxWidth: '540px;' }}>
          <div className="row g-0">
            <div className="col-md-6">
              <div className="card-body">
                <h5 className="card-title">Sea Battle Game</h5>
                <p className="card-text">This is the classic Battleship Game implementation.
                  Have a nice time playing it online.</p>
                <p className="card-text">Please <Link to="/register">sign up</Link> or <Link to="/login">sign
                  in</Link> if you already have an account to play the game.</p>
              </div>
            </div>
            <div className="col-md-6">
              <img src="/images/battleship.png" className="img-fluid rounded-end"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage
