import React, { useEffect, useState } from 'react'
import styles from "./styles.css";

interface ReadMoreProps {
  children: any
}

const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({children}) => {
  const [isReadMoreToggled, setIsReadMoreToggled] = useState(false)

  const [showReadMore, setShowReadMore] = useState(false)
  const handleReadMore = () => {
    //@ts-ignore
    const tags = $(".vtex-rich-text-0-x-paragraph--read-more-text");
    const x = tags.length > 1 ? tags[tags.length-1] : tags[0]; 
    x.style.webkitLineClamp = !isReadMoreToggled ? "25" : "";
    setIsReadMoreToggled(!isReadMoreToggled)
  }
  useEffect(() => {
    //@ts-ignore
    console.log(document.getElementsByClassName("vtex-rich-text-0-x-paragraph--read-more-text")[0])
    //@ts-ignore
    if(document.getElementsByClassName("vtex-rich-text-0-x-paragraph--read-more-text")[0] && document.getElementsByClassName("vtex-rich-text-0-x-paragraph--read-more-text")[0].textContent.length > 0){
      //@ts-ignore
      setShowReadMore(true)
    } 
    
  }, [])
  return (
    <>
      <div className={styles.readMoreContainer}>
        
          <div>
          {children}

          {showReadMore && (
            <div className={styles.readMoreContent} onClick={() => handleReadMore()}>
              {!isReadMoreToggled ? 'read more...': 'read less'}
            </div>
               )}
          </div>
     
      
        
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

