import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { beginCreatePrivateGame } from '../actions/game'
import { getPrivateGameUrl } from '../helpers/url'
import { copy } from '../helpers/clipboard'

export const DashboardPage = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.game.isLoading)
  const [createdGame, setCreatedGame] = useState(null)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const privateGameLink = useMemo(() => createdGame ? getPrivateGameUrl(createdGame._id) : null, [createdGame])
  const privateGameLinkLocal = useMemo(() => createdGame ? getPrivateGameUrl(createdGame._id, true) : null, [createdGame])

  const createPrivateGame = async () => {
    const { game } = await dispatch(beginCreatePrivateGame())
    if (game) {
      setCreatedGame(game)
    }
  }

  const copyLink = () => {
    if (copy(privateGameLink) !== null) {
      setIsLinkCopied(true)
    }
  }

  const playWithRandomPlayer = async () => {

  }

  return (
    <div className="page page__dashboard container">
      <p className="game-introduction">You can either play with a friend or with a random player</p>
      {/*<p>You can create a private game and send the link to your friend to play together</p>*/}

      <div className="choose-game-type">
        <button className="btn btn-main" onClick={createPrivateGame}>Play With Friend</button>
        <Link className="btn btn-info" to="/random-game">Random Game</Link>
      </div>

      <div>
        {createdGame && (
          <div className="private-game-created">
            Send this link to your friend and start playing:
            <div className="form-group">
              <input className="form-control" type="text" value={privateGameLink} readOnly />
            </div>

            <div className="d-flex">
              <div>
                <button className="btn btn-main" onClick={copyLink}>Copy Link</button>
                <span>{isLinkCopied ? 'Copied!' : ''}</span>
              </div>
              <Link className="btn btn-success" to={privateGameLinkLocal}>Play!</Link>
            </div>
          </div>
        )}
        {isLoading && (
          <div>Game is being created...</div>
        )}
      </div>
    </div>
  )
}

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   games: state.games,
// })
//
// const mapDispatchToProps = (dispatch) => ({
//   beginCreatePrivateGame: () => dispatch(beginCreatePrivateGame()),
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)

export default DashboardPage