import { modal, openModal, closeModal } from "./modal.js";

// Récupération des projets de l'architecte depuis le back-end
const worksApiResponse = await fetch("http://localhost:5678/api/works");
const works = await worksApiResponse.json();
const categoriesApiResponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesApiResponse.json();
categories.unshift({
    "id": 0,
    "name": "Tous"
});

function generateWorks(works) {
    works.forEach((work) => {
        // Création de la basile HTML figure et intégration du contenu en HTML 
        const figure = document.createElement("figure");
        figure.innerHTML = 
        `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
        `;
        // Récupération de l'élément du DOM ("Gallery") qui accueillera les projets
        const gallery = document.querySelector(".gallery");
        // Rattachement de la balise figure au parent "Gallery"
        gallery.appendChild(figure);
        });
}

function createFilterButtons() {
    categories.forEach((category) => {
        const filterButton = document.createElement("button");
        filterButton.dataset.categoryId = category.id;
        filterButton.classList.add("button");
        filterButton.innerText = category.name;
        const filtersContainer = document.querySelector(".filters-container");
        filtersContainer.appendChild(filterButton);
    });
};

function activateFilterButtons() {
    const filterButtons = document.querySelectorAll("button")
    filterButtons.forEach((filterButton) => {
        filterButton.addEventListener("click", (event) => {
            filterButtons.forEach((filterButton) => {filterButton.classList.remove("active-button")})
            event.target.classList.add("active-button")
            const selectedFilter = parseInt(event.target.dataset.categoryId);
            const filteredWorks = works.filter((work) => work.categoryId === selectedFilter)
            document.querySelector(".gallery").innerHTML = "";
            if (selectedFilter >= 1) {
                generateWorks(filteredWorks)
            } else {
                generateWorks(works)
            }
        })
    })
}

generateWorks(works);
createFilterButtons();
activateFilterButtons();

// Modification de la page d'accueil en mode édition
if (sessionStorage.token) {
    // Modification du menu login/logout en fonction de l'authentification via le token
    const loginButton = document.getElementById("login");
    loginButton.innerHTML = "<li>logout</li>";
    loginButton.addEventListener("click", (event) => {
        sessionStorage.removeItem("token");
        event.preventDefault;
        loginButton.innerHTML = "<li>logout</li>";
    });

    // Apparition du header "Mode édition"
    const editionModeDiv = document.createElement("div");
    editionModeDiv.setAttribute("class", "edition-mode-header");
    editionModeDiv.innerHTML = `
    <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
    <a href="#modal" class="js-modal">Mode édition</a>`;
    const headerTag = document.querySelector("header");
    const headerDiv = document.querySelector(".header");
    headerTag.insertBefore(editionModeDiv, headerDiv);

    // Apparition du bouton "modifier" dans la section "Mes projets"
    const portfolioTitleDiv = document.querySelector(".portfolio-title");
    portfolioTitleDiv.innerHTML = `
    <h2> Mes Projets </h2>
    <i class="fa-regular fa-pen-to-square"></i>
    <a href="#modal" class="js-modal">modifier</a>`    
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})