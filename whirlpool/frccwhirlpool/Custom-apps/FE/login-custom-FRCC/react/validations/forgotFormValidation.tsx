interface ErrorsObject {
  [key: string]: any;
}

export default function forgotFormValidation(values: any, messages: any) {
  let errors: ErrorsObject = {};

  //Email validation
  if (!values.email.trim()) {
    errors.email = messages["store/custom-login.errors.empty"];
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = messages["store/custom-login.errors.invalid-email"];
  }

  return errors;
}
