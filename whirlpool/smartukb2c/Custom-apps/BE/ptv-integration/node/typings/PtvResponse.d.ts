export interface ptvResponse{
      housenumber: string,
      housename: String,
      subBuilding: String,
      address1: String,
      district: String,
      city: String,
      state: String,
      noLookUpState: boolean,
      zip: String,
      id: integer,
      preview: String,
}

export interface ptvVtex{
      addressId: String,
      postalCode: String,
      city: String,
      state: String,
      country: String,
      street: String,
      number: String,
      neighborhood: String,
      complement: null,
      reference: null
}
