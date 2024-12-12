/**
 * Affiche un message d'erreur 
 * @param {string} messageContent - Le contenu du message d'erreur à afficher pour l'utilisateur
 * @param {HTMLElement} container - Le conteneur HTML auquel rattacher la balise span contenant le message d'erreur
 */
export function displayErrorMessage(messageContent, container) {
    let errorMessage = document.querySelector(".error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        container.appendChild(errorMessage);
    }
    errorMessage.innerText = messageContent;
}