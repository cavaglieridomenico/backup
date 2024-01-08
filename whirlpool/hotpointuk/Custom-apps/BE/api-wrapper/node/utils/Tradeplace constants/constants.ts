import { ProductAvailabilityRequestLineItemType, TradeplaceRequest } from "../../typings/TradeplaceRequest"

export const docTypesTP : any = {
	"TP" : '<!DOCTYPE TradeplaceMessage SYSTEM "http://xml.tradeplace.com/schemas/TradeXML/2.0.0/TradeXML.dtd">'
}

export const defaultTradeplaceRequest: TradeplaceRequest = {
	TradeplaceMessage:{
		$: 
		{
			xmlns: "http://xml.tradeplace.com/schemas/TradeXML/1.0.0/TradeXML.dtd",
			productionMode: "test"
		},
		TransportEnvelope:
		{
			Routing:
			{
				To: "indesit.uk@tradeplace.com",
				From: "hotpoint_d2c@tradeplace.com",
				Forwarder: "hotpoint_d2c@tradeplace.com"
			},
				TradeplaceMessageVersion: "2.1.11",
				TradeplaceTransportVersion: "1.1.0",
				UniqueTransportID: "d0ea04b6-909f-4409-9d23-eb3d4a05d382",
				CreationDate:
				{
					Year: 0,
					Month: "",
					Day: "",
					Hour: 0,
					Minute: 0,
					Second: 0
				},
				TransportCount: "1",
				DocumentClassification: "ProductAvailabilityRequest",
				ReplyDocumentClassification: "ProductAvailabilityReply"
		},
		BusinessMessage:
		{
			ProductAvailabilityRequest:
			{
				ProductAvailabilityRequestHeader:
				{
					CustomerCode:
					{
                        _:"HOTPOINTUK",
						$:
                        {
							customerCodeQualifier: "OEM"
						}
					},
					CountryCode: "GB",
                    LanguageCode: "en",
					SellerCode: "hotpoint_d2c@tradeplace.com",
					OrderType: "HD",
					RequestedDeliveryDate:
					{
						Year: 0,
						Month: "",
						Day: ""
					},
					ShipToParty:
					{
						$:
						{
							shipToPartyCodeQualifier:"OEM"
						},
						Party:
						{
							Code: ["HOTPOINTUK"],
							Name: [],
							Street: [],
							District: "",
							PostalCode: "",
							City: "",
							CountryCode: "",
							PhoneNumber: ""
						}
					}			
				},
					ProductAvailabilityRequestLineItems: 
				{
					ProductAvailabilityRequestLineItem : []
                }
            }
        }
    }
}

export const defaultProductLineItem: ProductAvailabilityRequestLineItemType = {

    Material: {
        $ : {
            materialQualifier : ""
        },
        _ : ""

    },
    Quantity : 0, 
	DeliveryService : ''

}

export const defaultTradeplaceReplyVtex = {
    availableDeliveryWindows: []
}