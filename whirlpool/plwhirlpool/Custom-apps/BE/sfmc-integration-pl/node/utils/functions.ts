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
  if (typeof err?.response?.data === 'object') return err?.response?.data.message
  else if (err?.response?.data) return err?.response?.data
  else if (err.message) return err.message
  else return err
}

export function isValid(param: any): Boolean {
  return param != undefined && param != null && param != "undefined" && param != "null" && param != "" && param != " " && param != "-" && param != "_";
}
