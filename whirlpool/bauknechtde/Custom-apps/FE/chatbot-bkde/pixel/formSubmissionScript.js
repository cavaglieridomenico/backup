async function submitForm() {
	// Get data from query string
	const queryParams = new URLSearchParams(document.location.search)
	const userId = queryParams.get('userId')
	const conversationId = queryParams.get('convId')
	const botId = queryParams.get('botId')
	// console.log(userId)
	// console.log(conversationId)
	// console.log(botId)
	const name = document.querySelector('input[id="name"]').value

	const address = document.querySelector('input[id="address"]').value

	const email = document.querySelector('input[id="email"]').value

	const phone = document.querySelector('input[id="phone"]').value

	const purchasedate = document.querySelector('input[id="purchasedate"]').value

	const ncnumber = document.querySelector('input[id="ncnumber"]').value

	const serial = document.querySelector('input[id="serial"]').value

	const icnumber = document.querySelector('input[id="icnumber"]').value

	// use correct domain for your region
	const domain =
		'https://lo.bc-intg.liveperson.net/thirdparty-services-0.1/webview'
	// encode auth string
	const authString = `${conversationId} || ${botId}`
	const auth = await sha256(authString)
	// console.log(auth)
	// const res =
  await postData(domain, auth, {
		botId,
		conversationId,
		userId,
		message: 'request successful',
		contextVariables: [
			{ name: 'name', value: name },
			{ name: 'address', value: address },
			{ name: 'email', value: email },
			{ name: 'phone', value: phone },
			{ name: 'purchasedate', value: purchasedate },
			{ name: 'ncnumber', value: ncnumber },
			{ name: 'serial', value: serial },
			{ name: 'icnumber', value: icnumber },
		],
	})
	// console.log(res)
}

async function postData(url = '', auth, data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		headers: {
			Authorization: auth,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	return await response.json()
}
