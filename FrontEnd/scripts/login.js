// Récupération des éléments du DOM
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");


function manageUserLogin() {
    // Ajout de l'écouteur d'événement pour gérer le login 
    loginForm.addEventListener("submit", async (event) => {
        // Empêcher le rechargement par défaut 
        event.preventDefault();
        // Création de la charge utile avec l'objet de la nouvelle connexion
        const userLog = {
            email: emailInput.value,
            password: passwordInput.value
        };
        // Conversion de la charge utile au format JSON
        const chargeUtile = JSON.stringify(userLog);
        // Appel de la fonction fetch avec toutes les informations nécessaires
        const loginResponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: chargeUtile
        });
        console.log(loginResponse);
        // Gestion de l'authentification 
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            sessionStorage.setItem("token", loginData.token);
            window.location.href = "index.html";
        } else if (loginResponse.status === 401) {
            console.log(`Erreur de l'API ${loginResponse.status} ${loginResponse.statusText}`);
            let loginErrorSpan = document.getElementById("login-error-message");
            if (!loginErrorSpan) {
                loginErrorSpan = document.createElement("span");
                loginErrorSpan.id = "login-error-message";
                loginForm.appendChild(loginErrorSpan); 
            };
            loginErrorSpan.innerText = "Mot de passe incorrect";
        } else if (loginResponse.status === 404) {
            console.log(`Erreur de l'API ${loginResponse.status} ${loginResponse.statusText}`);
            let loginErrorSpan = document.getElementById("login-error-message");
            if (!loginErrorSpan) {
                loginErrorSpan = document.createElement("span");
                loginErrorSpan.id = "login-error-message";
                loginForm.appendChild(loginErrorSpan); 
            };
            loginErrorSpan.innerText = "Il n'existe pas de compte avec cette adresse e-mail";
        }
    })
}

manageUserLogin();

