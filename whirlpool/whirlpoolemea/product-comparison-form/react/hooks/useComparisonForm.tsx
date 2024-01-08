/**
 * @param {form,errors,optInCheck,campaign,setShowErrors,loggedIn}
 * @returns handleSubmit, loading, statusNewsletter and statusBackInStock
 */
import { useState } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import {
  UserErrors,
  Method,
  StatusNewsLetter,
  StatusComparison,
} from '../typings/global'
// import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import getAppSettings from '../graphql/settings.graphql'
import { appInfos, AppSettings } from '../utils/utils'
interface Props {
  form: { [key: string]: string }
  errors: UserErrors
  errorCheckboxes: (boolean | undefined)[]
  optInCheck: boolean
  campaign?: string
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  isLoggedIn: boolean
  productsSkuIds: string[]
  productSpecificationGroupsToHideArray: string[]
}
interface WindowGTM extends Window {
  dataLayer: any[]
}

export const handleApi = (
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
  return fetch(url, options).then((raw: any) => {
    if (raw?.ok) {
      // Check if raw json
      if (
        raw?.headers?.get('content-type') &&
        raw?.headers?.get('content-type')?.indexOf('application/json') !== -1
      )
        return raw.json()
      else return raw.text()
    } else throw new Error()
  })
}

