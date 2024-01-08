const API = require("../SendToAPI");
const fs = require('fs');

var list = [];

function getRecipes(){

    API.start(200);
    API.sendRequest('/api/dataentities/RE/search?_fields=id', 'GET', null, response => {
        let json = JSON.parse(response);
        json.forEach(e => {
            list.push(e.id);
        });
    },null);
    API.stop(()=>{fs.writeFileSync("./new/recipesList.json", JSON.stringify(list, null, 2))});
}

function getPreparationIngredients(){

    API.start(200);
    API.sendRequest('/api/dataentities/PI/search?_fields=id', 'GET', null, response => {
        let json = JSON.parse(response);
        json.forEach(e => {
            list.push(e.id);
        });
    },null);
    API.stop(()=>{fs.writeFileSync("./new/recipesList.json", JSON.stringify(list, null, 2))});
}

//getRecipes();
getPreparationIngredients();