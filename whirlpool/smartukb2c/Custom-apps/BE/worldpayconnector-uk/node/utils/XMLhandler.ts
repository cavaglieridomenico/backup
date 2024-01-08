import { Builder, parseString } from 'xml2js'
import { XML } from './constants';

export function BuildXML(obj: any, xmlPrefix: string | null = XML): string {
  let builder = new Builder()
  let xmlObj = builder.buildObject(obj);
  if(xmlPrefix != null){
    xmlObj = xmlObj.replace(/<?.+?>/, xmlPrefix)
  }
  return xmlObj

}

export function ParseXML<T>(xml: string): T | undefined {
  if (xml.trim() == "")
    return undefined
  let res: T | undefined = undefined
  parseString(xml, (err, result) => {
    if (!err)
      res = result
  })
  return res;
}
