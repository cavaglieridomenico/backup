import React from 'react'
import FeReady from './FeReady';
import { NotFoundEvent } from './NotFoundEvent';

interface AnalyticsProps {
  pageType:'staticPage'|'plp'|'pdp'
  pageTypeEvent:'home'|'search'|'contact'|'detail'|'category'|'cart'|'checkout'|'purchase'|'other'|'error'
}
interface WindowGTM extends Window { dataLayer: any[]; }

const Analytics: StorefrontFunctionComponent<AnalyticsProps> = ({pageType = 'staticPage',pageTypeEvent="other"}) => {
  console.log('in analytics');
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  return <>
    <FeReady dataLayer={dataLayer} pageType={pageType} pageTypeEvent={pageTypeEvent}></FeReady>
    <NotFoundEvent dataLayer={dataLayer} pageType={pageTypeEvent}></NotFoundEvent>
  </>
}

Analytics.schema = { 
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
  },
  pageType:{
    title:"Page type",
    description:"Type of the page, choise among 'staticPage', 'plp', 'pdp'",
    default:"",
    type:"string"
  },
  pageTypeEvents:{
    title:"Page type events",
    description:"Type of page printed on event",
    default:"",
    type:"string"
  }
}

export default Analytics
