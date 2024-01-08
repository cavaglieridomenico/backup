var days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const data = new Date()
const data2 = new Date()

function isoStringToDate(s) {
  var b = s.split(/\D/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3]||0, b[4]||0, b[5]||0, b[6]||0));
}

function getDataWithoutTimeZone(data){
	let plusIndex = data.indexOf('+')
	return plusIndex !== -1 ? data.substr(0,plusIndex) : data
}

export function getDeliveryDate(data, data2) {
	let start = getDataWithoutTimeZone(data)
	let end = getDataWithoutTimeZone(data2)
	let dataOriginal = new Date(start)
	let dateIso = isoStringToDate(start)
	let dataOriginal2 = new Date(end)
	var day = days[dateIso.getDay()];
	var month = months[(dateIso.getMonth())] ;
	var year = isoStringToDate(start).getFullYear()
	return  day + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year + ' tra le ore '  + dataOriginal.getHours() +  ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) + ' e le ore ' + dataOriginal2.getHours()+ ':' + (dataOriginal2.getMinutes() === 0 ? '00' : dataOriginal2.getMinutes())
}
export function getCreationDate(data) {
	let dataOriginal = new Date(data)
	let dateIso = isoStringToDate(data)
	var day = days[dateIso.getDay()];
	var month = months[(dateIso.getMonth())];
	var year = isoStringToDate(data).getFullYear()
	return  day + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year
}
