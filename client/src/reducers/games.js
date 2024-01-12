import {
  FETCH_GAMES,
  CREATE_PRIVATE_GAME,
} from '../actions/games'

const defaultState = []

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_GAMES:
      if (Array.isArray(action.games)) {
        return [
          ...state,
          ...action.games,
        ]
      }

      return state
    case CREATE_PRIVATE_GAME:
      return [
        ...state,
        action.game,
      ]
    default:
      return state
  }
}
