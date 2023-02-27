"use strict";

// añado variables
const inputElement = document.querySelector(".js-input");
const searchButton = document.querySelector(".js-button-search");
const resetButton = document.querySelector(".js-button-reset");
const listElement = document.querySelector(".js-list");
const favouritesElementUl = document.querySelector(".js-favourites");
const btnDeleteAll = document.querySelector(".js-delete-all");

// creo funcion manejadora del boton buscar
function searchHandler() {
  // antes de buscar borro la lista anterior para evitar duplicados
  listElement.innerHTML = "";

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

function renderCocktail(cocktailData) {
  const liElement = generateLi(cocktailData);
  liElement.addEventListener("click", () => {
    // cuando clickes en mi voy a hacer 3 cosas
    // 1- almacenar en el local storage
    // antes de anadir un nuevo objeto, recupero los que habia antes y lo meto en una variable
    const oldData = giveMeLocalStorageData(); //devuelve un array con los datos anteriores o un array vacio [] sino habia

    // solo si no existe en storage,
    if (!checkIfElementExistInStorage(cocktailData)) {
      //  lo añadimos
      oldData.push(cocktailData);
      // almaceno este elemento convertido otra vez en string
      localStorage.setItem("favouritesCocktails", JSON.stringify(oldData));

      // 2- pintar el nuevo favorito en la lista de favoritos
      generateFavourite(cocktailData);
    }

    // 3- cambiar estilo al clickar
    liElement.classList.add("items-selected");
  });

  //chequear que el elemnto exista para cambiarle su estilo
  if (checkIfElementExistInStorage(cocktailData)) {
    liElement.classList.add("items-selected");
  }
  return liElement;
}

// creo funcion para que me pinte un coctel comun para las dos listas
function generateLi(cocktailData) {
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
  return liElement;
}

// vamos a hacer una funcion para que lea del localStorage y añadimos const para almacenar lo que nos devuelva
function giveMeLocalStorageData() {
  const objectsLocalStorage = localStorage.getItem("favouritesCocktails");
  if (objectsLocalStorage) {
    return JSON.parse(objectsLocalStorage);
  } else {
    return [];
  }
}
//creamos funcion para generar favorito y llamamos a la de generar Li y agregamos la X
function generateFavourite(cocktailData) {
  const clonedLi = generateLi(cocktailData);

  // añadimos la cruz para borrar
  const img = document.createElement("img"); // <img src="" alt="" />
  img.src = "../images/icon-cross.png";
  img.classList.add("cross-img");
  img.addEventListener("click", () => {
    // recuperamos los favoritos del storage
    let localData = giveMeLocalStorageData();
    // buscar el indice del elemento que queremos borrar con indexof
    const index = localData.findIndex(
      (element) => element.strDrink === cocktailData.strDrink
    );
    // borrar el elemento con splice
    localData.splice(index, 1);

    // vuelvo a setear en el storage
    localStorage.setItem("favouritesCocktails", JSON.stringify(localData));

    //borrar elemento de mi lista padre sin refrescar
    favouritesElementUl.removeChild(clonedLi);

    //borramos todos los elementos de la lista
    listElement.innerHTML = "";

    // volvemos a buscar para recargar la pagina y eliminar la clase de lo anteriormente seleccionado
    searchHandler();
  });

  clonedLi.appendChild(img);
  clonedLi.classList.add("favourite-li");
  favouritesElementUl.appendChild(clonedLi);
}

// funcion que chequea si un elemento esta en el storage
function checkIfElementExistInStorage(item) {
  const dataFromLocalStorage = giveMeLocalStorageData();
  const found = dataFromLocalStorage.find(
    (element) => element.strDrink === item.strDrink
  );
  return found;
}

//-------------------ACABAMOS FUNCIONES----------------

// EMPEZAMOS LA LOGICA

searchButton.addEventListener("click", searchHandler);

// al clickar en el reset, borro todos los hijos
resetButton.addEventListener("click", () => {
  listElement.innerHTML = "";
});
//creo funcion anonima para el boton de delete all fav y borro del local storage
btnDeleteAll.addEventListener("click", () => {
  favouritesElementUl.innerHTML = "";
  localStorage.removeItem("favouritesCocktails");
});

//pintamos cocteles favoritos
const theFavourites = giveMeLocalStorageData();

if (theFavourites && theFavourites.length > 0) {
  for (const item of theFavourites) {
    generateFavourite(item);
  }
}
