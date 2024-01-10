import React, { useEffect, useRef, useState } from 'react'

import { useSelector } from 'react-redux'

import {
  SHIP,
  SHIP_STATUS_KILLED,
  SHOT_RESULT_MISSED,
  getBoard,
  getShipCellsCoords,
  getShipByCoords,
  getCellsAround,
} from '@packages/game-mechanics'

import Board from './Board'

export const Game = ({makeShot}) => {
  const [playerBoard, setPlayerBoard] = useState([])
  const [opponentBoard, setOpponentBoard] = useState([])
  const game = useSelector(state => state.game.game)
  const gameRef = useRef(null)

  const initBoard = (stateProp, ships = [], shots = []) => {
    const board = getBoard()

    ships.forEach((ship) => {
      getShipCellsCoords(ship).forEach(({ row, col }) => {
        board[row][col] = SHIP
      })
    })

    shots.forEach((shot) => {
      const ship = getShipByCoords(ships, shot.row, shot.col)
      board[shot.row][shot.col] = ship ? ship.status : shot.result
    })

    // Mark cells around killed ships
    if (stateProp === 'opponentBoard') {
      ships.filter(({status}) => status === SHIP_STATUS_KILLED).forEach((ship) => {
        const shipCellsCoords = getShipCellsCoords(ship)
        shipCellsCoords.forEach(({row, col}) => {
          const cellsAround = getCellsAround(row, col)
          cellsAround.forEach((el) => {
            const shipByCoords = getShipByCoords(ships, el.row, el.col)
            if (!shipByCoords) {
              board[el.row][el.col] = SHOT_RESULT_MISSED
            }
          })
        })
      })
    }

    if (stateProp === 'opponentBoard') {
      setOpponentBoard(board)
    } else {
      setPlayerBoard(board)
    }
  }

  const getShots = (shots) => {
    if (typeof shots === 'undefined') {
      shots = game.shots
    }
    return shots.filter((shot) => shot.playerId === game.player._id)
  }

  const getOpponentShots = (shots) => {
    if (typeof shots === 'undefined') {
      shots = game.shots
    }
    return shots.filter((shot) => shot.playerId === game.opponent._id)
  }

  const onCellClick = (row, col) => {
    if (game.player._id === game.nextMove) {
      makeShot(row, col)
    } else {
      console.log('It is not your turn!')
    }
  }

  useEffect(() => {
    initBoard(`playerBoard`, game.ships, getOpponentShots(game.shots))
    initBoard(`opponentBoard`, game.opponentKilledShips, getShots(game.shots))
    gameRef.current = game
  }, [game])

  return (
    <div className="game">
      <div className="game__board">
        <p>Player Board</p>
        <Board board={playerBoard} shots={game.shots} />
      </div>
      <div className="game__board">
        <p>Opponent Board</p>
        <Board board={opponentBoard} onCellClick={(...args) => onCellClick(...args)} />
      </div>

      <div>
        {game.nextMove === game.player._id && (
          <p>It's your turn</p>
        )}
        {game.opponent && game.nextMove === game.opponent._id && (
          <p>It's opponent's turn</p>
        )}
      </div>
    </div>
  )
}

export default Game
