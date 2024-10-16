chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getLinks') {
        const links = getAllLinks();
        sendResponse({ links: links });
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
