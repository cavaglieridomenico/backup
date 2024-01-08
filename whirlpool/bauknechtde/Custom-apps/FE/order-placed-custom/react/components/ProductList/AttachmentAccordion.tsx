import React, { FC, useState, ReactNode } from 'react'
import { IconCaretDown, IconCaretUp } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from "vtex.styleguide";

interface Props {
  content: ReactNode[]
  beforeTitleLabel?: ReactNode
  titleLabel: ReactNode
  toggleLabel?: ReactNode
  price?: number
  url?: string
}

const CSS_HANDLES = [
  'attachmentWrapper',
  'attachmentHeader',
  'attachmentTitle',
  'attachmentToggleWrapper',
  'attachmentToggleButton',
  'attachmentToggleLabel',
  'attachmentContent',
  'attachmentContentItem',
  "attachmentPrice",
  "attachmentPriceFree",
  "garanziaContainer"
]

const AttachmentAccordion: FC<Props> = ({
  beforeTitleLabel,
  titleLabel,
  toggleLabel,
  content,
  url
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [isOpen, setIsOpen] = useState(false)

  const filteredContent = content.filter(Boolean)
  const hasContent = filteredContent.length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') {
      return
    }
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  const attachmentWrapperClass = `${handles.attachmentWrapper} mt7 bg-muted-5 br2`
  const attachmentHeaderClass = `${handles.attachmentHeader} flex pa5 justify-between items-center`
  const attachmentTitleClass = `${handles.attachmentTitle} c-on-base`
  const attachmentToggleWrapperClass = `${handles.attachmentToggleWrapper} flex items-center`
  const attachmentToggleLabelClass = `${handles.attachmentToggleLabel}`
  const attachmentToggleButtonClass = `${handles.attachmentToggleButton} c-action-primary ml5`
  const attachmentContentClass = `${handles.attachmentContent} ph5 pv3`
  const attachmentContentItemClass = `${handles.attachmentContentItem} mb4 c-muted-1`
  // if it has no attachment content, no accordion is needed
  if (!hasContent && !url) {
    return (
      <div className={attachmentWrapperClass}>
        <div className={attachmentHeaderClass}>
          {beforeTitleLabel}
          <span className={attachmentTitleClass}>{titleLabel}</span>
          <div className={attachmentToggleWrapperClass}>
            <div className={attachmentToggleLabelClass}>{toggleLabel}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasContent && url) {
    return (
      <div style={{margin: "1rem 0 0 0"}}>
      <a
        target="_blank"
        href={url}
      >
        <Button>
        <span>{titleLabel}</span>
        </Button>
      </a>
    </div>
    )
  }

  return (
    <div className={attachmentWrapperClass} aria-expanded={isOpen}>
      <div
        className={attachmentHeaderClass}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
      >
        {beforeTitleLabel}
        <span className={attachmentTitleClass}>{titleLabel}</span>
        <div className={attachmentToggleWrapperClass}>
          <div className={attachmentToggleLabelClass}>{toggleLabel}</div>
          {hasContent && (
            <div className={attachmentToggleButtonClass}>
              {isOpen ? <IconCaretUp /> : <IconCaretDown />}
            </div>
          )}
        </div>
      </div>
      {hasContent && (
        <div hidden={!isOpen} className={attachmentContentClass}>
          {filteredContent.map((line, i) => (
            <div key={i} className={attachmentContentItemClass}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AttachmentAccordion
