import { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';
import { fetchAnimeList } from '../services/api';
import './Home.css';

const Home = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnime = async () => {
            const data = await fetchAnimeList();
            setAnimeList(data);
            setLoading(false);
        };
        loadAnime();
    }, []);

    return (
        <div className="home-page">
            <h1>Popular Anime</h1>
            {loading ? (
                <p>Loading popular anime...</p>
            ) : (
                <div className="anime-grid">
                    {animeList.map(anime => (
                        <AnimeCard
                            key={anime.mal_id}
                            id={anime.mal_id}
                            title={anime.title}
                            image={anime.images?.jpg?.image_url}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
