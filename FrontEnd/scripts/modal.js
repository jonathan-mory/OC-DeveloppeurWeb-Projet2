import { baseURL } from "./urlBaseApi.js";
import { fetchWorks, fetchCategories } from "./apiData.js";
import { displayWorks } from "./index.js";
import { displayErrorMessage } from "./test.js";

const token = sessionStorage.getItem("token")
const dialog = document.getElementById("modal");
const addWorkForm = document.getElementById("add-project-form")
const submitButton = document.getElementById("submit-button");
const addWorkInputs = addWorkForm.querySelectorAll("input[required], select");
const beforeUploadContent = document.querySelectorAll("#file-upload-container div ~ *")
const afterUploadContainer = document.querySelector(".image-container")

function openModal() {
    const openModalButtons = document.querySelectorAll(".js-modal-open");
    openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        dialog.showModal()
    })
})
}

function generateWorksForModal(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-button" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        figure.classList.add("figure-modal")
        modalGallery.appendChild(figure);
    });
}

async function deleteWork(event) {
    try {
        const workId = event.currentTarget.getAttribute("data-id")
        const response = await fetch(`${baseURL}works/${workId}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        })
        if (response.ok) {
            const works = document.querySelectorAll("figure")
            works.forEach((work) => {
                if (work.dataset.id === workId) {
                    work.remove()
                }
            })
        } else {
            console.error("Erreur lors de la suppression de l\'élément");
        }
    } catch (error) {
        console.error("Erreur réseau ou autre problème", error)
    }
}

function switchWindow(openingWindow, closingWindow) {
    openingWindow.classList.add("active")
    closingWindow.classList.remove("active")
}

function displayModalWindow() {
    const modalWindow1 = document.getElementById("modal-window1")
    const modalWindow2 = document.getElementById("modal-window2")
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

function checkAndDisplayUploadFile() {
    const fileUploadContainer = document.getElementById("file-upload-container")
    const fileInput = document.getElementById("file-input")
    fileInput.addEventListener('change', (event) => {
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
            // Cacher le message d'erreur lorsque l'on ré-upload une nouvelle image
            const errorMessage = document.querySelector(".error-message") 
            errorMessage ? errorMessage.remove() : null
            // Afficher l'image uploadée et le bouton pour changer de fichier
            afterUploadContainer.style.display = "block"
            reader.readAsDataURL(file)
            // Changer d'image grâce au bouton
            const changePictureButton = document.querySelector(".image-container .delete-button")
            changePictureButton.addEventListener("click", () => {
                addWorkForm.reset() 
                afterUploadContainer.style.display = "none"
                beforeUploadContent.forEach((element) => {
                    element.id !== "file-input" ? element.style.display = "block" : null;
                })
            })
        } else {
            displayErrorMessage("Impossible de charger le fichier car il est trop volumineux (4 Mo maximum)", fileUploadContainer)
        }
    });
}

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

function checkFormValidity() {
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

function closeModal() {
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

openModal()
fetchWorks().then(works => {
    generateWorksForModal(works); // Affiche la liste des travaux une fois la promesse résolue
});

// Supprimer des projets
document.querySelectorAll(".figure-modal .delete-button")
.forEach((deleteButton) => {
    deleteButton.addEventListener("click", deleteWork)
})

displayModalWindow()
checkAndDisplayUploadFile()

fetchCategories().then(categories => {
    generateCategorieOptions(categories); // Affiche la liste des travaux une fois la promesse résolue
});
generateCategorieOptions()
checkFormValidity();
closeModal()

// Ajouter des écouteurs d'événements à chaque champ requis
addWorkInputs.forEach(input => {
    input.addEventListener("input", checkFormValidity);
});

async function addWork() {
    try {
        const addWorkFormData = new FormData(addWorkForm)
        const response = fetch(`${baseURL}works`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: addWorkFormData
        })
        afterUploadContainer.style.display = "none"
        beforeUploadContent.forEach((element) => {
            element.id !== "file-input" ? element.style.display = "block" : null;
        })
        addWorkForm.reset()
        checkFormValidity()
        dialog.close()
        const response2 = await fetch(`${baseURL}works`)
        const worksUpdated = await response2.json()
        console.log(worksUpdated)
        displayWorks(worksUpdated)
    } catch (error) {
        console.error("Erreur réseau ou autre problème", error)
    }
}

addWorkForm.addEventListener("submit", (event) => {
    event.preventDefault()
    addWork()
})


