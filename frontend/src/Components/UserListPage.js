import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";

let page = document.querySelector("#page");

const UserListPage = () => {
  const user = getUserSessionData();
  if (!user) RedirectUrl("/error", "Resource not authorized. Please login.");

  fetch(API_URL + "users", {
    method: "GET",
    headers: {
      Authorization: user.token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        let fullErrorMessage =
          " Error code : " +
          response.status +
          " : " +
          response.statusText +
          "/nMessage : ";
        return response.text().then((errorMessage) => {
          fullErrorMessage += errorMessage;
          return fullErrorMessage;
        });
      }
      return response.json();
    })
    .then((data) => {
      if (typeof data === "string") onError(data);
      else onUserList(data);
    })
    .catch((err) => onError(err));
};

const onUserList = (data) => {
  console.log("onUserList");
  let userListPage = `<h5>List of MyCMS users</h5>
<ul class="list-group list-group-horizontal-lg">`;
  let userList = document.querySelector("ul");
  // Neat way to loop through all data in the array, create a new array of string elements (HTML li tags)
  // with map(), and create one string from the resulting array with join(''). '' means that the separator is a void string.
  userListPage += data
    .map((user) => `<li class="list-group-item">${user.username}</li>`)
    .join("");
  userListPage += "</ul>";
  return (page.innerHTML = userListPage);
};

const onError = (err) => {
  console.error("UserListPage::onError:", err);
  let errorMessage;
  if (err.message) {
    errorMessage = err.message;
  } else errorMessage = err;
  if (errorMessage.includes("jwt expired"))
    errorMessage += "<br> Please logout first, then login.";
  RedirectUrl("/error", errorMessage);
};

export default UserListPage;
