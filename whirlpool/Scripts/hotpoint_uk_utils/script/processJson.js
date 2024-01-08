const { count } = require('console');
const fs = require('fs')
const fetch = require('node-fetch')

main()
async function main(){

    let file1 = require("./Not_Present_in_BR.json");
    


    let count = 0;
    
    let array = [];


    file1.forEach(item => {

            let splitted = item.split("/");
            let indmod = splitted[5];
            let innsplit = indmod.split("-");
            let industrialCode = innsplit[1];
            let x ={
                industrialCode: industrialCode
            }

            array.push(x)

    })

    
    

    
    

    //console.log(count);
    
    fs.writeFileSync("./Not_Present_in_BR(industrialCode).json", JSON.stringify(array, null, 2));
}