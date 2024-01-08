import CoBody from "co-body";
import { stringify, sendEventWithRetry , isAuthenticatedRequest, isValid } from "../utils/commons";
import { searchDocuments , updatePartialDocument } from "../utils/documentCRUD"
import { CLEntityName , CLEntityFields, NLEntityFields } from "../utils/constants";
import { AppSettings } from "../typings/config"
import { ProfilingRequest , CLRecord, NewsletterSubscriptionData } from "../typings/types"


export async function UpdateUserProfiling(ctx: Context , next: () => Promise<any>) {    
  let req = (await CoBody(ctx.req)) as ProfilingRequest  
  let appSettings: AppSettings = JSON.parse(process.env[`${ctx.vtex.account}-SFMC`]!);
  let promises = []

  try {
    //first: check the call authentiocation
    if(isAuthenticatedRequest(appSettings, req)){
      
      
      promises.push(searchDocuments(ctx, CLEntityName, CLEntityFields, `email=${req.email}`, { page: 1, pageSize: 10 }))

      if(appSettings.hasNewsletterMDEntity){
        promises.push(searchDocuments(ctx, appSettings.newsletterMDEntity , NLEntityFields, `email=${req.email}`, { page: 1, pageSize: 10 }))
      }

      let records = await Promise.all(promises) 

      let cl: CLRecord[] = records[0];
      let nl: CLRecord[] = records[1]; 
      
      //console.log("CL : " + cl.length + ", NL : " + nl.length)
        
      if(cl.length > 0){        
        
        await updatePartialDocument( ctx , CLEntityName, cl[0].id, { isNewsletterOptIn: true, isProfilingOptIn: req.profilingOptin})               
        
      } else {
        let eventPayload: NewsletterSubscriptionData | undefined      

        if ( nl.length > 0) {
          //case NL in VTEX 
          eventPayload = {
            firstName: nl[0].firstName,
            lastName: nl[0].lastName,
            email: nl[0].email,
            isNewsletterOptIn: nl[0].isNewsletterOptIn,
            isProfilingOptIn: req.profilingOptin,
            campaign: null,
            userType: nl[0].userType,
            partnerCode: nl[0].partnerCode,
            eventId: "Profiling subscription: "
          }        

        } else if(isValid(req.firstName) && isValid(req.lastName)) {  
          //case user unknown in VTEX  with check surname as mandatory field       

          eventPayload = {
            firstName: req.firstName,
            lastName: req.lastName,
            email: req.email,
            isNewsletterOptIn: true,
            isProfilingOptIn: req.profilingOptin,
            campaign: null,                        
            eventId: "Profiling subscription: "
          }    
                        
        } 

        if(eventPayload!= undefined){
          await sendEventWithRetry(ctx, ctx.vtex.account + ".crm-async-integration", "crm-newsletter-subscription", eventPayload)
        } else{
          ctx.state.logger.error(`[Update user profiling optin] - user ${req.email} no name/surname valid (record skipped)`)
        }      

      }
      
      ctx.body = "OK"
      ctx.status = 200  

    } else {
      ctx.state.logger.error(`[Update user profiling optin] - Fobidden access for request of the user ${req.email} --data: ${stringify(req)}`)
      ctx.body = "Forbidden Access"
      ctx.status = 403
    }

    await next()

  } catch (err) {
    let msg = err.message ? err.message : stringify(err);
    ctx.state.logger.error(`[Update user profiling optin] - request failed for the user ${req.email} --data: ${stringify(req)} --err: ` + msg)
    ctx.body = "Internal Server Error"
    ctx.status = 500
  }
 
}

