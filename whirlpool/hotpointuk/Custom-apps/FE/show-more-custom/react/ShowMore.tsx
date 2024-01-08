import React, { useState } from 'react'
import style from "./style.css";

interface ShowMoreProps {
  children: any,
  showMoreLabel: string,
  showLessLabel: string
}

const ShowMore: StorefrontFunctionComponent<ShowMoreProps> = ({children, showMoreLabel, showLessLabel}) => {

  const [show, setShow] = useState(false)


  return (
    <>
    <div className={style.container}>
      <div className={`${show ? style.showMoreContainer : style.hideMoreContainer }`}>
        {children}
      </div>
      <div className={style.button} onClick={() => setShow(!show)}>{show ? showLessLabel : showMoreLabel}</div>
    </div>
    </>
  )
}

ShowMore.schema = {
  title: 'Show More Label',
  description: 'editor.showmore.description',
  type: 'object',
  properties: {
    showMoreLabel : {
      title: "Show More Label",
      description: "Show More Label",
      default: "",
      type: "string"
    },
    showLessLabel : {
      title: "Show Less Label",
      description: "Show Less Label",
      default: "",
      type: "string"
    },
  },
}

export default ShowMore

