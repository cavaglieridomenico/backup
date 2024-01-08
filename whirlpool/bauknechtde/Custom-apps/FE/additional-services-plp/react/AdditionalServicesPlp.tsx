import React, {useState, useEffect} from 'react'
import { useProduct } from "vtex.product-context";
import style from './style.css'

interface AdditionalServicesPlpProps { }

const findAdditionalService = (specification:any) =>{
  let add = specification.filter((e:any)=>e.name === "allSpecifications")[0].specifications.filter((e:any) => e.name === 'additionalServices')
  let additionalServices =  add.length > 0 ? add[0].values[0].split(',') : []
  if(additionalServices !== []){
    additionalServices.push('Consegna al piano')
  }
  additionalServices.sort()
  return additionalServices
}

const AdditionalServicesPlp: StorefrontFunctionComponent<AdditionalServicesPlpProps> = ({ }) => {
  const productContextValue = useProduct();
  const [additionalServices, setAdditionalServices] = useState([] as unknown as [string])

  useEffect(() =>{
    setAdditionalServices(findAdditionalService(productContextValue.product.specificationGroups))
  },[])

  return ( <div className={style.container}> {additionalServices.map((add:string) => {
    return <div className={style.additionalService}>{add}</div>
  }) } </div>)
}

AdditionalServicesPlp.schema = {
  title: 'Additional services in plp',
  description: 'Additional services in plp',
  type: 'object',
  properties: {},
}

export default AdditionalServicesPlp
