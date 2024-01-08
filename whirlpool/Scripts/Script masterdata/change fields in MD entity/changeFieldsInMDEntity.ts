// IMPORTANT TO RUN THIS SCRIPT USE THIS COMMAND: node --loader ts-node/esm ./truncateEntity.ts

import fetch from 'node-fetch'

const ACCOUNT = "ruwhirlpoolqa"
const APP_KEY = "vtexappkey-ruwhirlpoolqa-AIHWUB"
const APP_TOKEN = "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW"

const OPTIONS = {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "content-type": "application/json",
    'X-VTEX-API-AppKey': APP_KEY,
    'X-VTEX-API-AppToken': APP_TOKEN
  }
}
const ENTITY = "BR"
let count = 0;

let body = {
  categoryId: null,
  categoryName: null,
  twelveNc: null
}

let optionsPATCH = {
  method: "PATCH",
  headers: { ...OPTIONS.headers },
  body:""
}
main()

async function main() {
  const masterdataFullContent: any = await getMasterDataContent(ENTITY, "id")

  console.log(masterdataFullContent.length + " - " + count++)

  // const masterdataContentToDisable = masterdataFullContent.filter((employee: any) => fileContent.includes(employee.email.toLowerCase()))

  // // console.log(masterdataContentToDisable.filter((r: EMRecord) => r.status).length)

  const chunkSize = 1000;

  let recordsToUpdate = masterdataFullContent.map

  for (let i = 0; i < masterdataFullContent.length; i += chunkSize) {
    const chunk = masterdataFullContent.slice(i, i + chunkSize);
    const promiseResponses: Promise<boolean>[] = chunk.map((record) => patchFields(record, ENTITY))
    const responses = await Promise.all(promiseResponses)
    console.log(JSON.stringify(responses))
  }
}

async function getMasterDataContent(entity: string, fields: string) {
  let entityContent = []
  try {
    let token: string | null = null;
    let data: any;

    do {
      const { dataResponse, tokenResponse } = await performScroll(entity, fields, token)

      data = dataResponse
      token = tokenResponse
      console.log(data.length)
      entityContent = entityContent.concat(data)

    } while (data.length > 0)

    fetch(`https://${ACCOUNT}.myvtex.com/api/dataentities/${entity}/scroll?_token=${token}&_size=1000`, OPTIONS)
  } catch (err) {
    console.error(err)
  }

  return entityContent
}

function performScroll(entity: string, fields: string = "id", token: string | null = null): Promise<{ dataResponse: any[], tokenResponse: string }> {
  return new Promise(async (resolve, reject) => {
    fetch(`https://${ACCOUNT}.myvtex.com/api/dataentities/${entity}/scroll?${token ? `_token=${token}` : `_fields=${fields}`}&_size=1000`, OPTIONS)
      .then((mdResponse) => {
        if (mdResponse.ok) {
          mdResponse.json().then((response: any[]) => {
            resolve({
              dataResponse: response,
              tokenResponse: mdResponse.headers.get("x-vtex-md-token")
            })
          })
        } else {
          reject(mdResponse)
        }
      })

  })
}

function apiCallsCategory()

function patchFields(record: any, entity: string): Promise<boolean>{
  return new Promise(async (resolve, reject) => {
    optionsPATCH.body = JSON.stringify(body);
    fetch(`https://${ACCOUNT}.myvtex.com/api/dataentities/${entity}/documents/${record.id}`, optionsPATCH)
      .then((mdResponse) => {
        if (mdResponse.ok) {
          console.log("SUCCESSED DELETE:", record.id);
          resolve(true)
        } else {
          console.log("FAILED DELETE: ", record.id)
          reject(false)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}