var days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const data = new Date()
const data2 = new Date()

function getDataWithoutTimeZone(data){
	let plusIndex = data.indexOf('+')
	return plusIndex !== -1 ? data.substr(0,plusIndex) : data
}

export function getDeliveryDate(data, data2) {
	let start = getDataWithoutTimeZone(data)
	let end = getDataWithoutTimeZone(data2)
	let dataOriginal = new Date(start)
	let dataOriginal2 = new Date(end)
	var day = days[dataOriginal.getDay()];
	var month = months[dataOriginal.getMonth()] ;
	var year = dataOriginal.getFullYear()
	return  day + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year + ' tra le ore '  + dataOriginal.getHours() +  ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) + ' e le ore ' + dataOriginal2.getHours()+ ':' + (dataOriginal2.getMinutes() === 0 ? '00' : dataOriginal2.getMinutes())
}
export function getCreationDate(data) {
	let dataOriginal = new Date(data)
	var day = days[dataOriginal.getDay()];
	var month = months[dataOriginal.getMonth()];
	var year = dataOriginal.getFullYear()
	return  day + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year
}
