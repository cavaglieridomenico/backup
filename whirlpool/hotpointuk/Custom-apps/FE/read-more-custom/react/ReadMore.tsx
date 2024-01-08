import React, { useState } from 'react'
import style from "./style.css";
import { useRuntime } from 'vtex.render-runtime'

interface ReadMoreProps {
  children: any,
  removeMarginLeft: boolean
}

const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({children, removeMarginLeft = false}) => {
  const [isReadMoreToggled, setIsReadMoreToggled] = useState(false)
  const runtime = useRuntime();
  const { account } = runtime;

  const handleReadMore = (event:any) => {

    let tagsSelected = account === "hotpointuk" ? event.currentTarget.parentNode.closest(".hotpointuk-read-more-0-x-readMoreContainer").querySelectorAll(".vtex-rich-text-0-x-paragraph--read-more-text") :  event.currentTarget.parentNode.closest(".hotpointuk-read-more-0-x-readMoreContainer").querySelectorAll(".vtex-rich-text-0-x-paragraph--read-more-text");

    for (let item of tagsSelected) {
      item.style.webkitLineClamp = !isReadMoreToggled ? "15" : "";
    }
    setIsReadMoreToggled(!isReadMoreToggled)
  }

  return (
    <>
      <div className={[style.readMoreContainer, removeMarginLeft ? style.readMoreContainerRemoveMargin :  ""].join(" ")}>
        <div>{children}</div>
        <div className={style.readMoreContent} onClick={handleReadMore}>{!isReadMoreToggled ? 'Read more': 'Read less'}</div>
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

