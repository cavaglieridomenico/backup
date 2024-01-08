export function sendAlert(ctx: Context, entity: string, subject: string, message?: string) {
  ctx.clients.masterdata.createDocument({
    dataEntity: entity,
    fields: {
      subject,
      message
    }
  }).catch((err) => { console.log(err) })
}
