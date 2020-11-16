const { getSomeRandom } = require("popular-movie-quotes");


const Quote = () => {
  let quote = document.querySelector("#quote");
  quote.innerHTML = renderRandomBlockQuote();
  quote.addEventListener("click", () => quote.innerHTML = renderRandomBlockQuote());
};

function renderRandomBlockQuote() {
  const movieQuote = getSomeRandom(1)[0];
  return `<blockquote class="blockquote">
 <p class="mb-0">${movieQuote.quote}</p>
 <footer class="blockquote-footer">Someone famous in the movie <cite title="${movieQuote.movie}">${movieQuote.movie} (year ${movieQuote.year})</cite></footer>
</blockquote>`;
}

export default Quote;
