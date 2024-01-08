export interface MKTAttrUK {
  AttributeSet: string
  AttributeName: string
  AttributeValue: string
}

export interface CreateConsumerUK {
  WEB_ID: string
  BP_ID?: string
  Prefix?: string
  Email: string
  Name: string
  Brand?: string
  Surname: string
  Country: string
  Source?: string
  Address_Line?: string
  Address_Line2?: string
  City?: string
  Province?: string
  Zip?: string
  Phone?: string
  MarketingTable?: MKTAttrUK[]
}

export interface CreateConsumerUK_Response {
  MT_CosumerRegistration_Response: {
    BP_ID: string
    Email: string
    Name: string
    Surname: string
    MessageType?: string
    MessageCode?: string
    MessageDescription?: string
  }
}
