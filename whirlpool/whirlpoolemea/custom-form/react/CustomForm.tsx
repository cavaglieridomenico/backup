//applinkata
import React, { useState } from "react";
import { Input, Button } from "vtex.styleguide";
import styles from "./styles.css";
import classnames from "classnames";
//import { FormattedMessage/*, useIntl, defineMessages */} from 'react-intl';
import { usePixel } from "vtex.pixel-manager";

interface CustomFormProps {
  url: string;
  isReturn: boolean;
  isProduct: boolean;
  privacyLinkLabel: string;
  privacyLabel: string;
  privacyLink: string;
  messages: any;
  errorFieldEmpty: string;
  errorWrongEmail: string;
  //errorOrderNumberChars: string;
  //errorProductCodeChars: string;
  errorDateFuture: string;
  successMessageText: string;
  addressFormText: string;
  addressTo: string;
  pickupAddress: string;
  orderNumber: string;
  productCode: string;
  deliveredDate: string;
  documentTransportNumber: string;
  refundReason: string;
  returnReason: string;
  note: string;
  fotoLabel: string;
  supportEmail: string;
  requiredFields: string;
  placeholderNumber: string;
  placeholderEmail: string;
  goBackHome: string;
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
};

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({
  url,
  isReturn,
  isProduct,
  privacyLinkLabel = "Informativa sulla privacy",
  privacyLabel = "Tratteremo le tue informazioni personali in conformità con la nostra ",
  privacyLink = "/pagine/informativa-sulla-privacy",
  errorFieldEmpty = "",
  errorWrongEmail = "",
  //errorOrderNumberChars = "",
  //errorProductCodeChars = "",
  errorDateFuture = "",
  successMessageText = "",
  addressFormText = "",
  addressTo = "",
  pickupAddress = "",
  orderNumber = "",
  productCode = "",
  deliveredDate = "",
  documentTransportNumber = "",
  refundReason = "",
  returnReason = "",
  note = "",
  fotoLabel = "",
  supportEmail = "",
  requiredFields = "",
  placeholderNumber = "",
  placeholderEmail = "",
  goBackHome = "",
}) => {
  const [fields, setFields] = useState<{ [index: string]: any }>(
    SubscriberAttributes
  );
  const [errors, setErrors] = useState<{ [index: string]: any }>({});
  const [isLoading, setLoading] = useState(false);
  const [isResponse, setResponse] = useState(false);
  const [isFormValid, setFormValid] = useState(false);
  const [isFieldValid, setFieldValid] = useState(false);

  fields["itemType"] = isProduct ? "product" : "accessory";

  const { push } = usePixel();

  //GA4FUNREQ58
  const setAnalyticCustomError = () => {
    const ga4Data = {
      event: "ga4-custom_error",
      type: "error message",
      description: "",
    };
    if (Object.keys(errors).length !== 0) {
      for (let prop in errors) {
        if (
          errors[prop] &&
          prop !== "documentTransportNumber" &&
          prop !== "Country"
        ) {
          ga4Data.description = `${prop}: ${errors[prop]}`;
          push({ ...ga4Data });
        }
      }
    }
  };

  function isValidDate(date: string) {
    // const dateString: string = date.value;
    // First check for the pattern  dd/mm/yyyy dd-mm-yyyy
    if (
      /!(\^\d{1,2}\-\d{1,2}\-\d{4}$\)||!\^\d{1,2}\/\d{1,2}\/\d{4}$)/gm.test(
        date
      )
    )
      return false;
    var parts: any =
      date?.indexOf("/") !== -1 ? date?.split("/") : date?.split("-");

    var day: any = parts ? parseInt(parts[0], 10) : "";
    var month: any = parts ? parseInt(parts[1], 10) : "";
    var year: any = parts ? parseInt(parts[2], 10) : "";

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

    //check if date is future
    var today = new Date().getTime(),
      // idate:any = idate.split("/");

      parts: any = new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    if (today - parts < 0) return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
      monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }
  function ValidateEmail(mail: string) {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(mail)) {
      return true;
    }
    return false;
  }
  const submitForm = (e: any) => {
    handleValidation();

    //GA4FUNREQ58
    setAnalyticCustomError();

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
        if (response.status === 200) {
          setLoading(false);
          setResponse(true);
        }
      });
    }
  };
  const validateField = (field: string) => {
    switch (field) {
      case "FirstName":
      case "Surname":
      case "Address":
      case "DocumentTransportNumber":
      case "PickUpAddress":
      case "RefundReason":
      case "City":
      case "Country":
        if (fields[field] === "") {
          errors[field] = errorFieldEmpty;
          setFieldValid(false);
        } else {
          errors[field] = "";
          setFieldValid(true);
        }
        break;

      case "ClientEmail":
        if (!ValidateEmail(fields["ClientEmail"])) {
          errors["ClientEmail"] = errorWrongEmail;
          setFieldValid(false);
        } else {
          errors["ClientEmail"] = "";
          setFieldValid(true);
        }
        break;
      case "OrderNumber":
        //if (fields["OrderNumber"].length !== 16) {
        if (fields["OrderNumber"].length == 0) {
          //errors["OrderNumber"] = errorOrderNumberChars;
          errors["OrderNumber"] = requiredFields;
          setFieldValid(false);
        } else {
          errors["OrderNumber"] = "";
          setFieldValid(true);
        }
        setFieldValid(true);
        break;
      case "ProductCode":
        //if (fields["ProductCode"].length !== 12) {
        if (fields["ProductCode"].length == 0) {
          //errors["ProductCode"] = errorProductCodeChars;
          errors["ProductCode"] = requiredFields;
          setFieldValid(false);
        } else {
          errors["ProductCode"] = "";
          setFieldValid(true);
        }
        setFieldValid(true);
        break;
      case "DeliveredDate":
        if (isValidDate(fields["DeliveredDate"])) {
          errors["DeliveredDate"] = errorDateFuture;
          setFieldValid(false);
        } else {
          errors["DeliveredDate"] = "";
          setFieldValid(true);
        }
        break;
    }
  };
  const handleValidation = () => {
    const erroreMessage = errorFieldEmpty;

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
    if (!fields["documentTransportNumber"]) {
      errors["documentTransportNumber"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["documentTransportNumber"] = "";
      setFormValid(true);
    }

    if (!fields["PickUpAddress"]) {
      errors["PickUpAddress"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["PickUpAddress"] = "";
      setFormValid(true);
    }
    if (!fields["Country"]) {
      errors["Country"] = erroreMessage;
      setFormValid(false);
    } else {
      errors["Country"] = "";
      setFormValid(true);
    }
    if (!ValidateEmail(fields["ClientEmail"])) {
      errors["ClientEmail"] = errorWrongEmail;
      setFormValid(false);
    } else {
      errors["ClientEmail"] = "";
      setFormValid(true);
    }
      //if (fields["OrderNumber"].length !== 16) {
      if (fields["OrderNumber"].length == 0) {
      //errors["OrderNumber"] = errorOrderNumberChars;
      errors["OrderNumber"] = requiredFields;
      setFormValid(false);
    } else {
      errors["OrderNumber"] = "";
      setFormValid(true);
    }
    //if (fields["ProductCode"].length !== 12) {
    if (fields["ProductCode"].length == 0) {
      //errors["ProductCode"] = errorProductCodeChars;
      errors["ProductCode"] = requiredFields;
      setFormValid(false);
    } else {
      errors["ProductCode"] = "";
      setFormValid(true);
    }
    if (isValidDate(fields["DeliveredDate"]) === false) {
      errors["DeliveredDate"] = errorDateFuture;
      setFormValid(false);
    } else {
      errors["DeliveredDate"] = "";
      setFormValid(true);
    }

    setErrors({ ...errors });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    fields[field] = e.target.value;
    setFields({ ...fields });
    handleValidation();
    validateField(field);
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
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="FirstName">Nome *</label>
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
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Surname">Cognome *</label>
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
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ClientEmail">Email *</label>
            </div>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "ClientEmail")}
              value={fields["ClientEmail"]}
              id="ClientEmail"
              name="ClientEmail"
              placeholder={placeholderEmail}
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
              <label htmlFor="PhoneNumber">Telefono</label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="tel"
              pattern="(\+39)?\s?[0-9]*"
              onChange={(e: any) => handleChange(e, "PhoneNumber")}
              value={fields["PhoneNumber"]}
              id="PhoneNumber"
              name="PhoneNumber"
              placeholder={placeholderNumber}
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
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="City">{addressFormText}</label>
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
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Address">{addressTo}</label>
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

          {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="PickUpAddress">{pickupAddress}</label>
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
          ) : null}
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="OrderNumber">{orderNumber}</label>
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
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ProductCode">{productCode}</label>
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
                //data-error-exactlength="Questo valore deve essere esattamente di 12 caratteri."
                //data-length="12"
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
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="DeliveredDate">{deliveredDate}</label>
            </div>

            <Input
              className={classnames(styles.inputTitle, "requiredInput")}
              type="text"
              onChange={(e: any) => handleChange(e, "DeliveredDate")}
              value={fields["DeliveredDate"]}
              id="DeliveredDate"
              name="DeliveredDate"
              placeholder="GG/MM/AAAA"
            />

            {errors.DeliveredDate ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.DeliveredDate}
              </span>
            ) : null}
          </div>
          {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="DocumentTransportNumber">
                  {documentTransportNumber}
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
          ) : null}
          {!isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="RefundReason">{refundReason}</label>
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
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="returnReason">{returnReason}</label>
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
          <span className={classnames(styles.inputTitle)}>{note}</span>
          <textarea
            className={classnames(styles.textArea)}
            id="Note"
            name="Note"
            placeholder="Scrivi le tue note qui"
            onChange={(e: any) => handleChange(e, "Note")}
            value={fields["Note"]}
            rows={10}
          ></textarea>
        </div>
        <div>
          {isReturn ? (
            <div className={classnames(styles.fotoDanno)}>
              {fotoLabel}
              <a
                className={classnames(styles.mailTo)}
                href="mailto:supporto@whirlpool.com"
              >
                {supportEmail}
              </a>
            </div>
          ) : (
            ""
          )}
          <div className={classnames(styles.campiObbligatori)}>
            {requiredFields}
          </div>
        </div>
        {isLoading ? (
          <div className={classnames(styles.loaderFormContainer)}>
            <div className={classnames(styles.loaderForm)}></div>
          </div>
        ) : isResponse ? (
          <div className={classnames(styles.messageText)}>
            <span>{successMessageText}</span>
            <a className={classnames(styles.formLink)} href="/">
              {goBackHome}
            </a>
          </div>
        ) : (
          <div className={classnames(styles.inviaButton)}>
            <p>
              {privacyLabel}
              <a href={privacyLink} className={styles.formLink}>
                {privacyLinkLabel}
              </a>
            </p>
            <Button
              type="submit"
              id="support_return_product_save"
              name="support_return_product[save]"
              value="Submit"
              disabled={!isFormValid && isFieldValid}
            >
              Invia
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

CustomForm.schema = {
  title: "CUSTOM FORM APP",
  description: "Setup for Custom-form-app",
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
      description: "return or refound",
      type: "boolean",
      default: null,
    },
    isProduct: {
      title: "isProduct",
      description: "prodotto o accessorio",
      type: "boolean",
      default: null,
    },
    privacyLabel: {
      title: "privacyLabel",
      description: "Label for privacyLabel",
      default:
        "Tratteremo le tue informazioni personali in conformità con la nostra Informativa sulla Privacy - ",
      type: "string",
    },
    privacyLinkLabel: {
      title: "privacyLinkLabel",
      description: "Label for privacyLinkLabel",
      default: "Privacy Policy",
      type: "string",
    },
    privacyLink: {
      title: "Href",
      description: "Href to privacy policy",
      default: "/pagine/informativa-sulla-privacy",
      type: "string",
    },
    errorFieldEmpty: {
      title: "error Field Empty",
      description: "error message if field required remain empty",
      default: "Required field must be filled",
      type: "string",
    },
    errorWrongEmail: {
      title: "error invalid E-mail",
      description: "error message if invalid email",
      default: "Please, insert a valid e-mail",
      type: "string",
    },
    // errorOrderNumberChars: {
    //   title: "error order number chars",
    //   description: "error message if order number chars are different by 16",
    //   default: "This Order Number must contain exactly 16 chars",
    //   type: "string",
    // },
    // errorProductCodeChars: {
    //   title: "error order number chars",
    //   description: "error message if Product Code chars are different by 12",
    //   default: "Product Code must contain exactly 12 chars",
    //   type: "string",
    // },
    errorDateFuture: {
      title: "error date Future",
      description: "error message if date is empty or future",
      default: "The field is required and cannot include a future date",
      type: "string",
    },
    successMessageText: {
      title: "Message after submit",
      description: "Message of success after submit",
      default:
        "Thanks for contacting us! We have sent you an email with the data report",
      type: "string",
    },
    addressFormText: {
      title: "Address",
      description: "Address form label text",
      default: "Address *",
      type: "string",
    },
    addressTo: {
      title: "Address To",
      description: "Address form label text",
      default: "Address where to pick up the product",
      type: "string",
    },
    pickupAddress: {
      title: "Pickup Address",
      description: "Address where to pick up the product",
      default: "Address where to pick up the product",
      type: "string",
    },
    orderNumber: {
      title: "Order Number",
      description: "Order Number form label text",
      default: "Order number *",
      type: "string",
    },
    productCode: {
      title: "Product Code",
      description: "Product Code form label text",
      default: "Product Code *",
      type: "string",
    },
    deliveredDate: {
      title: "Delivered Date",
      description: "Delivered Date form label text",
      default: "Goods received date *",
      type: "string",
    },
    documentTransportNumber: {
      title: "Transport document number",
      description: "Transport document number form label text",
      default: "Transport document number",
      type: "string",
    },
    refundReason: {
      title: "Refund Reason",
      description: "Refund Reason form label text",
      default: "Reason for the return",
      type: "string",
    },
    returnReason: {
      title: "Return Reason",
      description: "Return Reason form label text",
      default: "Description of the damage detected",
      type: "string",
    },
    note: {
      title: "Note Label",
      description: "Note form label text",
      default: "Description of the damage detected",
      type: "string",
    },
    fotoLabel: {
      title: "Foto Label",
      description: "Note form label text",
      default: "A photo of the damage to the product is required",
      type: "string",
    },
    supportEmail: {
      title: "Email text ",
      description: "Email text where to contact if support needed",
      default: "supporto@whirlpool.com",
      type: "string",
    },
    requiredFields: {
      title: "Required Messages",
      description: "Text advice to says *fields are required",
      default: "*Required fields",
      type: "string",
    },
    placeholderNumber: {
      title: "Placeholder Prefix number form",
      description: "Placeholder Prefix country phone",
      default: "+39",
      type: "string",
    },
    placeholderEmail: {
      title: "Placeholder Email form",
      description: "Placeholder email form",
      default: "youremail@example.com",
      type: "string",
    },
    goBackHome: {
      title: "Text to go back home",
      description: "Text to go back home",
      default: "Go Back Home",
      type: "string",
    },
  },
};

export default CustomForm;
