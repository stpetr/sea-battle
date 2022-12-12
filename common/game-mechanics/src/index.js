const BATTLEFIELD_SIZE = 10
const PLAYERS_NUMBER = 2

const GAME_TYPE_RANDOM = 'random'
const GAME_TYPE_PRIVATE = 'private'
const GAME_STATUS_JOIN = 'join'
const GAME_STATUS_SET = 'set'
const GAME_STATUS_PLAY = 'play'
const GAME_STATUS_FINISHED = 'finished'

const SHIP_ORIENTATION_HORIZONTAL = 'horizontal'
const SHIP_ORIENTATION_VERTICAL = 'vertical'
const SHIP_STATUS_OK = 'ok'
const SHIP_STATUS_WOUNDED = 'wounded'
const SHIP_STATUS_KILLED = 'killed'
const SHOT_RESULT_MISSED = 'missed'
const SHOT_RESULT_WOUNDED = 'wounded'
const SHOT_RESULT_KILLED = 'killed'
const SHIP = 'ship'

const WINNER_AWARD = 100
const PARTICIPATE_AWARD = 10

let shipId = 0

const getNewShipId = () => ++shipId

const createAvailableShip = (width, length, qty, orientation = SHIP_ORIENTATION_HORIZONTAL) => ({
  availableShipId: getNewShipId(),
  width,
  length,
  qty,
  orientation,
  row: null,
  col: null,
})

const getAvailableShips = () => [
  createAvailableShip(1, 4, 1),
  createAvailableShip(1, 3, 2),
  createAvailableShip(1, 2, 3),
  createAvailableShip(1, 1, 4),
]

const isCoordsValid = (row, col) => row >= 0 && row < BATTLEFIELD_SIZE && col >= 0 && col < BATTLEFIELD_SIZE

const getBoard = () => {
  const board = []

  for (let row = 0; row < BATTLEFIELD_SIZE; row++) {
    for (let col = 0; col < BATTLEFIELD_SIZE; col++) {
      if (!Array.isArray(board[row])) {
        board[row] = []
      }

      board[row][col] = null
    }
  }

  return board
}

const printBoard = (board) => {
  console.log('---')
  board.forEach((row) => console.log(row.join(', ')))
  console.log('---')
}

const getShipCellsCoords = (ship) => {
  const coords = []

  for (let i = 0; i < ship.length; i++) {
    let row = ship.row,
      col = ship.col
    if (ship.orientation === SHIP_ORIENTATION_HORIZONTAL) {
      col += i
    } else {
      row += i
    }

    coords.push({
      row,
      col,
    })
  }

  return coords
}

const isCellTaken = (ships, row, col, excludeShip = null) => {
  // Need to check the given cell and all cells around it
  const coordsToCheck = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  for (let i = 0; i < coordsToCheck.length; i++) {
    const checkRow = row + coordsToCheck[i][0],
      checkCol = col + coordsToCheck[i][1],
      shipByCoords = getShipByCoords(ships, checkRow, checkCol)

    if (!isCoordsValid(checkRow, checkCol)) {
      continue
    }

    if (shipByCoords) {
      if (!excludeShip || excludeShip.id !== shipByCoords.id) {
        return true
      }
    }
  }

  return false
}

const validateShipsContent = (ships) => {
  const availableShips = getAvailableShips()
  availableShips.forEach((ship) => ship.set = 0)

  for (let i = 0; i < ships.length; i++) {
    let ship = availableShips.find((availableShip) => ships[i].width === availableShip.width && ships[i].length === availableShip.length)
    if (!ship) {
      return false
    }

    ship.set++
  }

  for (let i = 0; i < availableShips.length; i++) {
    if (availableShips[i].qty !== availableShips[i].set) {
      return false
    }
  }

  return true
}

const validateShipsCoords = (ships) => {
  const board = getBoard()

  for (let i = 0; i < ships.length; i++) {
    let ship = ships[i]
    let shipCells = getShipCellsCoords(ship)

    for (let j = 0; j < shipCells.length; j++) {
      let shipCell = shipCells[j]
      if (!isCoordsValid(shipCell.row, shipCell.col)) {
        return false
      }

      if (isCellTaken(board, shipCell.row, shipCell.col)) {
        return false
      }
    }

    // If we're here it means that the ship is valid and can be put on board
    for (let j = 0; j < shipCells.length; j++) {
      const shipCell = shipCells[j]
      // @todo Remove the magic number
      board[shipCell.row][shipCell.col] = 1
    }
  }

  return true
}

