// @ts-ignore
export default async function fetchRequest({ uri, apiKey, apiToken }) {

	const response = await fetch(`${uri}`, {
		headers: {
			'X-VTEX-API-AppKey': apiKey,
			'X-VTEX-API-AppToken': apiToken,
		},
		method: 'GET',
	})
	return await response.json()

}
