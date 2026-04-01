import React from 'react';
import './Search.css';

const Search = () => {
    return (
        <div className="search-page">
            <h1>Search Anime</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search for an anime..." />
                <button>Search</button>
            </div>
            <div className="search-results">
                <p>Search results will appear here.</p>
            </div>
        </div>
    );
};

export default Search;
