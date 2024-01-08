import * as soap from 'soap';
import { Client } from 'soap/lib/client';

export interface Response {
  Header: any
  Body: any
}

export class XMLhandler {

  private wsdl: string
  private client?: Client

  constructor(wsdl: string) {
    this.wsdl = wsdl;
  }

  private createClient = async () => {
    return new Promise<Client>((resolve, reject) => {
      soap.createClient(this.wsdl, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  private init = async () => {
    this.client = await this.createClient();
  }

  public jsonToXML = async(object: any): Promise<string> => {
    if (!this.client) {
      await this.init();
    }
    return this.client?.wsdl.objectToXML(object, "", "", "");
  }

  public xmlToJson = async(xml: string): Promise<Response> => {
    if (!this.client) {
      await this.init();
    }
    return this.client?.wsdl.xmlToObject(xml);
  }
}
