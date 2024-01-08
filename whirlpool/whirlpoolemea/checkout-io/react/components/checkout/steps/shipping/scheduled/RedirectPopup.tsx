import React from 'react';
import { Button } from 'vtex.styleguide';
import style from "../standard/delivery.css";

interface PopupProps {
  popupTitle: string;
  popupText: string;
  popupCtaLabel: string;
  popupCtaAction: () => void;
}

const RedirectPopup:StorefrontFunctionComponent<PopupProps> = ({popupTitle, popupText, popupCtaLabel, popupCtaAction}) => {
  return (
    <div className={`flex items-center justify-center ${style.popupContainer}`}>
      <div className={`flex flex-column ${style.popup}`}>
        <div className='flex items-center'>
          <div className={`c-on-base b mr4`}>!</div>
          <span className={`c-on-base b ${style.errorMessageLabel}`}>{popupTitle}</span>
        </div>
        <div className='mt5'>
          <span className={style.errorMessageLabel}>{popupText}</span>
        </div>
        <div className="flex justify-center mt6">
          <Button onClick={popupCtaAction} block variation="primary" type="button">
            {popupCtaLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RedirectPopup
