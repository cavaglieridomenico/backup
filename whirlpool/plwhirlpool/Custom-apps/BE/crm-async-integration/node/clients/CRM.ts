//@ts-nocheck

import {ExternalClient, InstanceOptions, IOContext} from "@vtex/api";
const fs = require('fs');
const https = require('https');
import { crmHost,cert } from "../utils/constants";

export default class CrmAPI extends ExternalClient {
    constructor(context: IOContext, options: InstanceOptions) {
      let environment = JSON.parse(process.env.CRM).crmEnvironment;
      super(crmHost[environment], context, {
        ...options,
        headers:{
          "Accept": "*/*",
          "Content-Type": "text/xml"
        },
        httpsAgent: new https.Agent({
          pfx: fs.readFileSync(cert[environment]),
          passphrase: JSON.parse(process.env.CRM).crmPassword
        })
      });
    }

    public async getAccount(crmBpId: string): Promise<any> {
      let paylaod = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
                        '<soap:Body>'+
                            '<n0:ZEsDispconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">'+
                              '<CrmBpId>'+crmBpId+'</CrmBpId>'+
                              '<Date/>'+
                            '</n0:ZEsDispconMyacc>'+
                        '</soap:Body>'+
                    '</soap:Envelope>';
      let environment = JSON.parse(process.env.CRM).crmEnvironment;
      let endpoint = "/ecq/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer";
      if(environment=="production"){
        endpoint = "/ecp/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer";
      }
      return this.http.post(endpoint, paylaod, this.options);
    }
}

