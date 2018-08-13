import { AsyncStorage } from 'react-native'
const HEADERS = ['access-token', 'token-type', 'client', 'expiry', 'uid']

const setTokens = async (headers, axios) => {
  for (let token of HEADERS) {
    axios.defaults.headers.common[token] = headers[token]
    await AsyncStorage.setItem(token, headers[token])
  }
}

export const getTokens = async () => {
  let headers = {}
  for (let token of HEADERS) {
    const t = await AsyncStorage.getItem(token)
    headers[token] = t
  }

  return headers
}

const clearTokens = async () => {
  for (token of HEADERS) {
    await AsyncStorage.removeItem(token)
  }
}

const tokenMiddleware = args => store => next => action => {
  if (!action)
    action = { type: '' }
  const { customHeaders = [], validateAction = 'VALIDATE_TOKEN', logoutAction = 'LOGOUT', axios } = args
  if (action.type === validateAction) {
    getTokens(axios)
  } else if (action.type === logoutAction) {
    clearTokens()
  } else {
    const { headers } = action
    if (headers) {
      if (headers['access-token']) {
        setTokens(headers, axios)
      }
    }
  }

  return next(action)

}

export default tokenMiddleware

