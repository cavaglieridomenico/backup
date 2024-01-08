import React, { FC } from 'react';
import style from '../ffstyles.css'
import { useSection } from '../providers/context';


const ModalContainer: FC = ({children}) => {
  const { expiredEmail } = useSection()

  document.body.style.overflow = expiredEmail ? "hidden" : 'auto'

   return (
  <div className={style.modalContainer}>
    <div className={style.modalContent}>{children}</div>
  </div>);
};

export default ModalContainer
