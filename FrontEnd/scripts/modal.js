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
        figure.dataset.id = work.id
        figure.innerHTML = 
        `
        <img src="${work.imageUrl}" alt="${work.title}">
        <button class="delete-button" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        figure.classList.add("figure-modal")
        // Récupération de l'élément du DOM ("Gallery") qui accueillera les projets
        const modalGallery = document.querySelector(".modal-gallery");
        // Rattachement de la balise figure au parent "Gallery"
        modalGallery.appendChild(figure);
        });
}

async function deleteWorks(event) {
    try {
        const workId = event.currentTarget.getAttribute("data-id")
        const token = sessionStorage.getItem("token")
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        })
        if (response.ok) {
            console.log('Élément supprimé avec succès');
            const works = document.querySelectorAll("figure")
            works.forEach((work) => {
                if (work.dataset.id === workId) {
                    work.remove()
                }
            })
        } else {
            console.error('Erreur lors de la suppression de l\'élément');
        }
    } catch (error) {
        console.error("Erreur réseau ou autre problème", error)
    }
}

generateWorksForModal()

const deleteWorkButtons = document.querySelectorAll(".delete-button")
deleteWorkButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", deleteWorks)
})


