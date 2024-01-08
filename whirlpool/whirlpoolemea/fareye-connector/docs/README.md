## FarEye Connector

App name: fareye-connector

Description: app useful to retrieve and reserve delivery slots on FarEye. 

Neowise - FarEye eCommerce impacts analysis: https://docs.google.com/presentation/d/1yI8WACa9PihpdVSDvIYbBl6ZWfibrdcESkiLe8XPnoU/edit#slide=id.gb22b138bce_0_805
# App Settings

  - vtex settings 
  
    - Credentials 

      - AppKey e AppToken comma separated useful about services exposed to GCP
  
    - Admin parameter 

      - FarEye Booking MasterData EntityName
      - InStock shipping policy Id (useful to retrieve the correct sla in the OF)
      - Gas specification (Field name and Field value) 
      - Side-By-Side specification (Field name and Field value)
      - Installation service Ids (comma separated)
  
    - Marketplace settings (useful to handle OrderEvent, because some state are managed only on seller admin)

      - Username (seller for basic auth)
      - Password (seller for basic auth)
      - Inbound credential hash (sha256) (marketplace for basic auth)
      - Marketplace orderId prefix to be ignored (comma separated)
      - Marketplace orderId prefix list (comma separated)
      - IsMarketplace

  - FarEye Settings

    - Country's code (eg. IT)
    - Services Host
    - Bearer auth enabled (to get access token)
    - Client id (to get access token)
    - Client secret (to get access token)
    - Static token (to skip get access token, fake token)
    - Whirlpool's warehouse Code (fulfillment_center)
    - Delay of booking date (in days)
    - Delay of TimeSlot EndDate (in days)
    - Expire time of bookings (in hours)
    - TimeSlot black list hour range (comma separated)(useful because FarEye (fastest) return a full day slot 8-20 in case of disadvantaged areas, so we need to remove for    
                                                       get slot)
# Rest services exposed
Routes:
  - getDeliverySlots: (GET) useful to retrieve all delivery slots available for a specific order, passing the orderFormId.
  
  - reserveDeliverySlot: (POST) useful to reserve a specific slot based on the orderForm(Id).
  
  - cancellationBatch: (POST) useful to cancel all reservations expired, so older than X hours (default 2).

  - getReservation: (GET) useful to get the reservationCode passing the orderId, moreover returns information about order's items (such as isGas ecc.).
  
  - cancelBooking: (POST) useful to cancel a specific reservation passing the orderId.

  - setMPBookingStatus: (POST) useful to change the status of a specific booking in MD. This service is called by the seller account when It capture an OrderEvent with a change  
                               of status about a marketplace order.

  - checkBookingStatus: (GET) useful to check if the booking is expired or not. Called by VTEX FE in order to refresh the page in case of canceled booking, moreover if there is
                              a reservation expired but not yet in CANCELED status, It will be deleted.  

Events:
  - bookingStatus: (OrderEvent) useful to manage and change the status of bookings in the MD when currentStatus change. If it's a marketplace order, setMPBookingStatus service 
                                will be called.

  - updateOnOrderCreated: (OrderEvent) useful to fill in the MD record of a specific Booking/Order with the orderId. This allow to search by orderId in the next steps, instead 
               referenceNumber and orderFormId.
# GraphQL query/mutation exposed

# MaserData Entities

FarEye Booking:

  Default acronym -> FB

  Fields -> {
              orderFormId (string)

              referenceNumber (string) random number that identify uniquely the operation, specially about the reservation in which is used in search query as parameter

              orderId (string)

              reservationCode (string) token returned from FarEye

              carrierCode (string) specific for country and returned from FarEye in the getDeliverySlots

              status (string => [CREATED, SAP_MANAGED, CANCELED, USED]) of the booking that is related to the status of the order

              creationDate (date_time) date of reservation useful to determinate if a booking is expired or not, is not used the time of vtex default fields because we don't
                                       know the correct offset
            }
  
  Entity used to track all bookings created and canceled in FarEye.

# CustomApp 

Id: "fareye"
Fields: {  
          reservationCode
          referenceNumber
          hasCGASAppliances
          carrierCode
        }
