import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRuntime } from "vtex.render-runtime"

import { MyAccountContextProvider, useMyAccount } from './providers/myAccountContext'

const MyAccountFFLinkButton = ({
  render,
  label,
}: {
  render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
  label: string
}) => {
  const { fnFSectionUrl, isFF, isVIP } = useMyAccount()
  const intl = useIntl()
  const { culture } = useRuntime()

  const [sessionInvitations, setSessionInvitations] = useState<any>(null)

  useEffect(() => {
    if (sessionInvitations === null)
      setSessionInvitations(window?.sessionStorage?.getItem("invitations"))
  }, [])

  // only for ITCC
  // to activate for VIP copy else solution
  if (culture.locale == "it-IT" || culture.locale == "en-US") {
    return (
      <>

        {(!isFF && !isVIP) ?
          render([
            {
              name: label ?? intl.formatMessage({ id: 'store/invoice-section.ff-names' }),
              path: fnFSectionUrl,
            },
          ]) : null
        }
      </>
    )
  } else {
    return (
      <>
        {sessionInvitations == 'true' && !isVIP ?
          render([
            {
              name: label ?? intl.formatMessage({ id: 'store/invoice-section.ff-names' }),
              path: fnFSectionUrl,
            },
          ]) : null
        }
      </>
    )
  }
}

const MyAccountFFLink = ({
  render,
  label,
}: {
  render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
  label: string
}) => {
  return (
    <MyAccountContextProvider>
      <MyAccountFFLinkButton label={label} render={render} />
    </MyAccountContextProvider>
  )
}

MyAccountFFLink.propTypes = {
  render: PropTypes.func.isRequired,
  label: PropTypes.string,
}

export default MyAccountFFLink
