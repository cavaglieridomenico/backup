const API = require("../SendToAPI");
const recipesList = require("./recipesList.json");

function deleteRecipes(){

    API.start(200);
    recipesList.forEach(id => {
        API.sendRequest('/api/dataentities/RE/documents/'+id, 'DELETE', null, null);
    });
    API.stop();
}

function deletePreparationIngredients(){

    API.start(100);
    recipesList.forEach(id => {
        API.sendRequest('/api/dataentities/PI/documents/'+id, 'DELETE', null, null);
    });
    API.stop();
}


//deleteRecipes();
deletePreparationIngredients();