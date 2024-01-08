interface ErrorsObject {
  [key: string]: any;
}

export default function setPasswordFormValidation(
  values: any,
  messages: any,
  secondPassword: string,
  regexes: any
) {
  let errors: ErrorsObject = {};

  //Access key validation
  if (!values.accessKey.trim()) {
    errors.accessKey = messages["store/custom-login.errors.empty"];
  } else if (values.accessKey.length != 6) {
    errors.accessKey = messages["store/custom-login.errors.invalidAccessCode"];
  }

  //Password validation
  if (!values.password.trim()) {
    errors.password = messages["store/custom-login.errors.empty"];
  } else if (
    !regexes.upperCaseRegex.test(values.password) ||
    !regexes.lowerCaseRegex.test(values.password) ||
    !regexes.numberRegex.test(values.password) ||
    values.password.length < 8
  ) {
    errors.password = messages["store/custom-login.errors.invalid-password"];
  } else if (values.password.includes(" ")) {
    errors.password =
      messages["store/custom-login.errors.invalid-password-spaces"];
  }

  //SecondPassword validation
  if (!secondPassword.trim()) {
    errors.password2 = messages["store/custom-login.errors.empty"];
  } else if (secondPassword != values.password) {
    errors.password2 = messages["store/custom-login.errors.invalid-password2"];
  }

  return errors;
}
