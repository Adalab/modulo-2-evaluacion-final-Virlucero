"use strict";

// añado variables

const inputElement = document.querySelector(".js-input");
const searchButton = document.querySelector(".js-button-search");
const resetButton = document.querySelector(".js-reset-button");
const listElement = document.querySelector(".js-list");
const favouritesElement = document.querySelector(".js-favourites");

// creo funcion manejadora del boton buscar
function searchHandler(evt) {
  evt.preventDefault();
  //guardo lo que introduce el usuario
  let cocktailName = inputElement.value;

  // hago llamada al servidor para que me devuelva la lista de cockteles

  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // recojo los cockteles introducidos con este let
      let cocktails = data.drinks;
      for (const cocktail of cocktails) {
        const newLi = renderCocktail(cocktail);
        listElement.appendChild(newLi);
      }
    });
}

searchButton.addEventListener("click", searchHandler);

// creo funcion para que me pinte un coctel
function renderCocktail(cocktailData) {
  console.log(cocktailData);
  const liElement = document.createElement("li");
  const h4Title = document.createElement("h4");
  const textForTitle = document.createTextNode(cocktailData.strDrink);
  const img = document.createElement("img");

  let imageSource = cocktailData.strDrinkThumb;
  if (imageSource === null) {
    imageSource = "../images/default-cocktel.jpg";
  }
  img.src = imageSource;
  img.classList.add("cocktail-img");
  h4Title.appendChild(textForTitle);
  liElement.appendChild(h4Title);
  liElement.appendChild(img);

  liElement.addEventListener("click", () => {
    console.log("anado a favoritos", cocktailData.idDrink);

    // almaceno este elemento si hago click en el
    localStorage.setItem(cocktailData.strDrink, JSON.stringify(cocktailData));

    // vamos a añadir este elemnto a la lista de favoritos
    favouritesElement.appendChild(liElement);
  });

  return liElement;
}

// gi
