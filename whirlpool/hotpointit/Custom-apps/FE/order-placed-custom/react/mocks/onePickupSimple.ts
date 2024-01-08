export const orderGroupQuery = {
  orderGroup: {
    orders: [
      {
        allowCancellation: true,
        orderId: '905691315299-01',
        deliveryParcels: [],
        pickUpParcels: [
          {
            address: {
              addressType: 'pickup',
              receiverName: 'Victor Hugo',
              state: 'RJ',
              street: 'Rua Marquês de Abrantes',
              number: '5',
              city: 'Rio de Janeiro',
              postalCode: '22230061',
              neighborhood: 'Flamengo',
              complement: '',
              country: 'BRA',
            },
            price: 0,
            pickupFriendlyName: 'Loja no Flamengo do Rio de Janeiro',
            seller: '1',
            items: [
              {
                id: '307',
                skuName: 'Tipo 1',
                name: 'Pickup múltiplas SLAs RJ Tipo 1',
                price: 30000,
                listPrice: 50000,
                isGift: false,
                quantity: 1,
                attachments: [],
                bundleItems: [],
                seller: '1',
                imageUrl:
                  'http://vtexgame1.vteximg.com.br/arquivos/ids/155657-55-55/prancha.jpg?v=636657805466200000',
                detailUrl:
                  '/teste-so-delivery-copy-256--copy-257--copy-258--copy-275--copy-276-/p',
                measurementUnit: 'un',
                unitMultiplier: 1,
              },
            ],
            selectedSla: 'retirada na loja múltiplos pontos RJ (1f848d7)',
            selectedSlaObj: {
              id: 'retirada na loja múltiplos pontos RJ (1f848d7)',
              name: 'retirada na loja múltiplos pontos RJ (1f848d7)',
              shippingEstimate: '11bd',
              deliveryWindow: null,
              price: 0,
              deliveryChannel: 'pickup-in-point',
              pickupStoreInfo: {
                additionalInfo: 'não entre de sunga\nnão entre sem sunga',
                address: {
                  addressId: 'vtexgame1:1f848d7',
                  addressType: 'pickup',
                  receiverName: null,
                  street: 'Rua Marquês de Abrantes',
                  number: '5',
                  city: 'Rio de Janeiro',
                  state: 'RJ',
                  postalCode: '22230061',
                  neighborhood: 'Flamengo',
                  complement: '',
                  country: 'BRA',
                },
                friendlyName: 'Loja no Flamengo do Rio de Janeiro',
                isPickupStore: true,
              },
            },
            shippingEstimate: '11bd',
            shippingEstimateDate: '2019-02-08T17:22:41.5635196Z',
            deliveryWindow: null,
            deliveryChannel: 'pickup-in-point',
            selectedSlaType: 'pickup-in-point',
          },
        ],
        takeAwayParcels: [],
        items: [
          {
            id: '307',
            skuName: 'Tipo 1',
            name: 'Pickup múltiplas SLAs RJ Tipo 1',
            price: 30000,
            listPrice: 50000,
            isGift: false,
            quantity: 1,
            attachments: [],
            bundleItems: [],
            seller: '1',
            imageUrl:
              'http://vtexgame1.vteximg.com.br/arquivos/ids/155657-55-55/prancha.jpg?v=636657805466200000',
            detailUrl:
              '/teste-so-delivery-copy-256--copy-257--copy-258--copy-275--copy-276-/p',
            measurementUnit: 'un',
            unitMultiplier: 1,
          },
        ],
        sellers: [
          {
            id: '1',
            name: 'vtexgame1',
          },
        ],
        totals: [
          {
            id: 'Items',
            name: 'Total dos Itens',
            value: 30000,
          },
          {
            id: 'Discounts',
            name: 'Total dos Descontos',
            value: 0,
          },
          {
            id: 'Shipping',
            name: 'Total do Frete',
            value: 0,
          },
          {
            id: 'Tax',
            name: 'Total da Taxa',
            value: 0,
          },
        ],
        clientProfileData: {
          email: 'victorhmp@mailinator.com',
          firstName: 'Victor',
          lastName: 'Hugo',
          document: '18430995005',
          documentType: 'cpf',
          phone: '+551112340909',
        },
        paymentData: {
          transactions: [
            {
              transactionId: '7D599682F7274DCC9FD34B8386F12123',
              payments: [
                {
                  id: '533EDB55AB94480DA73AC26682D1E65E',
                  paymentSystem: '4',
                  paymentSystemName: 'Mastercard',
                  value: 30000,
                  installments: 1,
                  lastDigits: '1234',
                  group: 'creditCard',
                  dueDate: null,
                  url: null,
                  bankIssuedInvoiceBarCodePNG: null,
                  bankIssuedInvoiceIdentificationNumber: null,
                  connectorResponses: null,
                },
              ],
            },
          ],
        },
        storePreferencesData: {
          countryCode: 'BRA',
          currencyCode: 'BRL',
        },
        creationDate: '2019-01-24T17:21:30.9124556Z',
        value: 30000,
      },
    ],
    totalPickUpParcels: [
      {
        address: {
          addressType: 'pickup',
          receiverName: 'Victor Hugo',
          state: 'RJ',
          street: 'Rua Marquês de Abrantes',
          number: '5',
          city: 'Rio de Janeiro',
          postalCode: '22230061',
          neighborhood: 'Flamengo',
          complement: '',
          country: 'BRA',
        },
        price: 0,
        pickupFriendlyName: 'Loja no Flamengo do Rio de Janeiro',
        seller: '1',
        items: [
          {
            id: '307',
            skuName: 'Tipo 1',
            name: 'Pickup múltiplas SLAs RJ Tipo 1',
            price: 30000,
            listPrice: 50000,
            isGift: false,
            quantity: 1,
            attachments: [],
            bundleItems: [],
            seller: '1',
            imageUrl:
              'http://vtexgame1.vteximg.com.br/arquivos/ids/155657-55-55/prancha.jpg?v=636657805466200000',
            detailUrl:
              '/teste-so-delivery-copy-256--copy-257--copy-258--copy-275--copy-276-/p',
            measurementUnit: 'un',
            unitMultiplier: 1,
          },
        ],
        selectedSla: 'retirada na loja múltiplos pontos RJ (1f848d7)',
        selectedSlaObj: {
          id: 'retirada na loja múltiplos pontos RJ (1f848d7)',
          name: 'retirada na loja múltiplos pontos RJ (1f848d7)',
          shippingEstimate: '11bd',
          deliveryWindow: null,
          price: 0,
          deliveryChannel: 'pickup-in-point',
          pickupStoreInfo: {
            additionalInfo: 'não entre de sunga\nnão entre sem sunga',
            address: {
              addressId: 'vtexgame1:1f848d7',
              addressType: 'pickup',
              receiverName: null,
              street: 'Rua Marquês de Abrantes',
              number: '5',
              city: 'Rio de Janeiro',
              state: 'RJ',
              postalCode: '22230061',
              neighborhood: 'Flamengo',
              complement: '',
              country: 'BRA',
            },
            friendlyName: 'Loja no Flamengo do Rio de Janeiro',
            isPickupStore: true,
          },
        },
        shippingEstimate: '11bd',
        shippingEstimateDate: '2019-02-08T17:22:41.5635196Z',
        deliveryWindow: null,
        deliveryChannel: 'pickup-in-point',
        selectedSlaType: 'pickup-in-point',
      },
    ],
    totalDeliveryParcels: [],
    totalTakeAwayParcels: [],
  },
}