chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getLinks') {
        const links = getAllLinks();
        sendResponse({ links: links });
    }
    // Ajouter un écouteur pour les liens malveillants
    if (request.message === 'highlightMaliciousLinks' && request.data) {
        highlightMaliciousLinks(request.data);
    }
});

function getAllLinks() {
    const links = document.querySelectorAll('a');
    const linkArray = [];

    links.forEach(link => {
        const href = link.href;
        if (href) {
            linkArray.push(href);
        }
    });

    return linkArray;
}

function highlightMaliciousLinks(result) {
    console.log(result);
    if (result && result.matches && result.matches.length > 0) {
        result.matches.forEach(match => {
            const url = match.threat.url;
            const threatType = match.threatType;

            if (threatType === 'MALWARE' || threatType === 'SOCIAL_ENGINEERING' || threatType === 'UNWANTED_SOFTWARE' || threatType === 'POTENTIALLY_HARMFUL_APPLICATION') {
                const links = document.querySelectorAll('a');

                links.forEach(link => {
                    if (link.href === url) {
                        link.style.color = 'red'; // Change la couleur du lien en rouge
                        link.style.fontWeight = 'bold'; // Optionnel: met le texte en gras
                        link.setAttribute('title', 'Attention : Ce lien est potentiellement dangereux.');

                        // Optionnel : Ajout d'un avertissement visuel avec du CSS
                        link.classList.add('malicious-link');
                    }
                });
            }
        });
    }
}
