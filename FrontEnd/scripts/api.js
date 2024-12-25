const worksURL = "http://localhost:5678/api/works"
const categoriesURL = "http://localhost:5678/api/categories"
const usersLoginURL = "http://localhost:5678/api/users/login"
const token = sessionStorage.getItem("token")

export async function getWorks() {
    try {
        const response = await fetch(worksURL);
        return await response.json();
    } catch (error) {
        console.error("Erreur du réseau lors de la récupération des projets :", error);
        window.alert("Erreur du réseau lors de la récupération des projets :");
        return null;
    }
}

export async function getCategories() {
    try {
        const response = await fetch(categoriesURL);
        const data = await response.json();
        data.unshift({
            "id": 0,
            "name": "Tous"
        });
        return data;
    } catch (error) {
        console.error("Erreur du réseau lors de la récupération des catégories :", error);
        window.alert("Erreur du réseau lors de la récupération des catégories :");
        return null;
    }
}

export async function postUsersLogin(chargeUtile) {
    try {
        const response = await fetch(usersLoginURL, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: chargeUtile
        });
        return response
    } catch (error) {
        console.error("Erreur de connexion :", error);
    }
}

export async function deleteWork(workId) {
    try {
        const response = await fetch(`${worksURL}/${workId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            const deletedWorks = document.querySelectorAll(`figure[data-id="${workId}"]`);
            if (deletedWorks) {
                deletedWorks.forEach((figure) => {
                    figure.remove()
                });
            } else {
                console.warn("Élément non trouvé dans le DOM.");
            }
        } else if (response.status === 401) {
            window.alert("Accès non autorisé pour supprimer le projet.")
            console.error("Erreur lors de la suppression du projet, statut HTTP:", response.status);
        }
    } catch (error) {
        window.alert("Erreur du réseau lors de la suppression du projet")
        console.error("Erreur du réseau lors de la suppression du projet:", error);
    }
}

export async function postWork(form) {
    try {
        const data = new FormData(form)
        const response = await fetch(worksURL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: data
        })
        return await response.json()
    } catch (error) {
        console.error("Erreur du réseau lors de la publication du projet", error)
        window.alert("Erreur du réseau lors de la publication du projet")
    }
}

export let works = await getWorks();
export let categories = await getCategories();