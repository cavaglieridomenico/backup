export interface Checkup3Year {
    appliance_data?: (ApplianceDataEntity)[] | null;
    person_data: PersonData;
    address_data: AddressData;
    mkt_data: MktData;
  }
  export interface ApplianceDataEntity {
    product_id: string;
    commercial_code: string;
    purchase_date: string;
    register: string;
    category: string;
  }

  export interface PersonData {
    firstname: string;
    lastname: string;
    title_key: string;
  }
  export interface AddressData {
    email: string;
    street: string;
    street_int: string;
    cap: string;
    city: string;
    province: string;
    telephone: string;
  }
  export interface MktData {
    eu_consumer_brand: string;
    eu_consumer_prv: string;
    eu_consumer_age: string;
    eu_cu_segmentation: string;
  }
  
  