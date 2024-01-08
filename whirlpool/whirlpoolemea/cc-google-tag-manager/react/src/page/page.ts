import push from '../../src/utils/push'
import { PixelMessage } from '../../typings/events'
import { pushWithoutDuplicates } from '../utils/product-utils'
import { getUrlToPush } from '../utils/page-utils'
import {
  isErrorPage,
  isProductErrorPage,
  pushErrorPageEvent,
  getPageView,
  getUserCompany,
} from '../utils/page-utils'
import { PageViewQuery, WindowRuntime } from './interfaces'
import { getData, getAnalyticWrapperData } from '../utils/product-utils'

export async function sendPageEvents(e: PixelMessage) {
  //Get product data
  // const productQuery: any = await getProduct()
  // const product: Product = productQuery?.data?.productData

  //alternative message if the data is not available
  const alternativeValue: string = ''

  switch (e.data.eventName) {
    //GA4FUNREQ28
    case 'vtex:drawerInteraction': {
      const { action } = e.data
      push({
        event: 'filter_interactions',
        action: action,
      })
      break
    }

    case 'vtex:extra_info_interaction_tooltip': {
      push({
        event: 'extra_info_interaction',
        type: 'tooltip',
      })
      break
    }

    //GA4FUNREQ-CC-03
    // pageView & FEReady
    case 'vtex:pageView': {
      const path = window.location.pathname
      const url = (path.startsWith("/de/") || path.startsWith("/it/") || path.startsWith("/fr/")) ? path.substring(3) : path
      const runtime = (window as unknown as WindowRuntime)?.__RUNTIME__
      const pageViewQuery: PageViewQuery = await getPageView(url)
      const isErrorPageView = isErrorPage() || isProductErrorPage()

      //Error and Search conditions for pageType and contentGrouping (not calculated on BE side)
      const checkPageTypeErrors = () => {
        //Search case
        if (window?.location?.search?.includes('_q')) return ['search', pageViewQuery?.contentGrouping]
        //Error case
        if (isErrorPage() || isProductErrorPage() || runtime?.route?.id === 'store.not-found#search') return ['error', 'Errors']
        //Default case
        return [pageViewQuery?.pageType, pageViewQuery?.contentGrouping]
      }

      const [pageType, contentGrouping] = checkPageTypeErrors()

      const objToPush = {
        status: pageViewQuery?.isAuthenticated ? 'authenticated' : 'anonymous',
        userType: pageViewQuery?.userType,
        'product-code': pageViewQuery?.productCode || '',
        'product-name': pageViewQuery?.productName || '',
        'product-category': pageViewQuery?.category || '',
        pageType: pageType,
        contentGrouping: contentGrouping,
        contentGroupingSecond: pageViewQuery?.contentGroupingSecond || '',
        user_company: getData(getUserCompany('userCluster'), alternativeValue),
      }

      push({
        event: 'pageView',
        ...objToPush,
      })
      push({
        event: 'feReady',
        ...objToPush,
      })

      if (isErrorPageView) {
        pushErrorPageEvent()

        //GA4FUNREQ57
        push({
          event: 'custom_error',
          type: 'error pages',
          description: '404',
        })
      }
      break
    }

    //GA4FUNREQ82
    case 'vtex:cta_click': {
      const ctaClickDataList = e.data.ctaClick
      const linkUrl = getAnalyticWrapperData(ctaClickDataList, 'linkUrl')
      const urlLocation = window.location.origin
      push({
        event: 'cta_click',
        link_url:
          linkUrl === 'Data not available'
            ? linkUrl
            : `${urlLocation}/${linkUrl.replace('/', '')}`,
        link_text: getAnalyticWrapperData(ctaClickDataList, 'linkText'),
        checkpoint: getAnalyticWrapperData(
          ctaClickDataList,
          'checkpoint',
          alternativeValue
        ),
        area: getAnalyticWrapperData(
          ctaClickDataList,
          'area',
          alternativeValue
        ),
        type: getAnalyticWrapperData(
          ctaClickDataList,
          'type',
          alternativeValue
        ),
      })
      break
    }

    //GA4FUNREQ60
    case 'vtex:popup': {
      const { popupId, action } = e.data
      push({
        event: 'popup',
        popup_id: getData(popupId),
        action: getData(action),
      })
      break
    }

    //GA4FUNREQ10
    case 'vtex:ga4-sliderClick': {
      const { urlPath } = e.data
      const sliderClickEvent = {
        event: 'slider_click',
        link_url: getUrlToPush(urlPath),
      }
      pushWithoutDuplicates(sliderClickEvent)
    }

    //GA4FUNREQ16
    case 'vtex:ga4-supportChat': {
      const chat_status = e.data.data.chat_status
        ? e.data.data.chat_status
        : e.data.data?.[0]?.chat_status

      push({
        event: 'support_chat',
        type: 'open',
        chat_status,
      })

      break
    }

    case 'vtex:ga4-chatSupport': {
      const { chatRequest, chatStatus } = e.data.data
      const chatReason = chatRequest ? chatRequest : 'Not Available'

      push({
        event: 'chatSupport',
        eventCategory: 'Chat Support',
        eventAction: 'Request Chat Session',
        eventLabel: `Chat session topic: ${chatReason}`,
        chat_status: chatStatus,
        type: 'confirm',
        chat_request: chatReason,
      })
      break
    }

    //FUNREQ40E
    case "vtex:promoView": {
      let promotions = e.data.promotions
      push({
        event: "eec.promotionView",
        ecommerce: {
          promoView: {
            promotions,
          },
        },
      })
      return
    }

    //FUNREQ40F
    case "vtex:promotionClick": {
      let promotions = e.data.promotions
      push({
        event: "eec.promotionClick",
        ecommerce: {
          promoClick: {
            promotions,
          },
        },
      })
      return
    }

    case "vtex:pageComponentInteraction": {
      if (e.data.id == "optin_granted") {
        push({
          event: e.data.id,
        })
      }
      break
    }

    case "vtex:formSubmission": {
      push({
        event: "formSubmission",
        eventCategory: "Form Submission",
        eventAction: "Support",
      })
      break
    }

    //FUNREQ52
    case "vtex:LeadGeneration": {
      push({
        event: "optin",
        eventCategory: "Lead Generation",
        eventAction: "Optin granted",
        eventLabel: e.data.data,
      })
      break
    }

    case "vtex:popupInteraction": {
      push({
        event: "popupInteraction",
        eventCategory: "Popup",
        eventAction: e.data.data["eventAction"],
        eventLabel: e.data.data["eventLabel"],
      })
      break
    }

    case "vtex:filterBurgerInteraction": {
      push({
        event: "filter_burger_mobile",
        eventCategory: "Facet Tracking",
        eventAction: e.data.action,
      })
      break
    }

    case "vtex:contactClick": {
      push({
        event: "contact_click",
        eventCategory: "Support",
        eventAction: "Contact Click",
        eventLabel: e.data.type,
      })
      break
    }
  }
}
