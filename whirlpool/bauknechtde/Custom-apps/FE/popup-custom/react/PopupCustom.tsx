import React, { FC, useEffect, useState } from 'react'
import style from "./style.css";
import { getDataFromSessionStorage, saveDataToSessionStorage } from "./utils/sessionStorage";

const PopupCustom: FC = ({children}) => {
  const [isBannerClosed, setIsBannerClosed] = useState<Boolean>(true);

  useEffect(() => {
    const isClosed = getDataFromSessionStorage('isBannerClosed');
    setIsBannerClosed(isClosed === 'true');
  }, []);

  const closeBanner = () => {
    setIsBannerClosed(true);
    saveDataToSessionStorage('isBannerClosed', 'true');
  };

  return (
    <>
      {
        !isBannerClosed
        &&
        <div className={style.topbarDiv}>
          <div className={style.topbarContent}>
            {children}
          </div>
          <img onClick={() => closeBanner()} className={style.topbarCloseButton} src={require('./assets/closeIcon.png')}/>
        </div>
      }
    </>
  )
};

export default PopupCustom;