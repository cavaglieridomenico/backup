import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'


export default class Tradeplace extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  public async productAvailability(body: Object, tpUsername: String, tpPassword: String): Promise<any> {
    //console.log("process.env.VAR: " + process.env.VAR);
    
    const endpointTest: string = `${JSON.parse(`${process.env.VAR}`).tpUrlTest}`;
    const endpointProd: string = `${JSON.parse(`${process.env.VAR}`).tpUrlProd}`;
    const productionMode: boolean = `${JSON.parse(`${process.env.VAR}`).productionMode}` === "true" ? true : false;
    
    //console.log("cost in clients: " + endpointTest + "||||" + endpointProd + "||||" + productionMode);
    
    
    return new Promise((resolve, reject) => {
      try {
        resolve(this.http.post((productionMode ? endpointProd : endpointTest), body,
          {
            headers: 
            {
              'Content-Type': 'application/xml',
              'Authorization': 'Basic ' + Buffer.from(tpUsername + ':' + tpPassword).toString('base64')
            }
          }))
      } catch (err) {
        reject(err);
      }
    })
  }
}
