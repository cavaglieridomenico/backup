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
    let pathname = window?.location?.pathname?.split("/")
    const region = props.params.region || pathname[4]
    const province = props.params.province || pathname[5]
    const slug = props.params.slug || pathname[6]
    setCity(slug)
    let services:any ={}
    
    fetch(
      `https://api.d2c.service-locator.wpsandwatch.com/v1/geo/services?brand=HP&country=IT&locale=it_IT&province_id=${province}&region_id=${region}&country_id=Italia&cities_id=${slug}`,
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
  <h1 className={classnames(styles.titleCity)}> Centro di Assistenza Autorizzato Hotpoint - {city}</h1>
  <p className={classnames(styles.text)}>Chiamaci allo 02 20 30 (o al nostro numero della tua regione che puoi trovare qui sotto) e un nostro operatore richiederà per te l'intervento di un tecnico specializzato appartenente ad uno dei 250 Centri Autorizzati Hotpoint, più vicino a te.</p>
  <br></br>
  <br></br>

  <br></br>
  
  <div className={classnames(styles.list)}> 
  {services.map((service:service) => <p className={styles.serviceName}> 
  <b>{service.name}</b><br></br>
  {service.address}<br></br>
  <Link className={styles.numberLink}> {service.phone}</Link>

    
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
