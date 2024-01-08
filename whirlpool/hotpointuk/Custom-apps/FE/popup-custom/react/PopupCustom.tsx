import React, {FC, useEffect, useState} from 'react'
import style from "./style.css";
import closeIcon from "./assets/closeIcon-white.svg"
import {getDataFromSessionStorage, saveDataToSessionStorage} from "./utils/sessionStorage";

const PopupCustom: FC = ({children}) => {

  const [isClosed, setIsClosed] = useState(false);
  const [isBannerClosed, setIsBannerClosed]: any = useState('false')

  useEffect(() => {
    const isBanner = getDataFromSessionStorage('isBannerClosed')
    setIsBannerClosed(isBanner)
  }, [])

  const closeBanner = () => {
    setIsClosed(!isClosed);
    saveDataToSessionStorage('isBannerClosed', 'true')
  }

  return (
    <>
      {
        isBannerClosed !== 'true'
        &&
        <div className={!isClosed ? style.popupDiv : style.hide}>
          {children}
          <img onClick={() => closeBanner()} className={style.closeButton} src={closeIcon}/>
        </div>
      }
    </>
  )
}


export default PopupCustom

