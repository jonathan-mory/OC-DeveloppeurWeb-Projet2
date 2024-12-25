import * as api from "./api.js"
import { displayWorks } from "./index.js";
import { displayErrorMessage } from "./generic.js";

const dialog = document.getElementById("modal");
const modalWindow1 = document.getElementById("modal-window1")
const modalWindow2 = document.getElementById("modal-window2")

/**
 * Super fonction qui initialise la modale en y ajoutant toutes les fonctionnalités nécessaires (génération de la galerie des travaux à chaque ouverture, fonctionnalités génériques, gestion du formulaire d'ajout de projet).
 */
export function initModal() {
    const openModalButtons = document.querySelectorAll(".js-modal-open");
    openModalButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            modalWindow1.className === "window active" ? null : switchWindow(modalWindow1)
            const updatedWorks = await api.getWorks()
            initModalGallery(updatedWorks)
            dialog.showModal()
        })
    })
    initModalSettings()
    initModalForm()
}

/**
 * Change l'affichage de la modale en fonction de la fenêtre à afficher
 * 
 * @param {HTMLDialogElement} idModalWindow - La fenêtre de modale que l'on souhaite afficher.
 */
function switchWindow(idModalWindow) {
    dialog.querySelectorAll(".window").forEach((window) => {
        window === idModalWindow ? window.classList.add("active") : window.classList.remove("active")
    })
}

/**
 * Itinialise les fonctionnalités génériques de la modale pour la fermer ou changer de fenêtre. 
 */
function initModalSettings() {
    // Fermer la modale en cliquant sur le bouton
    const closeModalButtons = dialog.querySelectorAll(".js-modal-close");
    closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
            dialog.close()
        })
    })
    // Fermer la modale en cliquant sur l'overlay
    dialog.addEventListener('click', (event) => {
        event.target === dialog ? dialog.close() : null
    });
    // Afficher la fenêtre 2
    dialog.querySelector("#add-picture-button")
    .addEventListener("click", () => {
        switchWindow(modalWindow2)
    })
    // Afficher la fenêtre 1
    dialog.querySelector("#modal-backward-button")
    .addEventListener("click", () => {
        switchWindow(modalWindow1)
    })
}

/**
 * Affiche les projets dans la modale et implémente l'écouteur d'événement sur chaque bouton pour supprimer des projets.
 * 
 * @param {Array} works - Un tableau de projets récupéré à partir de la requête "Get Works" à l'API.
 */
function initModalGallery(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";
    works.forEach((work) => {
        // Création des éléments HTML pour accueillir les projets
        const i = document.createElement("i")
        i.className = "fa-solid fa-trash-can"

        const button = document.createElement("button")
        button.className = "delete-button"
        button.ariaLabel = "Supprimer le projet"

        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title

        const figure = document.createElement("figure")
        figure.className = "figure-modal"
        figure.dataset.id = work.id

        // Imbrication des éléments HTML 
        button.appendChild(i)
        figure.appendChild(img)
        figure.appendChild(button)
        modalGallery.appendChild(figure)

        // Ajout de la fonction de suppression d'un projet à chaque bouton
        button.addEventListener("click", async () => {
            api.deleteWork(work.id)
        })
    });
}

/**
 * Une super fonction qui initialise toutes les fonctionnalités nécessaires au bon fonctionnement du formulaire d'ajout de projets.
 */
function initModalForm() {

    const addWorkForm = document.getElementById("add-project-form")
    const addWorkInputs = modalWindow2.querySelectorAll("input[required], select");
    const beforeUploadContent = document.querySelectorAll("#file-upload-container div ~ *")
    const afterUploadContainer = document.querySelector(".image-container")

    /**
     * Affiche la classe "active" ou "disabled" au bouton de validation du formulaire, en fonction de si tous les champs sont remplis ou non.
     */
    function checkFormValidity() {
        const submitButton = document.getElementById("submit-button");
        const allFilled = Array.from(addWorkInputs).every(input => input.value.trim());
        submitButton.classList.toggle("active-button", allFilled);
        submitButton.classList.toggle("disabled-button", !allFilled);
    }

    /**
     * Réinitialise l'affichage du champ "fichier" du formulaire.
     */
    function resetUploadContainer() {
        afterUploadContainer.style.display = "none"
        beforeUploadContent.forEach((element) => {
            element.style.display = "block"
        })
    }

    /**
     * Vérifie que le fichier téléchargé ne dépasse pas 4 Mo et affiche l'aperçu de l'image.  
     */
    function checkAndDisplayUploadFile() {
        document.getElementById("file-input").addEventListener('change', (event) => {
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
                    resetUploadContainer()
                    addWorkForm.reset()
                    checkFormValidity()
                })
            } else {
                displayErrorMessage("Impossible de charger le fichier car il est trop volumineux (4 Mo maximum)", document.getElementById("file-upload-container"))
            }
        });
    }

    /**
     * Génère les options disponibles dans la case "Catégorie" du formulaire.
     * 
     * @param {Array} categories - Un tableau contenant l'ensemble des catégories des projets de l'architecte, récupéré à partir de l'API.
     */
    function generateCategorieOptions(categories) {
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

    /**
     * Implémente l'écouteur d'événement "submit" sur le formulaire et gère l'affichage dynamique des nouveaux projets.
     */
    function handleSubmitEvent() {
        /**
         * Super fonction qui est appelée après validation du formulaire. Elle réinitialise intégralement le formulaire, bascule sur la première fenêtre de la modale et ferme la modale.  
         */
        function resetModal() {
            resetUploadContainer()
            addWorkForm.reset()
            checkFormValidity()
            switchWindow(modalWindow1)
            dialog.close()
        }

        // Gestion de l'envoi du formulaire pour ajouter des projets
        addWorkForm.addEventListener("submit", async (event) => {
            event.preventDefault()
            const response = await api.postWork(addWorkForm)
            if (response) {
                const updatedWorks = await api.getWorks()
                displayWorks(updatedWorks)
                resetModal()
            }
        })
    }

    checkFormValidity()
    // Ajouter des écouteurs d'événements à chaque champ requis.
    addWorkInputs.forEach(input => {
        input.addEventListener("input", () => {
            checkFormValidity()
        });
    });
    checkAndDisplayUploadFile()
    generateCategorieOptions(api.categories)
    handleSubmitEvent()
}










