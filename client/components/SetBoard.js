import React from 'react'
import Ship from './Ship'

const BATTLEFIELD_SIZE = 10
const ORIENTATION_HORIZONTAL = 'horizontal'
const ORIENTATION_VERTICAL = 'vertical'

export class SetBoard extends React.Component {
    constructor(props) {
        super(props)

        this.shipId = 0

        this.state = {
            board: [],
            ships: [],
            draggedShip: null,
            availableShips: props.game.availableShips
        }

        this.constants = props.game.constants
    }
    generateShipId = () => ++this.shipId
    getAvailableShipsQty = () => this.state.availableShips.reduce((accumulator, { qty }) => accumulator += qty, 0)
    getShipById = (id) => this.state.ships.find((ship) => ship.id)
    initBoard = () => {
        const board = []

        for (let row = 0; row < this.constants.BATTLEFIELD_SIZE; row++) {
            for (let col = 0; col < this.constants.BATTLEFIELD_SIZE; col++) {
                if (!Array.isArray(board[row])) {
                    board[row] = []
                }

                board[row][col] = null
            }
        }

        this.setState({ board })
    }
    getShipByCoords = (row, col) => this.state.ships.find((ship) => {
        let result = false

        if (ship.orientation === this.constants.SHIP_ORIENTATION_HORIZONTAL) {
            result = row === ship.row && (col >= ship.col && col <= ship.col + ship.length - 1)
        } else if (ship.orientation === this.constants.SHIP_ORIENTATION_VERTICAL) {
            result = col === ship.col && (row >= ship.row && row <= ship.row + ship.length - 1)
        }

        return result
    })
    getShipCellsCoords = (ship) => {
        const coords = []

        for (let i = 0; i < ship.length; i++) {
            let row = ship.row,
                col = ship.col
            if (ship.orientation === this.constants.SHIP_ORIENTATION_HORIZONTAL) {
                col += i
            } else {
                row += i
            }

            coords.push({
                row,
                col
            })
        }

        return coords
    }
    isCoordsValid = (row, col) => row >= 0 && row < this.constants.BATTLEFIELD_SIZE && col >= 0 && col < this.constants.BATTLEFIELD_SIZE
    isCellTaken = (row, col, excludeShip) => {
        // Need to check the given cell and all cells around it
        const coordsAdd = [
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

        for (let i = 0; i < coordsAdd.length; i++) {
            const checkRow = row + coordsAdd[i][0],
                checkCol = col + coordsAdd[i][1],
                shipByCoords = this.getShipByCoords(checkRow, checkCol)

            if (!this.isCoordsValid(checkRow, checkCol)) {
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
    canPutShipAtCoords = (ship, row, col) => {
        const shipCellsCoords = this.getShipCellsCoords({ ...ship, row, col })
        let cellCoords

        for (let i = 0; i < shipCellsCoords.length; i++) {
            cellCoords = shipCellsCoords[i]
            if (!this.isCoordsValid(cellCoords.row, cellCoords.col) || this.isCellTaken(cellCoords.row, cellCoords.col, ship)) {
                return false
            }
        }

        return true
    }
    toggleShipOrientation = (e, ship) => {
        const orientation = (ship.orientation === this.constants.SHIP_ORIENTATION_HORIZONTAL) ?
            this.constants.SHIP_ORIENTATION_VERTICAL : this.constants.SHIP_ORIENTATION_HORIZONTAL

        if (ship.id) {
            const modifiedShip = {
                ...ship,
                orientation
            }
            const fitCoords = this.fitShipToBattlefield(modifiedShip, modifiedShip.row, modifiedShip.col)
            if (this.canPutShipAtCoords(modifiedShip, fitCoords.row, fitCoords.col)) {
                this.setState({
                    ships: this.state.ships.map((shipItem) => {
                        if (shipItem.id === ship.id) {
                            shipItem.row = fitCoords.row
                            shipItem.col = fitCoords.col
                            shipItem.orientation = orientation
                        }

                        return shipItem
                    })
                })
            } else {
                this.highlightShipOnBoard(e.target.closest('td'), { ...ship, orientation })
                setTimeout(() => this.clearHighlightOnBoard(), 400)
            }
        } else {
            this.setState({
                availableShips: this.state.availableShips.map((shipItem) => {
                    if (shipItem === ship) {
                        shipItem.orientation = orientation
                    }

                    return shipItem
                })
            })
        }
    }
    fitShipToBattlefield = (ship, row, col) => {
        let fitRow = row,
            fitCol = col

        if (ship.orientation === this.constants.SHIP_ORIENTATION_HORIZONTAL) {
            if (col + ship.length > this.constants.BATTLEFIELD_SIZE) {
                fitCol = col - (col + ship.length - this.constants.BATTLEFIELD_SIZE)
            }
        } else {
            if (row + ship.length > this.constants.BATTLEFIELD_SIZE) {
                fitRow = row - (row + ship.length - this.constants.BATTLEFIELD_SIZE)
            }
        }

        return {
            row: fitRow,
            col: fitCol
        }
    }
    getDropCoords = (td, ship) => {
        const tr = td.closest('tr')
        const trs = tr.closest('tbody').children
        const tds = tr.children
        const trIndex = Array.prototype.indexOf.call(trs, tr)
        const tdIndex = Array.prototype.indexOf.call(tds, td)

        return {
            ...this.fitShipToBattlefield(ship, trIndex, tdIndex),
        }
    }
    highlightShipOnBoard = (td, ship) => {
        const shipCoords = this.getDropCoords(td, ship)
        const tr = td.closest('tr')
        const trs = tr.closest('tbody').children
        const tds = tr.children

        const modifierClass = this.canPutShipAtCoords(ship, shipCoords.row, shipCoords.col) ? '-available' : '-taken'
        for (let cell = 0; cell < ship.length; cell++) {
            let cellTd
            if (ship.orientation === this.constants.SHIP_ORIENTATION_HORIZONTAL) {
                cellTd = tds[shipCoords.col + cell]
            } else {
                cellTd = trs[shipCoords.row + cell].children[shipCoords.col]
            }

            cellTd.classList.add('highlighted', modifierClass)
        }
    }
    clearHighlightOnBoard = () => {
        document.querySelectorAll('.board td').forEach((el) => el.classList.remove('highlighted', '-available', '-taken'))
    }
    onShipDragStart = (e, ship) => {
        if (!ship) {
            return
        }

        //e.dataTransfer.effectAllowed = 'move'
        e.target.classList.add('dragged-ship')

        this.setState({
            draggedShip: ship
        })
    }
    onShipDragEnter = (e) => {
        const td = e.target

        if (!this.state.draggedShip) {
            return
        }

        if (td.tagName.toLowerCase() !== 'td') {
            return e.preventDefault()
        }

        if (!this.state.draggedShip) {
            return
        }


        this.clearHighlightOnBoard()
        this.highlightShipOnBoard(td, this.state.draggedShip)
    }
    onShipDragOver = (e) => {
        if (e.target.tagName.toLowerCase() === 'td') {
            return e.preventDefault()
        }
    }
    onShipDrop = (e) => {
        if (e.target.tagName.toLowerCase() !== 'td') {
            return e.preventDefault()
        }

        if (!this.state.draggedShip) {
            return
        }

        const dropCell = e.target
        const shipCoords = this.getDropCoords(dropCell, this.state.draggedShip)

        if (!this.canPutShipAtCoords(this.state.draggedShip, shipCoords.row, shipCoords.col)) {
            return
        }
        
        if (this.state.draggedShip.id) {
            this.setState({
                ships: this.state.ships.map((ship) => {
                    if (ship.id === this.state.draggedShip.id) {
                        return {
                            ...ship,
                            ...shipCoords
                        }
                    }

                    return ship
                })
            })
        } else {
            this.setState({
                ships: [
                    ...this.state.ships,
                    {
                        ...this.state.draggedShip,
                        id: this.generateShipId(),
                        ...shipCoords,
                    }
                ]
            })

            this.setState({
                availableShips: this.state.availableShips.map((availableShip) => {
                    if (availableShip === this.state.draggedShip) {
                        availableShip.qty -= 1
                    }

                    return availableShip
                })
            })
        }

        this.onShipDragEnd(e)
    }
    onShipDragEnd = (e) => {
        this.setState({
            draggedShip: null
        })

        e.target.classList.remove('dragged-ship')

        this.clearHighlightOnBoard()
    }
    componentDidMount() {
        this.initBoard()
    }
    componentWillUnmount() {

    }
    render() {
        return (
            <div className="set-board">
                <div className="board-wrap">
                    <table className={`board` + (this.state.draggedShip ? ` ship-is-dragged` : ``) }
                           onDragEnter={(e) => this.onShipDragEnter(e)}
                           onDragOver={(e) => this.onShipDragOver(e)}
                           onDrop={(e) => this.onShipDrop(e)}
                    >
                        <tbody>
                            {
                                this.state.board.map((cols, rowIndex) => {
                                    return <tr key={`row-${rowIndex}`}>
                                        {
                                            cols.map((col, colIndex) => {
                                                const ship = this.getShipByCoords(rowIndex, colIndex)
                                                return (
                                                    <td
                                                        key={`col-${colIndex}`}
                                                        onDragStart={(e) => { if (e.target.tagName.toLowerCase() === 'td') { e.preventDefault(); return false; } }}
                                                    >
                                                        { ship &&
                                                        <span className="ship-cell"
                                                              draggable="true"
                                                              onDragStart={(e) => this.onShipDragStart(e, ship)}
                                                              onDragEnd={(e) => this.onShipDragEnd(e, ship)}
                                                              onClick={(e) => this.toggleShipOrientation(e, ship)}
                                                        >&nbsp;</span>
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
                {this.state.availableShips && (
                  <div className="available-ships">
                      {
                          this.state.availableShips.map((ship) => {
                              return (
                                ship.qty > 0 &&
                                <Ship key={`ship-${ship.width}-${ship.length}`} ship={ship}
                                      draggable="true"
                                      handleDragStart={(e) => this.onShipDragStart(e, ship)}
                                      handleDragEnd={(e) => this.onShipDragEnd(e, ship)}
                                      handleClick={(e) => this.toggleShipOrientation(e, ship)}
                                />
                              )
                          })
                      }
                  </div>
                )}
                <div>
                    <button
                        disabled={this.getAvailableShipsQty() > 0}
                        onClick={() => this.props.setShips(this.state.ships)}
                    >Save ships</button>
                </div>
            </div>
        )
    }
}

export default SetBoard
