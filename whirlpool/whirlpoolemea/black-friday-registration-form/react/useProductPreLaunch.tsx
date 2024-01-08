import { useState, useEffect } from 'react'
import { handleApi } from './utils/utils'
import { useQuery, useMutation } from 'react-apollo'
import CREATE_DOCUMENT from './graphql/createDocument.graphql'
import APP_SETTINGS from './graphql/settings.graphql'
import { appInfos } from './utils/utils'

interface Props {
  form: { [key: string]: string }
  dispatch: any
  errors: UserErrors
  optInCheck: boolean
  customCampaign?: string
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>
  textButton?: string
}
// interface WindowGTM extends Window {
//   dataLayer: any[]
// }

export const useProductPreLaunch = ({
  errors,
  form,
  dispatch,
  optInCheck,
  customCampaign,
  setShowErrors,
}: Props) => {
  // const dataLayer = ((window as unknown) as WindowGTM).dataLayer || []
  /**
   * Graph QL query to get AppSettings, specifically endpoints setted
   * from App settings in VTEX Admin
   */
  const { data } = useQuery(APP_SETTINGS, {
    ssr: false,
    variables: {
      app: `${appInfos?.vendor}.${appInfos?.appName}`,
      version: appInfos?.version,
    },
  })
  const settings: AppSettings = data && JSON.parse(data?.appSettings?.message)
  /**
   * Set endpoints, if they are available from App settings take them.
   * Otherwise take the ones hard coded
   */
  const userInfoApi =
    settings?.userInfoApi ?? '/_v/wrapper/api/user/email/userinfo?email='
  const sessionApi = settings?.sessionApi ?? '/api/sessions?items=*'
  // Campaign to use for registration
  const queryString = window?.location?.search
  const urlParams = queryString ? new URLSearchParams(queryString) : null
  const campaignFromUrl = urlParams ? urlParams?.get('campaign') : null

  const targetCampaign = campaignFromUrl
    ? campaignFromUrl?.toString()?.toUpperCase()?.replace('=', '')
    : customCampaign

  useEffect(() => {
    // CHECK IF USER IS LOGGEDIN
    isLogged()
  }, [])

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const isLogged = async () => {
    const profile = await handleApi('GET', sessionApi)
    setIsLoggedIn(
      profile?.namespaces?.profile?.isAuthenticated?.value === 'true'
    )
    if (profile && profile?.namespaces?.profile?.email?.value) {
      dispatch({
        name: 'email',
        value: profile?.namespaces?.profile?.email?.value,
      })
      dispatch({
        name: 'name',
        value: profile?.namespaces?.profile?.firstName?.value ?? '',
      })
      dispatch({
        name: 'surname',
        value: profile?.namespaces?.profile?.lastName?.value ?? '',
      })
    }
    // setFormLoading(false)
  }

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
      // USER EXISTS
      if (users.length) {
        // NOT LOGGED IN USER
        if (!isLoggedIn) {
          setStatus('LOGIN_ERROR')
        } else {
          // LOGGED IN USER
          handlePreLaunchMutation()
        }
      } else {
        // USER DOESN'T EXIST
        handlePreLaunchMutation()
        setStatus('SUCCESS')
        // dataLayer.push({
        //   event: 'userRegistration',
        // })
        // dataLayer.push({
        //   event: 'optin_granted',
        // })
        // dataLayer.push({
        //   event: "leadGeneration",
        //   eventCategory: "Lead Generation",
        //   eventAction: "Optin granted",
        //   eventLabel: "Lead from Newsletter",
        //   email: form.email,
        // });
      }
    } catch (error) {
      setStatus('GENERIC_ERROR')
    }
  }
  /**
   * Mutation
   */
  const [signUp, { loading }] = useMutation(CREATE_DOCUMENT, {
    onCompleted: (data: any) => {
      !data?.createDocument ? setStatus('GENERIC_ERROR') : setStatus('SUCCESS')
    },
    onError: () => {
      setStatus('GENERIC_ERROR')
    },
  })
  /**
   * Function to handle pre launch Mutation
   */
  const handlePreLaunchMutation = () => {
    const variables: MutationVariables = {
      acronym: 'RF',
      document: {
        fields: [
          {
            key: 'Campaign',
            value: targetCampaign,
          },
          {
            key: 'Email',
            value: form.email,
          },
          {
            key: 'Name',
            value: form.name,
          },
          {
            key: 'Surname',
            value: form.surname,
          },
          {
            key: 'NewsLetterOptIn',
            value: optInCheck,
          },
        ],
      },
    }
    //callto signup to subscription
    signUp({
      variables,
    })
  }

  return {
    handleSubmit,
    status,
    loading,
    isLoggedIn,
  }
}
