import { setTitle } from "../utils/render.js";

let contactPage = `
<p>
    Fouvez Dorian<br>
    Lekeu Cyprien<br>
    Fischer Boris<br>
    Pronce Alexandre<br>
</p>`;

const ContactPage = () => {
    setTitle("Contactez-nous");
    let page = document.querySelector("#page");
    return (page.innerHTML = contactPage);
}

export default ContactPage;