import React, { useEffect,useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
import styles from './styles.css'
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";


interface province {
  id: number
  label: string
  parent_label:string
  slug1: string
}
export interface ServiceLocatorProvincesProps {
  params: any;
}
const ServiceLocatorProvinces = (props: ServiceLocatorProvincesProps) => {
  const [provinces, setProvinces] = useState([])
  const [region, setRegion] = useState([])
  useEffect(() => {
    const region = props.params.region
    setRegion(region)
    let provinces:any ={}
    console.log(props);
    console.log(region);

    
    fetch(
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/provinces?brand=WP&country=FR&locale=fr_FR&region_id=${region}&country_id=France`,
      {
        headers: {
          Host: "api.d2c.service-locator.wpsandwatch.com",
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        
        if (json && json.locations) {
          provinces = json.locations.results
          setProvinces(provinces);

        }
      });
  }, []);
  // className={classnames(styles.domandaContainer, 'w100')}
  return <>
  <Helmet>
    <title> {region ? `Recherchez un technicien ${region} | Whirlpool France`: null } </title>
  </Helmet>
  <div className={classnames(styles.container)}>
  <p className={classnames(styles.title)}> Centre de service autorisé Whirlpool - {region}</p>
  <p className={classnames(styles.text)}>Dans tous les cas, appelez-nous au 09.69.39.1234.* et l'un de nos opérateurs organisera pour vous l'intervention d'un technicien spécialisé appartenant à l'une des 250 stations techniques agréées Whirlpool.
*prix d'un appel local, non surtaxé</p>
  <br></br>
  <br></br>

  <br></br>
  <div>
    <ul className={classnames(styles.list)}> 
  {provinces.map((province:province) => <li> 
   <b><Link
     page={'store.custom#service-locator-cities'}
     params={{ province: province.label,region: region }}
   >{province.label}</Link></b>
    
    </li>)} </ul>
    </div>
  </div>
  </>
}
ServiceLocatorProvinces.schema = {
  title: "editor.serviceLocatorProvinces.title",
  description: "editor.serviceLocatorProvinces.description",
  type: "object",
  properties: {
  },
};
export default ServiceLocatorProvinces
