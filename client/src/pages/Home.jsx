import React from 'react';
import AnimeCard from '../components/AnimeCard';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <h1>Popular Anime</h1>
            <div className="anime-grid">
                <AnimeCard />
                <AnimeCard />
                <AnimeCard />
                <AnimeCard />
            </div>
        </div>
    );
};

export default Home;
