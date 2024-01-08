## CRM async integration

Integration of CRM services.

# Master Data Entity

  - CLEntityName = "CL"; (Client)
      Fields = ["id", "userId", "crmBpId", "webId", "userType", "email", 
                "firstName", "lastName", "gender", "birthDate",  "businessPhone", 
                "homePhone", "phone", "isNewsletterOptIn", "localeDefault", "campaign", "partnerCode",          
                "doubleOptinStatus"]

  - CCEntityName = "CC"; (CRM Customer)
      Fields = ["id", "crmBpId", "webId", "vtexUserId", "email", "locale", "country", "optinConsent", 
                "firstName", "lastName", "gender", "dateOfBirth", "mobilePhone","homePhone", "campaign", 
                "userType", "addressId", "street", "number", "complement", "city", "state", "postalCode",
                "partnerCode", "doubleOptinStatus"];

  - ADEntityName = "AD"; (Addresses)
      Fields = ["id", "addressType", "street", "number", "complement", "city", "state", "postalCode", "country",    
                "lastInteractionIn"];

  - EMEntityName = "EM"; ()
      Fields = ["id", "email", "status"];

  - PAEntityName  = "PA"; ()
      Fields = ["id", "name", "partnerCode", "accessCode", "status"];

# Rest services exposed

By event: 
  - fetchDataFromCRM: retrieve customer data from CC entity by email received from event payload (LoggedUser)
  - recoverPlan: send event "NEW" by notify to GCP in order to do the recover plan for all the record of CC entity with creation date > than recover plan start date
  - newsletterSubscription: subscription to newsletter of email present in the payload of event, by CRM endpoint specified in the app setting 
  - newOrder: update the information contained in the CC entity

By endpoint:
  - ping: ping test
  - notificationHandler: handler of CRM notification
  - setCrmBpId: update of CC and CL entity with the CrmBpId
  - getUserDataFromVtex:  retrieve customer data from CC entity by vtexUserId received from event payload
  - getUserDataFromCRM: retrieve customer data from CC entity by email received from event payload (LoggedUser)
  - eppExportHandler: update EM entity with the information of epp users 
  - guestUserRegistration: update the information contained in the CC entity
