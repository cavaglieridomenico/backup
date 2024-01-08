import React, { FC } from 'react'
import { CSS_HANDLES } from "./utils/utilsForMessagesController"
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from "react-intl";

/*
  In this component we should handle all the possible messages to show to user in delivery section like "No delivery slots availabele.."
  and also all other messages for Gas appliances or small domestic appliances etc..
*/

type MessagesControllerProps = {
  itemsTypes: ItemType,
  hasSlots: boolean
}

type ItemType = {
  MDA: boolean,
  SDA: boolean,
  OOS: boolean,
  GAS: boolean,
}

const MessagesController: FC<MessagesControllerProps> = ({ itemsTypes, hasSlots }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      {itemsTypes &&
        Object.entries(itemsTypes).map(([key, value]: [string, boolean]) => {
          if (value && key != "MDA")
            return (
              <div className="mb5" key={key}>
                <div className={`${handles.shippingMessageContainer}`}>
                  <span className={`${handles.shippingMessageIcon}`}>
                    <svg height="25" viewBox="0 0 16 16" width="25" xmlns="http://www.w3.org/2000/svg">
                      <g fill="#FFB100">
                        <path d="M7 4h2v5H7z"></path>
                        <circle cx="8" cy="11" r="1"></circle>
                      </g>
                    </svg>
                  </span>
                  <span className={`${handles.shippingMessage}`}>
                    {key == "GAS" && <FormattedMessage id="checkout-hdx-delivery-slots-uk.gas-installation" />}
                    {key == "SDA" && <FormattedMessage id="checkout-hdx-delivery-slots-uk.special" />}
                    {key == "OOS" && <FormattedMessage id="checkout-hdx-delivery-slots-uk.leadtime" />}
                  </span>
                </div>
              </div>)

          else return null
        })}

      {!hasSlots && !itemsTypes.GAS && !itemsTypes.OOS && itemsTypes.MDA && (
        <div className="mb5">
          <div className={`${handles.shippingMessageContainer}`}>
            <span className={`${handles.shippingMessageIcon}`}>
              <svg height="25" viewBox="0 0 16 16" width="25" xmlns="http://www.w3.org/2000/svg">
                <g fill="#FFB100">
                  <path d="M7 4h2v5H7z"></path>
                  <circle cx="8" cy="11" r="1"></circle>
                </g>
              </svg>
            </span>
            <span className={`${handles.shippingMessage}`}>
              <FormattedMessage id="checkout-hdx-delivery-slots-uk.bundle" />
            </span>
          </div>
        </div>
      )}
      {hasSlots && (
         <div className="mb5">
         <div className={`${handles.shippingMessageContainer}`}>
           <span className={`${handles.shippingMessageIcon}`}>
             <svg height="25" viewBox="0 0 16 16" width="25" xmlns="http://www.w3.org/2000/svg">
               <g fill="#FFB100">
                 <path d="M7 4h2v5H7z"></path>
                 <circle cx="8" cy="11" r="1"></circle>
               </g>
             </svg>
           </span>
           <span className={`${handles.shippingMessage}`}>
             <FormattedMessage id="checkout-hdx-delivery-slots-uk.hurry" />
           </span>
         </div>
       </div>
      )}
    </>

  )
}

export default MessagesController;
