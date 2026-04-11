const BASE_URL = "https://api.jikan.moe/v4";

// Search anime by query
async function searchAnime(query) {
    const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
}

// Get top anime
async function getTopAnime(page = 1) {
    const response = await fetch(`${BASE_URL}/top/anime?page=${page}`);
    const data = await response.json();
    return data;
}

// Get anime details by ID
async function getAnimeById(id) {
    const response = await fetch(`${BASE_URL}/anime/${id}`);
    const data = await response.json();
    return data;
}

// Get anime recommendations
async function getAnimeRecommendations(id) {
    const response = await fetch(`${BASE_URL}/anime/${id}/recommendations`);
    const data = await response.json();
    return data;
}
