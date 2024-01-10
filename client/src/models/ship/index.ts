export type ShipOrientation = 'horizontal' | 'vertical'
export type ShipStatus = 'ok' | 'wounded' | 'killed'

export type Ship = {
  row: number
  col: number
  width: number
  length: number
  orientation: ShipOrientation
  status: ShipStatus
  playerId?: string
  _id?: string
}


export type AvailableShip = Omit<Ship, '_id' | 'playerId' | 'status'> & {
  id: number
  qty: number
  availableShipId: number
  canBeDropped: boolean
}
