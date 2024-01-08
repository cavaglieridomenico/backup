import { canUseDOM } from "vtex.render-runtime";

import type { PixelMessage } from "./typings/events";

export function handleEvents(e: PixelMessage) {
  console.log("new pixel alma")
  switch (e.data.eventName) {
    case "vtex:pageView": {
      break;
    }

    default: {
      break;
    }
  }
}

if (canUseDOM) {
  window.addEventListener("message", handleEvents);
}