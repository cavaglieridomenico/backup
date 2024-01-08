const API = require("../SendToAPI");
const recipes = require("../catalogJsonFiles/recipes.json")
const preparation_ingredients = require("../catalogJsonFiles/preparation_ingredients.json")

function uploadRecipes(){
    API.start(200);
    recipes.forEach(r => {
        API.sendRequest('/api/dataentities/RE/documents', 'POST', r, null, null);
    });
    API.stop();
}

function uploadPreparationIngredients(){
    API.start(200);
    preparation_ingredients.forEach(r => {
        API.sendRequest('/api/dataentities/PI/documents', 'POST', r, null, null);
    });
    API.stop();
}

//uploadRecipes();
uploadPreparationIngredients();