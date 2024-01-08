interface ErrorsObject {
  [key: string]: any
}

export default function validate(values: any) {
  
  let errors: ErrorsObject = {}

  if (!values.Reason.trim()) {
    errors.Reason = "Cette valeur ne doit pas être vide."
  }
  if (!values.Name.trim()) {
    errors.Name = "Cette valeur ne doit pas être vide."
  }
  if (!values.Surname.trim()) {
    errors.Surname = "Cette valeur ne doit pas être vide."
  }
  if (!values.Address.trim()) {
    errors.Address = "Cette valeur ne doit pas être vide."
  }
  if (!values.ZipCode.trim()) {
    errors.ZipCode = "Cette valeur ne doit pas être vide."
  } else if (!/^(?:[0-8]\d|9[0-8])\d{3}$/.test(values.ZipCode)) {
    errors.ZipCode = "Le code postal saisi n'est pas valide"
  }
  if (!values.City.trim()) {
    errors.City = "Cette valeur ne doit pas être vide."
  }
  if (!values.Email.trim()) {
    errors.Email = "Cette valeur ne doit pas être vide."
  } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
    errors.Email = "Cette valeur n'est pas une adresse e-mail valide"
  }
  if (!values.UserMessage.trim()) {
    errors.UserMessage = "Cette valeur ne doit pas être vide."
  }

  return errors
}
