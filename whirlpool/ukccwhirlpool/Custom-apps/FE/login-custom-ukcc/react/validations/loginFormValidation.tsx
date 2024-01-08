interface ErrorsObject {
  [key: string]: any;
}

export default function loginFormValidation(
  values: any,
  messages: any,
  regexes: any,
  isVIP: boolean,
  isAuth: boolean,
) {
  let errors: ErrorsObject = {};
  //Email validation
  if (!values.email.trim()) {
    errors.email = messages["store/custom-login.errors.invalid-email"];
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = messages["store/custom-login.errors.invalid-email"];
  }
  //Password validation
  if ((!isVIP && !isAuth) || (isAuth)) {
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
  }

  return errors;
}
