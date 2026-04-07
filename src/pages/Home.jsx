import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
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
            <h1>Trending</h1>
            {loading ? (
                <p>Loading trending shows...</p>
            ) : (
                <div className="movie-grid">
                    {animeList.map((anime, index) => (
                        <MovieCard
                            key={anime.mal_id}
                            id={anime.mal_id}
                            title={anime.title}
                            poster={anime.images?.jpg?.image_url}
                            year={anime.year || anime.aired?.prop?.from?.year || 'Unknown'}
                            duration={anime.duration || '24m'}
                            ageRating={anime.rating ? anime.rating.split(' ')[0] : 'TV-MA'}
                            rating={anime.score || 'N/A'}
                            ratingCount={anime.scored_by ? (anime.scored_by / 1000).toFixed(1) + 'K' : '0'}
                            description={anime.synopsis || "No description provided."}
                            rank={anime.rank || (index + 1)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
