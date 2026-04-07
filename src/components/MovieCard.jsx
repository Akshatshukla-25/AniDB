import { Star, Eye } from 'lucide-react';
import './MovieCard.css';

export default function MovieCard({
    title = "Project Hail Mary",
    year = "2026",
    duration = "2h 36m",
    ageRating = "12A",
    rating = "8.4",
    ratingCount = "165K",
    description = "Sole survivor on a desperate last-chance mission to save both humanity and the earth.",
    poster = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=600&auto=format&fit=crop",
    rank = "1"
}) {
    return (
        <div className="movie-card">
            <div className="movie-card-poster">
                <img src={poster} alt={title} />
            </div>
            <div className="movie-card-content">
                <div className="movie-card-top">
                    <span className="movie-badge">#{rank}</span>
                    <h3 className="movie-title">{title}</h3>
                </div>

                <div className="movie-meta">
                    {year} &bull; {duration} &bull; {ageRating}
                </div>

                <div className="movie-ratings">
                    <div className="rating-score-wrapper">
                        <Star className="icon-star" size={16} fill="#eab308" color="#eab308" />
                        <span className="rating-score">{rating}</span>
                        <span className="rating-count">({ratingCount})</span>
                    </div>
                    <button className="link-btn rate-btn">Rate</button>
                </div>

                <div className="movie-actions">
                    <button className="link-btn watch-btn">
                        <Eye className="icon-eye" size={16} /> Mark as watched
                    </button>
                </div>

                <p className="movie-description">{description}</p>
            </div>
        </div>
    );
}
