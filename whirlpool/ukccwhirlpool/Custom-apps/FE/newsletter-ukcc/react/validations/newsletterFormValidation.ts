interface ErrorsObject {
  [key: string]: any;
}

export default function newsletterFormValidation(values: any, messages: any) {
  let errors: ErrorsObject = {};

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //Name validation
  if (!values.name.trim()) {
    errors.name = messages["store/newsletter-custom-ukcc.emptyFieldError"];
  }
  //Surname validation
  if (!values.surname.trim()) {
    errors.surname = messages["store/newsletter-custom-ukcc.emptyFieldError"];
  }
  //Email validation
  if (!values.email.trim()) {
    errors.email = messages["store/newsletter-custom-ukcc.emptyFieldError"];
  } else if (!regex.test(values.email)) {
    errors.email = messages["store/newsletter-custom-ukcc.emailFieldError"];
  }

  return errors;
}
