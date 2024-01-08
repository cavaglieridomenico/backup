export interface CreateUpdateCrmCustomerRequestType{
        BP_ID : string, 
        Email : string,
        Name : string, 
        Surname: string, 
        Country : string,
        Source : string, 
        MarketingTable : [MarketingTableItem?]
    
}

export interface MarketingTableItem {
    AttributeSet : string, 
    AttributeName : string,
    AttributeValue : string
}