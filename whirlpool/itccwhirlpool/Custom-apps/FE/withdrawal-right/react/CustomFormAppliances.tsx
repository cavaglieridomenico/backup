//applinkata
import React, { useState, useReducer, useEffect } from "react";
import { Input, Button } from "vtex.styleguide";
import { useIntl } from "react-intl";
import { production, useRuntime } from "vtex.render-runtime";
import styles from "../react/style.css";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { useMutation } from "react-apollo";
import TECHNICAL_ASSISTANCE from "../graphql/technicalAssistanceMutation.graphql";

interface CustomFormProps {
  url?: string;
  isReturn?: boolean;
  isProduct?: boolean;
  privacyLinkLabel: string;
  privacyLabel: string;
  privacyLink: string;
  supportEmail: string;
  showAssistenza?: boolean;
}
interface MutationVariables {
  acronym: string;
  document: {
    fields: Array<{
      key: string;
      value?: string | null;
    }>;
  };
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
  ReturnReason: "",
  Note: "",
  Country: "",
  Zip: "",
  itemType: "",
  PostalCode: "",
  Brand: "",
  BadgeNumber: "",
  IndustrialCode: "",
  ProductLine: "",
};

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
});

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({
  url,
  isReturn,
  isProduct,
  privacyLabel,
  supportEmail = "directsalesonline@whirlpool.com",
  showAssistenza,
}) => {
  const [form, dispatch] = useReducer(reducer, SubscriberAttributes);
  const [isLoading, setLoading] = useState(false);
  const [isResponse, setResponse] = useState(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [assistanceCheckbox, setAssistanceCheckbox] = useState<boolean>(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setIsModalOpen(false);
      }, 5000);
    }
  }, [isModalOpen]);

  // Handle Input onBlur
  const handleBlur = (e: any) => {
    errors[e.target.name] = !e.target.validity.valid || !e.target.value;
  };

  const intl = useIntl();
  const { culture } = useRuntime();

  const validateProductCode = (value: any) => {
    return value.length == 12;
  };
  const validateOrdenumber = (value: any) => {
    return value.length == 13;
  };
  const phoneNumber = (value: any) => {
    return /^\d*\.?\d*$/.test(value);
  };
  function ValidateEmail(mail: string) {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(mail)) {
      return true;
    }
    return false;
  }

  const errors: any = {
    FirstName: !form.FirstName,
    Surname: !form.Surname,
    Address: !form.Address,
    ClientEmail: !ValidateEmail(form.ClientEmail),
    PhoneNumber: !phoneNumber(form.PhoneNumber),
    PickUpAddress: isReturn ? !form.PickUpAddress : false,
    OrderNumber: showAssistenza ? false : !validateOrdenumber(form.OrderNumber),
    ProductCode: !validateProductCode(form.ProductCode),
    DeliveredDate: form.DeliveredDate > currentDate && true,
    City: !form.City,
    DocumentTransportNumber: false,
    ReturnReason: isReturn ? !form.ReturnReason : false,
    //RefundReason: !form.RefundReason,
    Note: showAssistenza ? !form.Note : false,
    //Country: !form.Country,
    //Zip: !form.Zip,
    itemType: !form.itemType,
    PostalCode: showAssistenza ? !form.PostalCode : false,
  };

  form["itemType"] = isProduct ? "product" : "accessory";
  const [contactUs, { loading: mutationloading }] = useMutation<
    unknown,
    MutationVariables
  >(TECHNICAL_ASSISTANCE, {
    onCompleted: () => {
      setIsModalOpen(true);
    },
  });

  const handleSubscription = () => {
    const date = form["DeliveredDate"];
    const datearray = date.split("/");
    //const newdate = datearray[1] + "/" + datearray[0] + "/" + datearray[2];
    form["DeliveredDate"] = datearray;

    let formToSend: { [index: string]: any } = {};
    formToSend["ContactAttributes"] = {};
    formToSend["Address"] = form.ClientEmail;
    formToSend["Locale"] = culture.locale;
    formToSend["SubscriberKey"] = form.ClientEmail;
    formToSend["ContactAttributes"]["SubscriberAttributes"] = form;
    formToSend = {
      ...formToSend.ContactAttributes.SubscriberAttributes,
      AssistanceExtension: assistanceCheckbox,
    };

    //mutation
    let warranty = formToSend.AssistanceExtension == true ? "Si" : "No";
    const variables: MutationVariables = {
      acronym: "CU",
      document: {
        fields: [
          { key: "Name", value: `${formToSend.FirstName}` },
          { key: "Surname", value: `${formToSend.Surname}` },
          { key: "Email", value: `${formToSend.ClientEmail}` },
          { key: "Phone", value: `${formToSend.PhoneNumber}` },
          { key: "City", value: `${formToSend.City}` },
          { key: "Address", value: `${formToSend.Address}` },
          { key: "ZipCode", value: `${formToSend.PostalCode}` },
          { key: "ModelNumber", value: `${formToSend.ProductCode}` },
          { key: "Brand", value: `${formToSend.Brand}` },
          { key: "SerialNumber", value: `${formToSend.BadgeNumber}` },
          { key: "CommercialCode", value: `${formToSend.IndustrialCode}` },
          { key: "ProductSeries", value: `${formToSend.ProductLine}` },
          { key: "PurchaseDate", value: `${formToSend.DeliveredDate}` },
          {
            key: "WarrantyExtension",
            value: warranty,
          },
          { key: "Reason", value: `${formToSend.Note}` },
          { key: "Locale", value: `${culture.locale}` },
        ],
      },
    };

    const newBody = {
      locale: `${culture?.locale}`,
      Address: `${form?.ClientEmail}`,
      SubscriberKey: `${form?.ClientEmail}`,
      ContactAttributes: {
        SubscriberAttributes: {
          FirstName: `${form?.FirstName}`,
          Surname: `${form?.Surname}`,
          City: `${form?.City}`,
          Address: `${form?.Address}`,
          ClientEmail: `${form?.ClientEmail}`,
          PhoneNumber: `${form?.PhoneNumber}`,
          PickUpAddress: `${form?.PickUpAddress}`,
          OrderNumber: `${form?.OrderNumber}`,
          ProductCode: `${form?.ProductCode}`,
          DeliveredDate: `${
            form?.DeliveredDate[0] ? form?.DeliveredDate[0] : ""
          }`,
          DocumentTransportNumber: `${form?.DocumentTransportNumber}`,
          RefundReason: `${form?.RefundReason}`,
          Note: `${form?.Note}`,
          Country: `${culture?.language?.toUpperCase()}`,
          Zip: `${form?.PostalCode}`,
          itemType: window?.location?.href?.includes("accessori")
            ? "accessory"
            : "product",
          WithdrawType: "",
        },
      },
    };

    const mutationResult = contactUs({
      variables,
    });
    !production && console.log("mutationResult", mutationResult);
    !production && console.log("variables", variables);

    const fetchUrl = url ? url : "";
    if (!showAssistenza) {
      setLoading(true);
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBody),
      };
      fetch(fetchUrl, options).then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setResponse(true);
        }
      });
    }
    setShowErrors(false);
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    //if are no one errors
    if (!validateProductCode(form.ProductCode)) {
      (errors.ProductCode = true), setShowErrors(true);
      return;
    }
    if (form.DeliveredDate > currentDate) {
      (errors.DeliveredDate = true), setShowErrors(true);

      return;
    }
    if (!ValidateEmail(form.ClientEmail)) {
      (errors.ClientEmail = true), setShowErrors(true);
      return;
    } else {
      (errors.ClientEmail = false), setShowErrors(false);
    }

    if (showAssistenza && form.PostalCode.trim().length === 0) {
      (errors.PostalCode = true), setShowErrors(true);
      return;
    }
    if (showAssistenza && form.Note.trim().length === 0) {
      (errors.Note = true), setShowErrors(true);

      return;
    }
    if (showAssistenza && form.PhoneNumber.trim().length === 0) {
      (errors.Note = true), setShowErrors(true);

      return;
    }

    if (!showAssistenza && !validateOrdenumber(form.OrderNumber)) {
      (errors.OrderNumber = true), setShowErrors(true);
      return;
    }

    if (!Object.values(errors).some((errorBoolean) => errorBoolean)) {
      handleSubscription();
    } else {
      setShowErrors(true);
    }
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
              <label htmlFor="FirstName">
                <FormattedMessage id="store/custom-form.firstname" />
              </label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.FirstName}
                id="FirstName"
                name="FirstName"
                placeholder=""
              />
              {showErrors && errors.FirstName && (
                <span className={classnames(styles.inputError)}>
                  <FormattedMessage id="store/custom-form.field-empty" />
                </span>
              )}
            </div>
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Surname">
                <FormattedMessage id="store/custom-form.surname" />
              </label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.Surname}
                id="Surname"
                name="Surname"
                placeholder=""
              />
            </div>
            {showErrors && errors.Surname && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.field-empty" />
              </span>
            )}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ClientEmail">
                <FormattedMessage id="store/custom-form.email" />
              </label>
            </div>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.ClientEmail}
              id="ClientEmail"
              name="ClientEmail"
              placeholder={intl.formatMessage({
                id: "store/custom-form.email-placeholder",
              })}
            />
            {showErrors && errors.ClientEmail && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.wrong-mail" />
              </span>
            )}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div className={classnames(styles.inputTitle)}>
              <label htmlFor="PhoneNumber">
                <FormattedMessage id="store/custom-form.phone" />
                {showAssistenza && `*`}
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="tel"
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.PhoneNumber}
              id="PhoneNumber"
              name="PhoneNumber"
              placeholder={intl.formatMessage({
                id: "store/custom-form.phone-placeholder",
              })}
            />
            {showErrors && errors.PhoneNumber && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.wrong-phone-number" />
              </span>
            )}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="City">
                <FormattedMessage id="store/custom-form.city" />
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.City}
              id="City"
              name="City"
              placeholder=""
            />
            {showErrors && errors.City && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.field-empty" />
              </span>
            )}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Address">
                <FormattedMessage id="store/custom-form.address" />
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.Address}
              id="Address"
              name="Address"
              placeholder=""
            />
            {showErrors && errors.Address && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.field-empty" />
              </span>
            )}
          </div>

          {isReturn && (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="PickUpAddress">
                  <FormattedMessage id="store/custom-form.address-to" />
                </label>
              </div>
              <div className={classnames(styles.inputTtitle)}>
                <Input
                  className={classnames(styles.inputTitle)}
                  type="text"
                  id="PickUpAddress"
                  onChange={(e: any) => dispatch(e.target)}
                  onBlur={handleBlur}
                  value={form.PickUpAddress}
                  name="PickUpAddress"
                  placeholder=""
                />
              </div>
              {showErrors && errors.PickUpAddress && (
                <span className={classnames(styles.inputError)}>
                  <FormattedMessage id="store/custom-form.field-empty" />
                </span>
              )}
            </div>
          )}
          {showAssistenza ? (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="PostalCode">
                  <FormattedMessage id="store/custom-form.postal-code" />
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                id="PostalCode"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.PostalCode}
                name="PostalCode"
                placeholder=""
              />
              {showErrors && errors.PostalCode && (
                <span className={classnames(styles.inputError)}>
                  <FormattedMessage id="store/custom-form.field-empty" />
                </span>
              )}
            </div>
          ) : (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="OrderNumber">
                  <FormattedMessage id="store/custom-form.order-number" />
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                id="OrderNumber"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.OrderNumber}
                name="OrderNumber"
                placeholder=""
              />
              {showErrors && errors.OrderNumber && (
                <span className={classnames(styles.inputError)}>
                  <FormattedMessage id="store/custom-form.thirteen-chars" />
                </span>
              )}
            </div>
          )}
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ProductCode">
                <FormattedMessage id="store/custom-form.product-code" />
              </label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.ProductCode}
                id="ProductCode"
                name="ProductCode"
                placeholder=""
                data-error-exactlength="Questo valore deve essere esattamente di 12 caratteri."
                data-length="12"
              />
            </div>
            {showErrors && errors.ProductCode && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.twelve-chars" />
              </span>
            )}
          </div>
          {showAssistenza && (
            <>
              <div className={classnames(styles.singleInput)}>
                <div
                  className={classnames(
                    styles.inputTitle,
                    "itwhirlpoolqa-custom-form-0-x-requiredInput"
                  )}
                >
                  <label htmlFor="Brand">
                    <FormattedMessage id="store/custom-form.Brand" />
                  </label>
                </div>
                <div className={classnames(styles.inputTtitle)}>
                  <Input
                    className={classnames(styles.inputTitle)}
                    type="text"
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    value={form.Brand}
                    id="Brand"
                    name="Brand"
                    placeholder=""
                  />
                </div>
              </div>
              {/* BRAND */}
              <div className={classnames(styles.singleInput)}>
                <div
                  className={classnames(
                    styles.inputTitle,
                    "itwhirlpoolqa-custom-form-0-x-requiredInput"
                  )}
                >
                  <label htmlFor="BadgeNumber">
                    <FormattedMessage id="store/custom-form.BadgeNumber" />
                  </label>
                </div>
                <div className={classnames(styles.inputTtitle)}>
                  <Input
                    className={classnames(styles.inputTitle)}
                    type="text"
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    value={form.BadgeNumber}
                    id="BadgeNumber"
                    name="BadgeNumber"
                    placeholder=""
                  />
                </div>
              </div>
              {/* BadgeNumber */}
              <div className={classnames(styles.singleInput)}>
                <div
                  className={classnames(
                    styles.inputTitle,
                    "itwhirlpoolqa-custom-form-0-x-requiredInput"
                  )}
                >
                  <label htmlFor="IndustrialCode">
                    <FormattedMessage id="store/custom-form.IndustrialCode" />
                  </label>
                </div>
                <div className={classnames(styles.inputTtitle)}>
                  <Input
                    className={classnames(styles.inputTitle)}
                    type="text"
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    value={form.IndustrialCode}
                    id="IndustrialCode"
                    name="IndustrialCode"
                    placeholder=""
                  />
                </div>
              </div>
              {/* IndustrialCode */}
              <div className={classnames(styles.singleInput)}>
                <div
                  className={classnames(
                    styles.inputTitle,
                    "itwhirlpoolqa-custom-form-0-x-requiredInput"
                  )}
                >
                  <label htmlFor="ProductLine">
                    <FormattedMessage id="store/custom-form.ProductLine" />
                  </label>
                </div>
                <div className={classnames(styles.inputTtitle)}>
                  <Input
                    className={classnames(styles.inputTitle)}
                    type="text"
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    value={form.ProductLine}
                    id="ProductLine"
                    name="ProductLine"
                    placeholder=""
                  />
                </div>
              </div>
              {/* ProductLine */}
            </>
          )}
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "itwhirlpoolqa-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="DeliveredDate">
                <FormattedMessage id="store/custom-form.delivered-date" />
              </label>
            </div>

            <Input
              className={classnames(styles.inputTitle, "requiredInput")}
              type="date"
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.DeliveredDate}
              id="DeliveredDate"
              name="DeliveredDate"
              /*  placeholder={intl.formatMessage({
                id: "store/custom-form.date-placeholder",
              })} */
            />
            {showErrors && errors.DeliveredDate && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.date-required" />
              </span>
            )}
          </div>

          {showAssistenza && (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <div className={styles.assistanceCheckboxContainer}>
                  <input
                    type="checkbox"
                    id="AssistanceExtension"
                    name="AssistanceExtension"
                    value={form.AssistanceExtension}
                    onChange={(e: any) =>
                      setAssistanceCheckbox(e.target.checked)
                    }
                  />

                  <label
                    htmlFor="AssistanceExtension"
                    className={styles.checkboxLabel}
                  >
                    <FormattedMessage id="store/custom-form.AssistanceExtension" />
                  </label>
                </div>
              </div>
              <div className={`${classnames(styles.inputTtitle)} `}></div>
            </div>
          )}
          {/* AssistanceExtension */}
          {isReturn && (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="DocumentTransportNumber">
                  <FormattedMessage id="store/custom-form.document-transport-number" />
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.DocumentTransportNumber}
                id="DocumentTransportNumber"
                name="DocumentTransportNumber"
                placeholder=""
              />
            </div>
          )}

          {!isReturn && !showAssistenza && (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="RefundReason">
                  <FormattedMessage id="store/custom-form.refund-reason" />
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                value={form.RefundReason}
                id="RefundReason"
                name="RefundReason"
                placeholder=""
              />
            </div>
          )}

          {isReturn && (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "itwhirlpoolqa-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="ReturnReason">
                  <FormattedMessage id="store/custom-form.return-reason" />
                </label>
              </div>
              <div className={classnames(styles.inputTtitle)}>
                <Input
                  className={classnames(styles.inputTitle)}
                  type="text"
                  onChange={(e: any) => dispatch(e.target)}
                  onBlur={handleBlur}
                  value={form.ReturnReason}
                  id="ReturnReason"
                  name="ReturnReason"
                  placeholder=""
                />
                {showErrors && errors.ReturnReason && (
                  <span className={classnames(styles.inputError)}>
                    <FormattedMessage id="store/custom-form.field-empty" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <br></br>
        {showAssistenza && (
          <div>
            <span className={classnames(styles.inputTitle)}>
              <FormattedMessage id="store/custom-form.noteAndDefect" />
            </span>
            <textarea
              className={classnames(styles.textArea)}
              id="Note"
              name="Note"
              placeholder={intl.formatMessage({
                id: "store/custom-form.note-placeholder",
              })}
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.Note}
              rows={10}
            ></textarea>
            {showErrors && errors.Note && (
              <span className={classnames(styles.inputError)}>
                <FormattedMessage id="store/custom-form.field-empty" />
              </span>
            )}
          </div>
        )}
        {!showAssistenza && (
          <div>
            <span className={classnames(styles.inputTitle)}>
              <FormattedMessage id="store/custom-form.note" />
            </span>
            <textarea
              className={classnames(styles.textArea)}
              id="Note"
              name="Note"
              placeholder={intl.formatMessage({
                id: "store/custom-form.note-placeholder",
              })}
              onChange={(e: any) => dispatch(e.target)}
              onBlur={handleBlur}
              value={form.Note}
              rows={10}
            ></textarea>
          </div>
        )}
        <div>
          {isReturn && (
            <div className={classnames(styles.fotoDanno)}>
              <FormattedMessage id="store/custom-form.foto" />
              <a
                className={classnames(styles.mailTo)}
                href="mailto:supporto@whirlpool.com"
              >
                {supportEmail}
              </a>
            </div>
          )}
          <div className={classnames(styles.campiObbligatori)}>
            <FormattedMessage id="store/custom-form.required-field" />
          </div>
        </div>
        {isLoading || mutationloading ? (
          <div className={classnames(styles.loaderFormContainer)}>
            <div className={classnames(styles.loaderForm)}></div>
          </div>
        ) : isResponse ? (
          <div className={classnames(styles.messageText)}>
            <span>
              <FormattedMessage id="store/custom-form.message-text" />
            </span>
            <a className={classnames(styles.formLink)} href="/">
              <FormattedMessage id="store/custom-form.go-back-home" />
            </a>
          </div>
        ) : (
          <div className={classnames(styles.inviaButton)}>
            <div className={classnames(styles.privacyPolicy)}>
              {privacyLabel}
            </div>
            <Button
              type="submit"
              id="support_return_product_save"
              name="support_return_product[save]"
              value="Submit"
            >
              <FormattedMessage id="store/custom-form.submit" />
            </Button>
          </div>
        )}
      </form>
      {isModalOpen && (
        <div className={`fixed z-max overflow-hidden ${styles.toastWrapper}`}>
          <div className="ma4 absolute left-0 bottom-0">
            <div className="vtex-toast flex justify-between items-start items-center-ns t-body bg-base--inverted c-on-base--inverted pa5 br2-ns shadow-5">
              <FormattedMessage id="store/custom-form.message-text" />
            </div>
          </div>
        </div>
      )}
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
    privacyLabel: {
      title: "privacyLabel",
      description: "Label for privacyLabel",
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
  },
};

export default CustomForm;
