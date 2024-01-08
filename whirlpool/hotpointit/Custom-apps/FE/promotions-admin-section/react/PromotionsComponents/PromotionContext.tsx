import React, { FC, createContext, useEffect, useState} from 'react';

const initailValue = (initial:any) => {
  const [data, setData] = useState(initial)
  const [refresh,setRefresh] = useState(false)
  return {
      data,
      setData,
      refresh,
      setRefresh
  }
}

export const PromotionContext = createContext({} as ReturnType<typeof initailValue>)

interface Props{
  children:any
}


const PromotionWrapper: FC<Props> = ({
  children
}) =>{
  let initailValueData : any[] = []
  const [data, setData] = useState(initailValueData)
  const [refresh, setRefresh] = useState(false)
  const [isLoading, setLoading] = useState(true)
  useEffect(()=>{
    const retriveData = async () =>{
      let response = await fetch('/v1/api/promotions/list',{method:"GET"}).then(res => res.json())
      let promotions = response.map((promo:any) => {
        return {
          ...promo,
          categories: promo.categories.map((categorie:any) => categorie.name).join(';'),
          brands: promo.brands.map((brand:any) => brand.name).join(';') ,
          products: promo.products.map((product:any) => product.name).join(';')
        }
      })
      setData(promotions)
      setLoading(false)
    }
    retriveData()

  },[])

  return(!isLoading ? <PromotionContext.Provider value={{data,setData,refresh,setRefresh}}>
    {children}
  </PromotionContext.Provider> : <div className={'loader'}></div>)
}

export default PromotionWrapper
