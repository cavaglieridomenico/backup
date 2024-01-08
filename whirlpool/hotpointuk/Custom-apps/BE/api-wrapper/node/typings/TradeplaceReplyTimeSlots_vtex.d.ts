export interface TradeplaceReplyVtex {
    NextDayUnavailable : boolean,
    nextDayDeliveryWindow: {
        startDateUTC: String,
        endDateUTC: String,
    },
    availableDeliveryWindows: 
    [{
        startDateUTC: String,
        endDateUTC: String,
    }]
}

export interface VtexGasTradeplace{
    isGasproduct: boolean,
    availableDeliveryWindows:  Array<{ startDateUTC : string, endDateUTC:string }>
    
}