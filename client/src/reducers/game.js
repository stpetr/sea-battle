import {
  FETCH_PRIVATE_GAME,
  CREATE_PRIVATE_GAME,
  CREATE_PRIVATE_GAME_REQUEST,
  JOIN_GAME,
  SET_SHIPS,
  MAKE_SHOT,
  SET_GAME_DATA,
  LEAVE_GAME,
  REQUEST_REVANCHE,
  ACCEPT_REVANCHE,
} from 'actions/game'

const defaultState = {
  game: null,
  isLoading: false,
  isRevancheLoading: false,
}

export default (state = defaultState, { type, game }) => {

  switch (type) {
    case FETCH_PRIVATE_GAME:
      return {
        ...state,
        game,
      }
    case CREATE_PRIVATE_GAME_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case CREATE_PRIVATE_GAME:
      return {
        ...state,
        game,
        isLoading: false,
      }
    case JOIN_GAME:
      return {
        ...state,
        game,
      }
    case SET_SHIPS:
      return {
        ...state,
        game,
      }
    case MAKE_SHOT:
      return {
        ...state,
        game,
      }
    case SET_GAME_DATA:
      return {
        ...state,
        game,
      }
    case REQUEST_REVANCHE:
      return {
        ...state,
        isRevancheLoading: false,
      }
    case ACCEPT_REVANCHE:
      return {
        ...state,
        isRevancheLoading: false,
      }
    case LEAVE_GAME:
      return {
        ...state,
        game,
      }
    default:
      return state
  }
}
