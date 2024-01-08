export interface Address {
  addressId: number;
  postalCode: string;
  city: String;
  state: String;
  country: string;
  street: String;
  number: string;
  neighborhood: string | null;
  complement: any,
  reference: any
}
