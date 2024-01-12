import React, { useMemo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { AvailableShip } from './AvailableShip'
import { BoardCell } from './BoardCell'
import { Ship } from './Ship'
import {
  SHIP_ORIENTATION_HORIZONTAL,
  SHIP_ORIENTATION_VERTICAL,
  canPutShipAtCoords,
  getBoard,
  getShipByCoords,
  getRandomShips,
  fitShipToBattlefield,
} from '@packages/game-mechanics'

import { AvailableShip as AvailableShipType } from 'models/ship'

const board = getBoard()


export const SetBoard = ({ game, setShips: saveShips }) => {
  const [shipId, setShipId] = useState(1)
  const [ships, setShips] = useState<AvailableShipType[]>([])
  const [draggedShip, setDraggedShip] = useState<AvailableShipType | null>(null)
  const [availableShips, setAvailableShips] = useState<AvailableShipType[]>(game.availableShips)

  const getNewShipId = () => {
    setShipId((prevState) => prevState + 1)
    return shipId + 1
  }

  const availableShipsQty = useMemo(() => {
    return availableShips.reduce((accumulator, { qty }) => accumulator + qty, 0)
  }, [availableShips])

  const toggleShipOrientation = (ship) => {
    const orientation = (ship.orientation === SHIP_ORIENTATION_HORIZONTAL) ?
      SHIP_ORIENTATION_VERTICAL : SHIP_ORIENTATION_HORIZONTAL

    if (ship.id) {
      const modifiedShip = {
        ...ship,
        orientation,
      }
      const fitCoords = fitShipToBattlefield(modifiedShip, modifiedShip.row, modifiedShip.col)
      if (canPutShipAtCoords(ships, modifiedShip, fitCoords.row, fitCoords.col)) {
        setShips((prevState) => {
          return prevState.map((el) => {
            if (el.id === ship.id) {
              return {
                ...el,
                ...fitCoords,
                orientation,
              }
            }

            return el
          })
        })
      }
    } else {
      setAvailableShips((prevState) => {
        return prevState.map((el) => {
          if (el === ship) {
            return {
              ...el,
              orientation,
            }
          }

          return el
        })
      })
    }
  }

  const handleShipDragStart = (ship) => {
    setDraggedShip(ship)
  }

  const handleShipDragEnd = () => {
    setDraggedShip(null)
  }

  const handleShipDragOver = (row, col) => {
    if (row !== draggedShip.row || col !== draggedShip.col) {
      setDraggedShip((prevState) => {
        if (prevState) {
          const coords = fitShipToBattlefield(draggedShip, row, col)
          return {
            ...prevState,
            row: coords.row,
            col: coords.col,
            canBeDropped: canPutShipAtCoords(ships, draggedShip, coords.row, coords.col)
          }
        }
      })
    }
  }

  const handleShipDrop = (ship, targetRow, targetCol) => {
    if (!draggedShip) {
      return
    }

    const { row, col } = fitShipToBattlefield(draggedShip, targetRow, targetCol)

    if (!canPutShipAtCoords(ships, draggedShip, row, col)) {
      return
    }

    if (draggedShip.id) {
      setShips((prevState) => {
        return prevState.map((el) => {
          if (el.id === draggedShip.id) {
            return {
              ...el,
              row,
              col,
            }
          }
          return el
        })
      })
    } else {
      setShips((prevState) => ([
        ...prevState,
        {
          ...draggedShip,
          id: getNewShipId(),
          row,
          col,
        },
      ]))

      setAvailableShips((prevState) => {
        return prevState.map((el) => {
          if (el.availableShipId === draggedShip.availableShipId) {
            return {
              ...el,
              qty: el.qty - 1
            }
          }
          return el
        })
      })
    }
  }

  const handleShipsRandomize = () => {
    setAvailableShips([])
    setShips(getRandomShips())
  }

  return (
    <div className="set-board-wrap">
      <h2>Place your ships on the battlefield</h2>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div className="set-board">
          <div className="board-wrap">
            <div className="board-grid">
              {board.map((cols, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}-`}>
                  {cols.map((cell, colIndex) => (
                    <div key={`row-${rowIndex}x-col-${colIndex}`} className="cell">
                      <BoardCell
                        row={rowIndex}
                        col={colIndex}
                        draggedShip={draggedShip}
                        onShipDragOver={handleShipDragOver}
                        onShipDrop={handleShipDrop}
                      >
                        {getShipByCoords(ships, rowIndex, colIndex) ? (
                          <Ship
                            ship={getShipByCoords(ships, rowIndex, colIndex)}
                            onClick={toggleShipOrientation}
                            onDragStart={handleShipDragStart}
                            onDragEnd={handleShipDragEnd}
                          />
                          ) : null
                        }
                      </BoardCell>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          {availableShips && (
            <div className="available-ships">
              {
                availableShips.map((ship) => {
                  return (
                    ship.qty > 0 &&
                    <AvailableShip key={`ship-${ship.width}-${ship.length}`}
                      ship={ship}
                      onClick={toggleShipOrientation}
                      onDragStart={handleShipDragStart}
                      onDragEnd={handleShipDragEnd}
                    />
                  )
                })
              }
            </div>
          )}
        </div>
      </DndProvider>
      <div className="buttons">
        <button
          className="btn btn-main"
          disabled={availableShipsQty > 0}
          onClick={() => saveShips(ships)}
        >
          Save
        </button>
        <button
          className="btn btn-white"
          onClick={handleShipsRandomize}
        >
          Set randomly
        </button>
      </div>
    </div>
  )
}

export default SetBoard
