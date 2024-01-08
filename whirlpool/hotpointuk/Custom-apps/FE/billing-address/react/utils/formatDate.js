var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','Dicember'];

function isoStringToDate(s) {
  var b = s.split(/\D/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3]||0, b[4]||0, b[5]||0, b[6]||0));
}
export function getDeliveryDate(data, data2) {
	let dataOriginal = new Date(data)
	let dateIso = isoStringToDate(data)
	let dataOriginal2 = new Date(data2)
	var day = days[dateIso.getDay()];
	var month = months[(dateIso.getMonth())] ;
	var year = isoStringToDate(data).getFullYear()
	return  day + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year + ' tra le ore '  + dataOriginal.getHours() +  ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) + ' e le ore ' + dataOriginal2.getHours()+ ':' + (dataOriginal2.getMinutes() === 0 ? '00' : dataOriginal2.getMinutes())
}
export function getCreationDate(data) {
	let dataOriginal = new Date(data)
	let dateIso = isoStringToDate(data)
	var day = days[dateIso.getDay()];
	var month = months[(dateIso.getMonth())];
	var year = isoStringToDate(data).getFullYear()
	return  day + ',' + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year
}
