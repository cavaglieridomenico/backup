import { useState } from 'react'
import { useQuery } from 'react-apollo'
import APP_SETTINGS from './graphql/settings.graphql'
import { appInfos } from './utils/utils'

interface Props {
  form: { [key: string]: string }
  errors: UserErrors
  optInCheck: boolean
  customCampaign?: string
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  textButton?: string
}
interface WindowGTM extends Window {
  dataLayer: any[]
}

const handleApi = async (
  method: Method,
  url: string,
  body?: { [key: string]: any }
) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  }
  const raw = await fetch(url, options)
  if (raw.ok) {
    if (
      raw?.headers?.get('content-type') &&
      raw?.headers?.get('content-type')?.indexOf('application/json') !== -1
    )
      return await raw.json()
    else return await raw.text()
  } else throw new Error()
}

export const useRegistration = ({
  errors,
  form,
  optInCheck,
  customCampaign,
  setShowErrors,
}: //textButton
Props) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || []
  /**
   * Graph QL query to get AppSettings, specifically endpoints setted
   * from App settings in VTEX Admin
   */
  const { data } = useQuery(APP_SETTINGS, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  })
  const settings: AppSettings = data && JSON.parse(data?.appSettings?.message)
  /**
   * Set endpoints, if they are available from App settings take them.
   * Otherwise take the ones hard coded
   */
  const newsletteroptinApi =
    settings?.newsletteroptinApi ?? '/_v/wrapper/api/user/newsletteroptin'
  const postUserApi =
    settings?.postUserApi ?? '/_v/wrapper/api/user?userId=true'
  const userInfoApi =
    settings?.userInfoApi ?? '/_v/wrapper/api/user/email/userinfo?email='
  const sessionApi = settings?.sessionApi ?? '/api/sessions?items=*'
  /**
   * GET CAMPAIGN FROM URL IF PRESENT OTHERWISE GET THE ONE SETTED IN CMS SITE EDITOR
   */
  const queryString = window?.location?.search
  const urlParams = queryString ? new URLSearchParams(queryString) : null
  const campaignFromUrl = urlParams ? urlParams?.get('campaign') : null

  const targetCampaign = campaignFromUrl
    ? campaignFromUrl?.toString()?.toUpperCase()?.replace('=', '')
    : customCampaign

  const formIsValid =
    Object.values(form).every(field => !!field) &&
    Object.values(errors).every(error => !error) &&
    optInCheck
  const [status, setStatus] = useState<Status>()

  const handleSubmit = async () => {
    setShowErrors(true)
    if (!formIsValid) {
      errors = {
        name: !form.name,
        surname: !form.surname,
        email: !form.email,
        optIn: !optInCheck,
      }
      return
    }
    setStatus('LOADING')
    try {
      const users = await handleApi('GET', `${userInfoApi}${form.email}`)
      // USER EXISTS AND IS NOT OPT IN TO NEWSLETTER
      if (users.length && !users[0].isNewsletterOptIn) {
        const session = await handleApi('GET', sessionApi)
        // IF USER IS NOT AUTHENTICATED HE MUST BE WARNED TO LOG IN
        if (session?.namespaces?.profile?.isAuthenticated?.value == 'false') {
          setStatus('LOGIN_ERROR')
        } else {
          // IF USER IS AUTHENTICATED HE WILL OPT IN FOR NEWSLETTER
          await handleApi('PATCH', newsletteroptinApi, {
            isNewsletterOptIn: true,
          })
          setStatus('SUCCESS')
        }
      }
      // USER EXISTS AND IS ALREADY REGISTERED TO NEWSLETTER -> ERROR
      else if (users.length && users[0].isNewsletterOptIn) {
        setStatus('REGISTERED_ERROR')
      }
      // USER DOESN'T EXIST
      else {
        await handleApi('POST', postUserApi, {
          email: form.email,
          firstName: form.name,
          lastName: form.surname,
          isNewsletterOptIn: true,
          campaign: targetCampaign,
        })

        setStatus('SUCCESS')
        dataLayer.push({
          event: 'userRegistration',
        })
        dataLayer.push({
          event: 'optin_granted',
        })
        dataLayer.push({
          event: 'cta_click',
          eventCategory: 'CTA Click', // Fixed value
          eventAction: 'Marketing', // dynamic value – please verify that this is equal to “Marketing”
          eventLabel: 'subscription_page_BF', // fixed value
          link_text: 'Send', // button value always in english so form Invia -> Send
          checkpoint: '1', // dynamic value - will be populated like 'eventLabel’
          area: 'Marketing', // dynamic value - will be populated like 'eventAction’
          type: 'subscription_page_BF', // dynamic value
        })
        dataLayer.push({
          event: 'leadGeneration',
          eventCategory: 'Lead Generation',
          eventAction: 'Optin granted',
          eventLabel: 'Lead from Newsletter',
          email: form.email,
        })
      }
    } catch (error) {
      setStatus('GENERIC_ERROR')
    }
  }

  return {
    handleSubmit,
    status,
  }
}
