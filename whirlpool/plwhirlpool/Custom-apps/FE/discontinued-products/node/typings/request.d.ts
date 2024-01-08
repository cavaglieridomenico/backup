import { RedirectType } from "../utils/constants";

export interface RequestRedirect {
  type: string
  createRedirect: string | boolean,
  productId: string,
  productLink: string
}
