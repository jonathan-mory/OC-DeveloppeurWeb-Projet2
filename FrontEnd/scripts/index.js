import * as api from "./api.js";
import * as modal from "./modal.js"

export function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach((work) => {
        const img = document.createElement("img")
        img.className = "work-img"
        img.src = work.imageUrl
        img.alt = work.title

        const figcaption = document.createElement("figcaption")
        figcaption.innerText = work.title

        const figure = document.createElement("figure")
        figure.dataset.id = work.id

        figure.appendChild(img)
        figure.appendChild(figcaption)
        gallery.appendChild(figure);
    });
}

function displayFilterButtons(categories) {
    const filtersContainer = document.querySelector(".filters-container");
    categories.forEach((category) => {
        // Création des boutons de filtre
        const filterButton = document.createElement("button");
        filterButton.dataset.categoryId = category.id;
        filterButton.classList.add("filter-button");
        filterButton.innerText = category.name;
        filtersContainer.appendChild(filterButton);
        // Activation des boutons de filtre
        filterButton.addEventListener("click", (event) => {
            document.querySelector(".filter-button.active-button")?.classList.remove("active-button");
            event.target.classList.add("active-button")
            const selectedFilter = parseInt(event.target.dataset.categoryId);
            const filteredWorks = api.works.filter((work) => work.categoryId === selectedFilter)
            displayWorks(selectedFilter >= 1 ? filteredWorks : api.works)
        })
    });
};

function modifyLoginLogout() {
    const loginButton = document.getElementById("login")
    loginButton.innerText = "Logout"
    loginButton.addEventListener("click", () => {
        sessionStorage.removeItem("token")
    })
}

function displayEditionBar() {
    const headerTag = document.querySelector("header");
    const headerDiv = document.querySelector(".header");
    const editionModeDiv = document.createElement("div");
    editionModeDiv.setAttribute("class", "edition-mode-header");
    editionModeDiv.innerHTML = `
        <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
        <a href="#modal" class="js-modal-open">Mode édition</a>
    `;
    headerTag.insertBefore(editionModeDiv, headerDiv);
}

function displayModifyButton(params) {
    const portfolioTitleDiv = document.querySelector(".portfolio-title");
    portfolioTitleDiv.innerHTML = `
        <h2> Mes Projets </h2>
        <i class="fa-regular fa-pen-to-square"></i>
        <a href="#modal" class="js-modal-open">modifier</a>
    `    
}

displayWorks(api.works)

if (!sessionStorage.token) {
    displayFilterButtons(api.categories);
    // Initialisation du filtrage sur le bouton "Tous"
    document.querySelector('[data-category-id="0"]').classList.add("active-button");
}

if (sessionStorage.token) {
    modifyLoginLogout()
    displayEditionBar()
    displayModifyButton()
    modal.initModal()
    // Ajouter des écouteurs d'événements à chaque champ requis
    modal.addWorkInputs.forEach(input => {
        input.addEventListener("input", modal.checkFormValidity);
    });
}
