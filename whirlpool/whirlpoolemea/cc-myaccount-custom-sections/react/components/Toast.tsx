import React, { FC } from 'react';
import style from '../ffstyles.css'

interface TastProps {
  message: string
  error?: boolean | undefined
}

const Toast: FC<TastProps> = ({ message, error }) => {

  return (
  <div className={error ? style.toastContainerError : style.toastContainer}>
    <span className={style.successLabelRemove}>{message}</span>
  </div>
  );
};

export default Toast
