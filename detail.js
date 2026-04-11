// ============================================================
// detail.js — Anime Detail Page Logic
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    if (!animeId) {
        document.getElementById("detail-title").textContent = "No anime selected";
        return;
    }

    loadAnimeDetail(animeId);
});

// ===== Load Anime Detail =====
async function loadAnimeDetail(id) {
    try {
        const data = await getAnimeById(id);
        const anime = data.data;
        renderDetail(anime);

        // Characters (with rate-limit delay)
        await delay(1200);
        loadCharacters(id);
    } catch (err) {
        console.error("Failed to load anime detail:", err);
        document.getElementById("detail-title").textContent = "Failed to load anime.";
    }
}

// ===== Render Detail =====
function renderDetail(anime) {
    // Page title
    document.title = `AniRate — ${anime.title}`;

    // Poster
    const posterCard = document.getElementById("poster-card");
    const posterImg = document.getElementById("poster-img");
    posterImg.src = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
    posterImg.alt = anime.title;
    posterCard.classList.remove("skeleton");

    // Breadcrumb
    document.getElementById("breadcrumb-title").textContent = anime.title;
    document.getElementById("breadcrumb-title").classList.remove("skeleton-text");

    // Title
    const titleEl = document.getElementById("detail-title");
    titleEl.textContent = anime.title;
    titleEl.classList.remove("skeleton-text");

    // Badges
    const rating = anime.rating || "N/A";
    document.getElementById("badge-rating").textContent = rating.split(" - ")[0] || rating;
    document.getElementById("badge-type").textContent = anime.type || "—";
    document.getElementById("badge-episodes").textContent =
        anime.episodes ? `${anime.episodes} EPs` : "Ongoing";

    // Synopsis
    const synopsisEl = document.getElementById("synopsis-text");
    synopsisEl.textContent = anime.synopsis || "No synopsis available.";

    // Synopsis toggle
    const moreBtn = document.getElementById("synopsis-more");
    moreBtn.addEventListener("click", () => {
        synopsisEl.classList.toggle("expanded");
        moreBtn.textContent = synopsisEl.classList.contains("expanded") ? "− Less" : "+ More";
    });

    // Meta panel
    setMeta("meta-jp", anime.title_japanese || "—");
    setMeta("meta-score", anime.score ? `⭐ ${anime.score} / 10` : "—");
    setMeta("meta-ranked", anime.rank ? `#${anime.rank}` : "—");
    setMeta("meta-aired", anime.aired?.string || "—");
    setMeta(
        "meta-premiered",
        anime.season && anime.year
            ? `${capitalize(anime.season)} ${anime.year}`
            : "—"
    );
    setMeta("meta-duration", anime.duration || "—");
    setMeta("meta-status", anime.status || "—");

    // Genres (as tags)
    const genresEl = document.getElementById("meta-genres");
    genresEl.classList.remove("skeleton-text");
    if (anime.genres && anime.genres.length) {
        genresEl.innerHTML = anime.genres
            .map((g) => `<span class="genre-tag">${g.name}</span>`)
            .join("");
    } else {
        genresEl.textContent = "—";
    }

    // Studios
    setMeta(
        "meta-studios",
        anime.studios?.map((s) => s.name).join(", ") || "—"
    );

    // Producers
    setMeta(
        "meta-producers",
        anime.producers?.map((p) => p.name).join(", ") || "—"
    );

    // Animate in
    document.getElementById("detail-hero").style.animation = "fadeIn 0.6s ease-out";
}

// ===== Characters =====
async function loadCharacters(id) {
    const grid = document.getElementById("characters-grid");
    const loader = document.getElementById("characters-loader");

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
        const data = await response.json();
        const characters = data.data?.slice(0, 16) || [];

        loader.classList.add("hidden");

        if (characters.length === 0) {
            grid.innerHTML = `<p style="color:var(--text-muted);">No character data available.</p>`;
            return;
        }

        characters.forEach((entry, i) => {
            const card = createCharacterCard(entry, i);
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load characters:", err);
        loader.innerHTML = `<p style="color:#ff6b6b;">Failed to load characters.</p>`;
    }
}

function createCharacterCard(entry, index) {
    const char = entry.character;
    const role = entry.role || "Supporting";
    const va = entry.voice_actors?.find((v) => v.language === "Japanese") || entry.voice_actors?.[0];

    const card = document.createElement("div");
    card.classList.add("character-card");
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
    <div class="char-left">
      <img class="char-img" src="${char.images?.jpg?.image_url || ""}" alt="${char.name}" loading="lazy" />
      <div>
        <div class="char-name">${char.name}</div>
        <div class="char-role ${role === "Main" ? "main" : ""}">${role}</div>
      </div>
    </div>
    ${va
            ? `<div class="char-right">
            <img class="char-img" src="${va.person?.images?.jpg?.image_url || ""}" alt="${va.person?.name || ""}" loading="lazy" />
            <div>
              <div class="char-name">${va.person?.name || "Unknown"}</div>
              <div class="char-role">${va.language || ""}</div>
            </div>
          </div>`
            : ""
        }
  `;

    return card;
}

// ===== Helpers =====
function setMeta(id, value) {
    const el = document.getElementById(id);
    el.textContent = value;
    el.classList.remove("skeleton-text");
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== Navbar Search =====
document.getElementById("nav-search-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const q = e.target.value.trim();
        if (q) {
            window.location.href = `search.html?q=${encodeURIComponent(q)}`;
        }
    }
});

// ===== Add to List Button =====
document.getElementById("btn-add-list")?.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    let watchlist = JSON.parse(localStorage.getItem("anirate-watchlist") || "[]");
    if (!watchlist.includes(id)) {
        watchlist.push(id);
        localStorage.setItem("anirate-watchlist", JSON.stringify(watchlist));
    }

    const btn = document.getElementById("btn-add-list");
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
    btn.style.borderColor = "#00d4ff";
    btn.style.color = "#00d4ff";
});
