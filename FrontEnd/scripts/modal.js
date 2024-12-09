import * as api from "./api.js"
import { displayErrorMessage } from "./test.js";

export const dialog = document.getElementById("modal");
export const modalWindow1 = document.getElementById("modal-window1")
export const modalWindow2 = document.getElementById("modal-window2")
export const addWorkForm = document.getElementById("add-project-form")
export const addWorkInputs = addWorkForm.querySelectorAll("input[required], select");
const beforeUploadContent = document.querySelectorAll("#file-upload-container div ~ *")
const afterUploadContainer = document.querySelector(".image-container")

export function openModal() {
    const openModalButtons = document.querySelectorAll(".js-modal-open");
    openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        dialog.showModal()
    })
})
}

export function generateWorksForModal(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";
    works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-button" data-id="${work.id}" aria-label="Supprimer le projet"><i class="fa-solid fa-trash-can"></i></button>
        `;
        figure.classList.add("figure-modal")
        modalGallery.appendChild(figure);
    });
}

export function addDeleteEventListeners() {
    // Ajout de la fonction "deleteWork" à tous les boutons pour supprimer des projets
    document.querySelectorAll(".figure-modal .delete-button")
    .forEach((deleteButton) => {
        deleteButton.addEventListener("click", api.deleteWork)
    })
}

export function switchWindow(openingWindow, closingWindow) {
    openingWindow.classList.add("active")
    closingWindow.classList.remove("active")
}

export function switchModalWindow() {
    // Afficher la fenêtre 2
    document.getElementById("add-picture-button")
    .addEventListener("click", () => {
        switchWindow(modalWindow2, modalWindow1)
    })
    // Afficher la fenêtre 1
    document.getElementById("modal-backward-button")
    .addEventListener("click", () => {
        switchWindow(modalWindow1, modalWindow2)
    })
}

export function checkAndDisplayUploadFile() {
    const fileUploadContainer = document.getElementById("file-upload-container")
    document.getElementById("file-input")
    .addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 4 * 1024 * 1024) {
            // Création de la fonction pour lire l'image uploadée
            const reader = new FileReader()
            reader.onload = function(e) {
                const preview = document.getElementById("preview")
                preview.src = e.target.result
            }
            // Cacher les éléments HTML permettant d'uploader une image
            beforeUploadContent.forEach((element) => {
                element.style.display = "none"
            })
            // Supprimer le message d'erreur lorsque l'on ré-upload une nouvelle image
            const errorMessage = document.querySelector(".error-message") 
            errorMessage ? errorMessage.remove() : null
            // Afficher l'image uploadée et le bouton pour changer de fichier
            afterUploadContainer.style.display = "block"
            reader.readAsDataURL(file)
            // Changer d'image grâce au bouton
            const changePictureButton = document.querySelector(".image-container .delete-button")
            changePictureButton.addEventListener("click", () => {
                addWorkForm.reset() 
                resetUploadContainer()
                checkFormValidity()
            })
        } else {
            displayErrorMessage("Impossible de charger le fichier car il est trop volumineux (4 Mo maximum)", fileUploadContainer)
        }
    });
}

export function resetUploadContainer() {
    afterUploadContainer.style.display = "none"
    beforeUploadContent.forEach((element) => {
        element.id !== "file-input" ? element.style.display = "block" : null;
    })
}

export function generateCategorieOptions(categories) {
    const categorySelector = document.getElementById("category-select")
    categories.forEach((categorie) => {
        if (categorie.name === "Tous") {
            return
        } else {
            const categoryOption = document.createElement("option")
            categoryOption.value = parseInt(categorie.id)
            categoryOption.text = categorie.name
            categorySelector.appendChild(categoryOption)
        }
    })
}

export function checkFormValidity() {
    const submitButton = document.getElementById("submit-button");
    let allFilled = true;
    addWorkInputs.forEach(input => {
        if (!input.value) {
            allFilled = false;
        }
    });
    if (allFilled) {
        submitButton.classList.remove("disabled-button")
        submitButton.classList.add("active-button")
    } else {
        submitButton.classList.add("disabled-button")
        submitButton.classList.remove("active-button")
    } 
}

export function closeModal() {
    const closeModalButtons = document.querySelectorAll(".js-modal-close");
    // Fermer la modale en cliquant sur le bouton
    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            dialog.close()
        })
    })
    // Fermer la modale en cliquant sur l'overlay
    dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
    });
}

