import React from 'react'

type BoardProps = {
  board: any
  onCellClick?: (row: number, col: number) => void
}

export const Board: React.FC<BoardProps> = ({board, onCellClick}) => {
  const shoot = (row, col) => {
    if (!board[row][col] && onCellClick) {
      onCellClick(row, col)
    }
  }

  return (
    <div className="board-wrap">
      <table className="board">
        <tbody>
        {
          board.map((cols, rowIndex) => {
            return <tr key={`row-${rowIndex}`}>
              {
                cols.map((col, colIndex) => (
                  <td
                    key={`col-${colIndex}`}
                    onClick={() => shoot(rowIndex, colIndex)}
                  >
                    {board[rowIndex][colIndex] &&
                      <span className={`ship-cell is-${board[rowIndex][colIndex]}`}>&nbsp;</span>
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

export default Board
