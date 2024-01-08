import React, { useState } from "react";
import { Input, Button, RadioGroup } from "vtex.styleguide";
import styles from "./styles.css";
import classnames from "classnames";
import { useIntl, defineMessages } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
// import { string } from "prop-types";
//import DatePicker from "react-datepicker";
//require("react-datepicker/dist/react-datepicker.css");
// \react-datepicker\dist\react-datepicker.css
// import'react-datepicker.css';
// import url('https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.8.0/react-datepicker.min.css')

interface CustomFormProps {
  url: string;
  isReturn: boolean;
  isProduct: boolean;
}

const SubscriberAttributes = {
  FirstName: "",
  Surname: "",
  City: "",
  Address: "",
  ClientEmail: "",
  PhoneNumber: "",
  PickUpAddress: "",
  OrderNumber: "",
  ProductCode: "",
  DeliveredDate: "",
  DocumentTransportNumber: "",
  RefundReason: "",
  Note: "",
  Country: "",
  Zip: "",
  itemType: "",
  WithdrawType: "",
};

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({
  url,
  isReturn,
  isProduct,
}) => {
  /*--- INTL MANAGEMENT ---*/
  const intl = useIntl();

  const { push } = usePixel();

  const [fields, setFields] = useState<{ [index: string]: any }>(
    SubscriberAttributes
  );
  const [errors, setErrors] = useState<{ [index: string]: any }>({});
  const [isLoading, setLoading] = useState(false);
  const [isResponse, setResponse] = useState(false);
  const [isFormValid, setFormValid] = useState(false);
  const [isFieldValid, setFieldValid] = useState(false);
  const [radioGroup, setRadioGroup] = useState({
    value: null,
    error: false,
    errorMessage: "*Champs requis",
  });

  fields["itemType"] = isProduct ? "product" : "accessory";

  // function isValidDate(date: string) {
  // 	// const dateString: string = date.value;
  // 	// First check for the pattern  dd/mm/yyyy dd-mm-yyyy
  // 	if (
  // 		/!(\^\d{1,2}\-\d{1,2}\-\d{4}$\)||!\^\d{1,2}\/\d{1,2}\/\d{4}$)/gm.test(
  // 			date
  // 		)
  // 	)
  // 		return false;
  // 	var parts: any =
  // 		date?.indexOf("/") !== -1 ? date?.split("/") : date?.split("-");

  // 	var day: any = parts ? parseInt(parts[0], 10) : "";
  // 	var month: any = parts ? parseInt(parts[1], 10) : "";
  // 	var year: any = parts ? parseInt(parts[2], 10) : "";

  // 	// Check the ranges of month and year
  // 	if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

  // 	//check if date is future
  // 	var today = new Date().getTime(),
  // 		// idate:any = idate.split("/");

  // 		parts: any = new Date(parts[2], parts[1] - 1, parts[0]).getTime();
  // 	if (today - parts < 0) return false;

  // 	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // 	// Adjust for leap years
  // 	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
  // 		monthLength[1] = 29;

  // 	// Check the range of the day
  // 	return day > 0 && day <= monthLength[month - 1];
  // }
  function ValidateEmail(mail: string) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    return false;
  }
  const submitForm = (e: any) => {
    handleValidation();
    e.preventDefault();
    if (isFormValid) {
      const date = fields["DeliveredDate"];
      const datearray = date.split("/");
      const newdate = datearray[1] + "/" + datearray[0] + "/" + datearray[2];
      fields["DeliveredDate"] = newdate;

      setLoading(true);
      let formToSend: { [index: string]: any } = {};
      formToSend["ContactAttributes"] = {};
      formToSend["Address"] = fields.ClientEmail;
      formToSend["SubscriberKey"] = fields.ClientEmail;
      formToSend["ContactAttributes"]["SubscriberAttributes"] = fields;

      const fetchUrl = url;
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToSend),
      };
      fetch(fetchUrl, options).then((response) => {
        push({ event: "formSubmission" });
        if (response.status === 200) {
          setLoading(false);
          setResponse(true);
        }
      });
    } else {
      Object.entries(errors).forEach((error: any) => {
        push({ event: "errorMessage", data: error[1] });
      });
    }
  };
  const validateField = (field: string) => {
    switch (field) {
      case "FirstName":
      case "Surname":
      case "Address":
      // case "DocumentTransportNumber":
      // case "PickUpAddress":
      case "RefundReason":
      case "City":
      // case "Country":
      //   if (fields[field] === "") {
      //     errors[field] = "Ta wartość nie powinna być pusta.";
      //     setFieldValid(false);
      //   } else {
      //     errors[field] = "";
      //     setFieldValid(true);
      //   }
      //   break;

      case "ClientEmail":
        if (!ValidateEmail(fields["ClientEmail"])) {
          errors["ClientEmail"] = "Wpisz poprawny email.";
          setFieldValid(false);
        } else {
          errors["ClientEmail"] = "";
          setFieldValid(true);
        }
        break;
      case "OrderNumber":
        if (fields["OrderNumber"].length !== 16) {
          errors["OrderNumber"] = "Ta wartość musi mieć dokładnie 16 znaków.";
          setFieldValid(false);
        } else {
          errors["OrderNumber"] = "";
          setFieldValid(true);
        }
        break;
      case "ProductCode":
        if (fields["ProductCode"].length !== 12) {
          errors["ProductCode"] = "Ta wartość musi mieć dokładnie 12 znaków.";
          setFieldValid(false);
        } else {
          errors["ProductCode"] = "";
          setFieldValid(true);
        }
        break;
      // case "DeliveredDate":
      //   if (isValidDate(fields["DeliveredDate"])) {
      //     errors["DeliveredDate"] =
      //       "Ce champ est obligatoire et ne peut pas inclure de date future";
      //     setFieldValid(false);
      //   } else {
      //     errors["DeliveredDate"] = "";
      //     setFieldValid(true);
      //   }
      //   break;
    }
  };
  const handleValidation = () => {
    const erroreMessage = intl.formatMessage(messages.emptyFieldsError);

    setFormValid(false);

    if (fields["FirstName"] == "") {
      errors["FirstName"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["FirstName"] = "";
      setFormValid(true);
    }
    if (!fields["Surname"]) {
      errors["Surname"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["Surname"] = "";
      setFormValid(true);
    }
    if (!fields["Address"]) {
      errors["Address"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["Address"] = "";
      setFormValid(true);
    }
    if (fields["City"] == "") {
      errors["City"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["City"] = "";
      setFormValid(true);
    }
    // if (!fields["documentTransportNumber"]) {
    //   errors["documentTransportNumber"] = erroreMessage;
    //   setFormValid(false);
    // } else {
    //   errors["documentTransportNumber"] = "";
    //   setFormValid(true);
    // }

    // if (!fields["PickUpAddress"]) {
    //   errors["PickUpAddress"] = erroreMessage;
    //   setFormValid(false);
    // } else {
    //   errors["PickUpAddress"] = "";
    //   setFormValid(true);
    // }
    // if (!fields["Country"]) {
    //   errors["Country"] = erroreMessage;
    //   setFormValid(false);
    // } else {
    //   errors["Country"] = "";
    //   setFormValid(true);
    // }
    if (!ValidateEmail(fields["ClientEmail"])) {
      errors["ClientEmail"] = intl.formatMessage(messages.emailFieldsError);
      setFormValid(false);
    } else {
      errors["ClientEmail"] = "";
      setFormValid(true);
    }
    if (fields["OrderNumber"].length !== 12) {
      errors["OrderNumber"] = intl.formatMessage(
        messages.charactersFieldsError
      );
      setFormValid(false);
    } else {
      errors["OrderNumber"] = "";
      setFormValid(true);
    }
    if (fields["ProductCode"].length !== 12) {
      errors["ProductCode"] = intl.formatMessage(
        messages.charactersFieldsError
      );
      setFormValid(false);
    } else {
      errors["ProductCode"] = "";
      setFormValid(true);
    }
    // if (isValidDate(fields["DeliveredDate"]) === false) {
    //   errors["DeliveredDate"] =
    //     "Ce champ est obligatoire et ne peut pas inclure de date future";
    //   setFormValid(false);
    // } else {
    //   errors["DeliveredDate"] = "";
    //   setFormValid(true);
    // }
    if (radioGroup.value === null) {
      setRadioGroup({
        value: null,
        error: true,
        errorMessage: intl.formatMessage(messages.radioGroupErrorMessage),
      });
    }

    setErrors({ ...errors });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    fields[field] = e.target.value;
    setFields({ ...fields });
    handleValidation();
    validateField(field);
  };

  const handleChangeRadioGroup = (e: any) => {
    setRadioGroup({
      value: e.currentTarget.value,
      error: false,
      errorMessage: intl.formatMessage(messages.radioGroupErrorMessage),
    });
  };

  return (
    <div className={classnames(styles.containers)}>
      <form
        name="customForm"
        onSubmit={(e: any) => submitForm(e)}
        className={classnames(styles.formContainer)}
      >
        <div className={classnames(styles.supportReturn)}>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="FirstName">
                {intl.formatMessage(messages.firstName)}
              </label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "FirstName")}
                value={fields["FirstName"]}
                id="FirstName"
                name="FirstName"
                placeholder=""
              />
              {errors.FirstName ? (
                <span
                  id="firstNameError"
                  className={classnames(styles.inputError)}
                >
                  {errors.FirstName}
                </span>
              ) : null}
            </div>
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Surname">
                {intl.formatMessage(messages.lastName)}
              </label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Surname")}
                value={fields["Surname"]}
                id="Surname"
                name="Surname"
                placeholder=""
              />
            </div>
            {errors.Surname ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.Surname}
              </span>
            ) : null}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ClientEmail">
                {intl.formatMessage(messages.email)}
              </label>
            </div>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "ClientEmail")}
              value={fields["ClientEmail"]}
              id="ClientEmail"
              name="ClientEmail"
              placeholder="votre_email@exemple.com"
            />

            {errors.ClientEmail ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.ClientEmail}
              </span>
            ) : null}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div className={classnames(styles.inputTitle)}>
              <label htmlFor="PhoneNumber">
                {intl.formatMessage(messages.phone)}
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="tel"
              // pattern="(\+48)?\s?[0-9]*"
              onChange={(e: any) => handleChange(e, "PhoneNumber")}
              value={fields["PhoneNumber"]}
              id="PhoneNumber"
              name="PhoneNumber"
              placeholder="+33"
            />

            {errors.PhoneNumber ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.PhoneNumber}
              </span>
            ) : null}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="City">{intl.formatMessage(messages.city)}</label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "City")}
              value={fields["City"]}
              id="City"
              name="City"
              placeholder=""
            />

            {errors.City ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.City}
              </span>
            ) : null}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Address">
                {intl.formatMessage(messages.street)}
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "Address")}
              value={fields["Address"]}
              id="Address"
              name="Address"
              placeholder=""
            />

            {errors.Address ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.Address}
              </span>
            ) : null}
          </div>

          {/* {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "frwhirlpool-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="PickUpAddress">
                  ADRESSE OÙ RETIRER LE PRODUIT *
                </label>
              </div>
              <div className={classnames(styles.inputTtitle)}>
                <Input
                  className={classnames(styles.inputTitle)}
                  type="text"
                  id="PickUpAddress"
                  onChange={(e: any) => handleChange(e, "PickUpAddress")}
                  value={fields["PickUpAddress"]}
                  name="PickUpAddress"
                  placeholder=""
                />
              </div>
              {errors.PickUpAddress ? (
                <span
                  id="firstNameError"
                  className={classnames(styles.inputError)}
                >
                  {errors.PickUpAddress}
                </span>
              ) : null}
            </div>
          ) : null} */}
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="OrderNumber">
                {intl.formatMessage(messages.orderNumber)}
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              id="OrderNumber"
              onChange={(e: any) => handleChange(e, "OrderNumber")}
              value={fields["OrderNumber"]}
              name="OrderNumber"
              placeholder=""
            />

            {errors.OrderNumber ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.OrderNumber}
              </span>
            ) : null}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ProductCode">
                {intl.formatMessage(messages.productCode)}
              </label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "ProductCode")}
                value={fields["ProductCode"]}
                id="ProductCode"
                name="ProductCode"
                placeholder=""
                data-error-exactlength="Cette valeur doit être exactement de 12 caractères."
                data-length="12"
              />
            </div>
            {errors.ProductCode ? (
              <span
                id="productCodeError"
                className={classnames(styles.inputError)}
              >
                {errors.ProductCode}
              </span>
            ) : null}
          </div>
          {/* <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="DeliveredDate">
                DATE DE RÉCEPTION DES MARCHANDISES *
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle, "requiredInput")}
              type="text"
              onChange={(e: any) => handleChange(e, "DeliveredDate")}
              value={fields["DeliveredDate"]}
              id="DeliveredDate"
              name="DeliveredDate"
              placeholder="JJ/MM/AAAA"
            />

            {errors.DeliveredDate ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.DeliveredDate}
              </span>
            ) : null}
          </div> */}
          {/* {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="DocumentTransportNumber">
                  N. DOKUMENT TRANSPORTOWY
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) =>
                  handleChange(e, "DocumentTransportNumber")
                }
                value={fields["DocumentTransportNumber"]}
                id="DocumentTransportNumber"
                name="DocumentTransportNumber"
                placeholder=""
              />

              {errors.DocumentTransportNumber ? (
                <span
                  id="documentTransportNumberError"
                  className={classnames(styles.inputError)}
                >
                  {errors.DocumentTransportNumber}
                </span>
              ) : null}
            </div>
          ) : null} */}
          {!isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="RefundReason">
                  {intl.formatMessage(messages.description)}
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "RefundReason")}
                value={fields["RefundReason"]}
                id="RefundReason"
                name="RefundReason"
                placeholder=""
              />
            </div>
          ) : null}

          {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "frwhirlpool-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="returnReason">POWÓD ZWROTU</label>
              </div>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "RefundReason")}
                value={fields["RefundReason"]}
                id="RefundReason"
                name="RefundReason"
                placeholder=""
              />
            </div>
          ) : null}
        </div>
        <br></br>
        <div>
          <span className={classnames(styles.inputTitle)}>
            {intl.formatMessage(messages.comments)}
          </span>
          <textarea
            className={classnames(styles.textArea)}
            id="Note"
            name="Note"
            placeholder="Ecrivez-vos commentaires ici"
            onChange={(e: any) => handleChange(e, "Note")}
            value={fields["Note"]}
            rows={10}
          ></textarea>
        </div>
        <div>
          {isReturn ? (
            <div className={classnames(styles.fotoDanno)}>
              Zdjęcia uszkodzeń należy przesłać na adres elektroniczny:&nbsp;
              <a
                className={classnames(styles.mailTo)}
                href="mailto:eshop@whirlpool.com"
              >
                eshop@whirlpool.com
              </a>
            </div>
          ) : (
            ""
          )}
          <div className={classnames(styles.campiObbligatori)}>
            {intl.formatMessage(messages.required)}
          </div>
        </div>
        <div className={classnames(styles.radioGroup)}>
          <RadioGroup
            hideBorder
            name="withdrawalType"
            error={radioGroup.error}
            errorMessage={radioGroup.error && radioGroup.errorMessage}
            options={[
              {
                value: "home",
                label: intl.formatMessage(messages.firstCheckbox),
              },
              {
                value: "whirlpool",
                label: intl.formatMessage(messages.secondCheckbox),
              },
            ]}
            value={radioGroup.value}
            onChange={(e: any) => handleChangeRadioGroup(e)}
          />
        </div>
        <div className={classnames(styles.privacyLink)}>
          <span>
            {intl.formatMessage(messages.privacyLabel)}
            <a
              className={classnames(styles.privacyLinkText)}
              href="/pages/politique-de-protection-des-donnees-a-caractere-personnel"
            >
              {intl.formatMessage(messages.privacyLinkLabel)}
            </a>
          </span>
        </div>

        {/* <div className={classnames(styles.loaderFormContainer)}>
          <div className={classnames(styles.loaderForm)}></div>
        </div> */}
        {isLoading ? (
          <div className={classnames(styles.loaderFormContainer)}>
            <div className={classnames(styles.loaderForm)}></div>
          </div>
        ) : isResponse ? (
          <div className={classnames(styles.messageText)}>
            <span>{intl.formatMessage(messages.completeMessage)}</span>
            <a className={classnames(styles.formLink)} href="/">
              {intl.formatMessage(messages.completeMessageLink)}
            </a>
          </div>
        ) : (
          <div className={classnames(styles.inviaButton)}>
            <Button
              type="submit"
              id="support_return_product_save"
              name="support_return_product[save]"
              value="Submit"
              disabled={!isFormValid && isFieldValid}
            >
              {intl.formatMessage(messages.buttonLabel)}
            </Button>
          </div>
        )}
      </form>
      {/* {isResponse ? (
        <div>
          <span className={classnames(styles.messageText)}>
            Grazie per averci contattato! Ti abbiamo inviato una email con il
            resoconto dei dati prova prova
          </span>
        </div>
      ) : null} */}
    </div>
  );
};

