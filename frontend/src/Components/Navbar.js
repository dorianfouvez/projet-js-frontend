let navBar = document.querySelector("#navBar");

const Navbar = (userData) => {
  let navbarClassName = "navbar navbar-expand-md navbar-dark bg-gradient-dark-purple sticky-top mb-2";
  let navbar;
  if (userData) {
    navbar = `
      <!-- Button -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapse body -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <!-- Navbar Right Side -->
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="#" data-uri="/"><i class="fab fa-rebel text-black"></i> Synopsis</a>
          <a class="nav-item nav-link" href="#" data-uri="/"><i class="fas fa-address-book"></i> Contactez-nous</a>
        </div>

        <!-- Centered Logo -->
        <div class="mx-auto">
          <a class="navbar-brand" href="/game"><img src="src/assets/logo.png" alt="Logo"></a>
        </div>

        <!-- Navbar Left Side -->
        <div class="navbar-nav">   
          <a class="nav-item nav-link" href="#" data-uri="/list">List</a>
          <a class="nav-item nav-link" href="#" data-uri="/logout">Logout</a>
          <a class="nav-item nav-link" href="#" data-uri="/profile">${userData.username}</a>
        </div>
      </div>
    </nav>`;
  } else {
    navbar = `
      <!-- Button -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapse body -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <!-- Navbar Right Side -->
        <div class="navbar-nav">
          <a class="nav-item nav-link" href="#" data-uri="/"><i class="fab fa-rebel text-black"></i> Synopsis</a>
          <a class="nav-item nav-link" href="#" data-uri="/"><i class="fas fa-address-book"></i> Contactez-nous</a>
        </div>

        <!-- Centered Logo -->
        <div class="mx-auto">
          <a class="navbar-brand" href="/game"><img src="src/assets/logo.png" alt="Logo"></a>
        </div>

        <!-- Navbar Left Side -->
        <div class="navbar-nav">
        <a class="nav-item nav-link" href="#" data-uri="/login"><i class="fa fa-fw fa-user text-black"></i> Se connecter</a> 
          <a class="nav-item nav-link" href="#" data-uri="/register"><i class='fas fa-file-signature'></i> S'inscrire</a>
        </div>
      </div>
    </nav>`;
  }

  navBar.className = navbarClassName;
  return (navBar.innerHTML = navbar);
};

export default Navbar;
