import React from 'react'
import { useDrag } from 'react-dnd'

import {AvailableShip} from 'models/ship'

type ShipProps = {
  ship: AvailableShip
  onClick: (ship: AvailableShip) => void
  onDragStart: (ship: AvailableShip) => void
  onDragEnd: () => void
}

export const Ship: React.FC<ShipProps> = ({ ship, onClick, onDragStart, onDragEnd }) => {

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
    <div
      ref={dragRef}
      className="ship-cell"
      onClick={() => onClick(ship)}
    />
  )
}
