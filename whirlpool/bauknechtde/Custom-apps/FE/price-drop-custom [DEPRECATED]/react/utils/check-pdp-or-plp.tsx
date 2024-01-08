
/* Check for button pricedrop, if in link there is code products and "?_q"
// that means we are on plp so the button will be invisible and inverse. */
const checkPdpOrPlp = {

  isPdp : (productId:any) => {
    if( window.location.href.includes(productId))
    {
      if(!window.location.href.includes("?_q")){
        {return true}
      }
      else
        {return false}
    }
    else
    {return false}
  }
}

export default checkPdpOrPlp
