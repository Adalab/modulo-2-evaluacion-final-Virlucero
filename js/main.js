"use strict";

// añado variables
const inputElement = document.querySelector(".js-input");
const searchButton = document.querySelector(".js-button-search");
const resetButton = document.querySelector(".js-reset-button");
const listElement = document.querySelector(".js-list");
const favouritesElementUl = document.querySelector(".js-favourites");

// vamos a hacer una funcion para que lea del localStorage y añadimos const para almacenar lo que nos devuelva
function dameLosDatosDelLocalStorage() {
  const objectosDelLocalStorage = localStorage.getItem("favouritesCocktails");
  if (objectosDelLocalStorage) {
    return JSON.parse(objectosDelLocalStorage);
  } else {
    return [];
  }
}

// creo funcion para que me pinte un coctel
function renderCocktail(cocktailData) {
  const liElement = document.createElement("li");
  const h4Title = document.createElement("h4");
  const textForTitle = document.createTextNode(cocktailData.strDrink);
  const img = document.createElement("img"); // <img src="" alt="" />
  //variable para almacenar direccion de las fotos
  let imageSource = cocktailData.strDrinkThumb;
  if (imageSource === null) {
    imageSource = "../images/default-cocktel.jpg";
  }
  img.src = imageSource;
  img.classList.add("cocktail-img"); //creo clase en CSS porque sale muy grande
  h4Title.appendChild(textForTitle);
  liElement.appendChild(h4Title);
  liElement.appendChild(img);

  liElement.addEventListener("click", () => {
    // cuando clickes en mi voy a hacer 2 cosas
    // 1- almacenar en el local storage
    // antes de anadir un nuevo objeto, recupero los que habia antes y lo meto en una variable
    const oldData = dameLosDatosDelLocalStorage(); //devuelve un array con los datos anteriores o un array vacio [] sino habia
    oldData.push(cocktailData);

    // almaceno este elemento
    localStorage.setItem("favouritesCocktails", JSON.stringify(oldData));

    // 2- pintar el nuevo favorito en la lista de favoritos
    favouritesElementUl.appendChild(liElement);
  });

  return liElement;
}

// creo funcion manejadora del boton buscar
function searchHandler(evt) {
  evt.preventDefault();

  //guardo lo que introduce el usuario (su value)
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
        const newItem = renderCocktail(cocktail);
        listElement.appendChild(newItem);
      }
    });
}

searchButton.addEventListener("click", searchHandler);

const cocktailDelLocalStorage = dameLosDatosDelLocalStorage();

if (cocktailDelLocalStorage && cocktailDelLocalStorage.length > 0) {
  for (const item of cocktailDelLocalStorage) {
    const elementoDelLocalStorage = renderCocktail(item);
    favouritesElementUl.appendChild(elementoDelLocalStorage);
  }
}
