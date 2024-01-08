const fs = require('fs')
const fetch = require('node-fetch')

main()

async function main(){


    let internalBody = []

    let catTree = require("./tree.json");

    catTree.forEach(cat => {

        if(cat.catFName != "Spare Parts"){

            let aliasCategory = ""

            switch(cat.catFName){

                case "Coffee Machine": aliasCategory = "small-appliances";
                                        break;
                case "Cooker": aliasCategory = "cooking";
                                break;
                case "Dishwasher": aliasCategory = "dishwashing";
                                    break;
                case "Freezer": aliasCategory = "refrigeration";
                                break;
                case "Fridge Freezer": aliasCategory = "refrigeration";
                                        break;
                case "Fridge": aliasCategory = "refrigeration";
                                break;
                case "Hob": aliasCategory = "cooking";
                            break;
                case "Hood": aliasCategory = "cooking";
                             break;
                case "Microwave": aliasCategory = "cooking";
                                    break;
                case "Oven": aliasCategory = "cooking";
                             break;
                case "Tumble Dryer": aliasCategory = "laundry";
                                     break;
                case "Washer Dryer": aliasCategory = "laundry";
                                     break;
                case "Washing Machine": aliasCategory = "laundry";
                                        break;
                
            }

            fatherName = cat.catFName.toLocaleLowerCase();
            if(fatherName.includes(" ")){
                fatherName = fatherName.replaceAll(" ", "-");
            }

            childName = cat.catName.toLocaleLowerCase();
            if(childName.includes(" ")){
                childName = childName.replaceAll(" ", "-");
            }

            fromString = "/spare-parts/" + aliasCategory + "/" + fatherName + "/" + childName;
            resolveAsString = "/spare-parts/" + fatherName + "/" + childName;

            let internalBodyInner = {                
                type: "subcategory",
                declarer: "vtex.store@2.x",   
                from: fromString,
                resolveAs: resolveAsString,
                id: `${cat.catId}`
            }

            console.log(internalBody);
            internalBody.push(internalBodyInner);

        }

    });

    fs.writeFileSync("./internalLink.json", JSON.stringify(internalBody, null, 2))

}