import { nanoid } from 'nanoid'

export async function sendAlert(ctx: Context, subject: string, message?: string) {
  ctx.clients.masterdata.createDocument({
    dataEntity: 'AL',
    fields: {
      subject,
      message
    }
  }).catch(() => { })
}

export function mapErrorMessage(err: any) {
  if (err.message) return err.message
  else if (typeof err?.response?.data === 'object') return err?.response?.data.message
  else if (err?.response?.data) return err?.response?.data
  else return err
}

export const FormatPrice = (price: number) => price.toFixed(2).replace('.', ',')

export const GenerateID = () => nanoid()

export function isValid(param: any): Boolean{
  return param!=undefined && param!=null && param!="undefined" && param!="null" && param!="" && param!=" " && param!="-" && param!="_";
}
