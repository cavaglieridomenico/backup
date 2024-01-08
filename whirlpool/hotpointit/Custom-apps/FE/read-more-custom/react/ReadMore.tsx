import React, { useState} from 'react'
import style from "./style.css";
import {useIntl} from "react-intl";
import { canUseDOM } from 'vtex.render-runtime'

interface ReadMoreProps {
  children: any
}

const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({children}) => {
  const [isReadMoreToggled, setIsReadMoreToggled] = useState(false)

  const intl = useIntl();

  const paragraphContainer = canUseDOM ? document?.getElementsByClassName("vtex-rich-text-0-x-paragraph--read-more-text")?.[0] : null;

  const handleReadMore = () => {
    //@ts-ignore
    const tags = document.getElementsByClassName("vtex-rich-text-0-x-paragraph--read-more-text");
    const x = tags.length > 1 ? tags[tags.length-1] : tags[0];
    //@ts-ignore 
    x.style.webkitLineClamp = !isReadMoreToggled ? "100" : "";
    setIsReadMoreToggled(!isReadMoreToggled)
  }

  return (
    <>
      <div className={style.readMoreContainer}>
        <div>{children}</div>
        {/* @ts-ignore  */}
        {paragraphContainer?.offsetHeight >= 66 && (
          <div className={style.readMoreContent} onClick={handleReadMore}>{!isReadMoreToggled ? (
            intl.formatMessage({id: "read-more.read-more"})
          ) : (intl.formatMessage({id: "read-more.read-less"}))}</div>
        )}
        </div>
    </>
  )
}

ReadMore.schema = {
  title: 'Read More Label',
  description: 'editor.readmore.description',
  type: 'object',
  properties: {
  },
}

export default ReadMore

