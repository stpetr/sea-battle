import React from 'react'
import { useDrag } from 'react-dnd'

const getShipCells = (shipData) => {
  return new Array(shipData.length).fill(null);
}

export const AvailableShip = ({ ship, handleClick, handleDragStart, handleDragEnd }) => {
  const [, dragRef] = useDrag(() => ({
    type: 'SHIP',
    item: () => {
      handleDragStart(ship)
      return ship
    },
    end: () => {
      handleDragEnd()
    },
  }), [ship])

  return (
    <div className={`ship -${ship.orientation}`}
      ref={dragRef}
      onClick={() => handleClick(ship)}
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
