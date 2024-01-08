import React, { useEffect } from 'react'

interface ChatBotFormProps {}

const ChatBotForm: React.FC<ChatBotFormProps> = ({}) => {
	useEffect(() => {
		const script = document.createElement('script')
		const script2 = document.createElement('script')

		script.src =
			'https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.js'
		script2.src = '/arquivos/formSubmissionScript.js'
		script2.type = 'text/javascript'

		document.body.appendChild(script)
		document.body.appendChild(script2)

		var waitForEl = function (selector: any, callback: any) {
			let element = document?.querySelector(selector)
			if (
				element &&
				(window?.getComputedStyle(element)?.visibility == 'visible' ||
					document?.querySelector(selector)?.length > 0)
			) {
				callback()
			} else {
				setTimeout(function () {
					waitForEl(selector, callback)
				}, 100)
			}
		}

		waitForEl('#chatbot-form', function () {
			;(document.getElementById('chatbot-form') as any).innerHTML =
				'<form name="”whform”" onsubmit="submitForm();return false"> <table style="margin-top: 1rem;" align="center"> <tr> <td> <label for="name">Vor- und Nachname</label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="text" required id="name" name="user_name" /> </td> </tr> <tr> <td> <label for="address">Vollständige Adresse</label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="text" required id="address" name="user_adress" /> </td> </tr> <tr> <td> <label for="email">E-Mail Adresse</label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="email" required id="email" name="user_email" /> </td> </tr> <tr> <td> <label for="phone">Telefonummer</label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="tel" required id="phone" name="user_phone" /> </td> </tr> <tr> <td> <label for="purchasedate"> Kaufdatum des Geräts im Format TT/MM/JJJJ </label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="text" pattern="^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\\d{4}$" required id="purchasedate" name="purchase¬_date" /> </td> </tr> <tr> <td> <label for="ncnumber"> 12 NC-Nummer (12 stellig und nur Zahlen) </label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="text" pattern="^8[56][0-9]{10}$" required id="ncnumber" name="12nc_no" /> </td> </tr> <tr> <td> <label for="serial"> S/N Seriennummer (12 stellig und nur Zahlen) </label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="text" pattern="^(11|14|15|24|25|30|31|32|33|34|36|37|38|39|41|42|43|44|45|46|47|48|50|51|55|58|60|61|62|64|67|68|70|71|73|75|76|79|80|81|85|86|89|90|91|93|94|95|99|03|07)[0-9]{10}$" required id="serial" name="serial_no" /> </td> </tr> <tr> <td> <label for="icnumber">I. C. Code (12 stellig und nur Zahlen)</label> </td> </tr> <tr> <td> <input style="font-family: myriadLight; width: 100%; border: 1px solid #007d69" type="text" pattern="^[0-9]{12}$" required id="icnumber" name="ic_no" /> </td> </tr> <tr> <td colspan="2"> <input style="background: #007d69; color: white; padding: .5rem 1rem; border: none; border-radius: 0.2rem; margin-top: .5rem; cursor: pointer;" type="submit" name="”confirm”" value="Angaben bestätigen" /> </td> </tr> </table> </form>'
		})
	}, [])

	return <div id="chatbot-form"></div>
}

export default ChatBotForm
