const worksURL = "http://localhost:5678/api/works"
const categoriesURL = "http://localhost:5678/api/categories"
const usersLoginURL = "http://localhost:5678/api/users/login"
const token = sessionStorage.getItem("token")

export async function getWorks() {
    try {
        const response = await fetch(worksURL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
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
        console.error("Erreur lors de la récupération des catégories :", error)
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
        } else {
            console.error("Erreur lors de la suppression de l'élément, statut HTTP:", response.status);
        }
    } catch (error) {
        console.error("Erreur réseau ou autre problème:", error);
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
        return response
    } catch (error) {
        console.error("Erreur réseau ou autre problème", error)
    }
}

export let works = await getWorks();
export let categories = await getCategories();