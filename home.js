// ===== Home Page Logic =====

document.addEventListener("DOMContentLoaded", () => {
    loadTrending();
    loadTopRated();
});

// --- Trending Section (page 1 of top anime) ---
async function loadTrending() {
    const grid = document.getElementById("trending-grid");
    const loader = document.getElementById("trending-loader");

    try {
        const data = await getTopAnime(1);
        const animeList = data.data.slice(0, 12); // show 12 cards

        loader.classList.add("hidden");

        animeList.forEach((anime, i) => {
            const card = createAnimeCard(anime, i);
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load trending anime:", err);
        loader.innerHTML = `<p style="color:#ff6b6b;">Failed to load. Please try again later.</p>`;
    }
}

// --- Top Rated Section (page 2 for variety) ---
async function loadTopRated() {
    const scroll = document.getElementById("top-rated-scroll");
    const loader = document.getElementById("top-rated-loader");

    try {
        // Jikan rate-limits – wait a bit before second request
        await delay(1200);
        const data = await getTopAnime(2);
        const animeList = data.data.slice(0, 15);

        loader.classList.add("hidden");

        animeList.forEach((anime, i) => {
            const card = createAnimeCard(anime, i);
            scroll.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load top-rated anime:", err);
        loader.innerHTML = `<p style="color:#ff6b6b;">Failed to load. Please try again later.</p>`;
    }
}

// --- Card Builder ---
function createAnimeCard(anime, index) {
    const card = document.createElement("div");
    card.classList.add("anime-card");
    card.style.animationDelay = `${index * 0.06}s`;

    const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
    const title = anime.title || "Unknown";
    const score = anime.score ?? "N/A";
    const episodes = anime.episodes ? `${anime.episodes} eps` : "Ongoing";
    const year = anime.year || anime.aired?.prop?.from?.year || "—";

    card.innerHTML = `
    <img class="anime-card-img" src="${imageUrl}" alt="${title}" loading="lazy" />
    <div class="anime-card-badge">⭐ ${score}</div>
    <div class="anime-card-overlay">
      <p class="anime-card-title">${title}</p>
      <div class="anime-card-meta">
        <span>${year}</span>
        <span>·</span>
        <span>${episodes}</span>
      </div>
    </div>
  `;

    card.addEventListener("click", () => {
        window.location.href = `detail.html?id=${anime.mal_id}`;
    });

    return card;
}

// --- Utility ---
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
