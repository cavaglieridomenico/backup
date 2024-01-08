// @ts-nocheck
import React, { useContext, useState, useMemo, useEffect } from 'react';
import styles from "./styles.css";
import axios from 'axios';
import { ProductContext } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import getPdpVideos from './graphql/getPdpVideos.graphql'

const PdpVideos = ({ }) => {

  const valuesFromContext = useContext(ProductContext)
  /*if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }*/
  const { product }: { product: product } = valuesFromContext;
  let videos = [];
  const { loading, error, data } = useQuery(getPdpVideos, {
    variables: {
      "productId": parseInt(product.items[0].itemId)
    }
  });
  if (!loading && !error) {
    console.log(data.categoryVideo)
    let urls =  data.categoryVideo.map( r => {
      return r.video.includes("/embed/") ? r.video : "https://youtube.com/embed/" + r.video.split("https://youtu.be/")[1]
    })
    videos = urls
  }

  return (
    <div className={styles.PdpVideos}>
      {videos && videos.length > 0 && (
        <p className={styles.pdpVideosTitle}>
          We are here to support
        </p>
      )}

      <div className={styles.pdpVideosContainer}>
        {videos.map((video) => {
          return (
            <div className={styles.pdpVideosItem}>
              <iframe
                width="100%"
                height="100%"
                src={video}
                frameborder='0'
                allow='autoplay; encrypted-media'
                allowfullscreen
                title='video'></iframe>
            </div>
          )
        })
        }
      </div>
    </div>
  )
}


export default PdpVideos;
