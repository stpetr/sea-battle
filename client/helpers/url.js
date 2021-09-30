export const getServerUrl = () => `${process.env.SERVER_URL}`

export const getApiUrl = (uri) => {
    return `${process.env.SERVER_URL}/api/${uri}`
}

export const getPrivateGameUrl = (gameId, local = false) => {
    const localUri = `/games/private/${gameId}`
    if (local) {
        return localUri
    }

    return `${process.env.CLIENT_URL}${localUri}`
}
