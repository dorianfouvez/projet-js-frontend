

/**
 * setLayout allows to display specific information in an HTML template
 * containing those paramters as id to text elements (h4, h5, title)
 * @param {headerTitle} headerTitle
 * @param {pageTitle} pageTitle
 * @param {footerText} footerText
 */
function setLayout(headerTitle, footerText) {
  document.querySelector("#headerTitle").innerText = headerTitle;
  document.querySelector("#footerText").innerText = footerText;
}

function setTitle(pageTitle){
  document.querySelector("title").innerText = pageTitle;
  document.querySelector("#pageTitle").innerText = pageTitle;
}

// named export
export { setLayout, setTitle };