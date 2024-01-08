import { Builder, parseString } from 'xml2js'
import { xml_header } from './constants';
import { docTypesTP } from './Tradeplace constants/constants';

export function buildXML(obj: any, docTypeValue: string): string {
    let builder = new Builder()
    let xmlObj = builder.buildObject(obj);
    //console.log(xmlObj.replace(/<?.+?>/, XML))

    let xmlType = (' ' + xml_header).slice(1) ;
    if (typeof docTypesTP[docTypeValue] !== 'undefined') {
        xmlType = xmlType + docTypesTP[docTypeValue] as string;
    }
    return xmlObj.replace(/<?.+?>/, xmlType)
    
}

export function parseXML<T>(xml: string):T | undefined{
    if(xml.trim() == "")
        return undefined
    let res: T | undefined = undefined
    parseString(xml, (err, result) => {
        if(!err)
            res = result
    })
    return res;
}