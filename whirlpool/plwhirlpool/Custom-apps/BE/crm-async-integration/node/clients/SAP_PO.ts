//@ts-nocheck

import {ExternalClient, InstanceOptions, IOContext} from "@vtex/api";
const fs = require('fs');
const https = require('https');
import { certSapPo, sapPoHost } from '../utils/constants';

export default class SapPoAPI extends ExternalClient {
    constructor(context: IOContext, options: InstanceOptions) {
      let environment = JSON.parse(process.env.CRM).crmEnvironment;
      super(sapPoHost[environment], context, {
        ...options,
        headers:{
          "Accept": "*/*",
          "Content-Type": "text/xml"
        },
        httpsAgent: new https.Agent({
          pfx: fs.readFileSync(certSapPo[environment]),
          passphrase: JSON.parse(process.env.CRM).crmPassword
        })
      });
    }

    public async getAccount(crmBpId: string): Promise<any> {
      let paylaod = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
                        '<soap:Body>'+
                            '<n0:Z_ES_DISPCON_MYACC xmlns:n0="urn:sap-com:document:sap:rfc:functions">'+
                              '<CRM_BP_ID>'+crmBpId+'</CRM_BP_ID>'+
                              '<DATE/>'+
                            '</n0:Z_ES_DISPCON_MYACC>'+
                        '</soap:Body>'+
                    '</soap:Envelope>';
      let environment = JSON.parse(process.env.CRM).crmEnvironment;
      let system = environment=="production"?"eip":"eiq";
      let endpoint = `/${system}/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VTEX&receiverParty=&receiverService=&interface=SI_DisplayConsumerData_Out&interfaceNamespace=urn:whirlpool.com:D2C:ConsumerData`;
      return this.http.post(endpoint, paylaod, this.options);
    }
}

