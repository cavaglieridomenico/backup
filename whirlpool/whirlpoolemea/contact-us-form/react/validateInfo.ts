interface ErrorsObject {
  [key: string]: any
}

export default function validate(values: any, errEmpty: any, errEmail: any, errZip: any, regexZipCode: any, isTelephoneRequired: boolean) {

  const regex = new RegExp(regexZipCode);

  let errors: ErrorsObject = {};

  if (!values.Reason.trim()) {
    errors.Reason = errEmpty
  }
  if (!values.Name.trim()) {
    errors.Name = errEmpty
  }
  if (!values.Surname.trim()) {
    errors.Surname = errEmpty
  }
  if (!values.Address.trim()) {
    errors.Address = errEmpty
  }
  if (!values.ZipCode.trim()) {
    errors.ZipCode = errEmpty
  }
  //cap e zipcode error 400 con gaetano
  else if (regexZipCode) {
    if (regex.test(values.ZipCode)) { errors.ZipCode = errZip }
  }
  if (!values.City.trim()) {
    errors.City = errEmpty
  }
  if (!values.Email.trim()) {
    errors.Email = errEmpty
  } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
    errors.Email = errEmail
  }
  if (!values.UserMessage.trim()) {
    errors.UserMessage = errEmpty
  }
  if (isTelephoneRequired && !values.Phone.trim()) {
    errors.Phone = errEmpty
  }

  return errors
}
