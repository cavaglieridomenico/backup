export interface ClientProfileData {
  firstName: string,
  lastName: string,
  phone: string,
  userProfileId: string
}

export interface Address {
  receiverName: string,
  addressId: string,
  postalCode: string,
  city: string,
  state: string,
  country: string,
  street: string,
  number: string,
  neighborhood: string,
  complement: string,
  reference: string
}

export interface CustomApp {
  id: number,
  major: string,
  fields: string[]
}

export interface Order {
  clientProfileData: ClientProfileData,
  shippingData: {
    address: Address
  }
  customData: {
    customApps: CustomApp[]
  }
}
