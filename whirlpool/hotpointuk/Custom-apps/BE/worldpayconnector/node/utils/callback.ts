import { request } from "https"
import { OutgoingHttpHeaders } from "http";

export async function ExecuteHTTPRequest(url: any, body: any, headers?: OutgoingHttpHeaders): Promise<any> {
    return new Promise((resolve, reject) => {
        let req = request(url, {
            method: 'POST',
            headers: {
              ...headers,
              "Content-Type": "application/json"
            }
        }, res => {
            let body = "";
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", () => {
                console.log("response status: " + res.statusCode)
                if(res.statusCode != undefined && res.statusCode >= 200 && res.statusCode < 300)
                    resolve(body)
                else
                    reject(body)
            })
            res.on("error", err => {
                reject(err);
            })
        })

        req.on("error", err => {
            reject(err);
        })

        req.write(JSON.stringify(body))
        req.end();
    })
}