const validateShips = (ships) => {
  if (!Array.isArray(ships)) {
    return false
  }

  return validateShipsContent(ships) && validateShipsCoords(ships)
}

const putShipsOnBoard = (board, ships) => {
  ships.forEach((ship) => {
    getShipCellsCoords(ship).forEach(({ row, col }) => {
      // @todo Remove the magic number
      board[row][col] = 1
    })
  })

  return board
}

const getShipByCoords = (ships, row, col) => {
  // return ships.find((ship) => getShipCellsCoords(ship).filter(({ row: cellRow, col: cellCol }) => row === cellRow && col === cellCol))
  for (let i = 0; i < ships.length; i++) {
    let ship = ships[i]
    let shipCells = getShipCellsCoords(ship)
    for (let j = 0; j < shipCells.length; j++) {
      let shipCell = shipCells[j]
      if (shipCell.row === row && shipCell.col === col) {
        return ship
      }
    }
  }

  return null
}

const canPutShipAtCoords = (ships, ship, row, col) => {
  const shipCellsCoords = getShipCellsCoords({ ...ship, row, col })

  for (let i = 0; i < shipCellsCoords.length; i++) {
    let cellCoords = shipCellsCoords[i]
    if (!isCoordsValid(cellCoords.row, cellCoords.col) || isCellTaken(ships, cellCoords.row, cellCoords.col, ship)) {
      return false
    }
  }

  return true
}

const fitShipToBattlefield = (ship, row, col) => {
  let fitRow = row
  let fitCol = col

  if (ship.orientation === SHIP_ORIENTATION_HORIZONTAL) {
    if (col + ship.length > BATTLEFIELD_SIZE) {
      fitCol = col - (col + ship.length - BATTLEFIELD_SIZE)
    }
  } else {
    if (row + ship.length > BATTLEFIELD_SIZE) {
      fitRow = row - (row + ship.length - BATTLEFIELD_SIZE)
    }
  }

  return {
    row: fitRow,
    col: fitCol,
  }
}

const getRandomShips = () => {
  const ships = []
  let shipId = 0
  const board = getBoard()
  const availableShips = getAvailableShips()

  availableShips.forEach((ship) => {
    for (let i = 0; i < ship.qty; i++) {
      const possibleCoords = []

      board.map((cols, rowIndex) => {
        cols.map((cell, colIndex) => {
          [SHIP_ORIENTATION_HORIZONTAL, SHIP_ORIENTATION_VERTICAL].map((orientation) => {
            const orientedShip = { ...ship, orientation }
            const { row, col } = fitShipToBattlefield(orientedShip, rowIndex, colIndex)

            if (canPutShipAtCoords(ships, orientedShip, row, col)) {
              possibleCoords.push({
                row, col, orientation
              })
            }
          })
        })
      })

      if (possibleCoords.length) {
        const randomCoordsIndex = Math.floor(Math.random() * possibleCoords.length)
        const { row, col, orientation } = possibleCoords[randomCoordsIndex]
        ships.push({
          ...ship,
          id: ++shipId,
          row,
          col,
          orientation,
        })
      } else {
        // @todo throw an error to show user that something went wrong
        console.error('No possible coords for ship:', ship)
      }
    }
  })

  // @todo it would be nice to double check all ships after the generation process
  return ships
}

module.exports = {
  BATTLEFIELD_SIZE,
  PLAYERS_NUMBER,
  GAME_TYPE_PRIVATE,
  GAME_TYPE_RANDOM,
  GAME_STATUS_JOIN,
  GAME_STATUS_SET,
  GAME_STATUS_PLAY,
  GAME_STATUS_FINISHED,
  SHIP,
  SHIP_STATUS_OK,
  SHIP_STATUS_WOUNDED,
  SHIP_STATUS_KILLED,
  SHIP_ORIENTATION_HORIZONTAL,
  SHIP_ORIENTATION_VERTICAL,
  SHOT_RESULT_KILLED,
  SHOT_RESULT_MISSED,
  SHOT_RESULT_WOUNDED,
  canPutShipAtCoords,
  isCoordsValid,
  isCellTaken,
  getBoard,
  getShipByCoords,
  getShipCellsCoords,
  getAvailableShips,
  validateShips,
  putShipsOnBoard,
  fitShipToBattlefield,
  getRandomShips,
}
