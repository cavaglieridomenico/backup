const axios = require('axios');
const fs = require('fs')
const FormData = require('form-data');
const path = require('path');

let imageJsonArray = [
    {
        "imageName": "testScreenshot",
        "imagePath": "/Users/buscemagaetano/Desktop/testScreenshot.png"
    }
]

let saveResults = [

]

// name of the VTEX account
let account = "itwhirlpool"

// name of the VTEX workspace
let workspace = "master"

// VTEX binding id
let bindingId = "5ea43962-7a42-4a12-bf9e-3a7c98ce8b84"

// File Manager sha256Hash
let fmUploadFileShaHash = "0f928d0c58f67a444673e456a9eb43cd7a6f054f76e9a6e2694e701327dd563c"
let fmCreateContentShaHash = "f081b318ede7fbeca342609d53e58baf560b52647f75af1bf0b86b59327fbc06"

// FITST, call the UpdateImage endpoint
for(let i = 0; i < imageJsonArray.length; i ++){

    let file = imageJsonArray[i]

    let filePath = file.imagePath
    
    let bodyFormData = new FormData();
    bodyFormData.append('operations', `{"operationName":"UploadFile","variables":{"file":null},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"${fmUploadFileShaHash}","sender":"vtex.admin-cms@0.x","provider":"vtex.file-manager-graphql@0.x"}}}`);
    bodyFormData.append('map', '{"0":["variables.file"]}')
    bodyFormData.append('0', fs.createReadStream(filePath))
    
    let url = `https://${account}.myvtex.com/_v/private/graphql/v1?workspace=${workspace}&maxAge=long&appsEtag=remove&domain=admin&locale=en-US&__bindingId=${bindingId}`
    
    axios({
        
        method: "post",
        url: url,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },

    })
    .then(function (response) {

        // CREATE image object
        let createObj = {
            "operationName": "createContent",
            "variables": {},
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": fmCreateContentShaHash,
                    "sender": "vtex.admin-cms@0.x",
                    "provider": "vtex.admin-cms-graphql@0.x"
                },
                "variables": ""
            }
        }

        let variables = {
            "name": file.imageName,
            "type": "image",
            "builderId": "cms",
            "variant": {
                "status": "draft",
                "isForce": true,
                "blocks": [],
                "extraBlocks": [
                    {
                        "name": "Image",
                        "blocks": [
                            {
                                "name": "Image",
                                "props": {
                                    "url": response.data.data.uploadFile.fileUrl,
                                    "name": file.imageName,
                                    "mimetype": "image/png",
                                    "encoding": "",
                                    "extension": "",
                                    "alternativeText": file.imageName,
                                    "size": fs.statSync(file.imagePath).size
                                }
                            }
                        ]
                    }
                ]
            }
        }

        createObj.extensions.variables = Buffer.from(JSON.stringify(variables)).toString('base64')

        axios({
        
            method: "post",
            url: url,
            data: JSON.stringify(createObj),
            headers: { "Content-Type": "application/json" },
    
        })
        .then(function (response) {

            file.imageURL = response.data.data.createContent.variants[0].extraBlocks[0].blocks[0].props.url

            saveResults.push(file)

    
            if(saveResults.length == imageJsonArray.length){
                fs.writeFile('./report.txt', JSON.stringify(saveResults), function (err) {
                    if (err) return console.log(err);
                });
            }
        })
        .catch(function(err){
            console.log(err)
        })

    })
    .catch(function (response) {

        //handle error
        console.log(response);

    });

}


