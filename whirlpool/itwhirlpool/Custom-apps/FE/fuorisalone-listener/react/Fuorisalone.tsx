// @ts-nocheck
import React from 'react'
import { canUseDOM } from 'vtex.render-runtime'

interface Data {
  event?: string
  status?: string
  userType?: string
  contentGrouping?: string
  pageType?: string
}

const Fuorisalone = () => {
  return (
    <>
      <div id="fuorisalone-custom-listener" />
    </>
  )
}

export default Fuorisalone

if (canUseDOM) {
  window.addEventListener('message', function (evt) {
    const data: Data = {
      event: 'Outbound Clicks',
      eventCategory: 'Outbound',
      eventAction: '',
      eventLabel: '',
      // status: 'anonymous',
      // userType: 'prospect',
      // contentGrouping: 'Event',
    }

    switch (evt.data) {
      case 'Brera':
        data.eventAction = 'Go to google.com'
        data.eventLabel =
          'https://www.google.com/maps/place/Via+delle+Erbe,+2,+20121+Milano+MI/@45.4709983,9.1838849,17z/data=!3m1!4b1!4m5!3m4!1s0x4786c14cef12fbe3:0x4bccbc4063d2178a!8m2!3d45.4709983!4d9.1838849'
        // data.pageType = 'Brera'
        window.dataLayer.push(data)
        break

      case 'Statale':
        data.eventAction = 'Go to google.com'
        data.eventLabel =
          'https://www.google.com/maps/place/Via+Festa+del+Perdono,+7,+20122+Milano+MI/@45.460342,9.1919411,17z/data=!3m1!4b1!4m5!3m4!1s0x4786c6a8820c6153:0xfeb269174590b24!8m2!3d45.460342!4d9.1941298'
        // data.pageType = 'Statale'
        window.dataLayer.push(data)
        break

      case 'socialInstagram':
        data.eventAction = 'Go to instagram.com'
        data.eventLabel = 'https://www.instagram.com/whirlpool_italia/'
        // data.pageType = 'Instagram'
        window.dataLayer.push(data)
        break

      case 'socialFacebook':
        data.eventAction = 'Go to facebook.com'
        data.eventLabel = 'https://www.facebook.com/WhirlpoolItalia/'
        // data.pageType = 'Facebook'
        window.dataLayer.push(data)
        break

      default:
        break
    }
  })
}
