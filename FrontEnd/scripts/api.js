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

export async function deleteWork(event) {
    try {
        const workId = event.currentTarget.getAttribute("data-id")
        const response = await fetch(`${worksURL}/${workId}`, {
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

export async function postWork(form) {
    try {
        const data = new FormData(form)
        const response = fetch(worksURL, {
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

