import React from 'react'
import { useDrop } from 'react-dnd'
import { getShipCellsCoords } from '@packages/game-mechanics'
import { AvailableShip } from 'models/ship'

type BoardCellProps = {
  row: number
  col: number
  draggedShip: AvailableShip
  onShipDragOver: (row: number, col: number) => void
  onShipDrop: (ship: AvailableShip, row: number, col: number) => void
  children: React.ReactNode
}

export const BoardCell: React.FC<BoardCellProps> = (props) => {
  const { children, row, col, draggedShip, onShipDragOver, onShipDrop } = props
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'SHIP',
    drop: (ship: AvailableShip) => {
      onShipDrop(ship, row, col)
    },
    hover: () => {
      onShipDragOver(row, col)
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
