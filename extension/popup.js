const ThreatTypes = Object.freeze({
    MALWARE: {
        value: "MALWARE",
        label: "Malware",
        color: "#dc3545" // Rouge
    },
    SOCIAL_ENGINEERING: {
        value: "SOCIAL_ENGINEERING",
        label: "Ingénierie sociale",
        color: "#ffc107" // Jaune
    },
    UNWANTED_SOFTWARE: {
        value: "UNWANTED_SOFTWARE",
        label: "Logiciel indésirable",
        color: "#17a2b8" // Cyan
    },
    POTENTIALLY_HARMFUL_APPLICATION: {
        value: "POTENTIALLY_HARMFUL_APPLICATION",
        label: "Application potentiellement nuisible",
        color: "#fd7e14" // Orange
    }
});

const PlatformTypes = Object.freeze({
    WINDOWS: {
        value: "WINDOWS",
        label: "Windows"
    },
    MACOS: {
        value: "MACOS",
        label: "macOS"
    },
    LINUX: {
        value: "LINUX",
        label: "Linux"
    },
    ANDROID: {
        value: "ANDROID",
        label: "Android"
    },
    IOS: {
        value: "IOS",
        label: "iOS"
    },
    ANY_PLATFORM: {
        value: "ANY_PLATFORM",
        label: "Toute plateforme"
    },
    WEB: {
        value: "WEB",
        label: "Web"
    },
    CLOUD: {
        value: "CLOUD",
        label: "Cloud"
    }
});

document.getElementById('checkLinks').addEventListener('click', () => {

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'getLinks'}, (response) => {

            if (response && response.links) {
                const payload = getPayload(response.links);
                
                getApiRequestResult(payload)
                    .then(result => {
                        console.log(result);
                        displayResults(result);
                    })
                    .catch(error => {
                        console.error("Erreur lors de l'appel API :", error);
                        displayError("Erreur lors de l'appel API");
                    });
            } else {
                console.log("Aucun lien trouvé.");
                displayError("Aucun lien trouvé.");
            }
        });
    });
});

function getPayload(links) {
    const threatArray = links.map(url => ({ url }));

    const payload = {
        client: {
            clientId: "my-security-checker",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: [
                ThreatTypes.MALWARE.value, 
                ThreatTypes.SOCIAL_ENGINEERING.value,
                ThreatTypes.UNWANTED_SOFTWARE.value,
                ThreatTypes.POTENTIALLY_HARMFUL_APPLICATION.value
            ],
            platformTypes: [
                PlatformTypes.ANY_PLATFORM.value
            ],
            threatEntryTypes: ["URL"],
            threatEntries: threatArray
        }
    };
    
    return payload;
}

async function getApiRequestResult(payload) {
    const apiKey = 'AIzaSyDh3_VV1-PBuVAYvODAv73fMxbcL4ey5Bo'; // Remplace par ta clé API
    const url = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'appel API :", error);
        throw error;
    }
}

function displayResults(result) {
    const resultsTableBody = document.getElementById('linkList');
    resultsTableBody.innerHTML = ""; // Vider le corps du tableau

    if (result && result.matches && result.matches.length > 0) {
        result.matches.forEach(match => {
            const url = match.threat.url;
            const threatType = match.threatType;
            const platformType = match.platformType;
            
            const threatColor = ThreatTypes[threatType].color;
            const threatTypeLabel = ThreatTypes[threatType].label; // Récupérer le label de menace
            const platformTypeLabel = PlatformTypes[platformType].label; // Récupérer le label de plateforme

            // Créer une nouvelle ligne dans le tableau
            const resultRow = document.createElement('tr');
            resultRow.innerHTML = `
                <td>${getDomain(url)}</td>
                <td style="color: ${threatColor}">${threatTypeLabel}</td>
                <td>${platformTypeLabel}</td>
            `;
            resultsTableBody.appendChild(resultRow); // Ajouter la ligne au corps du tableau
        });
    } else {
        // Si aucun résultat n'est trouvé, afficher un message dans le tableau
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center;">Aucun résultat correspondant trouvé.</td>
            </tr>
        `;
    }
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p style="color: red;">${message}</p>`;
}

function getDomain(url) {
    const urlObj = new URL(url);
    return urlObj.hostname; // Retourner seulement le nom de domaine
}
