import { useEffect } from 'react'
import { useOrder } from './components/OrderContext'


function Omniconvert() {
  let order = useOrder()
  let value = (order.value/100).toFixed(2)
  
  // console.log(value);

  useEffect(() => {

    let mktz = window._mktz
    if(mktz !== undefined){
      mktz.push(['_Goal','sale',value,{transaction:order.orderId}]);
    }

  },[])
  return (
    <>
    </>
     )
}


export default Omniconvert
