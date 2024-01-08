import React, { FC } from 'react';
import style from '../ffstyles.css'

interface TastProps {
  message: string
  error?: boolean | undefined
}

const Toast: FC<TastProps> = ({ message, error }) => {

  return (
  <div className={style.toastContainer} style={{background: error ? "red" : "#edb112"}}>
    <span className={style.successLabelRemove}>{message}</span>
  </div>
  );
};

export default Toast
