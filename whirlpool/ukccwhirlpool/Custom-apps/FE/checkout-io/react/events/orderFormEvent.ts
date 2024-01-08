const EVENT_NAME = 'OFUpdate'

export const sendEvent = (window:any, orderForm: any) => {
  const OFUpdate = new CustomEvent<any>(EVENT_NAME, {detail: orderForm});
  window.dispatchEvent(OFUpdate);
}

export const addListener = (window:any, callback: any) => {
  window.addEventListener(EVENT_NAME, callback)
}
