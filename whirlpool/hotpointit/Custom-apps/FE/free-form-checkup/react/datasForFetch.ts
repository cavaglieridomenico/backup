export default function DatasForFetch(values: any, applianceDatas: any) {
  const formatApllianceDate = applianceDatas => {
    const newApplianceDatas = JSON.parse(JSON.stringify(applianceDatas))
    newApplianceDatas.forEach(({}, index) => {
      if (
        newApplianceDatas[index].purchase_date != null &&
        newApplianceDatas[index].purchase_date != undefined
      ) {
        newApplianceDatas[index].purchase_date = new Date(
            newApplianceDatas[index].purchase_date
        ).toISOString()
      }
    })

    return newApplianceDatas
  }

  const fetchDatas = {
    appliance_data: formatApllianceDate(applianceDatas),
    person_data: {
      firstname: values.firstName,
      lastname: values.lastName,
      title_key: values.title,
    },
    address_data: {
      email: values.email,
      street: values.address,
      street_int: values.interno,
      cap: values.cap,
      city: values.city,
      province: values.province,
      telephone: values.phone,
    },
    mkt_data: {
      eu_consumer_brand: values.eu_consumer_brand,
      eu_consumer_prv: values.eu_consumer_prv,
      eu_consumer_age: values.age,
      eu_cu_segmentation: values.job,
    },
  }
  //console.log(fetchDatas)
  //debugger
  return fetchDatas
}
