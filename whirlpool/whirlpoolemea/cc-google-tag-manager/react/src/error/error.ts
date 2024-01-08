import push from '../../src/utils/push'
import { PixelMessage } from '../../typings/events'


export async function sendErrorEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case "vtex:errorMessage": {
        push({
          event: "errorMessage",
          eventCategory: "Error",
          eventAction: "Error Message",
          eventLabel: e.data.data,
        })
        break
      }
    }
}