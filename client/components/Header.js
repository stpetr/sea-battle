import React from 'react'
import { NavLink } from 'react-router-dom'

const activeClass = {
    activeClassName: "is-active"
}

export const Header = () => (
    <header className="header">
        <div className="content-container">
            <div className="header__content">
                <NavLink className="header__link" to="/dashboard" {...activeClass}>
                    Dashboard
                </NavLink>
            </div>
        </div>
    </header>
)

export default Header
