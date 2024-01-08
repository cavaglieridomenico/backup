import React, { useState, useEffect } from 'react'
import classnames from 'classnames'

import { useCssHandles } from 'vtex.css-handles'
import { CloseButton } from 'vtex.modal-layout'

const CSS_HANDLES = [
  'bannerProductBuyOnline__wrapperOpen',
  'bannerProductBuyOnline__wrapper',
  'modalSpecial__background',
  'modalSpecial__background__open',
  'modalSpecial__container',
  'modalSpecial__container__open',
  'modalSpecial__buttonContainer',
  'modalSpecial__buttonClose',
  'modalSpecial__closeIcon',
  'modalSpecial__contentItems',
  'modalSpecial__scroller',
  'modalSpecial__scrollerOpen',
  'modalSpecial__modalOpenOverflow',
]

export default function FilterModal({ isOpen = false, handleClose, children }) {
  const [openModal, setOpenModal] = useState(isOpen)

  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    setOpenModal(isOpen)
  }, [isOpen])

  return (
    <div
      className={classnames(
        handles.bannerProductBuyOnline__wrapper,
        openModal ? handles.bannerProductBuyOnline__wrapperOpen : ''
      )}
    >
      <div
        className={classnames(
          handles.modalSpecial__background,
          openModal ? handles.modalSpecial__background__open : ''
        )}
      />
      <div
        className={classnames(
          handles.modalSpecial__scroller,
          openModal ? handles.modalSpecial__scrollerOpen : ''
        )}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          // if (handleClose) {
          //   handleClose()
          // }
        }}
      >
        <div
          className={classnames(
            handles.modalSpecial__container,
            openModal ? handles.modalSpecial__container__open : ''
          )}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className={handles.modalSpecial__buttonContainer}>
            <CloseButton label="" />
          </div>
          <div className={handles.modalSpecial__contentItems}>{children}</div>
        </div>
      </div>
    </div>
  )
}
