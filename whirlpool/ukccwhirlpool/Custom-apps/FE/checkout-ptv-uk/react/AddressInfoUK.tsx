import React, { FC } from 'react'

/*
  In this component we should set firstly an input field where user put the postalCode, then on the onBlur
  method or something similiar an API GET call to this endpoint /_v/wrapper/api/ptv/{postalCode} should be done 
  passing the inserted postalCode. This will provide us some Streets.
  After this call the other inputs are shown with a dropdown populated with streets retrieved from the previous call.
  Selecting one of this will populate the other input fields.

  Put the block related to this component declared in interfaces.json (address-info-uk) inside shipping-editable-form.address-editable-form
  block from store theme replacing the shipping-editable-form.address-editable-form.address-info block. Now 
  you should be able to see this component in the shipping step Checkout IO
*/
type AddressInfoUKProps = {
  prop: string
}

const AddressInfoUK: FC<AddressInfoUKProps> = ({
  prop
}) => {
  return <>{prop}</>
}

export default AddressInfoUK;
