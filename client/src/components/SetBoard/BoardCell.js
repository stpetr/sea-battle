import React from 'react'
import { useDrop } from 'react-dnd'
import { getShipCellsCoords } from '@packages/game-mechanics'

export const BoardCell = ({ children, row, col, draggedShip, handleShipDragOver, handleShipDrop }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'SHIP',
    drop: (ship) => {
      handleShipDrop(ship, row, col)
    },
    hover: () => {
      handleShipDragOver(row, col)
    },
    collect: () => {
      const state = {
        isOver: false,
      }

      if (draggedShip) {
        const coords = getShipCellsCoords(draggedShip)
        if (coords.find((el) => el.row === row && el.col === col)) {
          state.isOver = true
        }
      }

      return state
    },
  }), [draggedShip, row, col])

  return (
    <div
      ref={dropRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: isOver ? draggedShip && draggedShip.canBeDropped ? 'darkseagreen' : 'indianred' : 'white'
      }}
    >
      {children}
    </div>
  )
}
