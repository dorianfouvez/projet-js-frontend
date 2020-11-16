import Quote from "./Quote.js";

let page = document.querySelector("#page");

const HomePage = () => {    
  page.innerHTML = `<div id="quote"></div>`;
  Quote(); 
};

export default HomePage;
