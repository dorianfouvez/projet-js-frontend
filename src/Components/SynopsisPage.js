import { setTitle } from "../utils/render.js";

let synopsisPage = `
<br>
<br>
<div class="row">
<div class="col-md-1 mb-md-0 mb-5">
</div>
<div class="col-md-9 mb-md-0 mb-5">
<h2 class="alex">Bienvenue à toi aventurier ! </h2>
</div>
</div>
<br>
<div class="row">
<div class="col-md-1 mb-md-0 mb-5">
</div>
<div class="col-md-9 mb-md-0 mb-5">
<p>Avant de te lancer dans cette histoire trépidante, laisse moi te donner une petite astuce …<br>
Tu remarqueras rapidement que The choice possède une option « Plein écran » accessible via une icône cliquable de l’interface du jeu. 
Lorsque ton jeu sera affiché en Plein écran, nous te recommandons de continuer à utiliser cette icône.
Si par inadvertance tu appuyais sur Escape/Echap pour partir de ce mode, cela créerait un Bug d’affichage … Si c’est le cas, No stress ! 
il te suffira d’appuyer sur la touche F1 de ton clavier (touche de Debug) pour revenir à l’affichage initial du jeu.
<br>
<br>
Pour lancer le jeu il vous suffit de cliquer sur le logo de The Choice. 
Si celui-ci ne fonctionne pas correctement et n’affiche pas le jeu, nous t’invitons à changer de navigateur (nous te recommandons les navigateurs <b>Chrome</b> et <b>Firefox</b>).
</p>
</div>
</div>
<div class="row">
<div class="col-md-1 mb-md-0 mb-5">
</div>
<div class="col-md-9 mb-md-0 mb-5">
<p>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
</div>
</div>
<div class="row">
<div class="col-md-1 mb-md-0 mb-5">
</div>
<div class="col-md-9 mb-md-0 mb-5">
<p>
Sombre et terrible est l'histoire de la famille Foupronfile, qui commença sur la place du marché de la grande ville de Tagria. 
Les vents d'automne étaient violents, et pourtant, il y avait encore 47 jours avant ce que les gens du royaume de Doqoul appelaient la nuit des serpents verts, nuit glaciale où les premières aurores boréales apparaissaient dans la région.
Ce jour-là, Giste Foupronfile, mère de Leoric et Misty, était au bord des nerfs… Veuve à charge de faux jumeaux adolescents, elle savait que leur sort de cet hiver serait déterminé par les ventes du matin même. Cette époque du cycle était très connue dans cette région pour être relativement rigoureuse. 
La famille Foupronfile, vivant dans les bois, n’avait pas grand-chose à vendre à part un peu de bois coupé dans la forêt et de confiture faite maison. 
La plus grande partie de leur clientèle était composée de petits ménages et citadins.
Ils ne pouvaient espérer vendre plus que ce dont ils avaient besoin pour survivre car la famille Shibeb possédait déjà 90% des forêts de la région, et peu d’arbres fruitiers poussaient loin de la rivière.
<br>
<br>
Inexorablement, les craintes de Giste se sont confirmées quand elle récolta à peine assez d'argent pour nourrir deux des trois membres de sa famille durant la période hivernale. 
Ne pouvant se résigner à abandonner un de ses enfants ou à se laisser mourir, elle décida de se rendre chez l’Ophor, un très riche monsieur d’une trentaine de cycles. 
Ce dernier pratiquait un grand nombre d'expériences grandeurs natures sur l'être humain. Se disant scientifique, la seule science qui pourtant le faisait frissonner se concentrait sur la souffrance qu'il pouvait faire subir à un homme ou une femme. 
C'est donc sans surprise qu'il accepta d'aider financièrement Giste en échange de sa "participation" à ses expériences malsaines.
Près de 17 jours plus tard, Giste commença à cracher du sang régulièrement à cause des expériences d'Ophor.
Il ne fut pas longtemps pour comprendre qu'elle était désormais atteinte de la peste pourpre, maladie qui intéressait fortement son nouveau créancier depuis pas mal de temps. 
En voulant sauver sa vie en cherchant de l'aide auprès d'Ophor, elle finit par, au contraire, la raccourcir à cause des lourdes conséquences qu'avaient les expériences de ce dernier.
La situation étant encore plus désespérée, Léoric et Misty, en découvrant avec horreur l'état de santé de leur mère se dégrader, décidèrent de contacter <span class="redcolor">Mouchnir</span>.
<br>
<img src="assets/synopsis/mouchnir.png"  width="250" height="250">
<br>
Ni humain, ni bête, ni même autre appellation que "chose", <span class="redcolor">Mouchnir</span> était une créature à moitié morte et à moitié vivante. 
Celui-ci faisait l'objet de beaucoup de légendes urbaines, dont certaines racontaient que son sang même était composé du mal le plus pur et le plus concentré depuis la création du monde. Banni du royaume à cause de ses relations particulières avec la mort, il habitait désormais enfoncé dans les plus lointaines montagnes, là où rien ne poussait ou ne vivait.
Lorsqu’il vint chez les Foupronfile, les jumeaux durent éteindre toutes les lumières et se bander les yeux. La chose, après s’être faufilée dans la chambre de leur mère à pas de loup, leur susurra à chacun la même phrase d’un ton sec et sadique : « Si <span class="redcolor">Mouchnir</span> retient la barque d’une âme avant son grand voyage, une âme corrompue devra faire saigner le royaume de Doqoul ».

</p>
</div>
</div>
<br>
<br>
`;

const SynopsisPage = () => {
    setTitle("Synopsis");
    let page = document.querySelector("#page");
    return (page.innerHTML = synopsisPage);
}

export default SynopsisPage;