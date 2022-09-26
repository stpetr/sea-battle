import React from 'react'
import { connect } from 'react-redux'
import Ship from './Ship'
import {
  SHIP,
  SHOT_RESULT_MISSED,
  SHOT_RESULT_WOUNDED,
  SHOT_RESULT_KILLED,
  GAME_STATUS_PLAY,
  getShipCellsCoords,
  putShipsOnBoard,
} from '../../common/helpers/game-mechanics'
import Board from "./Board";

export class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playerBoard: [],
      opponentBoard: [],
    }

    this.constants = props.game.constants
  }

  componentDidMount() {
    console.log('did mount, game:', this.props.game)
    this.initBoard(`playerBoard`, this.props.game.ships, this.getOpponentShots())
    this.initBoard(`opponentBoard`, [], this.getShots())
  }

  componentWillReceiveProps(nextProps) {
    // console.log('props will change', nextProps)
    this.initBoard(`playerBoard`, this.props.game.ships, this.getOpponentShots(nextProps.game.shots))
    this.initBoard(`opponentBoard`, [], this.getShots(nextProps.game.shots))
  }

  componentWillUnmount() {

  }

  initBoard = (stateProp, ships = [], shots = []) => {
    const board = []

    for (let row = 0; row < this.constants.BATTLEFIELD_SIZE; row++) {
      for (let col = 0; col < this.constants.BATTLEFIELD_SIZE; col++) {
        if (!Array.isArray(board[row])) {
          board[row] = []
        }

        board[row][col] = null
      }
    }

    ships.forEach((ship) => {
      getShipCellsCoords(ship).forEach(({ row, col }) => {
        board[row][col] = SHIP
      })
    })

    shots.forEach((shot) => {
      board[shot.row][shot.col] = shot.result
    })

    this.setState({ [stateProp]: board })
  }

  getShots(shots) {
    if (typeof shots === 'undefined') {
      shots = this.props.game.shots
    }
    return shots.filter((shot) => shot.playerId === this.props.game.player._id)
  }

  getOpponentShots(shots) {
    if (typeof shots === 'undefined') {
      shots = this.props.game.shots
    }
    return shots.filter((shot) => shot.playerId === this.props.game.opponent._id)
  }

  render() {
    // console.log('game rendered', game.nextMove, game.player._id)
    const { game } = this.props
    return (
      <div className="game">
        <div className="game__board">
          <p>Player Board</p>
          <Board board={this.state.playerBoard} shots={game.shots}/>
        </div>
        <div className="game__board">
          <p>Opponent Board</p>
          <Board board={this.state.opponentBoard} onCellClick={this.props.makeShot}/>
        </div>

        {game.nextMove === game.player._id && (
          <p>It's your turn </p>
        )}
        {game.opponent && game.nextMove === game.opponent._id && (
          <p>It's opponent's turn </p>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  game: state.game.game,
})

export default connect(mapStateToProps)(Game)
