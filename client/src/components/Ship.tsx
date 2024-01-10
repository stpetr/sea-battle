import React from 'react'

type ShipProps = {
  ship: any,
  draggable: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onClick: () => void
}

export const Ship: React.FC<ShipProps> = (props) => {
  const {
    ship,
    draggable,
    onClick,
    onDragStart,
    onDragEnd,
  } = props
  const getShipCells = (shipData) => {
    const shipCells = []

    for (let cell = 0; cell < shipData.length; cell++) {
      shipCells[cell] = null
    }

    return shipCells
  }

  return (
    <div className={`ship -${ship.orientation}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}
      onClick={onClick}
    >
      {
        getShipCells(ship).map((cell, cellIndex) => (
          <span
            key={`ship-cell-${cellIndex}`}
            className="ship__cell"
          >&nbsp;</span>
        ))
      }
    </div>
  )
}

export default Ship
