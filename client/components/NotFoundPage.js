import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
    <div className="page">
        <h1>404: Not Found</h1>

        <p>How the hell did you get here?!</p>

        Go to <Link to="/">home page</Link> or stay here for a while if you're not that eager to play our awesome games
    </div>
);

export default NotFoundPage
