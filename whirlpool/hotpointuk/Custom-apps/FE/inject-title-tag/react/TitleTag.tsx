import React from 'react'
import { Helmet } from "react-helmet";
// import style from "./style.css";

interface TitleTagProps {
  titleTag: string
}

const TitleTag: StorefrontFunctionComponent<TitleTagProps> = ({titleTag}) => {

    // console.log(docTitle)
    //document.title = "title tag ciao"
    if(window.location !== undefined) {
      const url = String(window.location.href)
      // const pageNotFound = "Page Not Found: "
      const pageNotFound = titleTag
      const titleName = pageNotFound + url
  
      return (
          <Helmet>
              <title>{titleName}</title>
          </Helmet>
      );
    }
    return null;
}

TitleTag.schema = {
  title: 'Title Tag',
  description: 'editor.titletag.description',
  type: 'object',
  properties: {
    titleTag: {
       title: 'Title tag',
       description: 'This is the text visible in the title page',
       type: 'string',
       default: 'Page Not Found:',
    },
  },
}

export default TitleTag

