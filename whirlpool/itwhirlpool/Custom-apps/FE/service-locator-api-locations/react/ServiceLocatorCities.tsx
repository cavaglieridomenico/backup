import React, { useEffect,useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
import styles from './styles.css'
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { FormattedMessage } from 'react-intl'




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
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/cities?brand=WP&country=IT&locale=it_IT&province_id=${province}&region_id=${region}&country_id=Italia`,
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
  console.log(province, cities)
  return   <>
  <Helmet>
    <title> {province ? `Cerca un tecnico ${province} | Whirlpool Italia`: null } </title>
  </Helmet>
  <div className={classnames(styles.container)}>
  <h1 className={classnames(styles.title)}>  <FormattedMessage id="store/service-locator-api-locations.title" /> {province}</h1>
  <p className={classnames(styles.text)}><FormattedMessage id="store/service-locator-api-locations.text" /></p>
  <div>
  <ul className={classnames(styles.list)}> 
  {cities.map((city:city) => <li> 
   <b><Link
     page={'store.custom#service-locator-services'}
     params={{ city: city.label, region:region, province:province }}
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
