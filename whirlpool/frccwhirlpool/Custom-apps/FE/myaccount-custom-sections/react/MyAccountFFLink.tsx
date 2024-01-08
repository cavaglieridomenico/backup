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
      { runtime.binding.id == "1bbaf935-b5b4-48ae-80c0-346623d9c0c9" &&
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
