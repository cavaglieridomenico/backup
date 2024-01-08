import { canUseDOM } from 'vtex.render-runtime'
import { sendEnhancedEcommerceEvents } from './modules/enhancedEcommerceEvents'
// import { sendCartAndCheckoutEcommerceEvents } from './modules/cartAndCheckoutEcommerceEvents'
import { sendExtraEvents } from './modules/extraEvents'
import { PixelMessage } from './typings/events'

// no-op for extension point
export default function () {
  return null
}

export function handleEvents(e: PixelMessage) {
  // sendCartAndCheckoutEcommerceEvents(e)
  sendEnhancedEcommerceEvents(e)
  sendExtraEvents(e)
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
