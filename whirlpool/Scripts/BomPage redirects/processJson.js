const fs = require('fs')
const fetch = require('node-fetch')

main()
async function main(){

    let PROD_file = require("./PROD_bom2.json");
    let QA_file = require("./QA_bom.json");


    count = 0;
    let indCodeCorrect = "";
    let array = [];
    


    PROD_file.forEach(itemPROD => {

        let prodId = itemPROD.from;

        let exist = false;

        let index = 0;

        QA_file.forEach(itemQA => {

            if(itemQA.id === itemPROD.id){
                exist = true;
                
            }
            
        })
        
        if(exist == false){

            QA_file.forEach(itemQA => {

                if(itemQA.query.industrialCode == itemPROD.query.industrialCode && itemQA.query.modelNumber == itemPROD.query.modelNumber){
                    let x = {
                        QA: itemQA,
                        PROD: itemPROD
                    }
                    array.push(x)
                    
                }
                
            })

            
            count ++;
        }
            
        

    

    })

    console.log(count);
    
    fs.writeFileSync("./d_3bom.json", JSON.stringify(array, null, 2));
}