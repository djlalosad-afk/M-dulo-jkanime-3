/**
 * Módulo Sora para JkAnime
 * Extrae anime, episodios, imágenes y búsqueda
 */

const baseUrl = "https://jkanime.net";

async function searchAnime(query) {
    const url = `${baseUrl}/?s=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const results = [];
    doc.querySelectorAll("div.anime__item").forEach(item => {
        const titleElem = item.querySelector("h5 a");
        const imgElem = item.querySelector(".anime__item__pic");

        results.push({
            title: titleElem.textContent.trim(),
            url: titleElem.href,
            image: imgElem.dataset.setbg
        });
    });

    return results;
}

async function getAnimeDetails(animeUrl) {
    const res = await fetch(animeUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const description = doc.querySelector("div.anime__details__text p")?.textContent.trim() || "";
    const episodes = [];

    doc.querySelectorAll("div.episode__item a").forEach(ep => {
        episodes.push({
            title: ep.textContent.trim(),
            url: ep.href
        });
    });

    const image = doc.querySelector("div.anime__poster img")?.src || "";

    return { description, episodes, image };
}

async function getStream(episodeUrl) {
    const res = await fetch(episodeUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // JkAnime usa un iframe o video embed
    const videoSrc = doc.querySelector("iframe")?.src || "";

    return videoSrc;
}
