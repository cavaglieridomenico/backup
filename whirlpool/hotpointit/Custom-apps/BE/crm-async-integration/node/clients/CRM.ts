//@ts-nocheck

const fs = require('fs');
const https = require('https');
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { AppSettings } from "../typings/config";
import { crmHost,cert } from "../utils/constants";
import { AES256Decode } from "../utils/cryptography";
import { json2Xml3YCheckup } from "../utils/mapper";

export default class CrmAPI extends ExternalClient {

  private environment: string

  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: AppSettings = JSON.parse(process.env.CRM);
    super(crmHost[appSettings.crmEnvironment], context, {
      ...options,
      headers:{
        "Accept": "*/*",
        "Content-Type": "text/xml",
        "X-VTEX-Use-Https": "true"
      },
      httpsAgent: new https.Agent({
        pfx: fs.readFileSync(cert[appSettings.crmEnvironment]),
        passphrase: AES256Decode(appSettings.crmPassword)
      })
    });
    this.environment = appSettings.crmEnvironment;
  }

    /**
     * Build payload and make POST on SAP CRM
     * @param crmBpId user id from CRM entry
     * @returns response payload from SAP
     */
    public async getAccount(crmBpId: string): Promise<any> {
      let paylaod = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
                        '<soap:Body>'+
                            '<n0:ZEsDispconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">'+
                              '<CrmBpId>'+crmBpId+'</CrmBpId>'+
                              '<Date/>'+
                            '</n0:ZEsDispconMyacc>'+
                        '</soap:Body>'+
                    '</soap:Envelope>';
      let endpoint = "/ecq/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer";
      if(this.environment=="production"){
        endpoint = "/ecp/sap/bc/srt/rfc/sap/z_es_myacc_displayconsumer/550/z_es_myacc_displayconsumer/z_es_myacc_displayconsumer";
      }
      return this.http.post(endpoint, paylaod, this.options);
    }


    /**
     * Build XML payload for 3Year Checkup form and make POST on SAP CRM
     * @param ctx Context
     * @param payload json payload
     * @returns response payload from SAP
     */
    public async save3YChekup(ctx: Context, payload: Checkup3Year): Promise<any> {
      let paylaod = json2Xml3YCheckup(ctx, payload);
      let endpoint = "/ecq/sap/bc/srt/rfc/sap/z_es_prd_registration/550/z_es_prd_registration/z_es_prd_registration";
      if(this.environment=="production"){
          endpoint = "/ecp/sap/bc/srt/rfc/sap/z_es_prd_registration/550/z_es_prd_registration/z_es_prd_registration";
      }
      return this.http.post(endpoint, paylaod, this.options);
  }

}



