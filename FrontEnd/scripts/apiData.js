import { baseURL } from "./urlBaseApi.js";

/* const worksApiResponse = await fetch(`${baseURL}works`);
export const works = await worksApiResponse.json();
 */

export async function fetchWorks() {
    try {
        let response = await fetch(`${baseURL}works`);
        let works = await response.json();
        return works;
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
        return null;
    }
}

export async function fetchCategories() {
    try {
        let response = await fetch(`${baseURL}categories`);
        let categories = await response.json();
        categories.unshift({
            "id": 0,
            "name": "Tous"
        });
        return categories;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error)
    }
}

/* const categoriesApiResponse = await fetch(`${baseURL}categories`);
export const categories = await categoriesApiResponse.json();
categories.unshift({
    "id": 0,
    "name": "Tous"
}); */