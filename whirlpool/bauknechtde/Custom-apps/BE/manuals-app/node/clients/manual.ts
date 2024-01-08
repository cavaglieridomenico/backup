import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
const axios = require('axios');

export default class Manual extends JanusClient {

    constructor(context: IOContext, options?: InstanceOptions) {

        // memorize the authentication token of the application
        // by this way we don't encounter any VTEX proxy problems
        super(context, {
            ...options,
            headers: {
              ...(options && options.headers),
              VtexIdclientAutCookie: context.authToken,
              'Proxy-Authorization': context.authToken
            }
          })

    }

    public async getManualsSuggestions(code: any): Promise<any> {

        // promisify the client creation and soap request to be able to wait for the final result
        var responsePromise = new Promise ((resolve, reject) => {
            axios
            .get(`https://docs.api.prod.aws.wpsandwatch.com/autocomplete?&code=${code}`)
            .then((res: any) => {
                resolve(res)
            })
            .catch((error: any) => {
                reject(error)
            });

        })

        // build the body json with the soap request body
        return await responsePromise

    }

    public async getManuals(params: any): Promise<any> {

        let url = "https://docs.api.prod.aws.wpsandwatch.com/documents"
        let alreadyAssembled = false

        // iterate over the CODES array
        if(params.code) {

            if(!alreadyAssembled) { url += "?"; alreadyAssembled = true}
            url += `&code=${params.code}`

        }

        // iterate over the MAIN TYPE array
        if(params.mainType) {

            if(!alreadyAssembled) { url += "?"; alreadyAssembled = true}
            url += `&mainType=${params.mainType}`

        }

        // iterate over the MAIN IMAGE parameter
        if(params.mainImage) {

            if(!alreadyAssembled) { url += "?"; alreadyAssembled = true}
            url += `&mainImage=${params.mainImage}`

        }

        // iterate over the LANGUAGE array
        for(let i = 0; i < params.languages.length; i ++){

            if(!alreadyAssembled) { url += "?"; alreadyAssembled = true}
            url += `&language=${params.languages[i]}`

        }

        // iterate over the TYPE ID parameter
        if(params.typeId) {

            if(!alreadyAssembled) { url += "?"; alreadyAssembled = true}
            url += `&typeId=${params.typeId}`

        }

        console.log(url)

        // promisify the client creation and soap request to be able to wait for the final result
        var responsePromise = new Promise ((resolve, reject) => {
            axios
            .get(url)
            .then((res: any) => {
                resolve(res)
            })
            .catch((error: any) => {
                reject(error)
            });

        })

        // build the body json with the soap request body
        return await responsePromise

    }

    public async getDocumentations(params: any): Promise<any> {

        let url = "https://docs.api.prod.aws.wpsandwatch.com/documents"

        // MAIN TYPE = DOCUMENTATION
        url += `?&mainType=documentation`

        // MAIN IMAGE = false
        url += `&mainImage=false`

        // CODES parameter
        if(params.code) 
            url += `&code=${params.code}`

        // iterate over the LANGUAGE array
        for(let i = 0; i < params.languages.length; i ++) 
            url += `&language=${params.languages[i]}`

        console.log("GET DOCUMENTATION: " + url)

        // promisify the client creation and soap request to be able to wait for the final result
        var responsePromise = new Promise ((resolve, reject) => {
            axios
            .get(url)
            .then((res: any) => {
                resolve(res)
            })
            .catch((error: any) => {
                reject(error)
            });

        })

        // build the body json with the soap request body
        return await responsePromise

    }

    public async getPictures(params: any): Promise<any> {

        let url = "https://docs.api.prod.aws.wpsandwatch.com/documents"
        
        // MAIN TYPE = PICTURE
        url += `?&mainType=picture`

        // MAIN IMAGE = false
        url += `&mainImage=true`

        // iterate over the CODES array
        if(params.code) 
            url += `&code=${params.code}`

        console.log("GET PICTURE: " + url)

        // promisify the client creation and soap request to be able to wait for the final result
        var responsePromise = new Promise ((resolve, reject) => {
            axios
            .get(url)
            .then((res: any) => {
                resolve(res)
            })
            .catch((error: any) => {
                reject(error)
            });

        })

        // build the body json with the soap request body
        return await responsePromise

    }
}
