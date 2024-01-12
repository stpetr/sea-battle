import React from 'react'
import { useDrag } from 'react-dnd'

import { AvailableShip as AvailableShipType } from 'models/ship'

const getShipCells = (shipData) => {
  return new Array(shipData.length).fill(null);
}

type AvailableShipProps = {
  ship: AvailableShipType,
  onClick: (ship: AvailableShipType) => void
  onDragStart: (ship: AvailableShipType) => void
  onDragEnd: () => void
}

export const AvailableShip: React.FC<AvailableShipProps> = ({ ship, onClick, onDragStart, onDragEnd }) => {
  const [, dragRef] = useDrag(() => ({
    type: 'SHIP',
    item: () => {
      onDragStart(ship)
      return ship
    },
    end: () => {
      onDragEnd()
    },
  }), [ship])

  return (
    <div className={`ship -${ship.orientation}`}
      ref={dragRef}
      onClick={() => onClick(ship)}
    >
      {
        getShipCells(ship).map((cell, cellIndex) => (
          <span
            key={`ship-cell-${cellIndex}`}
            className="ship__cell"
          />
        ))
      }
    </div>
  )
}
