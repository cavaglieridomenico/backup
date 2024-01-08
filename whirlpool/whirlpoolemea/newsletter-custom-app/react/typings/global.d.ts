export interface UserErrors {
  name: boolean;
  surname: boolean;
  email: boolean;
  optIn: boolean;
}
export type Status =
  | "LOADING"
  | "LOGIN_ERROR"
  | "REGISTERED_ERROR"
  | "SUCCESS"
  | "GENERIC_ERROR";

export type Method = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";
