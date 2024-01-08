import React, { FC, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useIntl, defineMessages } from 'react-intl'
import { Helmet, ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { usePWA } from 'vtex.store-resources/PWAContext'
import { useCssHandles } from 'vtex.css-handles'

import { OrderGroupContext } from './components/OrderGroupContext'
import { CurrencyContext } from './components/CurrencyContext'
import ForbiddenError from './components/Errors/ForbiddenError'
import InvalidError from './components/Errors/InvalidError'
import OrderList from './components/OrderList'
import Skeleton from './Skeleton'
import Analytics from './Analytics'
import GET_ORDER_GROUP from './graphql/getOrderGroup.graphql'
import GET_ADDITIONAL_ORDER_INFO from './graphql/getAdditionalOrderInfo.graphql'

// to load default css handle styles
import './styles.css'
import { AdditionalOrderInfoContext } from './components/AdditionalOrderInfoContext'

interface OrderGroupData {
  orderGroup: OrderGroup
}

interface AdditionalOrderInfoData {
  getOrderInfo: AdditionalOrderInfo
}

const messages = defineMessages({
  title: { id: 'store/page.title', defaultMessage: '' },
})

const CSS_HANDLES = ['orderPlacedWrapper', 'orderPlacedMainWrapper']

const OrderPlaced: FC = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()
  const runtime = useRuntime()
  const { settings = {} } = usePWA() || {}
  const [installDismissed, setInstallDismissed] = useState(false)
  const { data, loading, error } = useQuery<OrderGroupData>(GET_ORDER_GROUP, {
    variables: {
      orderGroup: runtime.query.og,
    },
  })

  const { data: additionalData, loading: additionalInfoLoading, error: additionalInfoError } = useQuery<AdditionalOrderInfoData>(GET_ADDITIONAL_ORDER_INFO, {
    variables: {
      orderInfoRequest: {
        orderId: runtime.query.og + "-01",
        modalType: true,
        customData: [
          "profile",
          "hdx",
          "tradeplace"
        ],
        specifications: []
      }
    }
  })

  // render loading skeleton if query is still loading
  if (loading || additionalInfoLoading) return <Skeleton />

  // forbidden error
  if (
    error?.message.includes('403') ||
    // 'any' needed because graphql error type doesn't have 'extensions' prop
    (error as any)?.extensions?.response?.status === 403 ||
    additionalInfoError
  ) {
    return <ForbiddenError />
  }

  // not found error
  if (data?.orderGroup?.orders == null || additionalData?.getOrderInfo == null) {
    return <InvalidError />
  }

  const { orderGroup }: { orderGroup: OrderGroup } = data
  console.log("additionalData: ", additionalData);
  console.log("additionalData.getOrderInfo: ", additionalData.getOrderInfo);
  const getOrderInfo: AdditionalOrderInfo = additionalData.getOrderInfo;
  const { promptOnCustomEvent } = settings

  return (
    <OrderGroupContext.Provider value={orderGroup}>
      <CurrencyContext.Provider
        value={orderGroup.orders[0].storePreferencesData.currencyCode}
      >
        <AdditionalOrderInfoContext.Provider value={getOrderInfo}>
          <Helmet>
            <title>{formatMessage(messages.title)}</title>
          </Helmet>

          <div className={`${handles.orderPlacedWrapper} pt9 sans-serif`}>
            <Analytics eventList={orderGroup.analyticsData} />

            <ExtensionPoint id="op-header" />

            <div
              role="main"
              className={`${handles.orderPlacedMainWrapper} mv6 w-80-ns w-90 center`}
            >
              <OrderList />

              {promptOnCustomEvent === 'checkout' && !installDismissed && (
                <ExtensionPoint
                  id="promotion-banner"
                  type="install"
                  onDismiss={() => setInstallDismissed(true)}
                />
              )}
            </div>

            <ExtensionPoint id="op-footer" />
          </div>
        </AdditionalOrderInfoContext.Provider>
      </CurrencyContext.Provider>
    </OrderGroupContext.Provider>
  )
}

export default OrderPlaced
