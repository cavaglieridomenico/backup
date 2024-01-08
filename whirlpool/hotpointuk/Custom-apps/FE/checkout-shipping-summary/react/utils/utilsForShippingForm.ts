export const config = {
    URLhotpointPTV: '/_v/wrapper/api/ptv/',
    defaultCountry: 'GBR',
    defaultAddressType: 'residential',
    referenceField: 'reference'
  };

export const state = {
    hotpointPTV: {
      postalCode: '',
      addresses: [],
      locale: null,
      clearAddress: false,
      selectedAddress: {
        addressId: '',
        city: '',
        complement: '',
        withLiftOrStairs: false,
        country: '',
        neighborhood: '',
        number: '',
        postalCode: '',
        reference: '',
        state: '',
        street: '',
        receiverName: ''
      },
      lastPostalCode: '',
      inProgress: false
    }
  };

export const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };

  // tests to see if string is in correct UK style postcode: AL1 1AB, BM1 5YZ etc.
export function isValidPostcode(p:any) {
    var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
    return postcodeRegEx.test(p);
}

export const getTitleCase = (text:string) => {
  if (text?.length >= 1) {
    text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  }
  return text;
};