import React from 'react'

export class Ship extends React.Component {
  constructor(props) {
    super(props)
  }

  getShipCells = (shipData) => {
    const shipCells = []

    for (let cell = 0; cell < shipData.length; cell++) {
      shipCells[cell] = null
    }

    return shipCells
  }

  render() {
    return (
      <div className={`ship -${this.props.ship.orientation}`}
        draggable={this.props.draggable}
        onDragStart={this.props.handleDragStart}
        onDragEnd={this.props.handleDragEnd}
        onTouchStart={this.props.handleDragStart}
        onTouchEnd={this.props.handleDragEnd}
        onClick={this.props.handleClick}
      >
        {
          this.getShipCells(this.props.ship).map((cell, cellIndex) => (
            <span
              key={`ship-cell-${cellIndex}`}
              className="ship__cell"
            >&nbsp;</span>
          ))
        }
      </div>
    )
  }
}

export default Ship
