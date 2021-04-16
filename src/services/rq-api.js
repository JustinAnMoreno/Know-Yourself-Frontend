export function getQuote() {
    return fetch("https://zenquotes.io/api/today")
    .then(res => render.json())
}

