import { useState } from 'react';
import { searchAnime } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const data = await searchAnime(query);
            setResults(data || []);
        } catch (error) {
            console.error("Error searching anime:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">
            <h1>Search Anime</h1>
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for anime..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="search-results">
                {loading && <p>Loading...</p>}
                {!loading && hasSearched && results.length === 0 && <p>No results found.</p>}
                {!loading && !hasSearched && results.length === 0 && <p>Type something to search!</p>}

                {!loading && results.length > 0 && (
                    <div className="anime-grid">
                        {results.map((anime) => (
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
        </div>
    );
};

export default Search;
