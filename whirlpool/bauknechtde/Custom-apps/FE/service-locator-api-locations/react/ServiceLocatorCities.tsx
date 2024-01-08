import React, { useEffect,useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
import styles from './styles.css'
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";



interface city {
  id: number
  label: string
  parent_label:string
  slug: string
}
export interface ServiceLocatorCitiesProps {
  params: any;
}
const ServiceLocatorCities = (props: ServiceLocatorCitiesProps) => {
  const [cities, setCities] = useState([])
  const [province, setProvince] = useState([])
  const [region, setRegion] = useState([])
  const [slug, setSlug]:any = useState([])
  const provinceLabel = props.params.slug
    
  useEffect(() => {
    
    const pathname = window?.location?.pathname.split("/")
    const province = props.params.province || pathname[5]
    const region = props.params.region || pathname[4]
    const slug = props.params.slug || province
    setRegion(region)
    setProvince(province)
    let cities:any ={}
    fetch(
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/cities?brand=HP&country=IT&locale=it_IT&province_id=${slug}&region_id=${region}&country_id=Italia`,
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
          cities = json.locations.results
          setCities(cities);
          setSlug(cities)

        }
      });
  }, []);
  // className={classnames(styles.domandaContainer, 'w100')}
  return   <>
  <Helmet>
    <title> {province ? `Centro di assistenza autorizzato Hotpoint ${province} | Hotpoint Italia`: null } </title>
  </Helmet>
  <div className={classnames(styles.container)}>
  <h1 className={classnames(styles.titleCities)}> Centro di Assistenza Autorizzato Hotpoint - {provinceLabel}</h1>
  <p className={classnames(styles.text)}>Chiamaci allo 02 20 30 (o al nostro numero della tua regione che puoi trovare qui sotto) e un nostro operatore richiederà per te l'intervento di un tecnico specializzato appartenente ad uno dei 250 Centri Autorizzati Whirlpool, più vicino a te.</p>
  <br></br>
  <br></br>
  <br></br>
  <div>
  <ul className={classnames(styles.list)}> 
  {cities.map((city:city, index) => <li> 
   <b><Link
     page={'store.custom#service-locator-services'}
     params={{ city: city.label.replace(/ /g, '-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""), region:region, province:province, slug: slug[index].label }}
     className={styles.listCities}
   >{city.label}</Link></b>
    
    </li>)} </ul></div>
  </div>
  </>
}
ServiceLocatorCities.schema = {
  title: "editor.serviceLocatorCities.title",
  description: "editor.serviceLocatorCities.description",
  type: "object",
  properties: {
  },
};
export default ServiceLocatorCities
