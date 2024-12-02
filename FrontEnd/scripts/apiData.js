// Récupération des projets de l'architecte depuis le back-end
const worksApiResponse = await fetch("http://localhost:5678/api/works");
export const works = await worksApiResponse.json();

const categoriesApiResponse = await fetch("http://localhost:5678/api/categories");
export const categories = await categoriesApiResponse.json();
categories.unshift({
    "id": 0,
    "name": "Tous"
});