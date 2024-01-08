import React, { Component } from 'react'
import styles from './index.css'

class WorldpayPaymentApp extends Component {
  constructor(props) {
    console.log("payment app")
    debugger
    super(props)
    this.parsedPayload = JSON.parse(this.props.appPayload)
    this.locale = window.location.href.split(".ch/")[1].split("/")[0]
  }

  componentWillMount() {
    this.injectScript(
      'worldpayjs',
      'https://payments.worldpay.com/resources/hpp/integrations/embedded/js/hpp-embedded-integration-library.js',
      this.handleOnLoad
    )
  }


  handleOnLoad = () => {
    console.log('script loaded')
    console.log(this.parsedPayload.helperPageUrl)
    var customOptions = {
      iframeHelperURL: this.parsedPayload.helperPageUrl,
      iframeIntegrationId: 'libraryObject',
      url: this.parsedPayload.paymentUrl,
      type: 'iframe',
      inject: 'immediate',
      target: 'worldpay',
      accessibility: true,
      debug: false,
      language: this.locale,
      country: 'ch',
      preferredPaymentMethod: 'VISA-SSL',
      resultCallback: this.resultCallbackFunction,
      flowCallback: (data) => {console.log(data)}
    }

    //initialise the library and pass options
    var libraryObject = new WPCL.Library()
    console.log('library created')
    libraryObject.setup(customOptions)
  }

  resultCallbackFunction = (responseData) => {
    console.log(JSON.stringify(responseData))
    if (responseData.order != undefined) {
      switch (responseData.order.status) {
        case 'success':
          console.log('success')
          this.respondTransaction(true)
          break
        case 'cancelled_by_shopper':
          console.log(responseData.order.status)
          fetch(this.parsedPayload.deniedUrl, {
            method: 'POST'
          }).then(
            () => {
              console.log('payment denied')
              this.respondTransaction(false)
            },
            (err) => {
              console.log('notification error')
              console.log(JSON.stringify(err))
              this.respondTransaction(false)
              location.reload()
            }
          )
          break
        default:
          console.log(responseData.order.status)
      }
    }
  }

  injectScript = (id, src, onLoad) => {
    if (document.getElementById(id)) {
      return
    }
    const head = document.getElementsByTagName('head')[0]
    const js = document.createElement('script')
    js.id = id
    js.src = src
    js.async = true
    js.defer = true
    js.onload = onLoad

    head.appendChild(js)

    const css = document.createElement('link')
    css.rel="stylesheet"
    css.href = "https://payments.worldpay.com/resources/hpp/integrations/embedded/css/hpp-embedded-integration-library.css"
    head.appendChild(css)
  }

  componentDidMount() {
    // In case you want to remove payment loading in order to show an UI.
    $(window).trigger('removePaymentLoading.vtex')
  }

  respondTransaction = (status) => {
    $(window).trigger('transactionValidation.vtex', [status])
  }

  render() {
    return (
        <div className = {styles.wrapper} id="worldpay"></div>
    )
  }
}

export default WorldpayPaymentApp
