var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','Dicember'];

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
export function getShippingDeliveryDateFromCreationDate(date,businessDays) {
	//Check shipping nextDay type
	// if(businessDays === 0) {
	// 	++businessDays
	// }
	let shippingDate = addBusinessDays(new Date(date), businessDays)
	let dateIso = isoStringToDate(shippingDate.toISOString())
	var day = days[dateIso.getDay()];
	var month = months[(dateIso.getMonth())] ;
	var year = isoStringToDate(shippingDate.toISOString()).getFullYear()
	return  day + ' ' + shippingDate.getDate() + ' ' +  month + ' ' + year
}

export function addBusinessDays(startDate, days) {
    if(isNaN(days)) {
        console.log("Value provided for \"days\" was not a number");
        return
    }
    if(!(startDate instanceof Date)) {
        console.log("Value provided for \"startDate\" was not a Date object");
        return
    }
    // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
    var dow = startDate.getDay();
    var daysToAdd = parseInt(days);
    // If the current day is Sunday add one day
    if (dow == 0)
        daysToAdd++;
    // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
    if (dow + daysToAdd >= 6) {
        //Subtract days in current working week from work days
        var remainingWorkDays = daysToAdd - (5 - dow);
        //Add current working week's weekend
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
            //Add two days for each working week by calculating how many weeks are included
            daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
            //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
            if (remainingWorkDays % 5 == 0)
                daysToAdd -= 2;
        }
    }
    startDate.setDate(startDate.getDate() + daysToAdd);
    return startDate;
}

export function getBusinessDays(businessDays) {
	let numbers = "";
	for(var i=0; i<businessDays.length; i++) {
		let k = businessDays.charAt(i)
		if(!isNaN(k)) {
			numbers += k
		}
	}
	if(numbers.length === 0) {
		return null
	}
	return parseInt(numbers)
}

export function getTimeFromDate(date) {
    let time = new Date(date).toLocaleTimeString('en',
                 { timeStyle: 'short', hour12: false, timeZone: 'UTC' });
    return time;
}

