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
  const [decodedCity, setDecodedCity] = useState("")

console.log(city)

  useEffect(() => {

    const region = props.params.region
    const province = props.params.province
    const city = props.params.city
    setCity(city)
    setDecodedCity(decodeURI(city))
    
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
  <h1 className={classnames(styles.title)}> Centre d' Assistance Whirlpool - {decodedCity}</h1>
  <p className={classnames(styles.text)}> Appelez-nous au 02 20 30 </p>
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