export const useComparisonForm = ({
  form,
  errors,
  errorCheckboxes,
  optInCheck,
  campaign,
  setShowErrors,
  isLoggedIn,
  productsSkuIds,
  productSpecificationGroupsToHideArray,
}: Props) => {
  /**
   * Graph QL query to get AppSettings, specifically endpoints setted
   * from App settings in VTEX Admin
   */
  const { data } = useQuery(getAppSettings, {
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
  const userSessionApi =
    settings?.userSessionApi?.endpoint ?? '/api/sessions?items=*'
  const newsletterSubscribeApi =
    settings?.newsletterSubscribeApi?.endpoint ??
    '/_v/wrapper/api/user?userId=true'
  const newsletterSubscribeApiBodyKeys =
    settings?.newsletterSubscribeApi?.bodyKeys?.items ?? null
  const userInfoApi =
    settings?.userInfoApi?.endpoint ??
    '/_v/wrapper/api/user/email/userinfo?email='
  const newsletterOptinApi =
    settings?.newsletterOptinApi?.endpoint ??
    '/_v/wrapper/api/user/newsletteroptin'
  const newsletterOptinApiBodyKeys =
    settings?.newsletterOptinApi?.bodyKeys?.items ?? null
  const comparisonSubscribeApi =
    settings?.comparisonSubscribeApi?.endpoint ?? '/app/sfmc/productsComparison'
  const comparisonSubscribeApiBodyKeys =
    settings?.comparisonSubscribeApi?.bodyKeys?.items ?? null

  const dataLayer = (window as unknown as WindowGTM).dataLayer || []
  const { push } = usePixel()
  /**
   * Set the campaign to use in the Newsletter form subscription.
   * If the campaign isn't present in URL as query param take it
   * from CMS SiteEditor
   */
  const queryString = window?.location?.search
  const urlParams = queryString ? new URLSearchParams(queryString) : null
  const campaignFromUrl = urlParams ? urlParams?.get('campaign') : null

  const targetCampaign = campaignFromUrl
    ? campaignFromUrl?.toString()?.toUpperCase()?.replace('=', '')
    : campaign
  /**
   * Check if form is valid and we can proceed with API calls
   */
  const formIsValid =
    Object.values(form).every((field) => !!field) &&
    Object.values(errors).every((error) => !error) &&
    Object.values(errorCheckboxes).every((error) => !error)
  /**
   * Handle status of API calls
   */
  const [statusNewsletter, setStatusNewsletter] = useState<StatusNewsLetter>()
  const [statusComparison, setStatusComparison] = useState<StatusComparison>()

  // HANDLE NEWSLETTER OPTIN
  const handleOptin = () => {
    try {
      handleApi('GET', `${userInfoApi}${form.email}`)
        .then((users: any) => {
          // USER EXISTS AND IS NOT OPT IN TO NEWSLETTER
          if (users.length && !users[0].isNewsletterOptIn) {
            // IF USER IS NOT AUTHENTICATED HE MUST BE WARNED TO LOG IN
            if (!isLoggedIn) {
              setStatusNewsletter('LOGIN_ERROR')
            } else {
              // IF USER IS AUTHENTICATED HE WILL OPT IN FOR NEWSLETTER
              const newsletterOptinApiBody = {
                [newsletterOptinApiBodyKeys
                  ? newsletterOptinApiBodyKeys[0]?.optin
                  : 'isNewsletterOptIn']: true,
              }
              handleApi('PATCH', newsletterOptinApi, newsletterOptinApiBody)
                .then(() => {
                  setStatusNewsletter('SUCCESS')
                  // : setStatusNewsletter('GENERIC_ERROR')
                })
                .catch((error) => {
                  console.error(error)
                  setStatusNewsletter('GENERIC_ERROR')
                })
            }
          } else if (users.length && users[0].isNewsletterOptIn) {
            // USER EXISTS AND IS ALREADY REGISTERED TO NEWSLETTER -> ERROR
            setStatusNewsletter('REGISTERED_ERROR')
          } else {
            // USER DOESN'T EXIST, SUBSCRIBE TO NEWSLETTER AND CREATE ACCOUNT
            const newsletterSubscribeApiBody = {
              [newsletterSubscribeApiBodyKeys
                ? newsletterSubscribeApiBodyKeys[0]?.name
                : 'firstName']: form.firstName,
              [newsletterSubscribeApiBodyKeys
                ? newsletterSubscribeApiBodyKeys[0]?.surname
                : 'lastName']: form.surname,
              [newsletterSubscribeApiBodyKeys
                ? newsletterSubscribeApiBodyKeys[0]?.email
                : 'email']: form.email,
              [newsletterSubscribeApiBodyKeys
                ? newsletterSubscribeApiBodyKeys[0]?.campaign
                : 'campaign']: targetCampaign,
              [newsletterSubscribeApiBodyKeys
                ? newsletterSubscribeApiBodyKeys[0]?.optin
                : 'isNewsletterOptIn']: optInCheck,
            }
            handleApi(
              'POST',
              newsletterSubscribeApi,
              newsletterSubscribeApiBody
            )
              .then(() => {
                // if (res?.ok) {
                setStatusNewsletter('SUCCESS')
                dataLayer.push({
                  event: 'userRegistration',
                })
                dataLayer.push({
                  event: 'personalArea',
                  eventCategory: 'Personal Area',
                  eventAction: 'Start Registration',
                  eventLabel: 'Start Registration from NewsLetter',
                })
                //GA4FUNREQ23
                push({
                  event: 'ga4-personalArea',
                  section: 'Newsletter',
                  type: 'registration',
                })
                //GA4FUNREQ53
                push({
                  event: 'ga4-form_submission',
                  type: 'newsletter',
                })
                //GA4FUNREQ61
                push({
                  event: 'ga4-optin',
                })
                // } else {
                //   setStatusNewsletter('GENERIC_ERROR')
                // }
              })
              .catch((error) => {
                console.error(error)
                setStatusNewsletter('GENERIC_ERROR')
              })
          }
        })
        .catch((error) => {
          console.error(error)
          setStatusNewsletter('GENERIC_ERROR')
        })
    } catch (error) {
      setStatusNewsletter('GENERIC_ERROR')
    }
  }

  const handleProductComparison = () => {
    setStatusComparison('LOADING')
    const comparisonSubscribeApiBody = {
      [comparisonSubscribeApiBodyKeys
        ? comparisonSubscribeApiBodyKeys[0]?.email
        : 'email']: form.email,
      [comparisonSubscribeApiBodyKeys
        ? comparisonSubscribeApiBodyKeys[0]?.firstName
        : 'firstName']: form.firstName,
      [comparisonSubscribeApiBodyKeys
        ? comparisonSubscribeApiBodyKeys[0]?.lastName
        : 'lastName']: form.surname,
      [comparisonSubscribeApiBodyKeys
        ? comparisonSubscribeApiBodyKeys[0]?.skuIds
        : 'skuIds']: productsSkuIds,
      [comparisonSubscribeApiBodyKeys
        ? comparisonSubscribeApiBodyKeys[0]?.specificationsAvoided
        : 'specificationsAvoided']: productSpecificationGroupsToHideArray,
    }
    handleApi('POST', comparisonSubscribeApi, comparisonSubscribeApiBody)
      .then(() => setStatusComparison('SUCCESS'))
      .catch((error) => {
        console.error(error)
        setStatusComparison('ERROR')
      })
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setShowErrors(true)
    // CHECK IF FORM IS VALID
    if (!formIsValid) {
      errors = {
        name: !form.firstName,
        surname: !form.surname,
        email: !form.email,
      }
      return
    }
    // IF OPTIN SELECTED HANDLE IT
    if (optInCheck) {
      setStatusNewsletter('LOADING')
      handleOptin()
    }
    // HANDLE THE PROD COMPARISON
    handleProductComparison()
  }

  return {
    handleSubmit,
    userSessionApi,
    statusNewsletter,
    statusComparison,
  }
}
