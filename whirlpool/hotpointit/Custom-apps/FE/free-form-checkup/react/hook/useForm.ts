// import { responsePathAsArray } from 'graphql';
import { useState, useEffect } from 'react'
import { applianceData } from '../utils/appliance-data'

const useForm = (callback: any, validate: any) => {
  const [values, setValues]: any = useState({
    title: 'Sig.',
    firstName: '',
    lastName: '',
    address: '',
    interno: '',
    cap: '',
    city: '',
    province: 'AG',
    email: '',
    email2: '',
    phone: '',
    job: '',
    age: '',
    eu_consumer_brand: false, // should be 1(false) or 2(true)
    eu_consumer_prv: false, // should be N(false) or Y(true)
    appliance_data: [],
  })

  const [applianceDatas, setApplianceDatas]: any = useState([
    {
      category: applianceData[0].category,
      product_id: applianceData[0].model[0].product_id,
      commercial_code: applianceData[0].model[0].commercial_code,
      register: '',
      purchase_date: '',
    },
  ])

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

    setValues({
      ...values,
      [name]: selectedOptions[0].id,
    })
  }

  const handleChangeCheckboxes = (e: any) => {
    const { checked, name } = e.target
    setValues({
      ...values,
      [name]: checked,
    })
  }

  const handleChangeSelectCategory = (e: any, index: any) => {
    const { selectedOptions, name } = e.target

    const commercialCode = applianceData.find(
      (category: any) => category.category == selectedOptions[0].id
    )?.model[0].commercial_code
    const productId = applianceData.find(
      (category: any) => category.category == selectedOptions[0].id
    )?.model[0].product_id

    setApplianceDatas(() => {
      const newApplianceDatas = applianceDatas.slice()
      newApplianceDatas[index][name] = selectedOptions[0].id
      newApplianceDatas[index].commercial_code = commercialCode
      newApplianceDatas[index].product_id = productId
      return newApplianceDatas
    })
  }

  const handleChangeSelectModel = (e: any, index: any) => {
    const { selectedOptions, value } = e.target

    setApplianceDatas(() => {
      const newApplianceDatas = applianceDatas.slice()
      newApplianceDatas[index].commercial_code = value
      newApplianceDatas[index].product_id = selectedOptions[0].id
      return newApplianceDatas
    })
  }

  const handleChangeDate = (date: any, index: any) => {
    if (date != null && date != undefined) {
      // const formattedDate = date
      //   .toLocaleDateString() //Formatto la data in "GG/MM/YYYY"
      //   .split('/') // Divido la data in tre array [GG],[MM],[YYYY]
      //   .reverse() // Faccio il reverse dell'array [YYYY],[MM],[GG]
      //   .join('') // Trasformo in stringa senza virgole YYYYMMGG

      // const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      // const formattedDate = date.toLocaleDateString('it-IT', options)

      setApplianceDatas(() => {
        const newApplianceDatas = applianceDatas.slice()
        newApplianceDatas[index].purchase_date = date
        return newApplianceDatas
      })
    }
  }

  const addSection = (e: any) => {
    e.preventDefault()
    setApplianceDatas(() => {
      const newApplianceDatas = applianceDatas.slice()
      newApplianceDatas.push({
        category: applianceData[0].category,
        product_id: applianceData[0].model[0].product_id,
        commercial_code: applianceData[0].model[0].commercial_code,
        register: '',
        purchase_date: '',
      })
      return newApplianceDatas
    })
  }

  const removeSection = (index: any) => {
    setApplianceDatas(() => {
      const newApplianceDatas = applianceDatas.slice()
      return newApplianceDatas.filter(({}, id: any) => index != id)
    })
  }

  const handleChangeMatricola = (e: any, index: any) => {
    const { name, value } = e.target

    setApplianceDatas(() => {
      const newApplianceDatas = applianceDatas.slice()
      newApplianceDatas[index][name] = value
      return newApplianceDatas
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    setErrors(validate(values, applianceDatas))
    setIsSubmitting(true)
  }

  useEffect(() => {
    if (
      Object.keys(errors).length == 2 &&
      errors.date == null &&
      errors.matricola == null &&
      isSubmitting
    ) {
      callback(values, applianceDatas)
    }
  }, [errors])

  return {
    handleChange,
    handleChangeSelect,
    handleSubmit,
    handleChangeCheckboxes,
    handleChangeSelectCategory,
    handleChangeSelectModel,
    handleChangeMatricola,
    handleChangeDate,
    addSection,
    removeSection,
    values,
    applianceDatas,
    errors,
  }
}

export default useForm
