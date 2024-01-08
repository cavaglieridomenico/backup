import React, { useEffect, useState } from 'react'
import classNames from "classnames"
import styles from "./styles.css"
import { useCssHandles } from 'vtex.css-handles'

interface ScrollListenerWrapperProps {
  blockClass?: string,
  htmlId?: string,
  minPosition?: number

}

const CSS_HANDLES = [
  'scrollListener'
] as const;

const ScrollListenerWrapper: StorefrontFunctionComponent<ScrollListenerWrapperProps> = (
  { 
    children,
    blockClass="",
    htmlId,
    minPosition=0
  }
  
) => {

  let lastPosition = 0;

  const [scrollDirection, setScrollDirection] = useState("none");

  const handleScroll = () => {
    const actualPosition = window.pageYOffset;
    let direction = "none";
    if(actualPosition < minPosition) {
      direction = "none";
    } else if(lastPosition < actualPosition) {
      direction = "down";
    } else if(lastPosition > actualPosition) {
      direction = "up";
    }
    lastPosition = actualPosition;
    setScrollDirection(direction);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { handles } = useCssHandles(CSS_HANDLES, blockClass);
  return (<div
            // className={handles.scrollListener +
            //             (scrollDirection === "up" ? "--scrollUp" : "") +
            //             (scrollDirection === "down" ? "--scrollDown" : "")
            //           }
            // style={scrollDirection === "up" || scrollDirection === "down" ? {position: "fixed"} : {position: "sticky"}}
            className={classNames(handles.scrollListener, 
                                  scrollDirection === "up" ? [styles.wrapperScrollingUp, styles.wrapperStuck] : [], 
                                  scrollDirection === "down" ? [styles.wrapperScrollingDown, styles.wrapperStuck]: [],
                                  scrollDirection === "none" ? [styles.wrapperSticky] : [])}
            id={htmlId}>
              {children}
          </div>)
}


//Stuff for the site editor. Might not need it.
ScrollListenerWrapper.schema = {
  title: 'editor.field.title',
  description: 'editor.field.description',
  type: 'object', 
}

export default ScrollListenerWrapper
