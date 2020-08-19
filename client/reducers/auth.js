import {
    AUTHENTICATE,
    LOGIN,
    LOGOUT
} from '../actions/auth'

const tokenKey = 'token'
const defaultState = {}

export default (state = defaultState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            if (action.user) {
                return {
                    user: action.user,
                }
            }

            localStorage.setItem(tokenKey, '')

            return state
        case LOGIN:
            if (action.user) {
                localStorage.setItem(tokenKey, action.token)
                return {
                    user: action.user
                }
            }

            return {
                defaultState
            }
        case LOGOUT:
            localStorage.setItem(tokenKey, '')

            return defaultState
        default:
            return state
    }
}
