import React, {useState, useEffect} from 'react'
import {getDataFromSessionStorage, saveDataToSessionStorage} from "./utils/sessionStorage";
import { useCssHandles } from 'vtex.css-handles'

interface PopupCustomProps {
  children?: React.ReactNode;
}

const CSS_HANDLES = [
  "containerVisible",
  "containerHidden",
  "closeIcon"
] as const;

const PopupCustom: StorefrontFunctionComponent<PopupCustomProps> = ({children}) => {

  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [isBannerClosed, setIsBannerClosed] = useState<any>('true')
  const handles = useCssHandles(CSS_HANDLES);

  useEffect(() => {
    // At render check if the user already closed the banner in that session
    const isBanner = getDataFromSessionStorage('isBannerClosed')
    setIsBannerClosed(isBanner)
  }, [])

  const closeBanner = () => {
    // Close the banner and set the preference in session storage
    setIsClosed(!isClosed);
    saveDataToSessionStorage('isBannerClosed', 'true')
  }

  return (
    <>
      {
        isBannerClosed !== 'true'
        &&
        <div className={!isClosed ? `${handles.containerVisible} ph3 w-100 flex items-center justify-center bg-action-primary pv2 relative` : `${handles.containerHidden} dn`}>
          {children} 
          <img alt="close icon of stripe banner" onClick={() => closeBanner()} className={`${handles.closeIcon} absolute`} src={"https://itwhirlpool.vteximg.com.br/arquivos/closeIcon.png"}/>
        </div>
      }
    </>
  )
}

PopupCustom.schema = {
  title: 'Stripe - Pop Up Custom',
  description: 'Custom Banner with text and CTA for promos',
  type: 'object',
  properties: {},
}

export default PopupCustom;
