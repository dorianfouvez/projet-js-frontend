let navBar = document.querySelector("#navBar");

const Navbar = (userData) => {
  let navbarClassName = "navbar navbar-expand-md navbar-dark bg-gradient-dark-purple sticky-top mb-2";
  let navbar;
  if (userData) {
    navbar = `
    
      <!-- Logo -->
      <a class="navbar-brand" href="/"><img src="src/assets/logo.png" alt="Logo"></a>

      <!-- Button -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapse body -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="#" data-uri="/">Home</a>
          <a class="nav-item nav-link" href="#" data-uri="/game">Game</a>   
          <a class="nav-item nav-link" href="#" data-uri="/list">List</a>
          <a class="nav-item nav-link" href="#" data-uri="/logout">Logout</a>
          <a class="nav-item nav-link disabled" href="#">${userData.username}</a>
        </div>
      </div>
    </nav>`;
  } else {
    navbar = `
    
      <!-- Logo -->
      <a class="navbar-brand" href="/"><img src="src/assets/logo.png" alt="Logo"></a>

      <!-- Button -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapse body -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="#" data-uri="/">Home</a>
          <a class="nav-item nav-link" href="#" data-uri="/register">Register</a>
          <a class="nav-item nav-link" href="#" data-uri="/login">Login</a> 
        </div>
      </div>
    </nav>`;
  }

  navBar.className = navbarClassName;
  return (navBar.innerHTML = navbar);
};

export default Navbar;
