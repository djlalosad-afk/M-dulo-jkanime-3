/**
 * Módulo Sora para JkAnime
 * Autor: djlalosad-afk
 * Función: buscar anime, obtener detalles y stream
 */

const baseUrl = "https://jkanime.net";
const listUrl = "https://jkanime.net/animes/";

// Función de búsqueda
async function search(query) {
    const res = await fetch(listUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const results = [];
    doc.querySelectorAll("div.anime__item").forEach(item => {
        const titleElem = item.querySelector("h5 a");
        const imgElem = item.querySelector(".anime__item__pic");

        if (titleElem.textContent.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                title: titleElem.textContent.trim(),
                url: titleElem.href,
                image: imgElem.dataset.setbg
            });
        }
    });

    return results;
}

// Función de detalles del anime
async function details(animeUrl) {
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

// Función para obtener el stream de un episodio
async function stream(episodeUrl) {
    const res = await fetch(episodeUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const videoSrc = doc.querySelector("iframe")?.src || "";

    return videoSrc;
}
