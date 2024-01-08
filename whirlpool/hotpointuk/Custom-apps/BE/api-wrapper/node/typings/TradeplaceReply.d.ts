export interface TradeplaceReply {
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
				Month: number,
				Day: number,
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
            ProductAvailabilityReply: 
            {
                ProductAvailabilityReplyHeader: 
                {
                    MessageType: String,
                    OrderType: String,
                    InquiryProcessingDate: 
                    {
                        Year: number,
                        Month: number,
                        Day: number,
                        Hour: number,
                        Minute: number,
                        Second: number
                    },
                    RequestedDeliveryDate: 
                    {
                        Year: number,
                        Month: number,
                        Day: number,
                    }
                },
                ProductAvailabilityReplyLineItems: 
                {
                    ProductAvailabilityReplyLineItem: 
                    [{
                        Material: 
                        {
                            _: String,
                            $: 
                            {
                                materialQualifier: String
                            }
                        },
                        QuantityRequested: 3,
                        LineStatus:
                        {
                            ErrorType: String,
                            ErrorCode: String,
                            ErrorCount: String
                            ErrorText: String
                        }
                        HDConfirmationSchedule: 
                        [{
                            HDConfirmationScheduleItem: 
                            [{
                                ConfirmedQuantity: Number,
                                EstimatedDate: 
                                {
                                    Year: String,
                                    Month: String,
                                    Day: String
                                },
                                DeliverySlots:
                                [{
                                    DeliverySlot:
                                    {
                                        FromTime:
                                        {
                                            Hour: String,
                                            Minute: String     
                                        },
                                        ToTime: 
                                        {
                                            Hour: String,
                                            Minute: String  
                                        }
                                    }
                                }]
                            }]
                        }]
                    }] 
                }
            }
        }               
    }
}