CustomForm.schema = {
  title: "editor.customForm.title",
  description: "editor.customForm.description",
  type: "object",
  properties: {
    url: {
      title: "url servizio",
      description: "",
      type: "string",
      default: null,
    },
    isReturn: {
      title: "isReturn",
      description: "return o refun",
      type: "boolean",
      default: null,
    },
    isProduct: {
      title: "isProduct",
      description: "prodotto o accessorio",
      type: "boolean",
      default: null,
    },
  },
};

export default CustomForm;

const messages = defineMessages({
  firstName: {
    defaultMessage: "PRÉNOM *",
    id: "store/custom-form-labels.firstName",
  },
  lastName: {
    defaultMessage: "NOM *",
    id: "store/custom-form-labels.lastName",
  },
  email: {
    defaultMessage: "EMAIL *",
    id: "store/custom-form-labels.email",
  },
  phone: {
    defaultMessage: "TÉLÉPHONE",
    id: "store/custom-form-labels.phone",
  },
  city: {
    defaultMessage: "VILLE *",
    id: "store/custom-form-labels.city",
  },
  street: {
    defaultMessage: "RUE *",
    id: "store/custom-form-labels.street",
  },
  orderNumber: {
    defaultMessage: "NUMÉRO DE COMMANDE *",
    id: "store/custom-form-labels.orderNumber",
  },
  productCode: {
    defaultMessage: "CODE PRODUIT *",
    id: "store/custom-form-labels.productCode",
  },
  description: {
    defaultMessage: "DESCRIPTION DES DOMMAGES CONSTATÉS",
    id: "store/custom-form-labels.description",
  },
  comments: {
    defaultMessage: "COMMENTAIRE",
    id: "store/custom-form-labels.comments",
  },
  required: {
    defaultMessage: "*Champs requis",
    id: "store/custom-form-labels.required",
  },
  firstCheckbox: {
    defaultMessage: "Je renvoie le produit(s) par mes propres moyens",
    id: "store/custom-form-labels.firstCheckbox",
  },
  secondCheckbox: {
    defaultMessage:
      "Je souhaite bénéficier de la prise en charge du retour au tarif de 80€ TTC pour le gros éléctroménager ou 40€ TTC (micro-ondes pose libre) selon les modalités qui me seront communiquées et accepte que la somme soit déduite du montant remboursé",
    id: "store/custom-form-labels.secondCheckbox",
  },
  privacyLabel: {
    defaultMessage: "Je comprends le contenu de ",
    id: "store/custom-form-labels.privacyLabel",
  },
  privacyLinkLabel: {
    defaultMessage: "Politique de protection des données personnelles.",
    id: "store/custom-form-labels.privacyLinkLabel",
  },
  buttonLabel: {
    defaultMessage: "ENVOYER",
    id: "store/custom-form-labels.buttonLabel",
  },
  completeMessage: {
    defaultMessage:
      "Merci de nous contacter! Nous vous avons envoyé le rapport de données par e-mail ",
    id: "store/custom-form-labels.firstCompleteMessage",
  },
  completeMessageLink: {
    defaultMessage: "Retour à la page d'accueil",
    id: "store/custom-form-labels.completeMessageLink",
  },
  emptyFieldsError: {
    defaultMessage: "Le champ ne peut pas être vide.",
    id: "store/custom-form-labels.error.emptyFieldsError",
  },
  emailFieldsError: {
    defaultMessage: "Entrez un e-mail valide",
    id: "store/custom-form-labels.error.emailFieldsError",
  },
  charactersFieldsError: {
    defaultMessage: "Cette valeur doit être exactement de 12 caractères.",
    id: "store/custom-form-labels.error.charactersFieldsError",
  },
  radioGroupErrorMessage: {
    defaultMessage: "*Champs obligatoires",
    id: "store/custom-form-labels.error.radioGroupErrorMessage",
  },
});
