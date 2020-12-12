import { KillGame } from "./phaser/PhaserGamePage.js";
import UserListPage from "./UserListPage.js";
import LoginPage from "./LoginPage.js";
import RegisterPage from "./RegisterPage.js";
import LogoutComponent from "./LogoutComponent.js";
import ErrorPage from "./ErrorPage.js";
import PhaserGamePage from "./phaser/PhaserGamePage.js";
import SynopsisPage from "./SynopsisPage";
import ContactPage from "./ContactPage";
import ProfilePage from "./ProfilePage"

const routes = {
  "/": SynopsisPage,
  "/list": UserListPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/logout": LogoutComponent,
  "/error": ErrorPage,
  "/game": PhaserGamePage,
  "/contact": ContactPage,
  "/profile": ProfilePage,
};

let navBar = document.querySelector("#navBar");
let componentToRender;

// dictionnary of routes
const Router = () => {
  //game = "coucou";
  /* manage to route the right component when the page is loaded */
  window.addEventListener("load", (e) => {
    console.log("onload page:", [window.location.pathname]);
    componentToRender = routes[window.location.pathname];
    if (!componentToRender)
      return ErrorPage(
        new Error("The " + window.location.pathname + " ressource does not exist.")
      );
    componentToRender();
  });

  /* manage click on the navBar*/
  const onNavigate = (e) => {
    //console.log('clic dans la navBar sur e.target:');
    //console.log(e.target);
    KillGame();

    let uri;
    if (e.target.tagName === "A" || e.target.tagName === "IMG") {
      e.preventDefault();
      uri = e.target.dataset.uri;
    }
    if (uri) {
      console.log("onNavigate() uri:",uri," location:",window.location.pathname," origin :",window.location.origin);
      // use Web History API to add current page URL to the user's navigation history & set right URL in the browser (instead of "#")
      window.history.pushState({}, uri, window.location.origin + uri);
      // render the requested component
      // for the components that include JS, we want to assure that the JS included is not runned when the JS file is charged by the browser
      // therefore, those components have to be either a function or a class
      componentToRender = routes[uri];
      if (routes[uri]) {
        componentToRender();
      } else {
        ErrorPage(new Error("The " + uri + " ressource does not exist"));
      }
    }
  };

  navBar.addEventListener("click", onNavigate);

  // Display the right component when the user use the browsing history
  window.addEventListener("popstate", () => {
    componentToRender = routes[window.location.pathname];
    componentToRender();
  });
};

const RedirectUrl = (uri, data) => {
  // use Web History API to add current page URL to the user's navigation history & set right URL in the browser (instead of "#")
  window.history.pushState({}, uri, window.location.origin + uri);
  // render the requested component
  // for the components that include JS, we want to assure that the JS included is not runned when the JS file is charged by the browser
  // therefore, those components have to be either a function or a class
  componentToRender = routes[uri];
  if (routes[uri]) {
    if(!data)
      componentToRender();
    else
      componentToRender(data);
    
  } else {
    ErrorPage(new Error("The " + uri + " ressource does not exist"));
  }
};

export { Router, RedirectUrl };
