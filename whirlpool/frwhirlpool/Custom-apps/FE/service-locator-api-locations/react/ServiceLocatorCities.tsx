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

  useEffect(() => {

    const province = props.params.province
    const region = props.params.region
    setRegion(region)
    setProvince(province)
    let cities:any ={}
    fetch(
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/cities?brand=WP&country=FR&locale=fr_FR&province_id=${province}&region_id=${region}&country_id=France`,
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

        }
      });
  }, []);
  // className={classnames(styles.domandaContainer, 'w100')}
  return   <>
  <Helmet>
    <title> {province ? `Recherchez un technicien ${province} | Whirlpool France`: null } </title>
  </Helmet>
  <div className={classnames(styles.container)}>
  <h1 className={classnames(styles.title)}> Centre de service autorisé Whirlpool - {province}</h1>
  <p className={classnames(styles.text)}>Dans tous les cas, appelez-nous au 09.69.39.1234.* et l'un de nos opérateurs organisera pour vous l'intervention d'un technicien spécialisé appartenant à l'une des 250 stations techniques agréées Whirlpool.
*prix d'un appel local, non surtaxé</p>
  <br></br>
  <br></br>
  <br></br>
  <div>
  <ul className={classnames(styles.list)}> 
  {cities.map((city:city) => <li> 
   <b><Link
     page={'store.custom#service-locator-services'}
     params={{ city: city.slug, region:region, province:province }}
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
