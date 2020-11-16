//import Quote from "./Quote.js";

let homePage = `<p>Welcome to MyCMS...</p>`;

const HomePage = () => {    
  let page = document.querySelector("#page");
  return (page.innerHTML = homePage);
  //page.innerHTML = `<div id="quote"></div>`;
  //Quote(); 
};

export default HomePage;
