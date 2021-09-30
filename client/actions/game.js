import { makeApiRequest } from '../helpers/fetch'

export const FETCH_PRIVATE_GAME = 'FETCH_PRIVATE_GAME'
export const CREATE_PRIVATE_GAME = 'CREATE_PRIVATE_GAME'
export const JOIN_GAME = 'JOIN_GAME'
export const SET_SHIPS = 'SET_SHIPS'
export const MAKE_SHOT = 'MAKE_SHOT'
export const SET_GAME_DATA = 'SET_GAME_DATA'
export const LEAVE_GAME = 'LEAVE_GAME'

export const fetchPrivateGame = (game) => ({
  type: FETCH_PRIVATE_GAME,
  game,
})

export const createPrivateGame = (game) => ({
  type: CREATE_PRIVATE_GAME,
  game,
})

export const joinGame = (game) => ({
  type: JOIN_GAME,
  game,
})

export const setShips = (game) => ({
  type: SET_SHIPS,
  game,
})

export const makeShot = (game) => ({
  type: MAKE_SHOT,
  game,
})

export const setGameData = (game) => ({
  type: SET_GAME_DATA,
  game,
})

export const leaveGame = () => ({
  type: LEAVE_GAME,
  game: null,
})

export const beginFetchPrivateGame = (gameId) => (dispatch) => {
  return makeApiRequest(`game/private/${gameId}`).then((data) => {
    return dispatch(fetchPrivateGame(data))
  })
}

export const beginCreatePrivateGame = () => (dispatch) => {
  return makeApiRequest('game/create-private-game', { method: 'POST' }).then((data) => {
    return dispatch(createPrivateGame(data))
  })
}

export const beginJoinGame = (gameId) => (dispatch) => {
  return makeApiRequest(`game/${gameId}/join`, { method: 'POST' }).then((data) => {
    return dispatch(joinGame(data))
  })
}

export const beginSetShips = (gameId, ships) => (dispatch) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(ships)
  }

  return makeApiRequest(`game/${gameId}/set-ships`, requestOptions).then((data) => {
    return dispatch(setShips(data))
  })
}

export const beginMakeShot = (gameId, { row, col }) => (dispatch) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({ row, col })
  }

  return makeApiRequest(`game/${gameId}/make-shot`, requestOptions).then((data) => {
    return dispatch(makeShot(data))
  })
}

export const beginLeaveGame = (gameId) => (dispatch) => {
  return makeApiRequest(`game/${gameId}/leave`, { method: 'POST' }).then((data) => {
    return dispatch(leaveGame())
  })
}