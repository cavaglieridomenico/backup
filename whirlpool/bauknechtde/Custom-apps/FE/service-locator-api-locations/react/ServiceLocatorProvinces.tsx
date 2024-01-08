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
  const slug = props.params.slug !== undefined ? props.params.slug : window?.location?.pathname?.split("/")[4]

  useEffect(() => {

    const region = props.params.region
    setRegion(region)
    let provinces:any ={}
        
    fetch(
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/provinces?brand=HP&country=IT&locale=it_IT&region_id=${slug}&country_id=Italia`,
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
  
  return <>
  <Helmet>
    <title> {region ? `Centro di assistenza autorizzato Hotpoint ${region} | Hotpoint Italia`: null } </title>
  </Helmet>
  <div className={classnames(styles.container)}>
  <p className={classnames(styles.titleProvince)}> Centro di Assistenza Autorizzato Hotpoint - {slug}</p>
  <p className={classnames(styles.text)}>Chiamaci allo 02 20 30 (o al nostro numero della tua regione che puoi trovare qui sotto) e un nostro operatore richiederà per te l'intervento di un tecnico specializzato appartenente ad uno dei 250 Centri Autorizzati Whirlpool, più vicino a te.</p>
  <br></br>
  <br></br>

  <br></br>
  <div className={classnames(styles.list)}>
    <ul> 
  {provinces.map((province:province) => <li> 
   <b><Link
     page={'store.custom#service-locator-cities'}
     params={{ province: province.label.replace(/ /g, '-').toLowerCase(), region: region, slug: province.label }}
     className={styles.listProvince}
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
