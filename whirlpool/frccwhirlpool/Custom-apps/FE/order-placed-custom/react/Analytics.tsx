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

      let deliveryService = {
        id: "1",
        attachments: [],
        name: "Livraison à domicile",
        price: 0,
        quantity: 1,
        imageUrl: null,
        measurementUnit: "un",
        unitMultiplier: 1,
        type: "additionalService",
        __typename: "BundleItem",
      };
      let garantieService = {
        id: "2",
        attachments: [],
        name: "2 ans de garantie",
        price: 0,
        quantity: 1,
        imageUrl: null,
        measurementUnit: "un",
        unitMultiplier: 1,
        type: "additionalService",
        __typename: "BundleItem",
      };
      let temp: any = []
      order?.analyticsData[0]?.transactionProducts?.map((item:any) => {
        if(item?.categoryIdTree?.includes('2')) {
          temp.push(deliveryService)
        } else {
          temp.push(deliveryService)
          temp.push(garantieService)
        }
      })
      temp.map((item: any)=>{
        transactionProducts.push(item)
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
