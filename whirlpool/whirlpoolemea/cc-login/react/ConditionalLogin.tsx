// eslint-disable-next-line no-console
// eslint-disable-next-line no-undef

import React, { useEffect, useState } from 'react'
import styles from './style.css'
import {
  accountIcon,
  utilsFunctions,
  dropdownOpen,
  dropdownClose,
} from './utils/vectors'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import CustomerGreeting from '../graphql/customerGreeting.gql'
import { listener } from './utils/events'

//const sessionAPI = '/api/sessions'
interface ConditionalLoginInterface {
  imageLinkNotLogged: string
  imageLinkLogged: string
  loginPageUrl?: string
  loginLabel?: string
}
const ConditionalLogin: StorefrontFunctionComponent<ConditionalLoginInterface> = ({
  imageLinkNotLogged,
  imageLinkLogged,
  loginPageUrl = '/login',
}) => {
  const intl = useIntl()
  const { navigate } = useRuntime()

  //states
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [open, setOpen] = React.useState(false)


  const handleOpen = () => {
    setOpen(!open)
  }

  const { error, loading }: any = useQuery(
    CustomerGreeting,
    {
      fetchPolicy: 'no-cache',
      ssr: false,
      onError() {
        console.log('query', error, loading)
      },
      onCompleted(data) {
        console.log('query 2', data, error, loading)
        if (data && data.profile) {
          setName(data.profile?.firstName)
          setAuthenticated(true)
        } else {
          setName('')
          setAuthenticated(false)
        }
      },
    }
  )
  //did mount
  useEffect(() => {
    listener("onchangeprofileinfo", (e: any) => {
      setName(e.detail.firstName)
      //window.location.reload();
    })
  }, [])



  const iconAccount = `data:image/svg+xml;base64,${Buffer.from(
    accountIcon
  ).toString('base64')}`
  const dropdownOpenMenu = `data:image/svg+xml;base64,${Buffer.from(
    dropdownOpen
  ).toString('base64')}`
  const dropdownCloseMenu = `data:image/svg+xml;base64,${Buffer.from(
    dropdownClose
  ).toString('base64')}`

  return (
    <div
      className={styles.menuItemContainer}
      onClick={() => {
        if (!isAuthenticated) navigate({ to: loginPageUrl })
      }}
    // onMouseEnter={() => {
    //   setShowMessage(true);
    // }}
    // onMouseLeave={() => {
    //   setShowMessage(true);
    // }}
    >
      <div className={styles.containerLabels}>
        {name !== '' ? (
          <>
            <button
              onClick={handleOpen}
              className={styles.menuItemLabelContainer}
            >
              <img
                src={utilsFunctions.printTheCorrectIcon(
                  imageLinkNotLogged,
                  imageLinkLogged,
                  iconAccount,
                  name
                )}
                alt="account-icon"
                className={styles.accountcon}
              />
              <div className={styles.menuItemLabelName}>
                <p className={styles.menuItemLabel}>
                  {intl.formatMessage({
                    id: 'store/conditional-login.loggedLabel',
                  })}{' '}
                  {name}
                </p>
                <img
                  className={styles.dropdownOpen}
                  src={open ? dropdownCloseMenu : dropdownOpenMenu}
                />
              </div>
            </button>
            {open ? (
              <ul className={styles.menu}>
                <li className={styles.menuItem}>
                  <a className={styles.linkMenuItem} href="/account">
                    {intl.formatMessage({
                      id: 'store/conditional-login.myAccount',
                    })}
                  </a>
                </li>
                <li className={styles.menuItem}>
                  <a className={styles.linkMenuItem} href="/account/#/orders">
                    {intl.formatMessage({
                      id: 'store/conditional-login.myOrders',
                    })}
                  </a>
                </li>
                <li className={styles.menuItem}>
                  <a
                    className={styles.linkMenuItem}
                    href="/account/#/whishlist"
                  >
                    {intl.formatMessage({
                      id: 'store/conditional-login.wishlist',
                    })}
                  </a>
                </li>
                <li className={styles.menuItem}>
                  <a className={styles.linkMenuItem} href="/support">
                    {intl.formatMessage({
                      id: 'store/conditional-login.support',
                    })}
                  </a>
                </li>
              </ul>
            ) : null}
          </>
        ) : (
          <p className={styles.menuItemLabelContainer}>
            <img
              src={utilsFunctions.printTheCorrectIcon(
                imageLinkNotLogged,
                imageLinkLogged,
                iconAccount,
                name
              )}
              alt="account-icon"
              className={styles.accountcon}
            />
            <div className={styles.menuItemLabelName}>
              <p className={styles.menuItemLabel}>
                {intl.formatMessage({
                  id: 'store/conditional-login.myAccountLabel',
                })}
              </p>
              <img
                className={styles.dropdownOpen}
                src={open ? dropdownCloseMenu : dropdownOpenMenu}
              />
            </div>
          </p>
        )}
      </div>
    </div>
  )
}

ConditionalLogin.schema = {
  title: 'Conditional Login',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    imageLinkNotLogged: {
      title: 'imageLinkNotLogged',
      type: 'string',
      description:
        'This is the image that will be diplayed if the use IS NOT logged. The suggestion is to uplad the image on Vtex (ex. /arquivos/image.jpg). DO NOT insert both imageLink and SvgCode',
    },
    imageLinkLogged: {
      title: 'imageLinkLogged',
      type: 'string',
      description:
        'This is the image that will be diplayed if the IS logged. The suggestion is to uplad the image on Vtex (ex. /arquivos/image.jpg). DO NOT insert both imageLink and SvgCode',
    },
  },
}

export default ConditionalLogin
