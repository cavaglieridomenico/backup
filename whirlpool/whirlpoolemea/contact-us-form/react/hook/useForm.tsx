import React, { useState, useEffect } from 'react'
import { usePixel } from "vtex.pixel-manager"
import { FormattedMessage } from 'react-intl'
import { getCorrectReasonSupportEmail } from '../utils/reasons'

const useForm = (callback: any, validate: any, regexZipCode: any, reasons: any, isTelephoneRequired: boolean) => {
  const [values, setValues]: any = useState({
    Reason: "",
    Name: "",
    Surname: "",
    Address: "",
    ZipCode: "",
    City: "",
    Phone: "",
    Email: "",
    UserMessage: "",
    SerialNumber: "",
    ModelNumber: "",
    PurchaseDate: "",
    SalePoint: "",
    WarrantyExtension: "",
    EndWarrantyExtension: "",
    WhirlpoolCommunication: false,
    WarrantyCommunication: false,
    SupportEmail: "",
    BindingAddress: "",
  })
  const { push } = usePixel();

  const [errors, setErrors]: any = useState({})
  const [isSubmitting, setIsSubmitting]: any = useState(false)

  //form errors  
  const errEmpty = <FormattedMessage id="store/contact-us-form.cannotBeEmpty" />
  const errEmail = <FormattedMessage id="store/contact-us-form.emailCorrect" />
  const errZip = <FormattedMessage id="store/contact-us-form.zipCodeCorrect" />

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleChangeSelect = (e: any) => {
    const { selectedOptions, name } = e.target
    
    if (name == "Reason") {
      setValues({
        ...values,
        [name]: selectedOptions[0]?.value,
        SupportEmail: getCorrectReasonSupportEmail(reasons, selectedOptions[0]?.value)
      })
    } else {
      setValues({
        ...values,
        [name]: selectedOptions[0]?.value,
      })
    }
  }

  const handleChangeCheckboxes = (e: any) => {
    const { checked, name } = e.target
    setValues({
      ...values,
      [name]: checked,
    })
  }

  const handleChangePurchaseDate = (date: any) => {
    if (date != null && date != undefined) {
      setValues({
        ...values,
        PurchaseDate: date,
      })
    }
  }

  const handleChangeEndWarrantyExtensionDate = (date: any) => {
    if (date != null && date != undefined) {
      setValues({
        ...values,
        EndWarrantyExtension: date,
      })
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setErrors(validate(values, errEmpty, errEmail, errZip, regexZipCode, isTelephoneRequired))
    setIsSubmitting(true)
  }

  useEffect(() => {
    if (
      Object.keys(errors).length == 0 &&
      isSubmitting
    ) {
      callback(values)
    } else {
      Object.entries(errors).forEach((error: any) => {
        push({ event: "errorMessage", data: error[1] });
      });
    }
  }, [errors])

  return {
    handleChange,
    handleChangeSelect,
    handleSubmit,
    handleChangeCheckboxes,
    handleChangePurchaseDate,
    handleChangeEndWarrantyExtensionDate,
    values,
    errors,
    isSubmitting
  }
}

export default useForm
