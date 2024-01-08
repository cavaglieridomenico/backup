//@ts-nocheck
import React, { Component } from "react"

export class GooglePayPaymentApp extends Component {


	constructor(props: any) {
		super(props)
		this.parsedPayload = JSON.parse(this.props.appPayload)
	}

	componentWillMount() {
		this.injectScript(
			"worldpayjs",
			"https://payments.worldpay.com/resources/hpp/integrations/embedded/js/hpp-embedded-integration-library.js",
			this.handleOnLoad,
		)
	}

	handleOnLoad = () => {
		document.body.setAttribute("style", "overflow:hidden")
		const [language, country] = this.parsedPayload.locale.split("-")
		var customOptions = {
			iframeHelperURL: this.parsedPayload.helperPageUrl,
			iframeIntegrationId: "libraryObject",
			url: this.parsedPayload.paymentUrl,
			type: "iframe",
			inject: "immediate",
			target: "worldpay",
			accessibility: true,
			debug: false,
			language: language,
			country: country,
			preferredPaymentMethod: "VISA-SSL",
			resultCallback: this.resultCallbackFunction,
			flowCallback: (data: any) => {
				console.log("flowCallback - data: ", data)
			},
		}

		//initialise the library and pass options
		var libraryObject = new WPCL.Library()

		libraryObject.setup(customOptions)
	}

	resultCallbackFunction = (responseData: {
		order: { status: any; orderKey: string; error: any } | undefined
	}) => {
		if (responseData.order != undefined) {
			this.props?.saveResponse &&
				this.props.saveResponse({
					order: responseData.order.orderKey,
					status: responseData.order.status,
					error: JSON.stringify(responseData.order.error ?? ""),
				})
			switch (responseData.order.status) {
				case "success":
					this.respondTransaction(true)
					const orderId = responseData.order.orderKey
						.split("^")[1]
						.split("-")[0]
					//window.location.replace(`/checkout/orderPlaced/?og=${orderId}`)
					window.location.replace(`/checkout/gatewayCallback/${orderId}/Success`)
					break
				case "cancelled_by_shopper":
					fetch(this.parsedPayload.deniedUrl, {
						method: "POST",
					}).then(
						res => {
							if (res.ok) {
								this.respondTransaction(false)
								window.location.reload()
							} else {
								window.location.reload()
							}
						},
						err => {
							window.location.reload()
							//this.respondTransaction(false)
						},
					)
					break
				default:
					console.log(responseData.order.status)
			}
		}
	}

	injectScript = (
		id: string,
		src: string,
		onLoad: ((this: GlobalEventHandlers, ev: Event) => any) | null,
	) => {
		if (document.getElementById(id)) {
			return
		}
		const head = document.getElementsByTagName("head")[0]
		const js = document.createElement("script")
		js.id = id
		js.src = src
		js.async = true
		js.defer = true
		js.onload = onLoad

		head.appendChild(js)

		const css = document.createElement("link")
		css.rel = "stylesheet"
		css.href =
			"https://payments.worldpay.com/resources/hpp/integrations/embedded/css/hpp-embedded-integration-library.css"
		head.appendChild(css)
	}

	componentDidMount() {
		// In case you want to remove payment loading in order to show an UI.
		$(window).trigger("removePaymentLoading.vtex")
	}

	respondTransaction = (status: boolean) => {
		$(window).trigger("transactionValidation.vtex", [status])
	}

	render() {
		return (
			<div className={styles.prewrapper}>
				<div className={styles.wrapper} id="worldpay"></div>
			</div>
		)
	}
}
