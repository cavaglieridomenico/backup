# Back in stock email trigger

App useful to trigger back in stock email via VTEX. The name of MD entity related to back in stock email trigger (default AS), is
specified in the app settings.

# GraphQL mutation/query exposed

- Mutation:
   saveBISForm(args: BISForm!): Boolean -> Save BIS (Back In Sock) form in MD entity

# Rest services exposed

- backInStock -> [POST] = send back in stock email by vtex trigger (need to modify field <emailSent>)
              -> [DELETE] = delete the subscription (record in MD) by id

# MasterData Entity
- AS (Availability Subscriber) -> {
                                    id?: string
                                    email?: string
                                    name?: string | null
                                    surname?: string | null
                                    skuId?: string | null
                                    skuRefId?: string
                                    commercialCode?: string | null
                                    productUrl?: string | null
                                    productImageUrl?: string | null
                                    optin?: boolean | null
                                    campaign?: string | null
                                    tradePolicy?: string | null
                                    locale?: string | null
                                    createdAt?: string | null
                                    notificationSend?: string | null
                                    sendAt?: string | null
                                    host?: string | null // field used for tests in Vtex domain, so not stored on MD
                                  }
 
- CL (Client) -> {
                    id?: string
                    email: string
                    userType: string | null
                    isNewsletterOptIn: boolean | null
                  }
