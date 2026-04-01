import React from 'react';
import './AnimeCard.css';

const AnimeCard = () => {
    return (
        <div className="anime-card">
            <div className="anime-card-image-placeholder"></div>
            <div className="anime-card-content">
                <h3 className="anime-title">Anime Title</h3>
                <p className="anime-rating">⭐ 8.5</p>
            </div>
        </div>
    );
};

export default AnimeCard;
