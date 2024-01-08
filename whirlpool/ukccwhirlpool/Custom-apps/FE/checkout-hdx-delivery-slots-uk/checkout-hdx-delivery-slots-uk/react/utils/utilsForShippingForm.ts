export const config = {
  URLhotpointPTV: '/_v/wrapper/api/ptv/',
  defaultCountry: 'GBR',
  defaultAddressType: 'residential',
  referenceField: 'reference'
};
export function filterPostalCodeUK(currPostCode: string) {
  let postalCode = currPostCode;
  console.log("CHECKING if postalCode is correct...");
  if (postalCode && postalCode.indexOf(" ") < 0) {
    switch (postalCode.length) {
      case 7: {
        postalCode = postalCode.substring(0, 4) + ' ' + postalCode.substring(4);
        break;
      }
      case 6: {
        postalCode = postalCode.substring(0, 3) + ' ' + postalCode.substring(3);
        break;
      }
      case 5: {
        postalCode = postalCode.substring(0, 2) + ' ' + postalCode.substring(2);
        break;
      }
      default: {
        break;
      }
    }
    if (postalCode !== currPostCode) {
      console.log("postalCode updated");
    }
  }
  return postalCode.trim();
}

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
export function isValidPostcode(p: any) {
  var postcodeRegEx = /^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$/i;
  return postcodeRegEx.test(p);
}

export const getTitleCase = (text: string) => {
  if (text?.length >= 1) {
    text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  }
  return text;
};

export const CSS_HANDLES = [
  "stairsInputWrapper",
  "stairsPreText",
  "singleStreet",
  "streetListWrapper",
  "shippingInput",
  "goToPayentButton",
  "loaderWrapper"
] as const