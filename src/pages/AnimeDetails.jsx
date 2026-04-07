import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnimeDetails } from '../services/api';
import './AnimeDetails.css';

const AnimeDetails = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            const data = await fetchAnimeDetails(id);
            setAnime(data);
            setLoading(false);
        };
        loadDetails();
    }, [id]);

    if (loading) return <div className="anime-details-page"><p>Loading details...</p></div>;
    if (!anime) return <div className="anime-details-page"><p>Anime not found.</p></div>;

    return (
        <div className="anime-details-page">
            <Link to="/" className="back-link">&larr; Back to Home</Link>

            <div className="details-content">
                <div className="details-image">
                    <img
                        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                        alt={anime.title}
                    />
                </div>

                <div className="details-info">
                    <h1>{anime.title}</h1>
                    {anime.title_english && <h2 className="english-title">{anime.title_english}</h2>}

                    <div className="details-stats">
                        <div className="stat-badge"><span>Score:</span> {anime.score || 'N/A'}</div>
                        <div className="stat-badge"><span>Rank:</span> #{anime.rank || 'N/A'}</div>
                        <div className="stat-badge"><span>Episodes:</span> {anime.episodes || 'N/A'}</div>
                        <div className="stat-badge"><span>Status:</span> {anime.status}</div>
                    </div>

                    <div className="details-synopsis">
                        <h3>Synopsis</h3>
                        <p>{anime.synopsis || 'No synopsis available.'}</p>
                    </div>

                    {anime.genres && anime.genres.length > 0 && (
                        <div className="details-genres">
                            {anime.genres.map(genre => (
                                <span key={genre.mal_id} className="genre-tag">{genre.name}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimeDetails;
