const api = "https://api.jikan.moe/v4";

export const fetchAnimeList = async () => {
    try {
        const response = await fetch(`${api}/top/anime`);
        const data = await response.json();
        return data.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const fetchAnimeDetails = async (id) => {
    try {
        const response = await fetch(`${api}/anime/${id}`);
        const data = await response.json();
        return data.data || null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const searchAnime = async (query) => {
    try {
        const response = await fetch(`${api}/anime?q=${query}`);
        const data = await response.json();
        return data.data || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};
