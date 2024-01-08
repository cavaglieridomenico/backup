getAllItems('sprint--ruwhirlpoolqa');

// fileRead()
function fileRead() {
    const csv = require('csv-parser');
    const fs = require('fs');
    let data = []
    fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (row) => {
            console.log(row);
            data.push(row)
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            callVTexMappingService(data)

        });
}

function callVTexMappingService(data) {
    const arrayObject = [];

    data.forEach(id => {
        console.log(id.ID)
        const objectVitex = httpGet('https://sprint--itwhirlpoolqa.myvtex.com/v1/api/sfmc/catalog/sku?id=' + id.ID);
        arrayObject.push(JSON.parse(objectVitex))
    })
    console.log(arrayObject)
    postSalesforceCatalog(arrayObject)
}

async function postSalesforceCatalog(data) {
    const objectSaleforces = [];
    let arrayObjectID = [];

    for (let i = 0; i < data.length; i++) {
        objectSaleforces.push(data[i])
        arrayObjectID.push(data[i].unique_id)

        if (objectSaleforces.length === 5) {
            const obj = {
                api_key: "eac75250-6b3b-11e9-a1aa-063c1e816f18",
                payload: objectSaleforces
            };
            console.log(obj)
            httpPostSaleforces('https://7329181.collect.igodigital.com/c2/7329181/update_item_secure.json', obj).then(response => {
                console.log(response)
                console.log('***********************************************************')
                objectSaleforces.length = 0
            })

            objectSaleforces.length = 0
        }


    }
    if (objectSaleforces.length < 0) {
        const obj = {
            api_key: "eac75250-6b3b-11e9-a1aa-063c1e816f18",
            payload: objectSaleforces
        };
        console.log(obj)
        const res = await httpPostSaleforces('https://7329181.collect.igodigital.com/c2/7329181/update_item_secure.json', obj)
        console.log(res)
        objectSaleforces.length = 0
    }
    writeToFile(arrayObjectID, 'ID');
}

function getAllItems(workspace) {
    let data = []
    let arrObjectPage = []
    arrObjectPage.length = 1000
    console.log('getAllItems *********')
    for (let i = 1; ; ++i) {
        arrObjectPage = httpGetVitex(`https://${workspace}.myvtex.com/api/catalog_system/pvt/sku/stockkeepingunitids?page=${i}&pagesize=1000`);
        arrObjectPage = JSON.parse(arrObjectPage)
        console.log(arrObjectPage)

        if ((arrObjectPage === undefined || arrObjectPage.length === 0 || arrObjectPage.length < 1000) && i > 1) {
            break;
        } else {
            data = arrObjectPage
            console.log('push')
        }

    }
    console.log(data)
    callVTexMappingServiceArrayID(data, workspace)
}

function callVTexMappingServiceArrayID(data, workSpace) {
    let arrayObject = [];
    let arrayObject404 = [];
    let arrayObjectok = [];
    console.log('aaaaaaaaaaaaaaa')
    console.log(data)
    console.log(workSpace)
    data.forEach(id => {
        const objectVitex = httpPost(`https://${workSpace}.myvtex.com/v1/api/catalogs/sfmc/get/catalog?id=` + id, '');
        console.log(objectVitex)
        const objectVtexPars = JSON.parse(objectVitex)
        if (objectVtexPars.status || objectVitex === {}) {
            arrayObject404.push(id)
        } else {
            arrayObjectok.push(objectVtexPars.item)
            arrayObject.push(objectVtexPars)
        }
        console.log(objectVtexPars)
    })
    console.log(arrayObjectok)
    console.log(arrayObject404)
    // writeToFile(arrayObjectok, 'ok__')
    // writeToFile(arrayObject404, 'failet__')
    if (arrayObject.length > 0) {
        console.log(arrayObject)
        postSalesforceCatalog(arrayObject)
    } else {
        console.log('No data found after Vitex Call')
    }

}

function httpGet(theUrl) {
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", theUrl, false);
    xhr.send(null);
    return xhr.responseText;
}

function httpPost(theUrl, data) {

    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", theUrl, false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    console.log("Response " + xhr.status)
    return xhr.responseText;
}

function httpGetVitex(theUrl) {
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", theUrl, false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Accept", "application/json");
    // xhr.setRequestHeader("X-VTEX-API-AppKey", "vtexappkey-itwhirlpoolqa-SETTVR");
    // xhr.setRequestHeader("X-VTEX-API-AppToken", "IZQLNOEVVJGXTAQPMNBMQWOGJYLYVWHEEHMCHEBQAJYMMTBSCPLWNBILLJBPCFAYCBSLOOIHMKMGYBUPWTWGLKQDZARXCMNUJZJKAPENGDKCOBMJPLSJITNRKPMNXLFZ");
    xhr.setRequestHeader("X-VTEX-API-AppKey", "vtexappkey-ruwhirlpoolqa-AIHWUB");
    xhr.setRequestHeader("X-VTEX-API-AppToken", "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW");

    xhr.send(null);
    console.log(xhr.status + theUrl)
    return xhr.responseText;
}

function writeToFile(data, name) {
    const fs = require('fs');
    let dte = '' + new Date()
    fs.writeFile(name + 'ru' + '.txt', JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

async function httpPostSaleforces(theUrl, data) {
    const fetch = require("node-fetch");
    fetch(theUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
        // -- or --
        // body : JSON.stringify({
        // user : document.getElementById('user').value,
        // ...
        // })
    }).then(
        response => response.json()
        // .json(), etc.
        // same as function(response) {return response.text();}
    ).then(promise => {
        console.log(promise)
    }).catch(err => console.error(err));
}
