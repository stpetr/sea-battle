import {
    FETCH_PRIVATE_GAME,
    CREATE_PRIVATE_GAME,
    JOIN_GAME,
    SET_SHIPS,
    MAKE_SHOT,
    SET_GAME_DATA,
    LEAVE_GAME,
} from '../actions/game'

const defaultState = {
    game: null,
}

export default (state = defaultState, { type, game }) => {

    switch (type) {
        case FETCH_PRIVATE_GAME:
            return {
                ...state,
                game,
            }
        case CREATE_PRIVATE_GAME:
            return {
                ...state,
                game,
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
        case LEAVE_GAME:
            return {
                ...state,
                game,
            }
        default:
            return state
    }
}
