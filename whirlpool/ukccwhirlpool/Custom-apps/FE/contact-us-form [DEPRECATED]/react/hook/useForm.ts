// import { responsePathAsArray } from 'graphql';
import { useState, useEffect } from 'react'
import { usePixel } from "vtex.pixel-manager";

const useForm = (callback: any, validate: any) => {
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
    SupportEmail: "consommateurs_VIP@whirlpool.com",
    BindingAddress: "",
  })
  const { push } = usePixel();

  const [errors, setErrors]: any = useState({})
  const [isSubmitting, setIsSubmitting]: any = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleChangeSelect = (e: any) => {
    const { selectedOptions, name } = e.target
    
    if(name == "Reason") {
      setValues({
      ...values,
      [name]: selectedOptions[0].id
      // SupportEmail: selectedOptions[0].value
    })
    } else {
      setValues({
        ...values,
        [name]: selectedOptions[0].id,
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

    setErrors(validate(values))
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
