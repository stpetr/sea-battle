export const getApiUrl = (uri) => {
    return `${process.env.SERVER_URL}/api/${uri}`
}
