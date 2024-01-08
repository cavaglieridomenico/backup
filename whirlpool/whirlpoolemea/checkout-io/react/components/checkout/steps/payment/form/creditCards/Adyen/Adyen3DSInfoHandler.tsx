//@ts-nocheck
import React, { useEffect } from "react"
import { Helmet } from "vtex.render-runtime"
import collectBrowserInfo from "./utils.js"
import { useRuntime } from "vtex.render-runtime"

const MAX_RETRIES = 3

//TO DO <script src="https://master—{account}.myvtex.com/_v/public/vtex.scripts-server/v1/load.js" type="text/javascript"></script>

const Adyen3DSInfoHandler: React.FC = () => {
	const { account } = useRuntime()

	const saveAdyen3DSInfo = (retry = 0) => {
		const browserInf = collectBrowserInfo()
		console.log("browserInf: ", browserInf)

		const requestObj = {
			browserInfo: {
				acceptHeader:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8",
				colorDepth: browserInf.colorDepth,
				javaEnabled: browserInf.javaEnabled,
				language: browserInf.language,
				screenHeight: browserInf.screenHeight,
				screenWidth: browserInf.screenWidth,
				timeZoneOffset: browserInf.timeZoneOffset,
				userAgent: browserInf.userAgent,
			},
			origin: window.location.origin,
		}

		//console.log("requestObj: ", requestObj)

		fetch("/_v3/api/save-checkout-info", {
			method: "POST",
			body: JSON.stringify(requestObj),
		})
			.then(res => res.text())
			.then(res => {
				console.log("save-checkout-info res: ", res)
			})
			.catch(err => {
				console.log("error: ", err)
				if (retry < MAX_RETRIES) {
					saveAdyen3DSInfo(retry + 1)
				}
			})
	}

	useEffect(() => {
		saveAdyen3DSInfo();
	}, [])

	return (
		<div id="adyen-3ds-info-handler">
			{<Helmet>
			</Helmet>}
		</div>
	)
}

export default Adyen3DSInfoHandler
