
main();
async function main(){


    let str = "service/test"
    let allowedPage = ["service", "test"]

    let splitted = str.split("/");

    
    if(splitted[0] == "" &&
        allowedPage.includes(splitted[1]) &&
        splitted[2] != undefined){
            console.log("ok");
        }
        
    console.log(splitted[0] + " -- " + splitted[1] + " -- " + splitted[2]);
}