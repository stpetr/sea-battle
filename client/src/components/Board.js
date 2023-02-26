import React from 'react'

export class Board extends React.Component {
  constructor(props) {
    super(props)

    if (props.onCellClick) {
      this.onCellClick = props.onCellClick
    } else {
      this.onCellClick = () => {
        console.log('Click on cell dummy callback')
      }
    }
  }

  shoot(row, col) {
    if (!this.props.board[row][col]) {
      this.onCellClick(row, col)
    }
  }

  render() {
    return (
      <div className="board-wrap">
        <table className="board">
          <tbody>
          {
            this.props.board.map((cols, rowIndex) => {
              return <tr key={`row-${rowIndex}`}>
                {
                  cols.map((col, colIndex) => (
                    <td
                      key={`col-${colIndex}`}
                      onClick={() => this.shoot(rowIndex, colIndex)}
                    >
                      {this.props.board[rowIndex][colIndex] &&
                        <span className={`ship-cell is-${this.props.board[rowIndex][colIndex]}`}>&nbsp;</span>
                      }
                    </td>
                  ))
                }
              </tr>
            })
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Board
