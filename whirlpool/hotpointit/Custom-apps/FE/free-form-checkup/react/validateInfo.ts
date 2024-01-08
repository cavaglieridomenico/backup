interface ErrorsObject {
  [key: string]: any
}

export default function validateInfo(values: any, applianceDatas: any) {
  let errors: ErrorsObject = {}

  if (!values.firstName.trim()) {
    errors.firstName = 'Questo valore non dovrebbe essere vuoto.'
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'Questo valore non dovrebbe essere vuoto.'
  }
  if (!values.address.trim()) {
    errors.address = 'Questo valore non dovrebbe essere vuoto.'
  }
  if (!values.cap.trim()) {
    errors.cap = 'Questo valore non dovrebbe essere vuoto.'
  } else if (!/^[0-9]{5}$/.test(values.cap)) {
    errors.cap = 'Il CAP inserito non è valido (5 cifre)'
  }
  if (!values.city.trim()) {
    errors.city = 'Questo valore non dovrebbe essere vuoto.'
  }
  if (!values.email) {
    errors.email = 'Questo valore non dovrebbe essere vuoto.'
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "L'email inserita non è valida"
  }
  if (!values.email2) {
    errors.email2 = 'Questo valore non dovrebbe essere vuoto.'
  } else if (values.email2 !== values.email) {
    errors.email2 = 'Le email non combaciano'
  }
  if (!values.phone) {
    errors.phone = 'Questo valore non dovrebbe essere vuoto.'
  } else if (!/3\d{2}[\. ]??\d{6,7}$/.test(values.phone)) {
    errors.phone = 'Il numero di telefono inserito non è valido'
  }
  errors.matricola = applianceDatas.map(appliance =>
    appliance.register.trim() == ''
      ? 'Questo valore non dovrebbe essere vuoto.'
      : appliance.register.length > 12
      ? 'Per favore, inserisci massimo 12 cifre'
      : null
  )
  errors.date = applianceDatas.map(appl =>
    appl.purchase_date == '' ? 'Questo valore non dovrebbe essere vuoto.' : null
  )

  if (
    errors.matricola.filter(error => error == null).length ==
    errors.matricola.length
  ) {
    errors.matricola = null
  }
  if (errors.date.filter(error => error == null).length == errors.date.length) {
    errors.date = null
  }

  return errors
}
