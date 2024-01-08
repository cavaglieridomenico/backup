const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

main();
async function main() {

    let file = require("./spConv.json")

    let index = 0;

    while (index < file.length) {


        let splitted = file[index].split(",");
        let first = splitted[0];
        let second = splitted[1];

        const accKey = "vtexappkey-bauknechtde-SEGOPN"
        const accToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
        const account = "bauknechtde"

        let variable = { "left": [`${first}`, `${second}`], "active": true };

        console.log("-------------------------------------------------------");
        console.log("file: createSynonym.js:27 ~ variable", variable)

        try {
            let response = await fetch("https://" + account + ".myvtex.com/_v/private/admin-graphql-ide/v0/vtex.admin-search@1.66.1",
                {
                    method: "POST",
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json",
                        "X-VTEX-API-AppKey": accKey,
                        "X-VTEX-API-AppToken": accToken,
                        "Cache-Control": "no-cache",
                        "Cookie": "VtexIdclientAutCookie=eyJhbGciOiJFUzI1NiIsImtpZCI6IjRDRjUwNzBGNUY5QzdDMUVBNkZENUQyQ0VBRUVEQUY5OTIzRjFDQjQiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJnaXVzZXBwZV9tb25pdGlsbG9fcmVwbHlAd2hpcmxwb29sLmNvbSIsImFjY291bnQiOiJiYXVrbmVjaHRkZSIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiOWU0ZjRmNzItZGVhYy00ZThkLTgyOTAtNWM4NjliZDZkMDY4IiwiZXhwIjoxNjc2MDE2MzI3LCJ1c2VySWQiOiIyZDg0MTRjMi1jMjg1LTQzMTYtYTk4Ny0wZGY4MDAwYWJjODIiLCJpYXQiOjE2NzU5Mjk5MjcsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiI5YmYzZTgxZC02NDMyLTQyODMtYTU5Ny0xZTk4Mzg3OTFlZGUifQ.y16EuDhGwlrz91Fr-Ba3nlGV_dHgi5Du3wFkje_QWC7Iwi2jmA6phC7yMuSDlJjGNMxqV5W9jBjhuCQq5yiuqg"
                    },
                    body: JSON.stringify(
                        {
                            "query": "mutation($var: SearchSynonymItemInput){\n  createSynonym(searchSynonym: $var){\n    status\n  \n  }\n}",
                            "variables": {
                                "var": variable
                            }
                        }
                    )
                })

            console.log(" res -> ", await (response.json()));

        } catch (error) {
            console.log(error);
        }
        index++;
    }

}