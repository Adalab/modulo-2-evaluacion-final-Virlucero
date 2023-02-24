
'use strict'

// añado variables  

const inputElement = document.querySelector('.js-input')
const searchButton = document.querySelector('.js-button-search')
const resetButton = document.querySelector('.js-reset-button')
const listElement = document.querySelector('.js-list')

// creo funcion manejadora del boton buscar
function searchHandler(evt){
    evt.preventDefault();
    //guardo lo que introduce el usuario 
    let cocktailName=inputElement.value;
    
    // hago llamada al servidor para que me devuelva la lista de cockteles
    
    fetch (`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
    .then ((response)=>response.json())
    .then ((data)=> {
            // recojo los cockteles introducidos con este let
            let cocktails=data.drinks
            for (const cocktail of cocktails) {
                const newLi = renderCocktail(cocktail)
                listElement.appendChild(newLi)
            }
        })
}

searchButton.addEventListener("click", searchHandler)


// creo funcion para que me pinte un coctel

function renderCocktail (cocktailData) {

    const liElement = document.createElement('li');
    const h4Title = document.createElement('h4')
    const textForTitle = document.createTextNode(cocktailData.strDrink);
    h4Title.appendChild(textForTitle)
    liElement.appendChild(h4Title)


return liElement


}





    