import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['buttonPrimary__container', 'buttonPrimary__label']

export default function ButtonPrimary({
  disabled = false,
  id,
  onClick,
  hasTargetBlank = true,
  width = 'max-content',
  href,
  text = 'APPLICARE',
  isButton = false,
}) {
  const handles = useCssHandles(CSS_HANDLES)
  
  return isButton ? (
    <button
      className={handles.buttonPrimary__container}
      disabled={disabled}
      id={id}
      style={{ width }}
      onClick={onClick}
    >
      <span className={handles.buttonPrimary__label}>{text}</span>
    </button>
  ) : (
    <div id={id} className={handles.buttonPrimary__container} style={{ width }}>
      <a
        className={handles.buttonPrimary__label}
        href={href}
        onClick={onClick}
        target={hasTargetBlank ? '_blank noopener noreferrer' : undefined}
      >
        {text}
      </a>
    </div>
  )
}
