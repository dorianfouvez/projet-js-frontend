import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";
import { setTitle } from "../utils/render.js";

let page = document.querySelector("#page");

const ProfilePage = () => {
    setTitle("ProfilePage");
    const user = getUserSessionData();
    if (!user) RedirectUrl("/error", "Resource not authorized. Please login.");
  
    fetch(API_URL + "users/"+user.username, {
      method: "GET",
      headers: {
        Authorization: user.token,
      },
    })
    .then((response) => {
      if (!response.ok)
        throw new Error("Error code : " + response.status + " : " + response.statusText);
      return response.json();
    })
    .then((data) => onProfile(data))
    .catch((err) => onError(err));
}

const onProfile = (user) => {
  console.log("onProfile");
  let userListPage = `<p>
    <strong>Username : </strong> ${user.username}<br>
    <strong>Email : </strong> ${user.email}<br>`;
  if(user.isAdmin) userListPage += `<h6><strong>Admin</strong></h6><br>`;
  userListPage += `</p>`;
  return (page.innerHTML = userListPage);
};
  
const onError = (err) => {
  console.error("UserListPage::onError:", err);
  let errorMessage = "Error";
  if (err.message) {
    if (err.message.includes("401"))
      errorMessage = "Unauthorized access to this ressource : you must first login.";
    else errorMessage = err.message;
      
    if (errorMessage.includes("jwt expired")) errorMessage += "<br> Please logout first, then login.";
  }
  RedirectUrl("/error", errorMessage);
};

export default ProfilePage;