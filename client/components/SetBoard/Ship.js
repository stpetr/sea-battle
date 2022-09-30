import React from 'react'
import { useDrag } from 'react-dnd'

export const Ship = ({ ship, handleClick, handleDragStart, handleDragEnd }) => {

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
    <div
      ref={dragRef}
      className="ship-cell"
      onClick={() => handleClick(ship)}
    />
  )
}
