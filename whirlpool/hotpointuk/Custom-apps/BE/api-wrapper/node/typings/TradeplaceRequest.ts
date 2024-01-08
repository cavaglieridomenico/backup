export interface TradeplaceRequest{
	TradeplaceMessage:{
		$:{
			xmlns: String,
			productionMode: String
		},
		TransportEnvelope:
		{
			Routing:
			{
				To: String,
				From: String,
				Forwarder: String
			},
			TradeplaceMessageVersion: String,
			TradeplaceTransportVersion: String,
			UniqueTransportID: String,
			CreationDate:
			{
				Year: number,
				Month: String,
				Day: String,
				Hour: number,
				Minute: number,
				Second: number
			},
			TransportCount: String,
			DocumentClassification: String,
			ReplyDocumentClassification: String
		},
		BusinessMessage:
		{
			ProductAvailabilityRequest:
			{
				ProductAvailabilityRequestHeader:
				{
					CustomerCode:
					{
                        _:String,
						$:
                        {
							customerCodeQualifier: String
						}
					},
					CountryCode: String,
                    LanguageCode: String,
					SellerCode: String,
					OrderType: String,
					RequestedDeliveryDate:
                    {
                        Year: number,
						Month: String,
						Day: String
					},
					ShipToParty:
					{
						$:
						{
							shipToPartyCodeQualifier: String
						},
						Party:
						{
							Code: String[],
							Name: String[],
							Street: String[],
							District: String,
							PostalCode: String,
							City: String,
							CountryCode: String,
							PhoneNumber: String
						}		
					}			
				},
				ProductAvailabilityRequestLineItems: ProductAvailabilityRequestLineItemsType
			}	
		}
    }    
}

export interface ProductAvailabilityRequestLineItemsType 
{
    ProductAvailabilityRequestLineItem : [ProductAvailabilityRequestLineItemType?]
}

export interface ProductAvailabilityRequestLineItemType {
	Material: {
		$ : {
			materialQualifier : string
		},
		_ : String
	},
    Quantity : number,
	DeliveryService : string
}
