import React from 'react';
import { useParams } from 'react-router-dom';
import './AnimeDetails.css';

const AnimeDetails = () => {
    const { id } = useParams();

    return (
        <div className="anime-details-page">
            <h1>Anime Details (ID: {id})</h1>
            <div className="details-content">
                <div className="details-image-placeholder"></div>
                <div className="details-info">
                    <h2>Title will go here</h2>
                    <p className="details-synopsis">
                        Synopsis placeholder. More detailed description of the anime will be displayed here.
                    </p>
                    <button className="add-watchlist-btn">Add to Watchlist</button>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetails;
