import * as fs from 'fs';
import * as https from 'https';
import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { AES256Decode } from "../utils/cryptography";
import { replaceMultipleOccurrences, stringify, wait } from '../utils/commons';
import { Response, XMLhandler } from '../utils/XMLHandler';
import { crm, maxRetry, maxRetrySync, maxWaitTime, maxWaitTimeSync, sappo, uk } from '../utils/constants';
import { CRMBaseMessage, CRMDetails, CrmEnvironment, CRMPayloadPlaceholders, CRMSettings, PayloadType } from '../typings/crm/common';
import { CreateConsumerCRM, CreateConsumerCRM_Response, DisplayConsumerCRM, DisplayConsumerCRM_Response, ProductRegistrationCRM, ProductRegistrationCRM_Response } from '../typings/crm/CRM';
import { CreateConsumerPO, CreateConsumerPO_Response, DisplayConsumerPO, DisplayConsumerPO_Response, ProductRegistrationPO, ProductRegistrationPO_Response } from '../typings/crm/SAPPO';
import { CreateConsumerUK, CreateConsumerUK_Response } from '../typings/crm/UK';


export default class CRM extends ExternalClient {

  private po: boolean
  private settings: CRMDetails
  private envPath: string
  private xmlHandlerDisplayConsumer: XMLhandler
  private xmlHandlerCreateConsumer?: XMLhandler
  private xmlHandlerProductRegistration?: XMLhandler

  //@ts-ignore
  constructor(context: IOContext, options?: InstanceOptions) {
    let appSettings: CRMSettings = JSON.parse(process.env[`${context.account}-CRM`]!);
    let host = appSettings.isUkProject ?
      (uk as any)[appSettings.crmEnvironment].host :
      (
        appSettings.useSapPo ?
          (sappo as any)[appSettings.crmEnvironment].host :
          (crm as any)[appSettings.crmEnvironment].host
      );
    let cert = appSettings.isUkProject ?
      (uk as any)[appSettings.crmEnvironment].cert :
      (
        appSettings.useSapPo ?
          (sappo as any)[appSettings.crmEnvironment].cert :
          (crm as any)[appSettings.crmEnvironment].cert
      );
    super(host, context, {
      ...options,
      headers: {
        "Accept": "*/*",
        "Content-Type": "text/xml",
        "X-VTEX-Use-Https": "true"
      },
      httpsAgent: new https.Agent({
        pfx: fs.readFileSync(cert),
        passphrase: AES256Decode(appSettings.crmPassword)
      })
    });
    this.po = appSettings.useSapPo;
    this.settings = appSettings.isUkProject ? uk : (appSettings.useSapPo ? sappo : crm);
    this.envPath = appSettings.crmEnvironment == CrmEnvironment.PROD ? this.settings.production.envPath : this.settings.quality.envPath;
    this.xmlHandlerDisplayConsumer = new XMLhandler(this.settings.getAccount.wsdl!);
    try {
      this.xmlHandlerCreateConsumer = new XMLhandler(this.settings.createAccount.wsdl!);
      this.xmlHandlerProductRegistration = new XMLhandler(this.settings.productRegistration?.wsdl!);
    } catch (err) {
      // nothing to do, just ignore it
    }
  }

  private buildXMLPayload = (baseMessage: string, namespace: string, namespaceRef: string, data: string) => {
    baseMessage = replaceMultipleOccurrences(baseMessage, CRMPayloadPlaceholders.NAMESPACE, namespace);
    baseMessage = replaceMultipleOccurrences(baseMessage, CRMPayloadPlaceholders.NAMESPACEDECL, namespaceRef);
    baseMessage = replaceMultipleOccurrences(baseMessage, CRMPayloadPlaceholders.DATA, data);
    return baseMessage;
  }

  private retrieveResponse = (res: Response, namespace: string): any => {
    return this.po ? res.Body[`${namespace}.Response`] : res.Body[`${namespace}Response`];
  }

