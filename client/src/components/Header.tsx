import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { beginLogout } from 'actions/auth'

export const Header = () => {
  const auth = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const userInitials = useMemo(() => auth.user.name.split(' ').map(name => name[0]), [auth.user.name])

  const logout = () => {
    dispatch(beginLogout())
  }

  return (
    <header className="header">
      <nav>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link to="/" className="navbar-brand" href="#">Sea Battle</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              </ul>
              <div className="d-flex">
                <span className="user-bubble">{userInitials}</span>
                <button className="btn btn-main" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
      </nav>
    </header>
  )
}

export default Header
