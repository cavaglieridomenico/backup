import { useEffect, FC } from 'react'
import { withPixel } from 'vtex.pixel-manager/PixelContext'
import { useRuntime } from 'vtex.render-runtime'
import { useOrderGroup } from './components/OrderGroupContext'

interface Props {
  push: (...args: any) => void
  runtime: any
  eventList: any[]
}

const Analytics: FC<Props> = ({ eventList, push }) => {
  const { route } = useRuntime()
  const order = useOrderGroup()
  useEffect(() => {
    eventList.forEach((event) => push(event))
   
  }, [eventList, push, route.path])
  useEffect(() => {
    if(order.analyticsData){
      let {transactionProducts} = order?.analyticsData[0];
      order?.orders[0]?.items.map((order: any) =>{
        order.bundleItems.map((bundleItem:any)=>{
          bundleItem.type = 'additionalService';
          transactionProducts.push(bundleItem);
        });
      })
      //Check if transactionId already present in localStorage to prevent 
      //servicesPurchase firing at page reload (to have only one eec.purchase event)
      //If localStorage doesn't exist create it
      const localStorageTrIds = localStorage.getItem('__order_ids');
      let transactionIds: string[] = []
      if(!localStorageTrIds) {
        transactionIds.push(order?.analyticsData[0]?.transactionId)
        localStorage.setItem('__order_ids', JSON.stringify(transactionIds))
        push({event: 'servicesPurchase', data: order.analyticsData[0]})
      }
      else {
        transactionIds = JSON.parse(localStorageTrIds)
        //@ts-ignore
        if(!transactionIds.some((item: string) => item == order.analyticsData[0].transactionId)) {
          transactionIds.push(order?.analyticsData[0]?.transactionId)
          localStorage.setItem('__order_ids', JSON.stringify(transactionIds))
          push({event: 'servicesPurchase', data: order.analyticsData[0]})
        }
      }
    }
  }, [])
  return null
}

export default withPixel(Analytics)
