import RegisterPage from "./LoginPage.js";
import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";
import {removeSessionData} from "../utils/session.js";

const Logout = () => {
  removeSessionData();
  // re-render the navbar for a non-authenticated user
  Navbar();
  RedirectUrl("/login");
};

export default Logout;