  public async getAccountAPI(paylaod: DisplayConsumerCRM | DisplayConsumerPO | string, retry: number = 0): Promise<DisplayConsumerCRM_Response | DisplayConsumerPO_Response> {
    return new Promise<DisplayConsumerCRM_Response | DisplayConsumerPO_Response>(async (resolve, reject) => {
      try {
        if (typeof paylaod == 'object') {
          paylaod = await this.xmlHandlerDisplayConsumer!.jsonToXML(paylaod);
          paylaod = this.buildXMLPayload(CRMBaseMessage, this.settings?.getAccount.namespace!, this.settings?.getAccount.namespaceRef!, paylaod);
        }
      } catch (err) {
        reject({ message: `Error while fetching data from CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
      }
      this.http.post<string>(this.envPath + this.settings?.getAccount.endpoint!, paylaod, this.options)
        .then(async (res) => {
          try {
            let json = await this.xmlHandlerDisplayConsumer!.xmlToJson(res);
            let response: DisplayConsumerCRM_Response | DisplayConsumerPO_Response = this.retrieveResponse(json, this.settings.getAccount.namespace!);
            if (response) {
              resolve(response)
            } else {
              reject({ message: `Error while fetching data from CRM --details: ${stringify(res)} --data: ${stringify(paylaod)}` });
            }
          } catch (err) {
            reject({ message: `Error while fetching data from CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
          }
        })
        .catch(async (err) => {
          if (retry < maxRetrySync) {
            await wait(maxWaitTimeSync);
            return this.getAccountAPI(paylaod, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: `Error while fetching data from CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
          }
        })
    })
  }

  public async createUpdateAccountAPI(paylaod: CreateConsumerCRM | CreateConsumerPO | CreateConsumerUK | string, retry: number = 0): Promise<CreateConsumerCRM_Response | CreateConsumerPO_Response | CreateConsumerUK_Response> {
    return new Promise<CreateConsumerCRM_Response | CreateConsumerPO_Response | CreateConsumerUK_Response>(async (resolve, reject) => {
      try {
        this.options!.headers!["Content-Type"] = this.settings.createAccount.contentType ?? "text/xml";
        if (this.settings.createAccount.contentType == "text/xml" && typeof paylaod == 'object') {
          paylaod = await this.xmlHandlerCreateConsumer!.jsonToXML(paylaod);
          paylaod = this.buildXMLPayload(CRMBaseMessage, this.settings?.createAccount.namespace!, this.settings?.createAccount.namespaceRef!, paylaod as string);
        }
      } catch (err) {
        reject({ meesage: `Error while creating / updating consumers on CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
      }
      this.http.post<string | CreateConsumerUK_Response>(this.envPath + this.settings?.createAccount.endpoint!, paylaod, this.options)
        .then(async (res) => {
          try {
            if (typeof res == "object") {
              resolve(res as CreateConsumerUK_Response)
            } else {
              let json = await this.xmlHandlerCreateConsumer!.xmlToJson(res);
              let response: CreateConsumerCRM_Response | CreateConsumerPO_Response = this.retrieveResponse(json, this.settings.createAccount!.namespace!);
              if (response) {
                resolve(response)
              } else {
                reject({ meesage: `Error while creating / updating consumers on CRM --details: ${stringify(res)} --data: ${stringify(paylaod)}` });
              }
            }
          } catch (err) {
            reject({ meesage: `Error while creating / updating consumers on CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
          }
        })
        .catch(async (err) => {
          if (retry < maxRetry) {
            await wait(maxWaitTime);
            return this.createUpdateAccountAPI(paylaod, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ meesage: `Error while creating / updating consumers on CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
          }
        })
    })
  }

  public async registerProduct(paylaod: ProductRegistrationCRM | ProductRegistrationPO | string, retry: number = 0): Promise<ProductRegistrationCRM_Response | ProductRegistrationPO_Response> {
    return new Promise<ProductRegistrationCRM_Response | ProductRegistrationPO_Response>(async (resolve, reject) => {
      try {
        if (typeof paylaod == 'object') {
          paylaod = await this.xmlHandlerProductRegistration!.jsonToXML(paylaod);
          paylaod = this.buildXMLPayload(CRMBaseMessage, this.settings?.productRegistration?.namespace!, this.settings?.productRegistration?.namespaceRef!, paylaod as string);
        }
      } catch (err) {
        reject({ meesage: `Error while registering products on CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
      }
      this.http.post<string>(this.envPath + this.settings?.productRegistration?.endpoint!, paylaod, this.options)
        .then(async (res) => {
          try {
            let json = await this.xmlHandlerProductRegistration!.xmlToJson(res);
            let response: ProductRegistrationCRM_Response | ProductRegistrationPO_Response = this.retrieveResponse(json, this.settings.productRegistration!.namespace!);
            if (response) {
              resolve(response)
            } else {
              reject({ meesage: `Error while registering products on CRM --details: ${stringify(res)} --data: ${stringify(paylaod)}` });
            }
          } catch (err) {
            reject({ meesage: `Error while registering products on CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
          }
        })
        .catch(async (err) => {
          if (retry < maxRetrySync) {
            await wait(maxWaitTimeSync);
            return this.registerProduct(paylaod, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
          } else {
            reject({ meesage: `Error while registering products on CRM --details: ${stringify(err)} --data: ${stringify(paylaod)}` });
          }
        })
    })
  }

  public async parseCreateConsumerRes(res: string | CreateConsumerUK_Response, payloadType: string): Promise<CreateConsumerCRM_Response | CreateConsumerPO_Response | CreateConsumerUK_Response> {
    return new Promise<CreateConsumerCRM_Response | CreateConsumerPO_Response | CreateConsumerUK_Response>(async (resolve, reject) => {
      try {
        if (payloadType == PayloadType.XML) {
          let json = await this.xmlHandlerCreateConsumer!.xmlToJson(res as string);
          let response: CreateConsumerCRM_Response | CreateConsumerPO_Response = this.retrieveResponse(json, this.settings.createAccount!.namespace!);
          if (response) {
            resolve(response)
          } else {
            reject({ meesage: `Error while parsing CRM res --data: ${stringify(res)}` });
          }
        } else {
          resolve(res as CreateConsumerUK_Response);
        }
      } catch (err) {
        reject({ meesage: `Error while parsing CRM res --details: ${stringify(err)} --data: ${stringify(res)}` });
      }
    })
  }

  public async buildCreateConsumerReq(req: CreateConsumerCRM | CreateConsumerPO | CreateConsumerUK, payloadType: string): Promise<string | CreateConsumerUK> {
    return new Promise<string | CreateConsumerUK>(async (resolve, reject) => {
      try {
        if (payloadType == PayloadType.XML) {
          let xml = await this.xmlHandlerCreateConsumer!.jsonToXML(req);
          xml = this.buildXMLPayload(CRMBaseMessage, this.settings?.createAccount.namespace!, this.settings?.createAccount.namespaceRef!, xml);
          if (xml) {
            resolve(xml);
          } else {
            reject({ meesage: `Error while building req for "create / update consumer" --data: ${stringify(req)}}` });
          }
        } else {
          resolve(req as CreateConsumerUK)
        }
      } catch (err) {
        reject({ meesage: `Error while building req for "create / update consumer" --details: ${stringify(err)} --data: ${stringify(req)}` });
      }
    })
  }

}
