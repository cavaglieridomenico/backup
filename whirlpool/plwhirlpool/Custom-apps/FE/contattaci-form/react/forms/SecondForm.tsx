import React from 'react'
import { Input} from "vtex.styleguide";
import styles from "../styles.css";
import classnames from "classnames";

interface FormProps {
  fields: {[index: string]: any};
  errors: {[index: string]: any};
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const SecondForm: StorefrontFunctionComponent<FormProps> = (props) => {

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
                <label htmlFor="OrderOrInvoiceNumber">NUMER ZAMÓWIENIA</label>
              </div>
              {errors["OrderOrInvoiceNumber"] ? (
                <span id="OrderOrInvoiceNumberError" className={classnames(styles.inputError)} >
                  {errors["OrderOrInvoiceNumber"]}
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

export default SecondForm;