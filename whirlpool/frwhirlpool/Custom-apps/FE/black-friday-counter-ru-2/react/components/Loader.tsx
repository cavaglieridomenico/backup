import React from 'react'
import { Spinner } from 'vtex.styleguide'
import style from './style.css'

interface LoaderProps {
  openLoader: boolean,
}

const Loader: StorefrontFunctionComponent<LoaderProps> = ({ 
  openLoader
}) => {

  return(
    <div className={style.modalContainer} style={{display: openLoader ? "flex" : "none"}}>
      <div className={style.modalWrapper}>
        <Spinner color="#EDAC09" size={32} />
      </div>
    </div>
  )
}

export default Loader