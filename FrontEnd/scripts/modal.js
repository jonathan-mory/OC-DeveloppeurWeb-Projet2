import { works } from "./apiData.js";

export let modal = null
const focusablesSelector = "button, a, input, textarea"
let focusablesElements = []
let previouslyFocusedElement = null

export function openModal(event) {
    event.preventDefault()
    modal = document.querySelector(event.target.getAttribute("href"))
    focusablesElements = Array.from(modal.querySelectorAll(focusablesSelector))
    previouslyFocusedElement = document.querySelector(":focus")
    modal.style.display = null
    focusablesElements[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

export function closeModal(event) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    event.preventDefault()
    window.setTimeout(() => {
        modal.style.display = "none"
        modal = null
    }, 500)
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
}

function stopPropagation(event) {
    event.stopPropagation()
}

export function focusInModal(event) {
    event.preventDefault()
    let index = focusablesElements.findIndex(f => f === modal.querySelector(":focus"))
    if (event.shiftKey === true) {
        index--
    } else {
        index ++
    }
    if (index >= focusablesElements.length) {
        index = 0
    }
    if (index < 0) {
        index = focusablesElements.length - 1
    }
    focusablesElements[index].focus()
}

function generateWorksForModal() {
    works.forEach((work) => {
        // Création de la basile HTML figure et intégration du contenu en HTML 
        const figure = document.createElement("figure");
        figure.innerHTML = 
        `
        <img src="${work.imageUrl}" alt="${work.title}">
        <button class="delete-button"><i class="fa-solid fa-trash-can"></i></button>
        `;
        figure.classList.add("figure-modal")
        // Récupération de l'élément du DOM ("Gallery") qui accueillera les projets
        const modalGallery = document.querySelector(".modal-gallery");
        // Rattachement de la balise figure au parent "Gallery"
        modalGallery.appendChild(figure);
        });
}

generateWorksForModal()

const deleteWorkButtons = Array.from(document.querySelectorAll(".delete-button"))
console.log(deleteWorkButtons)
deleteWorkButtons.forEach((deleteButton) => {
    
})
