
interface Serviceability_filters {
  service_type: string
  payment_mode: string
  order_types: string
}

interface TimeSlot_GetDS {
  start_date: string
  end_date: string
  requested_time_slot: string[]
}
export interface TimeSlot_ReserveDS {
  date: string
  start_time: string
  end_time: string
  slot_number?: number
}

interface Additional_field1 {
  additional_field1: string
}

export interface GSP_ItemSpecs {
  item_code: string
  item_reference_number: string
  item_name: string
  item_quantity: number
  item_height: number
  item_width: number
  item_length: number
  item_weight: number
  item_uom: string
  weight_uom: string
  info?: Additional_field1
}

export interface GSP_ItemSkuSpecs {
  sku_item_name: string
  sku_description: string
  sku_quantity: number
  sku_weight: string
  sku_volume: string
  sku_time_to_install?: number
  info?: Additional_field1
}

export interface GetSlotPayload {
  reference_number?: string
  fulfilment_center: string
  origin_code?: string
  origin_postal_code?: string
  origin_county_code?: string
  origin_address_line1?: string
  origin_address_line2?: string
  origin_city_code?: string
  origin_state_code?: string
  origin_country_code?: string
  destination_code?: string
  destination_postal_code?: string
  destination_county_code?: string
  destination_address_line1?: string
  destination_address_line2?: string
  destination_city_code?: string
  destination_state_code?: string
  destination_country_code?: string
  destination_latitude?: number
  destination_longitude?: number
  invoice_value?: number
  item_value?: number
  cod_amount?: number
  quantity?: number
  booking_date?: string
  storage_days?: number
  weight: number
  volume?: number
  length?: number
  breadth?: number
  height?: number
  additional_heads: any[]
  serviceability_filters?: Serviceability_filters
  timeslot: TimeSlot_GetDS
  items_list?: GSP_ItemSpecs[]
  sku_list?: GSP_ItemSkuSpecs[]
  info?: {}
}

export interface ReserveSlotPayload {
  reference_number: string
  carrier_code: string
  fulfilment_center: string
  origin_code?: string
  origin_postal_code?: string
  origin_city_code?: string
  origin_state_code?: string
  origin_country_code?: string
  destination_code?: string
  destination_postal_code?: string
  destination_county_code?: string
  destination_address_line1?: string
  destination_address_line2?: string
  destination_city_code?: string
  destination_state_code?: string
  destination_country_code?: string
  destination_latitude?: number
  destination_longitude?: number
  invoice_value?: number
  item_value?: number
  cod_amount?: number
  quantity?: number
  booking_date?: string
  storage_days?: number
  weight: number
  volume?: number
  length?: number
  breadth?: number
  height?: number
  additional_heads: any[]
  serviceability_filters?: Serviceability_filters
  service_time?: number
  confirmed_date?: string
  status: string
  status_code: string
  timeslot: TimeSlot_ReserveDS
  items_list?: GSP_ItemSpecs[]
  sku_list?: GSP_ItemSkuSpecs[]
  info?: {}
}

export interface CancelSlotPayload {
  reference_id: string
  order_number?: string
  carrier_code: string
  slot_id: string
  reason?: string
  info?: {}
}

export enum FB_STATUS {
  CREATED = "CREATED",
  SAP_MANAGED = "SAP_MANAGED",
  CANCELED = "CANCELED",
  USED = "USED",
  CANCELLATION_ERROR = "CANCELLATION_ERROR"
}

export enum FB_STATUS_CAMEL_CASE {
  CREATED = "Created"
}



