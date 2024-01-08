import React, { ChangeEvent, FC, FormEvent, useState, useEffect } from "react";
import Select from 'react-select'
import { FormattedMessage } from "react-intl";
import style from "./styles.css";
import './styles.global.css'
import { execFetch } from './utils/httpReq'

const CouponForm: FC = () => {

  const [promotions, setPromotions]: any = useState([])
  const [promoSelected, setPromoSelected]: any = useState(false)
  const [formFields, setFormFields]: any = useState({})
  const [couponList, setcouponList]: any = useState([])
  const [fileUrl, setfileUrl]: any = useState()
  const [error, setError]: any = useState()


  useEffect(() => {
    execFetch('/api/rnb/pvt/benefits/calculatorconfiguration', 'GET').then(res => {
      setPromotions(res.items.filter((promo: any) => promo.utmSource != "" || (promo.utmCampain && promo.utmCampain != "") || (promo.utmCampaign && promo.utmCampaign != "")))
    }).catch(err => console.error(err))
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formFields)
    execFetch('/v1/coupon/generate', 'POST', formFields).then((response: any) => {
      setcouponList(response.couponlist)
      setfileUrl(response.fileURl)
      setError(response.message)
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.currentTarget
    setFormFields({
      ...formFields,
      [name]: value
    })
  }

  const handleSelectChange = (e: any) => {
    setPromoSelected(true)
    let promoid = e.value
    let promoDetails = promotions.find((p: any) => p.idCalculatorConfiguration == promoid)
    setFormFields({
      ...formFields,
      utmSource: promoDetails.utmSource,
      utmCampaign: promoDetails.utmCampaign ? promoDetails.utmCampaign : promoDetails.utmCampain
    })
    //console.log(promoId)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className={style.inputBlock}>
          <span className={style.inputlabel}> Promo:</span>
          <Select className={style.selectInput} options={promotions?.map((p: any) => {
            return {
              label: p.name,
              value: p.idCalculatorConfiguration
            }
          })} placeholder={<FormattedMessage id="coupon-generator.select_placeholder" />} isSearchable={true} onChange={handleSelectChange} />
        </label>
        <label className={style.inputBlock}>
          <span className={style.inputlabel}>{<FormattedMessage id="coupon-generator.utmSource" />}:</span>
          <input className={!promoSelected ? style.inputField : style.disabled} type="text" name="utmSource" value={formFields.utmSource} onChange={handleChange} disabled={promoSelected}></input>
        </label>
        <label className={style.inputBlock}>
          <span className={style.inputlabel}>{<FormattedMessage id="coupon-generator.utmCampaign" />}:</span>
          <input className={!promoSelected ? style.inputField : style.disabled} type="text" name="utmCampaign" value={formFields.utmCampaign} onChange={handleChange} disabled={promoSelected}></input>
        </label>
        <label className={style.inputBlock}>
          <span className={style.inputlabel}>{<FormattedMessage id="coupon-generator.code" />}:</span>
          <input className={style.inputField} type="text" name="couponCode" required onChange={handleChange}></input>
        </label>
        <label className={style.inputBlock}>
          <span className={style.inputlabel}>{<FormattedMessage id="coupon-generator.quantity" />}:</span>
          <input className={style.inputField} type="number" name="quantity" required onChange={handleChange}></input>
        </label>
        <label className={style.inputBlock}>
          <span className={style.inputlabel}>Email:</span>
          <input className={style.inputField} type="email" name="email" onChange={handleChange}></input>
        </label>
        <button type="submit">{<FormattedMessage id="coupon-generator.submit" />}</button>
      </form>
      <div className={style.responseBlock}>
        {fileUrl ? <span>{<FormattedMessage id="coupon-generator.download-label" />} <a href={fileUrl} target="_blank" rel="noopener noreferrer">{<FormattedMessage id="coupon-generator.download-link" />}</a></span> : null}
        {error && error.length > 0 ? <span>{error}</span> : null}
        <div className={couponList?.length && couponList.length > 0 ? style.couponList : style.hide}>
          {couponList.map((coupon: string) =>
            <span className={style.couponRow}>
              {coupon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
