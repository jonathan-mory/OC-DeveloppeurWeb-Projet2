// Récupération des éléments du DOM
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");

// Ajout de l'écouteur d'événement pour gérer le login 
loginForm.addEventListener("submit", (event) => {
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
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: chargeUtile
    })
    

    

})
