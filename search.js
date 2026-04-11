// ============================================================
// search.js — Search Page Logic
// ============================================================

let currentPage = 1;
let currentQuery = "";
let lastSearchParams = {};

document.addEventListener("DOMContentLoaded", () => {
    // Check for ?q= in URL (coming from detail page search bar or home)
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
        document.getElementById("search-input").value = q;
        performSearch(q);
    }

    // Search on Enter
    document.getElementById("search-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") triggerSearch();
    });

    // Search on button click
    document.getElementById("search-btn").addEventListener("click", () => {
        triggerSearch();
    });

    // Filter changes re-trigger search
    document.querySelectorAll(".filter-select").forEach((select) => {
        select.addEventListener("change", () => {
            if (currentQuery) {
                currentPage = 1;
                performSearch(currentQuery);
            }
        });
    });

    // Pagination
    document.getElementById("page-prev").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            performSearch(currentQuery);
            window.scrollTo({ top: 400, behavior: "smooth" });
        }
    });

    document.getElementById("page-next").addEventListener("click", () => {
        currentPage++;
        performSearch(currentQuery);
        window.scrollTo({ top: 400, behavior: "smooth" });
    });
});

function triggerSearch() {
    const q = document.getElementById("search-input").value.trim();
    if (!q) return;
    currentPage = 1;
    currentQuery = q;
    performSearch(q);

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set("q", q);
    window.history.replaceState({}, "", url);
}

async function performSearch(query) {
    currentQuery = query;

    const grid = document.getElementById("results-grid");
    const loader = document.getElementById("results-loader");
    const emptyState = document.getElementById("empty-state");
    const noResults = document.getElementById("no-results");
    const pagination = document.getElementById("pagination");
    const info = document.getElementById("results-info");

    // Show loader, hide everything else
    grid.innerHTML = "";
    emptyState.classList.add("hidden");
    noResults.classList.add("hidden");
    pagination.classList.add("hidden");
    loader.classList.remove("hidden");
    info.textContent = "";

    try {
        // Build query params
        const filterType = document.getElementById("filter-type").value;
        const filterStatus = document.getElementById("filter-status").value;
        const filterRating = document.getElementById("filter-rating").value;
        const filterSort = document.getElementById("filter-sort").value;

        let url = `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${currentPage}&limit=24`;
        if (filterType) url += `&type=${filterType}`;
        if (filterStatus) url += `&status=${filterStatus}`;
        if (filterRating) url += `&rating=${filterRating}`;
        if (filterSort) url += `&order_by=${filterSort}&sort=desc`;

        const response = await fetch(url);
        const data = await response.json();

        loader.classList.add("hidden");

        const animeList = data.data || [];
        const paginationData = data.pagination;

        if (animeList.length === 0) {
            noResults.classList.remove("hidden");
            return;
        }

        // Results info
        const totalItems = paginationData?.items?.total || animeList.length;
        info.textContent = `Found ${totalItems} result${totalItems !== 1 ? "s" : ""} for "${query}"`;

        // Render cards
        animeList.forEach((anime, i) => {
            const card = createSearchCard(anime, i);
            grid.appendChild(card);
        });

        // Pagination
        const hasNext = paginationData?.has_next_page || false;
        const lastPage = paginationData?.last_visible_page || 1;

        if (lastPage > 1) {
            pagination.classList.remove("hidden");
            document.getElementById("page-prev").disabled = currentPage <= 1;
            document.getElementById("page-next").disabled = !hasNext;
            document.getElementById("page-info").textContent = `Page ${currentPage} of ${lastPage}`;
        }
    } catch (err) {
        console.error("Search failed:", err);
        loader.classList.add("hidden");
        noResults.classList.remove("hidden");
        noResults.querySelector("h2").textContent = "Something went wrong";
        noResults.querySelector("p").textContent = "Please try again later";
    }
}

// ===== Card Builder =====
function createSearchCard(anime, index) {
    const card = document.createElement("div");
    card.classList.add("anime-card");
    card.style.animationDelay = `${index * 0.04}s`;

    const imageUrl =
        anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
    const title = anime.title || "Unknown";
    const score = anime.score ?? "N/A";
    const episodes = anime.episodes ? `${anime.episodes} eps` : "Ongoing";
    const year = anime.year || anime.aired?.prop?.from?.year || "—";
    const type = anime.type || "";

    card.innerHTML = `
    <img class="anime-card-img" src="${imageUrl}" alt="${title}" loading="lazy" />
    <div class="anime-card-badge">⭐ ${score}</div>
    ${type ? `<div class="anime-card-type">${type}</div>` : ""}
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
