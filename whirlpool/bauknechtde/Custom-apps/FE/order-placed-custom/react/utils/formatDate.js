var days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

function isoStringToDate(s) {
  var b = s.split(/\D/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3]||0, b[4]||0, b[5]||0, b[6]||0));
}
export function getCreationDate(data) {
	let dataOriginal = new Date(data)
	let dateIso = isoStringToDate(data)
	var day = days[dateIso.getDay()];
	var month = months[(dateIso.getMonth())] ;
	var year = isoStringToDate(data).getFullYear()
	return  day + ' ' + dataOriginal.getDate() + ' ' +  month + ' ' + year
}
