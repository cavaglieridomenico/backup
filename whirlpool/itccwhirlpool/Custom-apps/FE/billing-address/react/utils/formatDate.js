var daysIT = [
	'Domenica',
	'Lunedì',
	'Martedì',
	'Mercoledì',
	'Giovedì',
	'Venerdì',
	'Sabato',
]
var daysEN = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
]
var monthsIT = [
	'Gennaio',
	'Febbraio',
	'Marzo',
	'Aprile',
	'Maggio',
	'Giugno',
	'Luglio',
	'Agosto',
	'Settembre',
	'Ottobre',
	'Novembre',
	'Dicembre',
]
var monthsEN = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]
const data = new Date()
const data2 = new Date()

function isoStringToDate(s) {
	var b = s.split(/\D/)
	return new Date(
		Date.UTC(b[0], --b[1], b[2], b[3] || 0, b[4] || 0, b[5] || 0, b[6] || 0),
	)
}

function getDataWithoutTimeZone(data) {
	let plusIndex = data.indexOf('+')
	return plusIndex !== -1 ? data.substr(0, plusIndex) : data
}

export function getDeliveryDate(data, data2) {
	const locale = __RUNTIME__.culture.locale

	let start = getDataWithoutTimeZone(data)
	let end = getDataWithoutTimeZone(data2)
	let dataOriginal = new Date(start)
	let dateIso = isoStringToDate(start)
	let dataOriginal2 = new Date(end)
	var day = locale == 'it-IT' ? daysIT[dateIso.getDay()] : daysEN[dateIso.getDay()]
	var month = locale == 'it-IT'
			? monthsIT[dateIso.getMonth()]
			: monthsEN[dateIso.getMonth()]
	var year = isoStringToDate(start).getFullYear()
	return (
		day +
		' ' +
		dataOriginal.getDate() +
		' ' +
		month +
		' ' +
		year +
		' tra le ore ' +
		dataOriginal.getHours() +
		':' +
		(dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) +
		' e le ore ' +
		dataOriginal2.getHours() +
		':' +
		(dataOriginal2.getMinutes() === 0 ? '00' : dataOriginal2.getMinutes())
	)
}
export function getCreationDate(data) {
	// const { culture } = useRuntime
	const locale = __RUNTIME__.culture.locale

	let dataOriginal = new Date(data)
	let dateIso = isoStringToDate(data)
	var day =
		locale == 'it-IT' ? daysIT[dateIso.getDay()] : daysEN[dateIso.getDay()]
	var month =
		locale == 'it-IT'
			? monthsIT[dateIso.getMonth()]
			: monthsEN[dateIso.getMonth()]
	var year = isoStringToDate(data).getFullYear()
	return day + ' ' + dataOriginal.getDate() + ' ' + month + ' ' + year
}
