 const weekDays = (shortDay: string) => {
    if(shortDay == "Mon") return "Monday"
    if(shortDay == "Tue") return "Tuesday"
    if(shortDay == "Wed") return "Wednesday"
    if(shortDay == "Thu") return "Thursday"
    if(shortDay == "Fri") return "Friday"
    if(shortDay == "Sat") return "Saturday"
    if(shortDay == "Sun") return "Sunday"

    return "" 
}

 const monthDays = (shortMonth: string) => {
    if(shortMonth == "Jan") return "January"
    if(shortMonth == "Feb") return "February"
    if(shortMonth == "Mar") return "March"
    if(shortMonth == "Apr") return "April"
    if(shortMonth == "May") return "May"
    if(shortMonth == "Jun") return "June"
    if(shortMonth == "Jul") return "July"
    if(shortMonth == "Aug") return "August"
    if(shortMonth == "Sep") return "Semptember"
    if(shortMonth == "Oct") return "October"
    if(shortMonth == "Nov") return "November"
    if(shortMonth == "Dec") return "December"

    return ""
}

export const formatDate = (sDate: string, eDate: string) => {
    let startDate = new Date(sDate).toUTCString().toString().split(" ")
    let endDate = new Date(eDate).toUTCString().toString().split(" ");
    let weekday = startDate[0].replace(",", "")
    let month = startDate[2]
    let year = startDate[3]
    let startHour = startDate[4].substring(0,5)
    let endHour = endDate[4].substring(0,5)
    let dayNumber = startDate[1]
    return `${weekDays(weekday)}, ${dayNumber} ${monthDays(month)} ${year}, between ${startHour} and ${endHour}`
  }