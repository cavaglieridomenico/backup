import { HDSAddress } from "../utils/constants";

export function getHDXPayload(visit: number = 0, reservation: number = 0, cancellation: number = 0): string {
  let payload = '' +
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:hdx="' + HDSAddress + '">' +
    '<soap:Header/>' +
    '<soap:Body>' +
    '<hdx:$InterfaceName>' +
    '<hdx:UserID>$UserID</hdx:UserID>' +
    '<hdx:Password>$Password</hdx:Password>' +
    '<hdx:SystemID>$SystemID</hdx:SystemID>' +
    '<hdx:CallReference>$CallReference</hdx:CallReference>' + // maxLength: 255
    '<hdx:ClientNum>$ClientNum</hdx:ClientNum>' +
    (
      (visit || reservation) ?
        (
          '<hdx:VisitXML>' +
          '<![CDATA[' +
          '<Visit ' +
          'OrderCode="$OrderId" ' +
          //'Title="$CustomerTitle" ' + // not mandatory
          //'Initials="$CustomerInitials" ' + // not mandatory
          'Surname="$CustomerSurname" ' + // maxLength: 30
          'Telephone="$Telephone" ' +
          'Email="$Email" ' + // not mandatory
          'Address="$Address" ' + // maxLength: 255
          'CountryCode="$CountryCode" ' + // e.g. GB, GBR, FR, FRA
          'GeoCode="$GeoCode" ' + // e.g. RH4 1UP, 75015
          //'SpecialInstructions=$SpecialInstructions ' + // not mandatory, maxLength: 255
          'VisitDate="$VisitDate" ' +
          'FixedTime="$FixedTime" ' +
          'TimeslotGroupNumber="$TimeslotGroupNumber" ' +
          'TimeslotNumber="$TimeslotNumber" ' +
          'EmergencyVisit="$EmergencyVisit" ' +
          'DeliverVariableTime="$DeliverVariableTime" ' +
          'DeliverMeasure1="$DeliverMeasure1" ' +
          'DeliverMeasure2="$DeliverMeasure2" ' + // not mandatory
          'DeliverMeasure3="$DeliverMeasure3" ' + // not mandatory
          'DeliverMeasure4="$DeliverMeasure4" ' + // not mandatory
          'DeliverMeasure5="$DeliverMeasure5" ' + // not mandatory
          'CollectVariableTime="$CollectVariableTime" ' +
          'CollectMeasure1="$CollectMeasure1" ' +
          'CollectMeasure2="$CollectMeasure2" ' + // not mandatory
          'CollectMeasure3="$CollectMeasure3" ' + // not mandatory
          'CollectMeasure4="$CollectMeasure4" ' + // not mandatory
          'CollectMeasure5="$CollectMeasure5" ' + // not mandatory
          //'VisitDetails1="$VisitDetails1" ' + // not mandatory
          //'VisitDetails2="$VisitDetails2" ' + // not mandatory
          //'VisitDetails3="$VisitDetails3" ' + // not mandatory
          //'VisitDetails4="$VisitDetails4" ' + // not mandatory
          'RigidTypeAcceptability="$RigidTypeAcceptability" ' + // not mandatory
          //'DriverTypeAccepability="$DriverTypeAccepability" ' + // not mandatory
          //'VisitNum="$VisitNum" ' + // not mandatory
          'ReleasedInd="$ReleasedInd">' +
          '<Products>$Products</Products>' +
          '</Visit>' +
          ']]>' +
          '</hdx:VisitXML>'
        )
        : ''
    ) +
    (visit ?
      (
        '<hdx:StartDate>$StartDate</hdx:StartDate>' +
        '<hdx:NumDays>$NumDays</hdx:NumDays>'
      )
      : ''
    ) +
    (
      cancellation ?
        (
          '<hdx:OrderCode>$OrderCode</hdx:OrderCode>' +
          '<hdx:VisitNum>$VisitNum</hdx:VisitNum>'
        )
        : ""
    ) +
    '<hdx:ISOLangCode>$ISOLangCode</hdx:ISOLangCode>' +
    '<hdx:ISOCountryCode>$ISOCountryCode</hdx:ISOCountryCode>' +
    '<hdx:ISOCurrencyCode>$ISOCurrencyCode</hdx:ISOCurrencyCode>' +
    '</hdx:$InterfaceName>' +
    '</soap:Body>' +
    '</soap:Envelope>';
  return payload;
}

export enum Visit {
  TRUE = 1,
  FALSE = 0
}

export enum Reservation {
  TRUE = 1,
  FALSE = 0
}

export enum Cancellation {
  TRUE = 1,
  FALSE = 0
}

export interface BookingWindow {
  AvailableToBook?: string
  DeliveryDate?: string
  DefaultTimeSlotGroup?: string
  DelOUCode?: string
  DelOUName?: string
  Greenness?: string
  MarginalCost?: string
  PCodeGroupNum?: string
  RouteOpen?: string
  TimeSlotDescription?: string
  TimeSlotEndTime?: string
  TimeSlotGroupDesc?: string
  TimeSlotGroupName?: string
  TimeSlotGroupNumber?: string
  TimeSlotName?: string
  TimeSlotNumber?: string
  TimeSlotStartTime?: string
  VehicleGroup?: string
  VehicleType?: string
  WindowColour?: string
  WindowText?: string
  WindowTextColour?: string
}

export enum VehicleType {
  VR01 = "111111111000000",
  VR02 = "010101010000000",
  VR09 = "000000001000000"
}

export enum ThresholdDimensions {
  HEIGHT = 1800, // mm
  WIDHT = 700, // mm
  WEIGHT = 70 // kg
}

export interface HDXMeasures {
  deliveryMeasure1: number
  deliveryMeasure2: number
  deliveryMeasure3: number
  deliveryVariableTime: number
  collectMeasure1: number
  collectMeasure2: number
  collectMeasure3: number
  collectVariableTime: number
}

export enum HDXCategories {
  cookers = "cookers",
  hobs = "hobs",
  microwaves = "microwaves",
  ovens = "ovens",
  dishwashing = "dishwashing",
  tumbleDryers = "tumbleDryers",
  washerDryers = "washerDryers",
  washingMachines = "washingMachines",
  refrigeration = "refrigeration",
  freezers = "freezers",
  fridgeFreezer = "fridgeFreezer",
  fridges = "fridges"
}
