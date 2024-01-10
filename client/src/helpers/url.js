import { CLIENT_URL, SERVER_URL } from 'constants'

export const getServerUrl = () => SERVER_URL

export const getApiUrl = (uri) => {
  return `${SERVER_URL}/api/${uri}`
}

export const getPrivateGameUrl = (gameId, local = false) => {
  const localUri = `/game/${gameId}`
  if (local) {
    return localUri
  }

  return `${CLIENT_URL}${localUri}`
}
