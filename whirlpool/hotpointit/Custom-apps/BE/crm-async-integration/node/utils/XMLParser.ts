//@ts-nocheck

import { resolve } from "dns";
import { reject } from "ramda";

const parser = require('fast-xml-parser');
const he = require('he');

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: true,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
};


/**
 * Parse an XML to a key-value map 
 * @param input XML response
 * @returns key-value map of the XML
 */
export async function parse(input: any): Promise<Object>{
  let res = {};
  return new Promise<Object>((resolve,reject) => {
    try{
      res = parser.parse(input,options, true);
      resolve(res);
    }catch(err){
      reject(err)
    }
  })
}
