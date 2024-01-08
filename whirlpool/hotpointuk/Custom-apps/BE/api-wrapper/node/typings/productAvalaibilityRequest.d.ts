export interface OrderForm {
  userProfileId: String,
  items: Items[],
  shippingData: ShippingData,
  clientProfileData: ClientProfileData,
  customData: {
    customApps: [
    {
      fields: {
        shipTogether: String,
        connectedGas: String,
        tpError: String
      },
      id: String,
      major: number
    }
    ]
  }
}

export interface Items {
    id: number,
    productId: number,
    name: String,
    skuName: String,
    tax: number,
    price: number,
    listPrice: number,
    manualPrice: null,
    priceValidUntil: String,
    modalType: null,
    sellingPrice: number,
    isGift: boolean,
    attachments: any[],
    attachmentOfferings: any[],
    additionalInfo: {
      brandName: String,
      brandId: String,
      offeringInfo: null,
      categories: [
        {
          name: String,
          id: String
        }
      ]
    },
    preSaleDate: null,
    productCategories: {},
    productCategoryIds: String,
    defaultPicker: null,
    handlerSequence: number,
    handling: false,
    quantity: number,
    refId: String,
    rewardValue: number,
    seller: String,
    sellerChain: any[]
    itemAttachment: {
      content: {},
      name: null
    },
    imageUrl: String,
    detailUrl: String,
    components: any[],
    ean: String,
    bundleItems: any[],
    offerings: [{
      id: String,
      name: String,
      price: number,
      type: String
    }],
    priceTags: [],
    availability: String,
    measurementUnit: String,
    uniqueId: String,
    unitMultiplier: number
}

export interface shippingDataAddress {
      addressType: String,
      receiverName: String,
      addressId: String,
      postalCode: String,
      city: String,
      state: String,
      country: String,
      street: String,
      number: String,
      neighborhood: String,
      complement: String,
      reference: null
}

export interface ShippingData {
  attachmentId: String,
  address: {
    addressType: String,
    receiverName: String,
    addressId: String,
    postalCode: String,
    city: String,
    state: String,
    country: String,
    street: String,
    number: String,
    neighborhood: String,
    complement: String,
    reference: null
  },
  availableAddresses: [
    {
      addressType: String,
      receiverName: String,
      addressId: String,
      postalCode: String,
      city: String,
      state: String,
      country: String,
      street: String,
      number: String,
      neighborhood: String,
      complement: String,
      reference: null
    }
  ],
  logisticsInfo: [
    {
      itemIndex: number,
      selectedSla: String,
      slas: [
        {
          id: String,
          name: String,
          deliveryIds: [
            {
              courierId: String,
              warehouseId: String,
              dockId: String,
              courierName: String,
              quantity: number
            }
          ],
          shippingEstimate: String,
          shippingEstimateDate: null,
          lockTTL: null,
          availableDeliveryWindows: any[],
          deliveryWindow: null,
          price: number,
          tax: number
        }, {
          id: String,
          name: String,
          deliveryIds: [
            {
              courierId: String,
              warehouseId: String,
              dockId: String,
              courierName: String,
              quantity: number
            }
          ],
          shippingEstimate: String,
          shippingEstimateDate: null,
          lockTTL: null,
          availableDeliveryWindows: [
            {
              startDateUtc: String,
              endDateUtc: String,
              price: number,
              tax: number
            }, {
              startDateUtc: String,
              endDateUtc: String,
              price: number,
              tax: number
            }
          ],
          deliveryWindow: null,
          price: number,
          tax: number
        }
      ]
    }
  ],
  selectedAddresses: any[]
}

export interface ClientProfileData {
  phone: String,
  userProfileId: String,
  email: String,
  firstName: String,
  lastName: String
}
