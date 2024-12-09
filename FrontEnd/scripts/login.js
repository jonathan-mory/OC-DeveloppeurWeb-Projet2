import { baseURL } from "./urlBaseApi.js";
import { displayErrorMessage } from "./test.js";
// Récupération des éléments du DOM
const loginForm = document.getElementById("login-form");

function getFormData() {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const formData = {
        email: emailInput.value,
        password: passwordInput.value
    };
    return JSON.stringify(formData);
}

async function handleLoginResponse(loginResponse) {
    if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        sessionStorage.setItem("token", loginData.token);
        window.location.href = "index.html";
    } else {
        const errorMessage = loginResponse.status === 401
            ? "Mot de passe incorrect"
            : loginResponse.status === 404
                ? "Il n'existe pas de compte avec cette adresse e-mail"
                : "Une erreur est survenue. Veuillez réessayer.";
        displayErrorMessage(errorMessage, loginForm);
    }
}

function manageUserLogin() {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const chargeUtile = getFormData();
        try {
            const loginResponse = await fetch(`${baseURL}users/login`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: chargeUtile
            });
            await handleLoginResponse(loginResponse);
        } catch (error) {
            console.error("Erreur de connexion :", error);
            displayErrorMessage("Une erreur de connexion est survenue. Veuillez réessayer.");
        }
    });
}

manageUserLogin();