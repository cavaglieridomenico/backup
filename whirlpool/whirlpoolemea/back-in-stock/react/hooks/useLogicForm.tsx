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
  StatusBackInStock,
  MutationVariables,
} from '../typings/global'
import { useProduct } from 'vtex.product-context'
import { useQuery, useMutation } from 'react-apollo'
import BACK_IN_STOCK_MUTATION from '../graphql/backInStockMutation.graphql'
import getAppSettings from '../graphql/settings.graphql'
import { appInfos, AppSettings } from '../utils/utils'
interface Props {
  form: { [key: string]: string }
  errors: UserErrors
  errorCheckboxes: (boolean | undefined)[]
  optInCheck: boolean
  campaign?: string
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  loggedIn: boolean
}
interface WindowGTM extends Window {
  dataLayer: any[]
}

export const handleApi = async (
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
    // Check if raw json
    if (
      raw?.headers?.get('content-type') &&
      raw?.headers?.get('content-type')?.indexOf('application/json') !== -1
    )
      return await raw.json()
    else return await raw.text()
  } else throw new Error()
}

export const useLogicForm = ({
  form,
  errors,
  errorCheckboxes,
  optInCheck,
  campaign,
  setShowErrors,
  loggedIn,
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
  const newsletteroptinApi = settings?.newsletteroptinApi ?? '/_v/wrapper/api/user/newsletteroptin'
  const postUserApi = settings?.postUserApi ?? '/_v/wrapper/api/user?userId=true'
  const userInfoApi = settings?.userInfoApi ?? '/_v/wrapper/api/user/email/userinfo?email='
  const sessionApi = settings?.sessionApi ?? '/api/sessions?items=*'
  const bodyUserApiName = settings?.bodyUserApiName ?? 'firstName'
  const bodyUserApiSurname = settings?.bodyUserApiSurname ?? 'lastName'
  const bodyUserApiCampaign = settings?.bodyUserApiCampaign ?? 'campaign'
  const bodyUserApiOptin = settings?.bodyUserApiOptin ?? 'isNewsletterOptIn'


  const dataLayer = (window as unknown as WindowGTM).dataLayer || []
  const { push } = usePixel()
  /**
   * Set the campaign to use in the Newsletter form subscription.
   * If the campaign isn't present in URL as query param take it
   * from CMS SiteEditor
   */
  const newsletterUrl = window?.location?.href.split('?')[1]
  const targetCampaign =
    newsletterUrl?.toString().toUpperCase().replace('=', '') ?? campaign

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
  const [statusBackInStock, setStatusBackInStock] = useState<StatusBackInStock>()
  /**
   * productContext to get refId
   */
  const productContext = useProduct()
  const refId = productContext?.product?.items[0]?.referenceId[0]?.Value


  /**
   * Function to handle Newsletter subscription in case user
   * flag the newsletterOptin checkbox
   */
  const handleOptin = async () => {
    try {
      const users = await handleApi('GET', `${userInfoApi}${form.email}`)
      // USER EXISTS AND IS NOT OPT IN TO NEWSLETTER
      if (users.length && !users[0].isNewsletterOptIn) {
        // const session = await handleApi('GET', sessionApi)
        // IF USER IS NOT AUTHENTICATED HE MUST BE WARNED TO LOG IN
        // if (session?.namespaces?.profile?.isAuthenticated?.value == 'false') {
        if (!loggedIn) {
          setStatusNewsletter('LOGIN_ERROR')
        } else {
          // IF USER IS AUTHENTICATED HE WILL OPT IN FOR NEWSLETTER
          await handleApi('PATCH', newsletteroptinApi, {
            isNewsletterOptIn: true,
          })
          setStatusNewsletter('SUCCESS')
        }
      }
      // USER EXISTS AND IS ALREADY REGISTERED TO NEWSLETTER -> ERROR
      else if (users.length && users[0].isNewsletterOptIn) {
        setStatusNewsletter('REGISTERED_ERROR')
      }
      // USER DOESN'T EXIST
      else {
        await handleApi('POST', postUserApi, {
          email: form.email,
          [bodyUserApiName]: form.name,
          [bodyUserApiSurname]: form.surname,
          [bodyUserApiOptin]: true,
          [bodyUserApiCampaign]: targetCampaign,
        })

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
      }
    } catch (error) {
      setStatusNewsletter('GENERIC_ERROR')
    }
  }

  /**
   * Mutation
   */
  const [signUp, { loading }] = useMutation(BACK_IN_STOCK_MUTATION, {
    onCompleted: (data: any) => {
      !data?.createDocument
        ? setStatusBackInStock('ERROR')
        : setStatusBackInStock('SUCCESS')
    },
    onError: () => {
      setStatusBackInStock('ERROR')
    },
  })

  /**
   * Function to handle back in stock
   */
  const handleBackInStockMutation = () => {
    const variables: MutationVariables = {
      acronym: 'BS',
      document: {
        fields: [
          {
            key: 'email',
            value: form.email,
          },
          {
            key: 'refId',
            value: refId,
          },
        ],
      },
    }
    //callto signup to subscription
    signUp({
      variables,
    })
  }

  const handleSubmit = async () => {
    setShowErrors(true)
    if (!formIsValid) {
      errors = {
        name: !form.name,
        surname: !form.surname,
        email: !form.email,
      }
      return
    }
    if (optInCheck) {
      setStatusNewsletter('LOADING')
      await handleOptin()
    }
    handleBackInStockMutation()
  }

  return {
    handleSubmit,
    sessionApi,
    loading,
    statusNewsletter,
    statusBackInStock,
  }
}
