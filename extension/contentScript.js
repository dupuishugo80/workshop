const ThreatTypes = Object.freeze({
    MALWARE: "MALWARE",
    SOCIAL_ENGINEERING: "SOCIAL_ENGINEERING",
    UNWANTED_SOFTWARE: "UNWANTED_SOFTWARE",
    POTENTIALLY_HARMFUL_APPLICATION: "POTENTIALLY_HARMFUL_APPLICATION"
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getLinks') {
        
        const payload = getPayload();

        getApiRequestResult(payload)
            .then(result => {
                console.log(result);
                sendResponse(result);
            })
            .catch(error => {
                console.error("Erreur lors de l'appel API :", error);
                sendResponse({ error: "Erreur lors de l'appel API" });
            });

        return true; 
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

function getPayload() {
    const links = getAllLinks();

    const threatArray = links.map(url => ({ url }));

    const payload = {
        client: {
            clientId: "my-security-checker",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: [
                ThreatTypes.MALWARE, 
                ThreatTypes.SOCIAL_ENGINEERING,
                ThreatTypes.UNWANTED_SOFTWARE,
                ThreatTypes.POTENTIALLY_HARMFUL_APPLICATION
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: threatArray
        }
    };
    
    return JSON.stringify(payload, null, 2);
}

async function getApiRequestResult(payload) {
    const apiKey = 'AIzaSyDh3_VV1-PBuVAYvODAv73fMxbcL4ey5Bo';
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
            body: payload,
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
