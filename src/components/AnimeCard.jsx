import { Link } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ id, title, image }) => {
    return (
        <div className="anime-card">
            <div className="anime-image-placeholder">
                {image ? <img src={image} alt={title} /> : <span>No Image</span>}
            </div>
            <div className="anime-info">
                <h3>{title || 'Unknown Anime'}</h3>
                <Link to={`/anime/${id || 1}`} className="view-btn">View Details</Link>
            </div>
        </div>
    );
};

export default AnimeCard;
