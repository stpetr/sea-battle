import { makeApiRequest } from '../helpers/fetch'

export const FETCH_GAMES = 'FETCH_GAMES'
export const CREATE_PRIVATE_GAME = 'CREATE_PRIVATE_GAME'

export const fetchGames = (games) => ({
  type: FETCH_GAMES,
  games,
})

export const createPrivateGame = (game) => ({
  type: CREATE_PRIVATE_GAME,
  game,
})

export const beginFetchGames = () => (dispatch) => {
  return makeApiRequest('games').then((data) => {
    dispatch(fetchGames(data))
  })
}

export const beginCreatePrivateGame = () => (dispatch) => {
  return makeApiRequest('game/create-private-game', { method: 'POST' }).then((data) => {
    return dispatch(createPrivateGame(data))
  })
}
