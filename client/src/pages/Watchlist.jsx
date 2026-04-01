import React from 'react';
import './Watchlist.css';

const Watchlist = () => {
    return (
        <div className="watchlist-page">
            <h1>My Watchlist</h1>
            <div className="watchlist-empty">
                <p>Your watchlist is currently empty.</p>
            </div>
        </div>
    );
};

export default Watchlist;
