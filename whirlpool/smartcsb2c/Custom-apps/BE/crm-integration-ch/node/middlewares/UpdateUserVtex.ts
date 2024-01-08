import { isValid } from "../utils/function"

export async function UpdateUserVtex(ctx: Context, next: () => Promise<any>) {
  const
    {
      clients:
      {
        getCrmUser: getCrmUser
      },
    } = ctx

  let userid = ctx.vtex.route.params.userid

  let appSettings = await ctx.clients.apps.getAppSettings("" + process.env.VTEX_APP_ID)
  console.log(appSettings['productionMode'])
  getCrmUser.productionMode = appSettings['productionMode']
  getCrmUser.displayEndpoint = appSettings['displayConsumerUrl']
  getCrmUser.password = appSettings['crmPassword']

  ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: "CL",
    fields: ["crmBpId"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `id=${userid}`,
  }).then(userResult => {
    if (userResult.length > 0) {
      let crmid = userResult[0].crmBpId
      getCrmUser.getUser(crmid).then(res => {
        let re = new RegExp(String.fromCharCode(8206), "g")
        res = res.replace(re, "")
        let parser = require('fast-xml-parser')
        let crmUser = parser.parse(res)["soap-env:Envelope"]["soap-env:Body"]["n0:ZEsDispconMyaccResponse"]
        //console.log(JSON.stringify(crmUser))
        ctx.clients.masterdata.updatePartialDocument({
          dataEntity: "CL",
          id: userid.toString(),
          fields: {
            homePhone: crmUser["EsAddressData"].HousePhone,
            phone: crmUser["EsAddressData"].MobilePhone,
            businessPhone: crmUser["EsAddressData"].WorkPhone,
            gender: crmUser["EsNameData"].TitleKey == 1 ? "female" : "male",
            firstName: crmUser["EsNameData"].FirstName,
            lastName: crmUser["EsNameData"].LastName,
            email: crmUser["EsAddressData"].EmailAddress,
            birthDate: FormatDateCRMtoVTEX(crmUser["EsNameData"].DateOfBirth.toString()),
            isNewsletterOptIn: GetOptinValue(crmUser["EtMktAttrib"].item)
          }
        })
        if (isValid(crmUser["EsAddressData"].PostCode)) {
          ctx.clients.masterdata.searchDocuments<any>({
            dataEntity: "AD",
            fields: ['id', 'createdIn'],
            pagination: {
              page: 1,
              pageSize: 100
            },
            where: `userId=${userid}`,
            sort: "createdIn ASC"
          }).then(addressResult => {
            let {
              convertIso2Code
            } = require("convert-country-codes");
            //console.log(JSON.stringify(addressResult))
            if (addressResult.length > 0) {
              console.log("address found, updating")
              ctx.clients.masterdata.updatePartialDocument({
                dataEntity: "AD",
                fields: {
                  number: crmUser["EsAddressData"].HouseNum,
                  street: crmUser["EsAddressData"].Street1,
                  complement: crmUser["EsAddressData"].Street2 != "" ? crmUser["EsAddressData"].Street2 : null,
                  city: crmUser["EsAddressData"].City,
                  postalCode: crmUser["EsAddressData"].PostCode,
                  state: crmUser["EsAddressData"].State != "" ? crmUser["EsAddressData"].State : null,
                  country: convertIso2Code(crmUser["EsAddressData"].Country).ioc
                },
                id: addressResult[0].id
              })
            } else {
              console.log("no address found")
              if (crmUser["EsAddressData"].Country != "" && crmUser["EsAddressData"].Street1 != "" && crmUser["EsAddressData"].PostCode != "" && crmUser["EsAddressData"].City != "") {
                console.log("creating new address")
                ctx.clients.masterdata.createDocument({
                  dataEntity: "AD",
                  fields: {
                    userId: userid,
                    addressName: "CRM address",
                    number: crmUser["EsAddressData"].HouseNum,
                    street: crmUser["EsAddressData"].Street1,
                    complement: crmUser["EsAddressData"].Street2 != "" ? crmUser["EsAddressData"].Street2 : null,
                    city: crmUser["EsAddressData"].City,
                    postalCode: crmUser["EsAddressData"].PostCode,
                    state: crmUser["EsAddressData"].State != "" ? crmUser["EsAddressData"].State : null,
                    country: convertIso2Code(crmUser["EsAddressData"].Country).ioc
                  }
                }).then(() => {
                  console.log("address added")
                }, err => console.log("error adding address: " + err.response.data.Message))
              }
            }
          }, err => {
            console.log("master data error: " + err.response.data.Message)
          })
        }


      }, err => {
        console.log("crm error: " + JSON.stringify(err.response.data))
      })
    } else {
      console.log("user not found in master data")
    }

  }, (err) => console.log("Master data error: " + err.response.data.Message))



  ctx.status = 200
  ctx.body = "ok"

  await next()
}



function FormatDateCRMtoVTEX(crmDate: string): string | null {
  try {
    crmDate = crmDate.substring(0, 4) + "-" + crmDate.substring(4, 6) + "-" + crmDate.substring(6, 8)
    let vtexDate = new Date(crmDate)
    return vtexDate.toISOString()
  }
  catch (error) {
    console.log(error.message)
    return null
  }
}

function GetOptinValue(crmOptin: any[]) {
  let optinValue = crmOptin.find(optin => optin.AttName == "EU_CONSUMER_SPARE_PARTS")?.AttValue
  return optinValue == "Allowed"
}
