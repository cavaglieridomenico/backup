import { canUseDOM } from 'vtex.render-runtime'
import { sendUserEvents } from './src/user/user'
import { sendProductEvents } from './src/product/product'
import { PixelMessage } from './typings/events'
import { sendPageEvents } from './src/page/page'
import { sendSearchEvents } from './src/search/search'
import { sendSparePartsEvents } from './src/spareparts/spareparts'
import { sendCartAndCheckoutEcommerceEvents } from './src/checkout/checkout'
import { sendErrorEvents } from './src/error/error'

// no-op for extension point
export default function() {
  return null
}

export function handleEvents(e: PixelMessage) {
  if (!e?.data?.eventName) return //discarding all messages that are not GA events
  sendPageEvents(e)
  sendErrorEvents(e)
  sendUserEvents(e)
  sendProductEvents(e)
  sendSearchEvents(e)
  sendSparePartsEvents(e)
  sendCartAndCheckoutEcommerceEvents(e)
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
