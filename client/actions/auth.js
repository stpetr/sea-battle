export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const login = (uid) => ({
    type: LOGIN,
    uid
})

export const logout = () => ({
    type: LOGOUT
})
