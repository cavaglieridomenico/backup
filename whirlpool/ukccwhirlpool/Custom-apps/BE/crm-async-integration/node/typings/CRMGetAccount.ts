export const CRMGetAccount =
'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
  '<soap:Body>'+
      '<n0:ZEsDispconMyacc xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">'+
        '<CrmBpId>$crmBpId</CrmBpId>'+
        '<Date/>'+
      '</n0:ZEsDispconMyacc>'+
  '</soap:Body>'+
'</soap:Envelope>';

export const SAPPOGetAccount =
'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
  '<soap:Body>'+
      '<n0:Z_ES_DISPCON_MYACC xmlns:n0="urn:sap-com:document:sap:rfc:functions">'+
        '<CRM_BP_ID>$crmBpId</CRM_BP_ID>'+
        '<DATE/>'+
      '</n0:Z_ES_DISPCON_MYACC>'+
  '</soap:Body>'+
'</soap:Envelope>'
