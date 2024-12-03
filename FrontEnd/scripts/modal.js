import { works } from "./apiData.js";

function generateWorksForModal() {
    works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id
        figure.innerHTML = 
        `
        <img src="${work.imageUrl}" alt="${work.title}">
        <button class="delete-button" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        figure.classList.add("figure-modal")
        const modalGallery = document.querySelector(".modal-gallery");
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
            console.log("Élément supprimé avec succès");
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

const dialog = document.getElementById("modal");
const modalWindow1 = document.getElementById("modal-window1")
const modalWindow2 = document.getElementById("modal-window2")
const openModalButtons = document.querySelectorAll(".js-modal-open");
const closeModalButtons = document.querySelectorAll(".js-modal-close");

// Ouvrir la modale
openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        dialog.showModal()
        modalWindow1.classList.add("active")
        modalWindow2.classList.remove("active")
    })
})

// Fermer la modale
closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        dialog.close()
    })
})

// Fermer la modale en cliquant en dehors de celle-ci
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

generateWorksForModal()

const deleteWorkButtons = document.querySelectorAll(".delete-button")
deleteWorkButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", deleteWorks)
})

const addPictureButton = document.getElementById("add-picture-button")
addPictureButton.addEventListener("click", () => {
    modalWindow1.classList.remove("active")
    modalWindow2.classList.add("active")
})

const backwardButton = document.getElementById("modal-backward-button")
backwardButton.addEventListener("click", () => {
    modalWindow2.classList.remove("active")
    modalWindow1.classList.add("active")
})

const fileInput = document.getElementById('file-input');
const fileLabel = document.getElementById('file-label');

fileInput.addEventListener('change', () => {
  const fileName = fileInput.files[0].name;
  fileLabel.textContent = fileName;
});

