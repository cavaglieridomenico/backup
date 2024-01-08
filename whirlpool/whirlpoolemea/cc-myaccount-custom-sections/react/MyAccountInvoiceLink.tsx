import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'
import { MyAccountContextProvider, useMyAccount } from './providers/myAccountContext'

const MyAccountInvoiceLinkButton = ({
    render,
    label,
  }: {
    render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
    label: string
  }) => {
    const intl = useIntl()
    const {invoiceSectionUrl} = useMyAccount()

    return render([
      {
        name: label ?? intl.formatMessage({ id: 'store/invoice-section.invoice-names' }),
        path: invoiceSectionUrl,
      },
    ])
  }

  const MyAccountInvoiceLink = ({
    render,
    label,
  }: {
    render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
    label: string
  }) => {
    return(
      <MyAccountContextProvider>
          <MyAccountInvoiceLinkButton label={label} render={render}/>
      </MyAccountContextProvider>
    )
  }
  
  MyAccountInvoiceLink.propTypes = {
    render: PropTypes.func.isRequired,
    label: PropTypes.string,
  }
  
  export default MyAccountInvoiceLink