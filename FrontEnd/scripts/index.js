// Récupération des projets de l'architecte depuis le back-end
const worksApiResponse = await fetch("http://localhost:5678/api/works");
const works = await worksApiResponse.json();
const categoriesApiResponse = await fetch("http://localhost:5678/api/categories")
const categories = await categoriesApiResponse.json();

function generateWorks(works) {
    // Déclaration de la boucle pour parcourir tous les travaux de l'architecte et les ajouter à la galerie
    for (let i = 0; i < works.length; i++) {

    // Création de la basile HTML figure et intégration du contenu en HTML 
    const figure = document.createElement("figure");
    figure.innerHTML = 
    `
    <img src="${works[i].imageUrl}" alt="${works[i].title}">
    <figcaption>${works[i].title}</figcaption>
    `;

    // Récupération de l'élément du DOM ("Gallery") qui accueillera les projets
    const gallery = document.querySelector(".gallery");
    // Rattachement de la balise figure au parent "Gallery"
    gallery.appendChild(figure);
};
}

// Premier affichage de la page 
generateWorks(works);

function createFilterButtons() {
    // Création du filtre "Tous"
    const filterAllBtn = document.createElement("button");
    // Paramètrage du filtre "Tous"
    filterAllBtn.classList.add("button", "active-button");
    filterAllBtn.innerText = "Tous";
    // Récupération de l'élément parent et intégration dans le DOM
    const filtersContainer = document.querySelector(".filters-container");
    filtersContainer.appendChild(filterAllBtn);
    // Ajout de l'écouteur d'événement sur le filtre "Tous"
    filterAllBtn.addEventListener("click", () => {
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(works);
    });
    // Création des filtres "Objets", "Appartements" et "Hotels & Restaurants"
    for (let i = 0; i < categories.length; i++) {
        const filterBtns = document.createElement("button");
        filterBtns.id = categories[i].id;
        filterBtns.classList.add("button");
        filterBtns.innerText = categories[i].name;
        filtersContainer.appendChild(filterBtns);
    };
    // Ajout de l'écouteur d'événement pour trier les objets
    const objectsButton = document.getElementById("1");
    objectsButton.addEventListener("click", () => {
        const objectWorks = works.filter(work => work.categoryId === 1);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(objectWorks);
        });

    // Ajout de l'écouteur d'événement pour trier les appartements
    const flatsButton = document.getElementById("2");
    flatsButton.addEventListener("click", () => {
        const flatWorks = works.filter(work => work.categoryId === 2);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(flatWorks);
        });

    // Ajout de l'écouteur d'événement pour trier les hotels & restaurants
    const hotelsAndRestaurantsButton = document.getElementById("3");
    hotelsAndRestaurantsButton.addEventListener("click", () => {
        const hotelAndRestaurantWorks = works.filter(work => work.categoryId === 3);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(hotelAndRestaurantWorks);
    });
};

// Génération des boutons de filtres
createFilterButtons();

function buttonClicked() {
    document.querySelectorAll("button").forEach(button => {
        button.classList.remove("active-button");
    });
    this.classList.add("active-button");
}

// Modification des styles des boutons de filtre au clic
document.querySelectorAll(".button").forEach(button => {
    button.onclick = buttonClicked;
});

if (sessionStorage.token) {
    const loginButton = document.getElementById("login");
    loginButton.innerText = "logout";
}