import React from 'react'
import { connect } from 'react-redux'
import Loader from "./Loader";
import sockets from '../helpers/sockets'
import SetBoard from './SetBoard'
import Game from './Game'
import {
  beginCreatePrivateGame,
  beginFetchPrivateGame,
  beginJoinGame,
  beginSetShips,
  beginMakeShot,
  setGameData,
  beginRequestRevanche,
  beginAcceptRevanche,
} from '../actions/game'
import { Link } from 'react-router-dom'
import { getPrivateGameUrl } from '../helpers/url'
import { GAME_TYPE_PRIVATE } from '@packages/game-mechanics'
import { ConfirmModal } from './ConfirmModal'

export class GamePage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gameId: props.match.params.id,
      isRevancheRequested: false,
      // isLoading: true,
      // game: {},
    }
  }

  componentDidMount() {
    sockets.on(`opponentJoined`, ({ data }) => {
      this.props.setGameData(data)
    })

    sockets.on(`makeShot`, ({ data }) => {
      this.props.setGameData(data)
      // console.log('makeShot event fired', data)
    })

    sockets.on(`opponentSetShips`, ({ data }) => {
      this.props.setGameData(data)
    })

    sockets.on(`gameOver`, ({ data }) => {
      this.props.setGameData(data)
    })

    sockets.on(`requestRevanche`, ({ data }) => {
      this.setState({
        isRevancheRequested: true,
      })
    })

    sockets.on(`revancheAccepted`, ({ data }) => {
      this.props.history.push(`/game/${data._id}`)
    })

    this.props.beginFetchPrivateGame(this.state.gameId)
  }

  joinGame = () => {
    this.props.beginJoinGame(this.state.gameId)
  }
  setShips = (ships) => {
    this.props.beginSetShips(this.state.gameId, ships)
  }
  makeShot = (row, col) => {
    this.props.beginMakeShot(this.state.gameId, { row, col })
  }

  requestRevanche = () => {
    this.props.beginRequestRevanche(this.state.gameId)
  }

  acceptRevanche = () => {
    this.props.beginAcceptRevanche(this.state.gameId)
    this.setState({
      isRevancheRequested: false,
    })
  }

  rejectRevanche = () => {
    this.setState({
      isRevancheRequested: false,
    })
  }

  render() {
    if (this.state.isRevancheRequested) {
      return (
        <ConfirmModal
          show={true}
          title="Revanche?"
          message="Would you like to play again?"
          onYes={this.acceptRevanche}
          onNo={this.rejectRevanche}
        />
      )
    }

    if (this.props.game && this.props.game.winner) {
      return (
        <div className="game-over container">
          <h1 className="game-over__heading">Game Over</h1>
          {this.props.game.winner === this.props.game.player._id ? (
            <h2 className="game-over__result game-over__result--won">You've won!</h2>
          ) : (
            <h2 className="game-over__result game-over__result--lost">You've lost!</h2>
          )}
          <div className="game-over__buttons">
            <button className="btn btn-main" onClick={this.requestRevanche}>Revanche?</button>
            <Link className="btn btn-info" to="/dashboard">Continue</Link>
          </div>
        </div>
      )
    }

    return !this.props.game ? (
      <Loader/>
    ) : (
      <div className="page page__game container">

        <h1 className="page-heading">Game: {this.state.gameId}</h1>

        {this.props.game.status === 'join' && (
          <div>
            <p>You haven't join the game yet. Please click on this button</p>
            <button onClick={this.joinGame}>Join</button>
          </div>
        )}
        {this.props.game.status === 'set' && (
          <SetBoard setShips={this.setShips} game={this.props.game}/>
        )}
        {this.props.game.status === 'play' && (
          <Game game={this.props.game} makeShot={this.makeShot}/>
        )}
        {/*<div className="game__opponent">*/}
        {/*  {this.props.game.opponent ? (*/}
        {/*    <div>*/}
        {/*      <p>Opponent: {this.props.game.opponent.name}</p>*/}
        {/*    </div>*/}
        {/*  ) : (*/}
        {/*    <p>The opponent hasn't joined yet</p>*/}
        {/*  )}*/}
        {/*  {(!this.props.game.opponent && this.props.game.type === GAME_TYPE_PRIVATE) && (*/}
        {/*    <p>*/}
        {/*      Send this link to your friend and start playing:*/}
        {/*      <Link to={getPrivateGameUrl(this.props.game._id, true)}>*/}
        {/*        {getPrivateGameUrl(this.props.game._id)}*/}
        {/*      </Link>*/}
        {/*    </p>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  game: state.game.game,
})

const mapDispatchToProps = (dispatch) => ({
  beginFetchPrivateGame: (gameId) => dispatch(beginFetchPrivateGame(gameId)),
  beginCreatePrivateGame: () => dispatch(beginCreatePrivateGame()),
  beginJoinGame: (gameId) => dispatch(beginJoinGame(gameId)),
  beginSetShips: (gameId, ships) => dispatch(beginSetShips(gameId, ships)),
  beginMakeShot: (gameId, shot) => dispatch(beginMakeShot(gameId, shot)),
  setGameData: (game) => dispatch(setGameData(game)),
  beginRequestRevanche: (gameId) => dispatch(beginRequestRevanche(gameId)),
  beginAcceptRevanche: (gameId) => dispatch(beginAcceptRevanche(gameId))
})

export default connect(mapStateToProps, mapDispatchToProps)(GamePage)
