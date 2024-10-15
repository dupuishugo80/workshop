console.log("content.js");

let links = document.querySelectorAll('a');

let found = false;
links.forEach(link => {
  if (link.href.includes('test.com')) {
    found = true;
  }
});

if (found) {
  alert('Un lien vers test.com a été trouvé sur cette page.');
}
