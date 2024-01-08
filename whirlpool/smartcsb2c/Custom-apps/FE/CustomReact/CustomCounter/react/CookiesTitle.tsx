import React from "react"
interface TitleProps {
  titleTextLink: string
  titleText: string
}
interface WindowOptanon extends Window  {
  Optanon:any
}
const CookiesTitle: StorefrontFunctionComponent<TitleProps> = ({titleTextLink, titleText}) => {
    let optanon = (window as unknown as WindowOptanon).Optanon
    return (
      <div style={{maxWidth:'900px', margin:'0 auto'}}>
        <p>
          <a className='optanon-toggle-display'  onClick={()=>optanon.ToggleInfoDisplay()}style={{cursor:'pointer', fontWeight: 'bold'}}>{titleTextLink}</a> {titleText}
        </p>
      </div>
    )
  }

  CookiesTitle.schema = {
  title: 'editor.cookie-table.title',
  description: 'editor.cookie-table.description',
  type: 'object',
  properties: {
    titleTextLink: {
      title: 'titleTextLink',
      description: 'titleTextLink',
      type: 'string',
      default: 'VOGLIO DEFINIRE LE IMPOSTAZIONI DEI COOKIES',
    },
    titleText: {
      title: 'titleText',
      description: 'titleText',
      type: 'string',
      default: 'per modificare le impostazioni relative ai cookies',
    },
  },
}

export default CookiesTitle
