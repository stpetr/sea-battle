import { logout } from '../actions/auth'
import { getApiUrl } from './url'

const tokenKey = 'token'

const getAuthToken = () => `Bearer ${localStorage.getItem(tokenKey)}`

// @todo refactor checking for 401 and 500 status
export const makeApiRequest = (uri, options, dispatch) => {
    return fetch(getApiUrl(uri),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthToken(),
            },
            ...options
        })
        .then((res) => {
            if (res.status === 401) {
                if (localStorage.getItem(tokenKey)) {
                    alert('Seems you are not logged in anymore. Please login again')
                }

                if (typeof dispatch === 'function') {
                    return dispatch(logout())
                } else {
                    console.warn(`Unhandled 401 at ${uri}`)
                }
            }

            if (res.status === 500) {
                return alert(`A server error occurred on request to ${uri}`)
            }

            return res.text()
        })
        .then((data) => {
            try {
                data = data ? JSON.parse(data) : {}
            } catch (e) {
                data = {}
            }

            return data
        })
        .catch((e) => {
            console.warn('Error caught in makeApiRequest:', e.message)
        })
}
