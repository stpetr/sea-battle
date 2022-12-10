import React from 'react'
import { makeApiRequest } from '../helpers/fetch'
import sockets from '../helpers/sockets'

export class RandomGamePage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    sockets.on('randomGameReady', (game) => {
      this.props.history.push(`/game/${game._id}`)
    })

    makeApiRequest('random-game/check-in', { method: 'POST' }).then((data) => {
      console.log('Checked in for a random game', data)
    })
  }

  componentWillUnmount() {
    makeApiRequest('random-game/check-out', { method: 'POST' }).then((data) => {
      console.log('Checked out from random game', data)
    })
  }

  render() {
    return (
      <div className="page page__random-game">
        <h1 className="page-heading">Random Game</h1>
        <p>Waiting for a partner...</p>
      </div>
    )
  }
}

export default RandomGamePage
