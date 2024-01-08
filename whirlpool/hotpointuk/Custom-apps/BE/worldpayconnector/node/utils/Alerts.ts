export function sendAlert(ctx: Context, subject: string, message?: string) {
  ctx.clients.masterdata.createDocument({
    dataEntity: 'AL',
    fields: {
      subject,
      message
    }
  }).catch((err) => { console.log(err) })
}
