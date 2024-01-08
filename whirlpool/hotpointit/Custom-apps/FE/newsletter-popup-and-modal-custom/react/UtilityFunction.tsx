module FetchFunction {
  export const getUser = () => {
    return fetch("/api/sessions?items=*", {
      method: "GET",
      headers: {},
    }).then((response) => response.json());
  };

  export const getIsAlreadyOptin = (
    email: string
  ) => {
    return fetch("/_v/wrapper/api/user/email/userinfo?email="+ email, {
      method: "GET",
    }).then((response) => response.json());
  };
}
export default FetchFunction;
