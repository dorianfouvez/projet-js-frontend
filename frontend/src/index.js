import { setLayout } from "./utils/render.js";
import {Router} from "./Components/Router.js";
import Navbar from "./Components/Navbar.js";
/* use webpack style & css loader*/
import "./stylesheets/style.css";
/* load bootstrap css (web pack asset management) */
import 'bootstrap/dist/css/bootstrap.css';
/* load bootstrap module (JS) */
import 'bootstrap';

const HEADER_TITLE = "The choice - Projet JS 2020";
const PAGE_TITLE = "Synopsis ..."; // changer ceci dans les Components Page ????
const FOOTER_TEXT = "Created by Fouvez Dorian - Lekeu Cyprien - Fisher Boris - Pronce Alexandre";

Navbar();

Router();

setLayout(HEADER_TITLE, PAGE_TITLE, FOOTER_TEXT);
