// jkanime_sora_module.js
const baseUrl = "https://jkanime.net/";

async function searchAnime(query) {
    const res = await fetch(`${baseUrl}?s=${encodeURIComponent(query)}`);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const results = [];

    doc.querySelectorAll(".bsx .card").forEach(item => {
        results.push({
            title: item.querySelector(".card-body h5 a")?.textContent.trim(),
            url: item.querySelector(".card-body h5 a")?.href,
            image: item.querySelector("img")?.src
        });
    });

    return results;
}

async function getAnimeInfo(url) {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const title = doc.querySelector(".infox h1")?.textContent.trim();
    const image = doc.querySelector(".infox img")?.src;
    const description = doc.querySelector(".descripcion")?.textContent.trim();

    const episodes = [];
    doc.querySelectorAll(".episodios li a").forEach(ep => {
        episodes.push({
            title: ep.textContent.trim(),
            url: ep.href
        });
    });

    return { title, image, description, episodes };
}

async function getEpisodeStream(url) {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const videoSrc = doc.querySelector("video source")?.src || doc.querySelector("iframe")?.src;

    return [{ url: videoSrc, quality: "1080p" }];
}

// Export functions for Sora
export { searchAnime, getAnimeInfo, getEpisodeStream };
