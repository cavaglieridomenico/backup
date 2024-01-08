import React, { useEffect,useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
import styles from './styles.css'
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";



interface ServiceLocatorRegionsProps {
}
interface Region {
  id: number
  label: string
  parent_label:string
  slug: string
}
const ServiceLocatorRegions:StorefrontFunctionComponent<ServiceLocatorRegionsProps> = () => {
  const [regions, setRegions] = useState([])
  useEffect(() => {
    let regions:any ={}
    fetch(
      'https://api.d2c.service-locator.wpsandwatch.com/v1/geo/regions?brand=IN&country=IT&locale=it_IT&country_id=Italia',
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
          regions = json.locations.results
          setRegions(regions);

        }
      });
  }, []);
  
  return <>
  <Helmet>
    <title> Cerca un tecnico  | Indesit Italia</title>
  </Helmet>
  <div className={classnames(styles.container)}>
    <h1 className={classnames(styles.title)}> Italia</h1>
    <div className={classnames(styles.list)}>
    <ul> 
      {regions.map((region:Region) =>
        <li> 
        <b><Link
          page={'store.custom#service-locator-provinces'}
          params={{ region: region.label }}
        >
          {region.label}
        </Link></b>
        </li>
      )}
    </ul>
    </div>
  </div>
  </>
}

export default ServiceLocatorRegions
