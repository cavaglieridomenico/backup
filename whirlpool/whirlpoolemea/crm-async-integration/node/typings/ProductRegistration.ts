export interface ProductRegistrationReq {
  appliance_data: ApplianceData[]
  person_data: PersonData
  address_data: AddressData
  mkt_data: MKTData
}

interface ApplianceData {
  category: string
  product_id: string
  commercial_code?: string
  register: string
  purchase_date: string
}

interface PersonData {
  title_key?: string
  firstname: string
  lastname: string
  tradePolicy?: string
  accessCode?: string
}

interface AddressData {
  email: string
  street: string
  street_int?: string
  cap: string
  city: string
  province?: string
  telephone?: string
}

interface MKTData {
  eu_consumer_brand: boolean
  eu_consumer_prv: boolean
  eu_consumer_age?: string
  eu_cu_segmentation?: string
}
