// ============================================================
// watchlist.js — Watchlist Page Logic
// ============================================================

const WATCHLIST_KEY = "anirate-watchlist";
let watchlistData = []; // Full anime objects once loaded

document.addEventListener("DOMContentLoaded", () => {
    loadWatchlist();

    // Sort
    document.getElementById("wl-sort").addEventListener("change", () => {
        renderWatchlist();
    });

    // Clear all
    document.getElementById("wl-clear-btn").addEventListener("click", () => {
        if (!confirm("Remove all anime from your watchlist?")) return;
        localStorage.removeItem(WATCHLIST_KEY);
        watchlistData = [];
        renderWatchlist();
        showToast("Watchlist cleared");
    });
});

// ===== Load Watchlist =====
async function loadWatchlist() {
    const ids = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
    const loader = document.getElementById("wl-loader");
    const emptyState = document.getElementById("wl-empty");

    if (ids.length === 0) {
        loader.classList.add("hidden");
        emptyState.classList.remove("hidden");
        updateCount(0);
        return;
    }

    // Fetch each anime (with rate-limit delays for Jikan)
    watchlistData = [];

    for (let i = 0; i < ids.length; i++) {
        try {
            const data = await getAnimeById(ids[i]);
            if (data.data) {
                watchlistData.push(data.data);
            }
        } catch (err) {
            console.error(`Failed to load anime ID ${ids[i]}:`, err);
        }

        // Jikan rate limit: 3 requests/second
        if (i < ids.length - 1) {
            await delay(400);
        }
    }

    loader.classList.add("hidden");
    renderWatchlist();
}

// ===== Render Watchlist =====
function renderWatchlist() {
    const grid = document.getElementById("wl-grid");
    const emptyState = document.getElementById("wl-empty");

    grid.innerHTML = "";

    if (watchlistData.length === 0) {
        emptyState.classList.remove("hidden");
        updateCount(0);
        return;
    }

    emptyState.classList.add("hidden");

    // Sort
    const sortBy = document.getElementById("wl-sort").value;
    const sorted = [...watchlistData];

    if (sortBy === "score") {
        sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortBy === "title") {
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    // "added" = default localStorage order

    sorted.forEach((anime, i) => {
        const card = createWatchlistCard(anime, i);
        grid.appendChild(card);
    });

    updateCount(sorted.length);
}

// ===== Card Builder =====
function createWatchlistCard(anime, index) {
    const card = document.createElement("div");
    card.classList.add("wl-card");
    card.style.animationDelay = `${index * 0.05}s`;

    const imageUrl =
        anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
    const title = anime.title || "Unknown";
    const score = anime.score ?? "N/A";
    const episodes = anime.episodes ? `${anime.episodes} eps` : "Ongoing";
    const type = anime.type || "";
    const year = anime.year || anime.aired?.prop?.from?.year || "—";
    const synopsis = anime.synopsis || "";

    card.innerHTML = `
    <div class="wl-card-poster">
      <img src="${imageUrl}" alt="${title}" loading="lazy" />
    </div>
    <div class="wl-card-info">
      <div class="wl-card-title">${title}</div>
      <div class="wl-card-meta">
        <span class="wl-card-score">⭐ ${score}</span>
        ${type ? `<span class="wl-card-type">${type}</span>` : ""}
        <span>${year}</span>
        <span>·</span>
        <span>${episodes}</span>
      </div>
      <p class="wl-card-synopsis">${synopsis}</p>
    </div>
    <button class="wl-card-remove" title="Remove from watchlist">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  `;

    // Click card → detail page
    card.addEventListener("click", (e) => {
        if (e.target.closest(".wl-card-remove")) return;
        window.location.href = `detail.html?id=${anime.mal_id}`;
    });

    // Remove button
    card.querySelector(".wl-card-remove").addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromWatchlist(anime.mal_id, card);
    });

    return card;
}

// ===== Remove from Watchlist =====
function removeFromWatchlist(id, cardEl) {
    // Animate out
    cardEl.classList.add("removing");

    setTimeout(() => {
        // Remove from localStorage
        let ids = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
        ids = ids.filter((item) => String(item) !== String(id));
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));

        // Remove from in-memory data
        watchlistData = watchlistData.filter(
            (anime) => String(anime.mal_id) !== String(id)
        );

        renderWatchlist();
        showToast("Removed from watchlist");
    }, 350);
}

// ===== Update Count =====
function updateCount(n) {
    document.getElementById("wl-count").textContent = n;
}

// ===== Toast =====
function showToast(message) {
    // Remove any existing toast
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ===== Utility =====
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
