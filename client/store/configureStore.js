import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import authReducer from '../reducers/auth'
import gamesReducer from '../reducers/games'
import gameReducer from '../reducers/game'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  const store = createStore(combineReducers({
      auth: authReducer,
      games: gamesReducer,
      game: gameReducer,
    }),
    composeEnhancers(applyMiddleware(thunk)),
  )

  return store
}
