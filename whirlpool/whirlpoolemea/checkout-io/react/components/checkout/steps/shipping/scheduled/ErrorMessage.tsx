import React from 'react';
import style from "../standard/delivery.css";

interface ErrorProps {
  children?: React.ReactNode
}

const ErrorMessage: StorefrontFunctionComponent<ErrorProps> = ({children}) => {
  return (
    <div className={`flex items-center ba ${style.errorContainer}`}>
      <div className={`c-on-base b`}>!</div>
      <span className={style.errorMessageLabel}>{children}</span>
    </div>
  )
}

export default ErrorMessage
