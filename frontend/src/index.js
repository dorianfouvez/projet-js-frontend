import { setLayout } from "./utils/render.js";
import HomePage from "./Components/HomePage.js";
import {Router} from "./Components/Router.js";
import Navbar from "./Components/Navbar.js";
/* use webpack style & css loader*/
import "./stylesheets/style.css";
/* load bootstrap css (web pack asset management) */
import 'bootstrap/dist/css/bootstrap.css';
/* load bootstrap module (JS) */
import 'bootstrap';

const HEADER_TITLE = "JavaScript & Node.js full course";
const PAGE_TITLE = "Demo : use of webpack as a module bundler";
const FOOTER_TEXT = "Happy learning : )";

Navbar();

Router();

setLayout(HEADER_TITLE, PAGE_TITLE, FOOTER_TEXT);
