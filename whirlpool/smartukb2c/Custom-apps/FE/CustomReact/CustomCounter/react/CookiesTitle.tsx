import React from "react";
import { useCssHandles } from 'vtex.css-handles';

type TitleProps = {
  leftText: string,
  textLink: string
  rightText: string
}
interface WindowOptanon extends Window {
  Optanon: any
}

const CSS_HANDLES = [
  "cookieLink",
  "cookieTableContainer"
]
const Title: StorefrontFunctionComponent<TitleProps> = ({ leftText, textLink, rightText }: TitleProps) => {
  let optanon = (window as unknown as WindowOptanon).Optanon;
  const handles = useCssHandles(CSS_HANDLES);
  return (
    <div className={handles.cookieTableContainer}>
      <p className={handles.cookieDescr}>{ leftText } <a className={`${handles.cookieLink} optanon-toggle-display`}  onClick = {()=> optanon.ToggleInfoDisplay()}> { textLink } </a> { rightText }</p>
    </div>
  )}

Title.schema = {
  title: 'editor.cookie-table.title',
  description: 'editor.cookie-table.description',
  type: 'object',
  properties: {
    leftText: {
      title: 'leftText',
      description: 'text on the left of the link',
      type: 'string',
      default: 'You can always change your Cookie settings through the',
    },
    textLink: {
      title: 'textLink',
      description: 'titleTextLink',
      type: 'string',
      default: 'preference center',
    },
    rightText: {
      title: 'rightText',
      description: 'text on the right of the link',
      type: 'string',
      default: '',
    },
  },
}

export default Title
