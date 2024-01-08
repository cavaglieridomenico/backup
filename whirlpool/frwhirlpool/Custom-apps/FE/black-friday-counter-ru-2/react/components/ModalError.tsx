import React from 'react'
import { FormattedMessage } from "react-intl";
import messages from "../utils/definedMessages"
import style from './style.css'

interface ModalProps {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalError: StorefrontFunctionComponent<ModalProps> = ({ 
  openModal, 
  setOpenModal,
}) => {

  return(
    <div className={style.modalContainer} style={{display: openModal ? "flex" : "none"}}>
      <div className={style.modalWrapper}>
        <img 
          className={style.closeIcon} 
          src="https://frwhirlpool.vtexassets.com/arquivos/close_icon_bf.png" 
          alt="close_icon"
          onClick={() => setOpenModal(false)}
        />
        <p className={style.modalText}>
            <FormattedMessage  {...messages.modalTextError}/>
        </p>
        <button className={style.modalButton} onClick={() => setOpenModal(false)}>
          <FormattedMessage {...messages.modalButton}/>
        </button>
      </div>
    </div>
  )
}

export default ModalError