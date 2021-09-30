import { makeApiRequest } from '../helpers/fetch'

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const authenticate = (user) => ({
    type: AUTHENTICATE,
    user,
})

export const login = (user, token) => ({
    type: LOGIN,
    user,
    token
})

export const logout = () => ({
    type: LOGOUT
})

export const beginAuthenticate = () => (dispatch) => {
    return  makeApiRequest('user/check-auth', {
        method: 'POST',
    }, dispatch)
}

export const beginLogin = (email, password) => (dispatch) => {
    return makeApiRequest('user/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    }, dispatch).then((data) => {
        if (data && data.user && data.token) {
            return dispatch(login(data.user, data.token))
        }

        throw new Error('Failed to login')
    })
}

export const beginLoginAsAnonymous = () => (dispatch) => {
    return makeApiRequest('user/login-as-anonymous', {
        method: 'POST',
    }).then((data) => {
        if (data && data.user && data.token) {
            return dispatch(login(data.user, data.token))
        }

        throw new Error('Failed to login')
    })
}

export const beginRegister = (user) => (dispatch) => {
    return makeApiRequest('user/register', {
        method: 'POST',
        body: JSON.stringify(user)
    }).then((data) => {
        if (data && data.user && data.token) {
            return dispatch(login(data.user, data.token))
        }

        throw new Error('Failed to register')
    })
}

export const beginLogout = () => (dispatch) => {
    return makeApiRequest('user/logout', {
        method: 'POST',
    }, dispatch).then(() => {
        dispatch(logout())
    })
}
