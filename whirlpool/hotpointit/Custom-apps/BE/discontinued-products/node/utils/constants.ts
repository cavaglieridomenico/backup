export const DECLARER = "vtex.store@2.x";
export const TYPE = "userRoute";

export enum RedirectType {
  discontinued = "/discontinued",
  unsellable = "/unsellable"
};

export const discontinuedSpecification = "isDiscontinued";
export const sellableSpecification = "sellable";
export const regexSlug = /^\/([\w-]*)\/p$/m;
