import { setTitle } from "../utils/render.js";

let synopsisPage = `
<p>
    Welcome to <strong>THE CHOICE</strong><br>
    Here begins your adventure in ...
</p>`;

const SynopsisPage = () => {
    setTitle("Synopsis");
    let page = document.querySelector("#page");
    return (page.innerHTML = synopsisPage);
}

export default SynopsisPage;