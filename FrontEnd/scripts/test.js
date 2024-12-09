export function displayErrorMessage(messageContent, container) {
    let errorMessage = document.querySelector("error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        container.appendChild(errorMessage);
    }
    errorMessage.innerText = messageContent;
}