//@ts-nocheck
import { google } from "googleapis";
import { ServiceForm } from "../typings/configs";
import { GoogleCredentials } from "../typings/Google";
import { AES256Decode, base64Decode } from "./cryptography";

const VbaseBucket = "google"
const VbaseTokenFile = "token.json"

enum Types {
  SERVICE = "service",
  UTILIZATION = "utilization"
}

export const SaveOnSheet = async (ctx: Context, requestType: string, data: any) => {
  const { serviceForm: serviceFormSettings } = ctx.state.appSettings
  const AccesToken = await GetAccessToken(ctx, serviceFormSettings)
  await AppendOnSheet(AccesToken, serviceFormSettings, requestType, FormatData(requestType as Types, data))
}

const GetAccessToken = async (ctx: Context, settings: ServiceForm) => {
  const storedToken = await ctx.clients.vbase.getJSON<GoogleCredentials>(VbaseBucket, VbaseTokenFile, true).catch(() => null)
  if (storedToken != null && IsValidToken(storedToken)) return storedToken.access_token
  const newToken = await GetNewToken(settings)
  ctx.clients.vbase.saveJSON<GoogleCredentials>(VbaseBucket, VbaseTokenFile, newToken)
  return newToken.access_token
}

const GetNewToken = ({ gServiceAccount, gServiceKey }: ServiceForm) => {
  return new Promise<GoogleCredentials>((resolve, reject) => {
    let jwtClient = new google.auth.JWT(
      gServiceAccount,
      undefined,
      base64Decode(AES256Decode(gServiceKey)),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    //authenticate request
    jwtClient.authorize((err, token) => {
      if (err) {
        console.error(err);
        reject(err)
      } else if (token) {
        resolve(token as GoogleCredentials)
      } else (reject('token is undefined'))
    });
  })
}


const AppendOnSheet = (accessToken: string, { sheetId, types }: ServiceForm, requestType: string, data: string[][]) => {
  return new Promise((resolve, reject) => {
    let sheets = google.sheets("v4");
    const range = types.find(type => type.typeName == requestType)?.tab
    sheets.spreadsheets.values.append(
      {
        access_token: accessToken,
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: "RAW",
        requestBody: {
          values: data,
        },
      },
      (err: any, response: any) => {
        if (err) {
          reject(err)
        } else if (response) {
          resolve(response)
        } else {
          reject(response)
        }
      }
    );
  })
};

const IsValidToken = (credentials: GoogleCredentials) => credentials.expiry_date > Date.now()


const FormatData = (type: Types, payload: any) => {
  let formattedPayload: string[][] = [[]]
  switch (type) {
    case Types.UTILIZATION:
      formattedPayload = [[
        '', '', '', '',
        payload.name.value,
        payload.surname.value,
        payload.telephoneNumber.value,
        payload.email.value,
        payload.productCategory.value,
        payload.city.value,
        payload.street.value,
        payload.streetNumber.value,
        payload.numberOfApartament.value,
        payload.floorNumber.value,
        payload.comment.value,
        payload.optin ? 'YES' : "NO",
      ]]
      break

    case Types.SERVICE:
      formattedPayload = [[
        '', '', '', '',
        payload.serialNumber.value,
        payload.brand.value,
        payload.category.value,
        payload.dateOfPurchasing?.value || '',
        payload.reason.value,
        payload.notes.value,
        payload.name.value,
        payload.surname.value,
        payload.phoneNumber.value,
        payload.email.value,
        payload.city.value,
        payload.optin ? 'YES' : "NO",
      ]]
      break

    default:
      throw new Error(`Type ${type} not expected`)
  }

  formattedPayload[0].push(...FormatDate())

  return formattedPayload
}


// const FormatPhoneNumber = (phone: string) => `'${phone}`

// const FormatDate = (date = new Date()) => date.toLocaleDateString("it-IT").replace(/\//g, "-");

const FormatDate = (date = new Date(), timeZone = 'Europe/Moscow') => [date.toLocaleDateString("it-IT", {
  timeZone
}).replace(/\//g, "-"), date.toLocaleTimeString('it-IT', {
  timeZone
})]

  //return `${shiftedDate.toISOString().split("T")[0]} ${shiftedDate.getHours().toString().padStart(2, "0")}:${shiftedDate.getMinutes().toString().padStart(2, "0")}:${shiftedDate.getSeconds().toString().padStart(2, "0")}`;

