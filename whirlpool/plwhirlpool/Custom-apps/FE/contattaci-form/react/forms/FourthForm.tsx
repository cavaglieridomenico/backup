import React from 'react'
import { Input, Dropdown } from "vtex.styleguide";
import styles from "../styles.css";
import classnames from "classnames";

interface FormProps {
  fields: {[index: string]: any};
  errors: {[index: string]: any};
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const purchaseStageOptions = [
    {label: "PRZYMIERZAM SIĘ DO ZAKUPU", value: "PRZYMIERZAM SIĘ DO ZAKUPU".toLowerCase()},
    {label: "ZAMÓWIENIE ZŁOŻONE", value: "ZAMÓWIENIE ZŁOŻONE".toLowerCase()},
    {label: "ZAMÓWIENIE DOSTARCZONE", value: "ZAMÓWIENIE DOSTARCZONE".toLowerCase()}];

const FourthForm: StorefrontFunctionComponent<FormProps> = (props) => {
    
  const {fields, errors, handleChange} = props;

  return (
        <>
          <div className={classnames(styles.groupInput)}>
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTtitle)}>
                <Input
                  className={classnames(styles.inputTitle)}
                  type="text"
                  onChange={(e: any) => handleChange(e, "Name")}
                  value={fields["Name"]}
                  id="Name"
                  name="Name"
                  placeholder=""
                />
              </div>
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="Name">IMIĘ</label>
              </div>
              {errors.Name ? (
                <span id="NomeError" className={classnames(styles.inputError)}>
                  {errors.Name}
                </span>
              ) : null}
            </div>

            <div className={classnames(styles.singleInput)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Surname")}
                value={fields["Surname"]}
                id="Surname"
                name="Surname"
                placeholder=""
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="Surname">NAZWISKO</label>
              </div>
              {errors.Surname ? (
                <span id="firstNameError" className={classnames(styles.inputError)}>
                  {errors.Surname}
                </span>
              ) : null}
            </div>
          </div>

          <div className={classnames(styles.groupInput)}>
            <div className={classnames(styles.singleInput, "w-100")}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Address")}
                value={fields["Address"]}
                id="Address"
                name="Address"
                placeholder=""
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="Address">ULICA I NR DOMU</label>
              </div>
              {errors.Address ? (
                <span id="IndirizzoError" className={classnames(styles.inputError)} >
                  {errors.Address}
                </span>
              ) : null}
            </div>
          </div>

          <div className={classnames(styles.groupInput)}>
            <div className={classnames(styles.singleInput)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Zip")}
                value={fields["Zip"]}
                id="Zip"
                name="Zip"
                placeholder=""
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="Zip">KOD POCZTOWY</label>
              </div>
              {errors.Zip ? (
                <span id="CapError" className={classnames(styles.inputError)}>
                  {errors.Zip}
                </span>
              ) : null}
            </div>

            <div className={classnames(styles.singleInput)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "City")}
                value={fields["City"]}
                id="City"
                name="City"
                placeholder=""
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="City">MIEJSCOWOŚĆ</label>
              </div>
              {errors.City ? (
                <span id="CittaError" className={classnames(styles.inputError)}>
                  {errors.City}
                </span>
              ) : null}
            </div>
          </div>
          
          <div className={classnames(styles.groupInput)}>
            <div className={classnames(styles.singleInput)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="tel"
                pattern="^((\+)33|)\d{0,9}"
                onChange={(e: any) => handleChange(e, "PhoneNumber")}
                value={fields["PhoneNumber"]}
                id="PhoneNumber"
                name="PhoneNumber"
                placeholder="+48"
              />
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="PhoneNumber">TELEFON</label>
              </div>
            </div>

            <div className={classnames(styles.singleInput)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Email")}
                value={fields["Email"]}
                id="Email"
                name="Email"
                placeholder="twójemail@example.pl"
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="Email">Email</label>
              </div>
              {errors.Email ? (
                <span id="EmailError" className={classnames(styles.inputError)}>
                  {errors.Email}
                </span>
              ) : null}
            </div>
          </div>

          <div className={classnames(styles.title, styles.title2)}>
            <p> Dane zakupu </p>
          </div>

          <div className={classnames(styles.groupInput)}>
            <div className={classnames(styles.singleInput)}>
              <Dropdown
                className={classnames(styles.dropdownnnn)}
                options={purchaseStageOptions}
                onChange={(e: any) => handleChange(e, "StageOfPurchase")}
                value={fields["StageOfPurchase"]}
                id="StageOfPurchase"
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="StageOfPurchase">ETAP TWOJEGO ZAKUPU</label>
              </div>
              {errors["StageOfPurchase"] ? (
                <span id="PurchaseStageError" className={classnames(styles.inputError)} >
                  {errors["StageOfPurchase"]}
                </span>
              ) : null}
            </div>

            <div className={classnames(styles.singleInput, "w-100")}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "OrderOrInvoiceNumber")}
                value={fields["OrderOrInvoiceNumber"]}
                id="OrderOrInvoiceNumber"
                name="OrderOrInvoiceNumber"
                placeholder=""
              />
              <div className={classnames(styles.inputTitle, styles.requiredInput)}>
                <label htmlFor="OrderOrInvoiceNumber">NUMER ZAMÓWIENIA LUB NUMER FAKTURY</label>
              </div>
              {errors["OrderOrInvoiceNumber"] ? (
                <span id="OrderOrInvoiceNumberError" className={classnames(styles.inputError)} >
                  {errors["OrderOrInvoiceNumber"]}
                </span>
              ) : null}
            </div>
          </div>

          <div className={classnames(styles.groupInput)}>
            <div className={classnames(styles.singleInput, "w-100")}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "ProductCode")}
                value={fields["ProductCode"]}
                id="ProductCode"
                name="ProductCode"
                placeholder=""
              />
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="ProductCode">PRODUKTY / KODY PRODUKTÓW (JEŚLI ZAPYTANIE DOTYCZY KONKRETNYCH)</label>
              </div>
              {errors.ProductCode ? (
                <span id="ProductCodeError" className={classnames(styles.inputError)} >
                  {errors.ProductCOde}
                </span>
              ) : null}
            </div>
          </div>

          <div className={classnames(styles.textArea)}>
            <textarea
              className={classnames(styles.textArea)}
              id="Comment"
              name="Comment"
              placeholder=""
              onChange={(e: any) => handleChange(e, "Comment")}
              value={fields["Comment"]}
              rows={10}
            ></textarea>
            <div className={classnames(styles.inputTitle, styles.requiredInput)}>
              <label htmlFor="Comment">MIEJSCE NA TWOJĄ WIADOMOŚĆ / PYTANIE</label>
            </div>
            {errors.Comment ? (
              <span id="SegnalazioneError" className={classnames(styles.inputError)}>
                {errors.Comment}
              </span>
            ) : null}
          </div>
        </>
  )
}

export default FourthForm;