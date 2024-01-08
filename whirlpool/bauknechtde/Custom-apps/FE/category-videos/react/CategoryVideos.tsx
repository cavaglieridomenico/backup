import React, { useEffect, useState } from 'react'
import { useProduct } from "vtex.product-context";
import { useQuery } from 'react-apollo'
import getCategoryVideos from '../graphql/getCategoryVideos.graphql'
import styles from "./style.css"

interface LeadTimeProps {
  title: string
}

const CategoryVideos: StorefrontFunctionComponent<LeadTimeProps> = ({title="We are here to support"}) => {

    const product = useProduct().product;
    const [videos, setVideos] = useState([]);

    const { data } = useQuery(getCategoryVideos, {
      variables: {
        sparePartId: product.productReference.toString()
      }
    })
    useEffect(() => {
      //console.log(data)
      if(data && data["getSupportVideos"]){
        let urls = data["getSupportVideos"]["videoUrls"].map( (r:any) => {
          return r.includes("/embed/") ? r : "https://youtube.com/embed/" + r.split("https://youtu.be/")[1]
        })
        setVideos(urls)
      }
    }, [data])
    return (
      <>

        {videos.length > 0 && (
        <div>

        <h3 className={styles.pdpVideosTitle}>{title}</h3>
        <div  className={styles.pdpVideosWrap}>
               {videos.map((video) => {

          return (
            <div className={styles.pdpVideosItem}>
              <iframe
                width="100%"
                height="100%"
                src={video}
                allow='autoplay; encrypted-media'
                allowFullScreen={true}
                title='video'></iframe>
            </div>
          )
        })
        }
          </div>
        </div>
        )}
      
      </>
    )
}

CategoryVideos.schema = {
  title: 'Lead Time Label',
  description: 'editor.leadtime.description',
  type: 'object',
  properties: {
    title: {
       title: 'Title',
       description: 'Title',
       type: 'string',
       default: '### We are here to support',
    },
  },
}

export default CategoryVideos

