import { canUseDOM } from 'vtex.render-runtime'
import { RenderRuntime } from 'vtex.render-runtime/react/typings/runtime'
import type { PixelMessage } from './typings/events'
import { UserData } from './typings/events'
import { checkPixelStatus, fetchDataFromCRM, isValid } from './utils/functions'

export default function () { return null }

export function handleEvents(e: PixelMessage) {
  try {
    const runtime = (window as any).__RUNTIME__ as RenderRuntime;
    if (e.data.eventName == "vtex:userData" && isValid(e.data.email) && e.data.isAuthenticated && (runtime.route.canonicalPath == "/" || runtime.route.canonicalPath == "/account")) {
      checkPixelStatus()
        .then(res => {
          if (res.status == 200) {
            fetchDataFromCRM((e.data as UserData).email!)
              .then(() => console.info("crm sync: OK"))
              .catch(() => console.error("crm sync: KO"))
          } else {
            console.warn("crm sync: KO, feature not enabled");
          }
        })
        .catch(() => console.error("crm sync: KO"))
    }
  } catch (err) {
    console.error("crm sync: KO")
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
