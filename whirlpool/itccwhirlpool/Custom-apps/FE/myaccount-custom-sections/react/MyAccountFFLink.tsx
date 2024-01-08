import PropTypes from 'prop-types'
import React from 'react'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

const MyAccountFFLink = ({
    render,
    label,
  }: {
    render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
    label: string
  }) => {
    const runtime = useRuntime()
    const intl = useIntl()

    return(
      <>
      { runtime.binding.id == "d2ef55bf-ed56-4961-82bc-6bb753a25e90" &&
      render([
        {
          name: label ?? intl.formatMessage({ id: 'store/invoice-section.ff-names' }),
          path: '/friends',
        },
      ])
      }

  </>
    )
}

  MyAccountFFLink.propTypes = {
    render: PropTypes.func.isRequired,
    label: PropTypes.string,
  }

  export default MyAccountFFLink
