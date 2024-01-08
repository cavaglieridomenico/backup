//@ts-nocheck

import dns from 'dns'
import { IncomingMessage } from 'http'
import { configs } from '../typings/configs'
import { authHeaders } from './constants'
import { GetHash } from './AuthenticationUtils'

export async function ValidateWorldpayNotification(ip: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.reverse(ip, (err, hostNames) => {
      if (err == null) {
        hostNames.forEach(hostname => {
          if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+worldpay\.com$/g.test(hostname))
            resolve(false)
        })
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

export function ValidateForwardedNotification(ctx: Context, appSettings: configs): boolean {
  try {
    return ctx.get(authHeaders.appkey) == appSettings.gcpappkey && GetHash(ctx.get(authHeaders.apptoken)) == appSettings.gcpapptoken
  } catch {
    return false
  }
}


export const ReadNotificationBody = (reqBody: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = ""
    reqBody.on('data', data => {
      body += data
    })

    reqBody.on('end', () => {
      resolve(body)
    })

    reqBody.on('error', (err) => {
      reject(err)
    })
  })
}
