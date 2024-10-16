const ThreatTypes = Object.freeze({
    MALWARE: {
        value: "MALWARE",
        label: "Malware"
    },
    SOCIAL_ENGINEERING: {
        value: "SOCIAL_ENGINEERING",
        label: "Ingénierie sociale"
    },
    UNWANTED_SOFTWARE: {
        value: "UNWANTED_SOFTWARE",
        label: "Logiciel indésirable"
    },
    POTENTIALLY_HARMFUL_APPLICATION: {
        value: "POTENTIALLY_HARMFUL_APPLICATION",
        label: "Application potentiellement nuisible"
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
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (result && result.matches && result.matches.length > 0) {
        result.matches.forEach(match => {
            const url = match.threat.url;
            const threatType = match.threatType;
            const platformType = match.platformType;
            const cacheDuration = match.cacheDuration;

            const threatTypeLabel = ThreatTypes[threatType].label;
            const platformTypeLabel = PlatformTypes[platformType].label;

            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <strong>URL :</strong> ${url} <br>
                <strong>Type de menace :</strong> ${threatTypeLabel} <br>
                <strong>Plateforme :</strong> ${platformTypeLabel} <br>
                <strong>Durée de mise en cache :</strong> ${cacheDuration} <br>
                <hr>
            `;
            resultsDiv.appendChild(resultItem);
        });
    } else {
        resultsDiv.innerHTML = "<p>Aucun résultat correspondant trouvé.</p>";
    }
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p style="color: red;">${message}</p>`;
}
