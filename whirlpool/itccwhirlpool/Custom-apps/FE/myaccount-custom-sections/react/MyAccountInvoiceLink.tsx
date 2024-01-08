import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const MyAccountInvoiceLink = ({
    render,
    label,
  }: {
    render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
    label: string
  }) => {
    const intl = useIntl()
    return render([
      {
        name: label ?? intl.formatMessage({ id: 'store/invoice-section.invoice-names' }),
        path: '/fatture',
      },
    ])
  }

  MyAccountInvoiceLink.propTypes = {
    render: PropTypes.func.isRequired,
    label: PropTypes.string,
  }

  export default MyAccountInvoiceLink
