import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
interface Props {
  message: string
  message2: string
  btnMessage: string
  linkToRedirect?: string
}

const CSS_HANDLES = ['popUpContainer', 'popUpMessage', 'popUpButton'] as const
export const CustomPopup = ({
  message,
  message2,
  btnMessage,
  linkToRedirect,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)

  const handleClick = () => {
    setIsOpen(false)
    if (linkToRedirect) window.location.replace(linkToRedirect)
  }
  return isOpen ? (
    <div className={handles.popUpContainer}>
      <h3 className={handles.popUpMessage}>{message}</h3>
      <h3 className={handles.popUpMessage}>{message2}</h3>
      <Button className={handles.popUpButton} onClick={handleClick}>
        {btnMessage}
      </Button>
    </div>
  ) : null
}
