// Fonction pour afficher les liens dans le tableau du popup
function displayLinks(links) {
    const linkTableBody = document.getElementById('linkTable').querySelector('tbody');
    linkTableBody.innerHTML = ''; // Efface les anciennes données

    links.forEach((link, index) => {
        const row = document.createElement('tr');

        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;

        const cellLink = document.createElement('td');
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = link;
        linkElement.target = '_blank';

        cellLink.appendChild(linkElement);
        row.appendChild(cellIndex);
        row.appendChild(cellLink);

        linkTableBody.appendChild(row);
    });
}

// Lorsque le popup s'ouvre, envoyer un message au content script pour récupérer les liens
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {message: 'getLinks'}, (response) => {
        if (response && response.links) {
            displayLinks(response.links); // Afficher les liens dans le tableau
        } else {
            console.log("Aucun lien trouvé.");
        }
    });
});
