import React from 'react'
import { isCellTaken } from '../../common/helpers/game-mechanics'

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

    console.log('Board props', props)
  }

  getCoordsOfCell(el) {
    const td = el.closest('td')
    const tr = td.closest('tr')
    const trs = tr.closest('tbody').children
    const tds = tr.children
    const row = Array.prototype.indexOf.call(trs, tr)
    const col = Array.prototype.indexOf.call(tds, td)

    return {
      row,
      col,
    }
  }

  shoot(td) {
    const { row, col } = this.getCoordsOfCell(td)
    this.onCellClick(row, col)
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
                  cols.map((col, colIndex) => {
                    const hasShip = isCellTaken(this.props.board, rowIndex, colIndex)
                    return (
                      <td
                        key={`col-${colIndex}`}
                        onClick={(e) => {
                          this.shoot(e.target)
                        }}
                      >
                        {this.props.board[rowIndex][colIndex] &&
                        <span className={`ship-cell is-${this.props.board[rowIndex][colIndex]}`}>&nbsp;</span>
                        }
                      </td>
                    )
                  })
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
