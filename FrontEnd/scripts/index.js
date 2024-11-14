// Récupération des projets de l'architecte depuis le back-end
const responseAPI = await fetch("http://localhost:5678/api/works");
const works = await responseAPI.json();

// Déclaration de la boucle pour parcourir tous les travaux de l'architecte et les ajouter à la galerie
for (let i = 0; i < works.length; i++) {

    // Récupération de l'élément du DOM ("Gallery") qui accueillera les projets
    const gallery = document.querySelector(".gallery");

    // Création de la basile HTML figure et intégration du contenu en HTML 
    const figure = document.createElement("figure");
    figure.innerHTML = 
    `
    <img src="${works[i].imageUrl}" alt="${works[i].title}">
    <figcaption>${works[i].title}</figcaption>
    `;

    // Rattachement de la balise figure au parent "Gallery"
    gallery.appendChild(figure);
}