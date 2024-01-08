import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class PTV extends ExternalClient {

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options);
  }

  public async ptvGetPostal(postalCode: String, ptvUsername: String, ptvPassword: String): Promise<any> {
    const productionMode: boolean = `${JSON.parse(`${process.env.VAR}`).productionMode}` === "true" ? true : false;
    //console.log("productionMode appSetting: " + productionMode);
    
    const endpointTest: string = `${JSON.parse(`${process.env.VAR}`).ptvUrlTest}`;
    const endpointProd: string = `${JSON.parse(`${process.env.VAR}`).ptvUrlProd}`;

    
    return this.http.get(`${(productionMode ? endpointProd : endpointTest)}/${postalCode}`,
      {
        headers: 
        {
          'Authorization': 'Basic ' + Buffer.from(ptvUsername + ':' + ptvPassword).toString('base64')
        }
      }
    )
  }
}
