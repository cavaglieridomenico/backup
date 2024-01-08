interface ErrorsObject {
  [key: string]: any;
}

export default function signUpFormValidation(values: any, messages: any) {
  let errors: ErrorsObject = {};

  //Name validation
  if (!values.name.trim()) {
    errors.name = messages["store/custom-login.errors.empty"];
  }
  //Surname validation
  if (!values.surname.trim()) {
    errors.surname = messages["store/custom-login.errors.empty"];
  }
  //Email validation
  if (!values.email.trim()) {
    errors.email = messages["store/custom-login.errors.empty"];
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = messages["store/custom-login.errors.invalid-email"];
  }

  return errors;
}
