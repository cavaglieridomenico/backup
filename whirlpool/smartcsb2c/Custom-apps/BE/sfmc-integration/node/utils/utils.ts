// Add wait time
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function sendAlert(ctx: Context, subject: string, message?: string) {
  ctx.clients.masterdata.createDocument({
    dataEntity: 'AL',
    fields: {
      subject,
      message
    }
  }).catch(() => { })
}

export function formatErrorMessage(error: any): string {
  let message: string = 'No error message was returned';
  if (error?.response?.data?.Message) {
    message = error.response.data.Message;
  } else if (error?.response?.data) {
    message = error.response.data;
  } else if (error?.response?.data?.error?.message) {
    message = error.response.data.error.message;
  }
  // Build error response
  return JSON.stringify({
    error: true,
    status: error?.response?.status,
    errorType: error?.message,
    message
  })
}