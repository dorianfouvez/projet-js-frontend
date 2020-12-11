import { API_URL } from "../utils/server.js";
import { setTitle } from "../utils/render.js";

let contactPage = `
<p>
    Fouvez Dorian<br>
    Lekeu Cyprien<br>
    Fischer Boris<br>
    Pronce Alexandre<br>
</p>
<form>
    <div class="form-group">
        <label for="email">Your Email</label>
        <input class="form-control" id="email" type="text" name="email" placeholder="Enter your email" required="" pattern="^\\w+([.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,4})+\$" />
    </div>
    <div class="form-group">
        <label for="subject">Subject</label>
        <input class="form-control" id="subject" type="text" name="subject" placeholder="Enter your subject" required="" />
    </div>
    <div class="form-group">
        <label for="message">Your Message</label>
        <textarea class="form-control" id="message" type="text" name="message" placeholder="Enter your message" required="" rows="5" cols="20"></textarea>
    </div>
    <button class="btn btn-primary" id="btn" type="submit">Submit</button>
    <!-- Create an alert component with bootstrap that is not displayed by default-->
    <div class="alert alert-danger mt-2 d-none" id="messageBoard"></div>
</form>`;

const ContactPage = () => {
    setTitle("");
    let page = document.querySelector("#page");
    page.innerHTML = contactPage;
    let registerForm = document.querySelector("form");
    registerForm.addEventListener("submit", onRegister);
    return;
}

const onRegister = (e) => {
    e.preventDefault();
    let email = {
      from: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };
  
    fetch(API_URL + "contact/", {
      method: "POST",
      body: JSON.stringify(email),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Error code : " + response.status + " : " + response.statusText);
        return response.json();
      })
      .then((data) => onMailSend(data))
      .catch((err) => onError(err));
};

const onMailSend = (userData) => {
    console.log("onMailSend", userData);
    // faire une alert pour exprimer ce qu'il se passe
    let messageBoard = document.querySelector("#messageBoard");
    messageBoard.innerText = "Mail envoyé !";
    messageBoard.classList.add("d-block");
    messageBoard.classList.replace("alert-danger","alert-success");
};
  
const onError = (err) => {
    let messageBoard = document.querySelector("#messageBoard");
    let errorMessage = /*"";
    if (err.message.includes("409")) errorMessage = "This user is already registered.";
    else errorMessage = */err.message;
    messageBoard.innerText = errorMessage;
    // show the messageBoard div (add relevant Bootstrap class)
    messageBoard.classList.add("d-block");
    messageBoard.classList.replace("alert-success","alert-danger");
};

export default ContactPage;