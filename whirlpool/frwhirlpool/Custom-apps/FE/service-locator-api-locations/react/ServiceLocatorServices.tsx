import React, { useEffect,useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
import styles from './styles.css'


interface service {
  name: string
  address: string
  phone:string
}
export interface ServiceLocatorCitiesProps {
  params: any;
}
const ServiceLocatorCities = (props: ServiceLocatorCitiesProps) => {
  const [services, setServices] = useState([])
  const [city, setCity] = useState([])


  useEffect(() => {

    const region = props.params.region
    const province = props.params.province
    const city = props.params.city
    setCity(city)
    let services:any ={}
    fetch(
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/services?brand=WP&country=FR&locale=fr_FR&province_id=${province}&region_id=${region}&country_id=France&cities_id=${city}`,
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
          services = json.locations.results
          setServices(services);
        }
      });
  }, []);
  return   <>
  <div className={classnames(styles.container)}>
  <h1 className={classnames(styles.title)}> Centre de service autorisé Whirlpool -  {city}</h1>
  <p className={classnames(styles.text)}>Dans tous les cas, appelez-nous au 09.69.39.1234.* et l'un de nos opérateurs organisera pour vous l'intervention d'un technicien spécialisé appartenant à l'une des 250 stations techniques agréées Whirlpool.
*prix d'un appel local, non surtaxé</p>
  <br></br>
  <br></br>

  <br></br>
  
  <div className={classnames(styles.list)}> 
  {services.map((service:service) => <p> 
  <b>{service.name}</b><br></br>
  {service.address}<br></br>
  <Link> {service.phone}</Link>

    
    </p>)}</div>
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
