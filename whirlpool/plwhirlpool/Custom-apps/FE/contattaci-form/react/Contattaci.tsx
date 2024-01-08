import React, { useState } from "react";
import { Input, Button, Dropdown, Checkbox } from "vtex.styleguide";
import styles from "./styles.css";
import classnames from "classnames";
import { useEffect } from "react";
import FormESKLEP from "./FormESKLEP";
import { usePixel } from "vtex.pixel-manager";
import { setAnalyticCustomError } from "./utils/ga4-analytics";

interface CustomFormProps {}

const SubscriberAttributes = {
  Name: "",
  Surname: "",
  Address: "",
  Zip: "",
  City: "",
  Email: "",
  PhoneNumber: "",
  Comment: "",
  Matricola: "",
  Modello: "",
  DataAcquisto: "",
  PuntoVendita: "",
  EstensioneDiGaranzia: "",
  DataFineGaranziaEstensione: "",
  OrderOrInvoiceNumber: "",
  CompanyName: "",
  CompanyAddress: "",
  CompanyCity: "",
  CompanyDescription: "",
  Reason: "",
  StageOfPurchase: "",
  ProductCode: "",
  supportEmail: "",
  ComunicazioneWhirlpool: false,
  ComunicazioneGaranzia: false,
  // BindingAddress: ""
};

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({}) => {
  const [fields, setFields] = useState<{ [index: string]: any }>(
    SubscriberAttributes
  );
  const [errors, setErrors] = useState<{ [index: string]: any }>({});
  const [selectedImage, setSelectedImage] = useState<{
    [index: string]: string;
  }>({});
  const [urlImage, setUrlImage] = useState(String);
  const [isGDPR, setIsGDPR] = useState(false);
  const [consent, setConsent] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isResponse, setResponse] = useState(false);
  const [isFormIncomplete, setFormIncomplete] = useState(false);

  const reasons = {
    first: "[ESKLEP] Uwagi dotyczące funkcjonowania sklepu whirlpool.pl",
    second: "[ESKLEP] Informacje o złożonym zamówieniu",
    third: "[ESKLEP] Problemy z dokonaną płatnością",
    fourth: "[ESKLEP] Dostawa i instalacja zamówionego produktu",
    fifth: "[ESKLEP] Status zwrotu mojego produktu",
    sixth: "[ESKLEP] Kontakt w sprawie zakupów korporacyjnych",
  };

  const contactReason = [
    {
      value: "Informacje o rozszerzonej gwarancji",
      label: "Informacje o rozszerzonej gwarancji",
    },
    { value: "Zgłoś usterkę", label: "Zgłoś usterkę" },
    {
      value: "Zapytanie dotyczące Polityki Prywatności",
      label: "Zapytanie dotyczące Polityki Prywatności",
    },
    {
      value: "Informacje w sprawie otwartego zgłoszenia serwisowego",
      label: "Informacje w sprawie otwartego zgłoszenia serwisowego",
    },
    {
      value: "Informacje o produkcie, akcesoriach, częściach zamiennych",
      label: "Informacje o produkcie, akcesoriach, częściach zamiennych",
    },
    // { value: "Ostrzeżenia", label: "Ostrzeżenia" },
    { value: "Inne...", label: "Inne..." },
    {
      value: "[ESKLEP] Uwagi dotyczące funkcjonowania sklepu whirlpool.pl",
      label: "[ESKLEP] Uwagi dotyczące funkcjonowania sklepu whirlpool.pl",
    },
    {
      value: "[ESKLEP] Informacje o złożonym zamówieniu",
      label: "[ESKLEP] Informacje o złożonym zamówieniu",
    },
    {
      value: "[ESKLEP] Problemy z dokonaną płatnością",
      label: "[ESKLEP] Problemy z dokonaną płatnością",
    },
    {
      value: "[ESKLEP] Dostawa i instalacja zamówionego produktu",
      label: "[ESKLEP] Dostawa i instalacja zamówionego produktu",
    },
    {
      value: "[ESKLEP] Status zwrotu mojego produktu",
      label: "[ESKLEP] Status zwrotu mojego produktu",
    },
    {
      value: "[ESKLEP] Kontakt w sprawie zakupów korporacyjnych",
      label: "[ESKLEP] Kontakt w sprawie zakupów korporacyjnych",
    },
  ];
  const matricoleImage = [
    {
      label: "Kuchenki",
      name: "Cuisinière",
      value:
        "matricola_prodotto_pianicottura___018f8558608ba3c51e58612d8bbbfc03.jpg",
    },
    {
      label: "Suszarkibębnowe",
      name: "Sèche-linge",
      value:
        "matricola_prodotto_asciugatrici___4afb41caeeebeeb8523c868570012a8e.png",
    },
    {
      label: "Piekarniki",
      name: "Four encastrable",
      value: "matricola_prodotto_forni___543c5799f2f7bc2878545b6175414470.png",
    },
    {
      label: "Lodówki",
      name: "Réfrigérateur",
      value:
        "matricola_prodotto_frigoriferi___2635b8fbc906dcc82f467ba06dc7be9e.png",
    },
    {
      label: "Pralkosuszarki",
      name: "Lavante-séchante",
      value:
        "matricola_prodotto_lavasciuga___11706c1a65ddb3504571fada0e5d4efc.png",
    },
    {
      label: "Zmywarki",
      name: "Lave-vaisselle",
      value:
        "matricola_prodotto_lavastoviglie___2707233b9f07df2042fd03414319ed47.png",
    },
    {
      label: "Pralki",
      name: "Lave-linge",
      value:
        "matricola_prodotto_lavatrici___0669612a8f3754d41d960828667932a8.png",
    },
    {
      label: "Zamrażarki",
      name: "Congélateur",
      value:
        "matricola_prodotto_congelatori___f1564b60d8675ce37781690a4fbf70a8.png",
    },
  ];

  const estensioneDiGaranzia = [
    { label: "Nie", value: "nie" },
    { label: "Tak", value: "tak" },
  ];

  const { push } = usePixel();

  // function isValidDate(date: string) {
  //   // const dateString: string = date.value;
  //   // First check for the pattern
  //   if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) return false;

  //   // Parse the date parts to integers
  //   var parts: any = date.split("/");
  //   var day = parseInt(parts[0], 10);
  //   var month = parseInt(parts[1], 10);
  //   var year = parseInt(parts[2], 10);

  //   // Check the ranges of month and year
  //   if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

  //   //check if date is future

  //   var today = new Date().getTime(),
  //     // idate:any = idate.split("/");

  //     parts: any = new Date(parts[2], parts[1] - 1, parts[0]).getTime();
  //   if (today - parts < 0) return false;

  //   var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  //   // Adjust for leap years
  //   if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
  //     monthLength[1] = 29;

  //   // Check the range of the day
  //   return day > 0 && day <= monthLength[month - 1];
  // }
  function isValidDatee(date: string) {
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) return false;
    else return true;
  }
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

  const findIndex = (reason: String) => {
    let indexFinded = -1;
    let indexArray = 0;
    while (indexFinded == -1 || indexArray < contactReason.length) {
      if (contactReason[indexArray].value == reason) {
        indexFinded = indexArray;
      }
      indexArray += 1;
    }
    return indexFinded == -1 ? 0 : indexFinded;
  };
  const getReason = (reason: String) => {
    return ENG_REASON[findIndex(reason)];
  };

  const ENG_REASON = [
    "Product Request Info",
    "Purchasing Accessories and Cleaning Products Info",
    "Purchase on the online shop made on www.whirlpool.it Info",
    "Technical Assistance on product from 0 to 24 months Request",
    "Technical Assistance on product covered by the service extension plan and beyond 24 months of life Request",
    "Technical Assistance on product out of warranty Request",
    "Information / reports on work in progress",
    "Service Extension Plan Activation",
    "Appointment Details Update",
    "Move or delete an appointment",
    "Connected home appliances",
    "Update / delete personal data (privacy management) / GDPR account cancellation",
  ];

  //GA4FUNREQ58
  useEffect(() => {
    setAnalyticCustomError(errors, push);
  }, [errors]);

  const submitForm = (e: any) => {
    e.preventDefault();
    handleValidation();
    if (handleValidation()) {
      setLoading(true);
      let formToSend: { [index: string]: any } = {};
      formToSend = {
        Name: { value: "" },
        Surname: { value: "" },
        Address: { value: "" },
        Zip: { value: "" },
        City: { value: "" },
        // "Provincia":{"value": ""},
        Email: { value: "" },
        PhoneNumber: { value: "" },
        OrderOrInvoiceNumber: { value: "" },
        StageOfPurchase: { value: "" },
        CompanyName: { value: "" },
        CompanyAddress: { value: "" },
        CompanyCity: { value: "" },
        CompanyDescription: { value: "" },
        Comment: { value: "" },
        ProductCode: { value: "" },
        Matricola: { value: "" },
        Modello: { value: "" },
        DataAcquisto: { value: "" },
        PuntoVendita: { value: "" },
        EstensioneDiGaranzia: { value: "" },
        DataFineGaranziaEstensione: { value: "" },
        Reason: { value: "" },
        supportEmail: { value: "" },
        ComunicazioneWhirlpool: { value: false },
        ComunicazioneGaranzia: { value: false },
        // "BindingAddress": { "value": "" }
      };
      Object.keys(fields).map((f) => {
        fields[f]
          ? (formToSend[f]["value"] = fields[f])
          : (formToSend[f]["value"] = "");
      });
      if (fields["Reason"].includes("[ESKLEP]")) {
        formToSend["supportEmail"] = { value: "sklep@whirlpool.com" };
      } else {
        formToSend["supportEmail"] = { value: "kontakt@whirlpool.com" };
      }
      formToSend["ComunicazioneGaranzia"] = fields.ComunicazioneGaranzia;
      formToSend["ComunicazioneWhirlpool"] = fields.ComunicazioneWhirlpool;
      formToSend["Email"] = fields.Email;
      formToSend["PhoneNumber"] = fields.PhoneNumber;
      // setLoading(false);
      // setResponse(true);
      // console.log(formToSend)

      const fetchUrl = "/api/dataentities/CU/documents";
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formToSend),
      };
      fetch(fetchUrl, options).then((response) => {
        if (response.status === 201) {
          setLoading(false);
          setResponse(true);

          //GA4FUNREQ19
          const ga4Data = {
            serviceReason: getReason(fields["Reason"]),
            type: "support",
          };
          push({
            event: "ga4-serviceContactFormSubmit",
            ga4Data,
          });

          //GA4FUNREQ61
          if (consent) {
            push({
              event: "ga4-optin",
            });
          }
        }
      });
    } else {
      setFormIncomplete(true);
    }
  };

  const validateField = (field: string) => {
    switch (field) {
      case "Name":
      case "EstensioneDiGaranzia":
      // case "Modello":
      case "City":
      case "Zip":
      // case "Provincia":
      case "Reason":
      case "OrderOrInvoiceNumber":
      case "StageOfPurchase":
      case "CompanyName":
      case "CompanyDescription":
      case "Address":
        if (!fields[field]) {
          errors[field] = "To pole należy uzupełnić";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      case "Surname":
        if (
          !fields["Surname"] &&
          fields["Reason"] !==
            "[ESKLEP] Uwagi dotyczące funkcjonowania sklepu whirlpool.pl"
        ) {
          errors["Surname"] = "To pole należy uzupełnić";
        } else {
          errors["Surname"] = "";
          setFormIncomplete(false);
        }
        break;
      case "Email":
        if (!ValidateEmail(fields["Email"])) {
          errors["Email"] =
            "Niektore wymagane pola są uzupełnione niepoprawnie";
        } else {
          errors["Email"] = "";
          setFormIncomplete(false);
        }
        break;
      case "Comment":
        if (fields[field].length < 12) {
          errors[field] = "To pole należy uzupełnić";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      // case "DataAcquisto":
      //   if (!isValidDate(fields[field])) {
      //     errors[field] = "Wysyłany formularz pownien być w odpowiednim formacie.";
      //   } else {
      //     errors[field] = "";
      //     setFormIncomplete(false);
      //   }
      //   break;
      // case "DataFineGaranziaEstensione":
      //   if (!isValidDatee(fields[field])) {
      //     errors[field] = "Data non valida";
      //   } else {
      //     errors[field] = "";
      //     setFormIncomplete(false);
      //   }
      //   break;
    }
  };

  const handleValidation = () => {
    const EmptyFieldErrMsg = "To pole należy uzupełnić";

    let formIsValid = true;

    if (!fields["Reason"]) {
      errors["Reason"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Reason"] = "";
    }
    if (!fields["Name"]) {
      errors["Name"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Name"] = "";
    }
    if (
      !fields["Surname"] &&
      fields["Reason"] !==
        "[ESKLEP] Uwagi dotyczące funkcjonowania sklepu whirlpool.pl"
    ) {
      errors["Surname"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Surname"] = "";
    }
    // if (!fields["Modello"] && !isGDPR) {
    //   errors["Modello"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // } else {
    //   errors["Modello"] = "";
    // }
    if (
      !fields["City"] &&
      fields["Reason"] !== reasons.first &&
      fields["Reason"] !== reasons.second &&
      fields["Reason"] !== reasons.third &&
      fields["Reason"] !== reasons.fifth &&
      fields["Reason"] !== reasons.sixth
    ) {
      errors["City"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["City"] = "";
    }
    if (
      !fields["Zip"] &&
      fields["Reason"] !== reasons.first &&
      fields["Reason"] !== reasons.second &&
      fields["Reason"] !== reasons.third &&
      fields["Reason"] !== reasons.fifth &&
      fields["Reason"] !== reasons.sixth
    ) {
      errors["Zip"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Zip"] = "";
    }
    // if (fields["Provincia"] === "Seleziona la tua provincia") {
    //   errors["Provincia"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // } else {
    //   errors["Provincia"] = "";
    // }
    if (
      !fields["Address"] &&
      fields["Reason"] !== reasons.first &&
      fields["Reason"] !== reasons.second &&
      fields["Reason"] !== reasons.third &&
      fields["Reason"] !== reasons.fifth &&
      fields["Reason"] !== reasons.sixth
    ) {
      errors["Address"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Address"] = "";
    }
    // if (!fields["EstensioneDiGaranzia"] && !isGDPR) {
    //   errors["EstensioneDiGaranzia"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // } else {
    //   errors["EstensioneDiGaranzia"] = "";
    // }
    // if(fields["Email"] ==="") {
    //   errors["Surname"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // }
    if (!ValidateEmail(fields["Email"])) {
      errors["Email"] = "Niektore wymagane pola są uzupełnione niepoprawnie";
      formIsValid = false;
    } else {
      errors["Email"] = "";
    }
    if (!fields["Comment"]) {
      errors["Comment"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Comment"] = "";
    }
    if (
      (!fields["OrderOrInvoiceNumber"] &&
        fields["Reason"] === reasons.second) ||
      (!fields["OrderOrInvoiceNumber"] && fields["Reason"] === reasons.third) ||
      (!fields["OrderOrInvoiceNumber"] &&
        fields["Reason"] === reasons.fourth) ||
      (!fields["OrderOrInvoiceNumber"] && fields["Reason"] === reasons.fifth)
    ) {
      errors["OrderOrInvoiceNumber"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["OrderOrInvoiceNumber"] = "";
    }
    if (!fields["StageOfPurchase"] && fields["Reason"] === reasons.fourth) {
      errors["StageOfPurchase"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["StageOfPurchase"] = "";
    }
    if (!fields["CompanyName"] && fields["Reason"] === reasons.sixth) {
      errors["CompanyName"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["CompanyName"] = "";
    }
    if (!fields["CompanyDescription"] && fields["Reason"] === reasons.sixth) {
      errors["CompanyDescription"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["CompanyDescription"] = "";
    }
    // if (!isValidDate(fields["DataAcquisto"]) && !isGDPR) {
    //   errors["DataAcquisto"] = "Wysyłany formularz pownien być w odpowiednim formacie.";
    //   formIsValid = false;
    // } else {
    //   errors["DataAcquisto"] = "";
    // }
    if (
      !isValidDatee(fields["DataFineGaranziaEstensione"]) &&
      fields["DataFineGaranziaEstensione"].length > 0 &&
      !isGDPR
    ) {
      errors["DataFineGaranziaEstensione"] = "Date invalide";
      formIsValid = false;
    } else {
      errors["DataFineGaranziaEstensione"] = "";
    }

    setErrors({ ...errors });
    setFormIncomplete(!formIsValid);
    return formIsValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    if (
      field === "ComunicazioneGaranzia" ||
      field === "ComunicazioneWhirlpool"
    ) {
      fields[field] = e.target.checked;
    } else {
      fields[field] = e.target.value;
    }

    fields["Reason"] ===
    "Aggiornare /cancellare dati personali (gestione privacy) / GDPR cancellazione account"
      ? setIsGDPR(true)
      : setIsGDPR(false);

    setFields({ ...fields });
    validateField(field);
  };
  const handleselectedImage = (e: any) => {
    let imageToRender: any = e.target.value;
    matricoleImage[imageToRender];
    let urlImage = `https://itwhirlpoolqa.vtexassets.com/assets/vtex/assets-builder/reply.whl-theme/1.0.0/contattaci-matricola-prodotti/${imageToRender}`;
    setSelectedImage(imageToRender);
    setUrlImage(urlImage);
  };
  const handleSubmitForm = (e: any) => {
    if (
      fields["Reason"] ==
        "Richiesta assistenza tecnica su  prodotto coperto da piano di estensione di assistenza e oltre il 24 mese di vita" ||
      fields["Reason"] == "Devo aggiornare i dati del mio appuntamento" ||
      fields["Reason"] == "Spostare o cancellare un appuntamento"
    ) {
      window.open("/supporto/fissa-un-appuntamento");
    } else {
      submitForm(e);
    }
  };

  useEffect(() => {
    if (
      fields.Reason ===
      "Aggiornare /cancellare dati personali (gestione privacy) / GDPR cancellazione account"
    ) {
      setIsGDPR(true);
    }
  }, []);
  //Function for getting a cookie value
  // const getCookieValue = (cookieName: string) => {
  //   return document.cookie.replace(/ /g, "").split(";").find(binding => binding.includes(cookieName))?.split("=")[1]
  // }

  // if (typeof document != "undefined") {
  //   useEffect(() => {
  //     if (document.cookie.length > 0) {
  //       // const binding = getCookieValue("vtex_binding_address")
  //       // setFields({ ...fields, BindingAddress: binding?.includes("epp") ? "epp" : binding?.includes("ff") ? "ff" : "vip" })
  //     }
  //   }, [document.cookie.length]);
  // }

  const datiProdotto = (
    <div className={classnames("w-100")}>
      <div className={classnames(styles.paragraphh)}>
        <p className={classnames(styles.title)}>Informacje o produkcie</p>
        <p>
          Dokładne informacje o produkcie pozwolą nam szybciej i dokładniej
          rozwiązać Twój problem.
        </p>
      </div>

      <div className={classnames(styles.groupInput)}>
        <div className={classnames(styles.singleInput)}>
          <Input
            className={classnames(styles.inputTitle)}
            type="text"
            onChange={(e: any) => handleChange(e, "Matricola")}
            value={fields["Matricola"]}
            id="Matricola"
            name="Matricola"
            placeholder=""
          />
          <div className={classnames(styles.inputTitle)}>
            <label htmlFor="Matricola">NUMER SERYJNY</label>
          </div>
        </div>
        <div className={classnames(styles.singleInput)}>
          <Input
            className={classnames(styles.inputTitle)}
            type="text"
            onChange={(e: any) => handleChange(e, "Modello")}
            value={fields["Modello"]}
            id="Modello"
            name="Modello"
            placeholder=""
          />
          <div className={classnames(styles.inputTitle)}>
            <label htmlFor="Modello">OPIS MODELU </label>
          </div>
          {errors.Modello ? (
            <span id="ModelloError" className={classnames(styles.inputError)}>
              {errors.Modello}
            </span>
          ) : null}
        </div>
        <div className={classnames(styles.singleInput)}>
          <Input
            className={classnames(styles.inputTitle, "requiredInput")}
            type="text"
            onChange={(e: any) => handleChange(e, "DataAcquisto")}
            value={fields["DataAcquisto"]}
            id="DataAcquisto"
            name="DataAcquisto"
            placeholder="dd/mm/yyyy"
          />
          <div className={classnames(styles.inputTitle)}>
            <label htmlFor="DataAcquisto">DATA ZAKUPU</label>
          </div>
          {errors.DataAcquisto ? (
            <span
              id="DataAcquistoError"
              className={classnames(styles.inputError)}
            >
              {errors.DataAcquisto}
            </span>
          ) : null}
        </div>
      </div>

      <div className={classnames(styles.groupInput)}>
        <div className={classnames(styles.singleInput)}>
          <Input
            className={classnames(styles.inputTitle)}
            type="text"
            onChange={(e: any) => handleChange(e, "PuntoVendita")}
            value={fields["PuntoVendita"]}
            id="PuntoVendita"
            name="PuntoVendita"
            placeholder=""
          />
          <div className={classnames(styles.inputTitle)}>
            <label htmlFor="PuntoVendita">SKLEP</label>
          </div>
        </div>
        <div className={classnames(styles.singleInput)}>
          {/* <Input
className={classnames(styles.inputTitle)}
type="text"
onChange={(e: any) => handleChange(e, "EstensioneDiGaranzia")}
value={fields["EstensioneDiGaranzia"]}
id="EstensioneDiGaranzia"
name="EstensioneDiGaranzia"
placeholder=""
/> */}
          <Dropdown
            options={estensioneDiGaranzia}
            onChange={(e: any) => handleChange(e, "EstensioneDiGaranzia")}
            value={fields["EstensioneDiGaranzia"]}
          />
          <div className={classnames(styles.inputTitle)}>
            <label htmlFor="EstensioneDiGaranzia">GWARANCJA ROZSZERZONA</label>
          </div>
          {errors.EstensioneDiGaranzia ? (
            <span
              id="EstensioneDiGaranziaError"
              className={classnames(styles.inputError)}
            >
              {errors.EstensioneDiGaranzia}
            </span>
          ) : null}
        </div>
        <div className={classnames(styles.singleInput)}>
          <Input
            className={classnames(styles.inputTitle)}
            type="text"
            onChange={(e: any) => handleChange(e, "DataFineGaranziaEstensione")}
            value={fields.DataFineGaranziaEstensione.label}
            id="DataFineGaranziaEstensione"
            name="DataFineGaranziaEstensione"
            placeholder="dd/mm/yyyy"
            autoComplete="off"
            disabled={fields.EstensioneDiGaranzia === "No"}
          />
          <div className={classnames(styles.inputTitle)}>
            <label htmlFor="DataFineGaranziaEstensione">
              GWARANCJA OBOWIĄZUJE DO
            </label>
          </div>
          {errors.DataFineGaranziaEstensione ? (
            <span
              id="DataFineGaranziaEstensioneError"
              className={classnames(styles.inputError)}
            >
              {errors.DataFineGaranziaEstensione}
            </span>
          ) : null}
        </div>
      </div>
      <div className={classnames(styles.asterisco)}>
        <p>Pola oznaczone (*) są wymagane</p>
      </div>

      {/* ----------------------------matricola select --------------- */}
      <div>
        <div className={classnames(styles.dropdownContainer, styles.widerDiv)}>
          <div className={classnames(styles.imageDropdownMatricola)}>
            <div className={styles.matricola}>
              <p className={classnames(styles.title)}>
                Gdzie znajdę numer seryjny?
              </p>
              <p className={classnames(styles.text)}>
                {" "}
                Numer seryjny podany jest w karcie gwarancyjnej, która znajduje
                się w dokumentacji urządzenia.
              </p>
              <p>
                Model produktu znajdziesz na pierwszej stronie instrukcji
                obsługi. Numer seryjny oraz model produktu znajdziesz również na
                etykiecie umieszczonej na urządzeniu.
              </p>
            </div>
            <div>
              <img src="https://itwhirlpoolqa.vtexassets.com/assets/vtex/assets-builder/reply.whl-theme/1.0.0/contattaci-matricola-prodotti/matricola_prodotto_pianicottura___018f8558608ba3c51e58612d8bbbfc03.jpg"></img>
            </div>
          </div>
          <div className={classnames(styles.singleSelectProdotto)}>
            <Dropdown
              selectTestId="imageSelect"
              options={matricoleImage}
              onChange={(e: any) => handleselectedImage(e)}
              value={selectedImage}
              placeholder="Kategoria produktu "
            />
          </div>
          <div className={classnames(styles.imageDropdown)}>
            <img src={urlImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );

  if (fields["Reason"].includes("[ESKLEP]")) {
    return (
      <FormESKLEP
        handleSubmitForm={handleSubmitForm}
        contactReason={contactReason}
        fields={fields}
        errors={errors}
        handleChange={handleChange}
        isLoading={isLoading}
        isResponse={isResponse}
        isFormIncomplete={isFormIncomplete}
        consent={consent}
        setConsent={setConsent}
      />
    );
  } else {
    return (
      <div className={classnames(styles.containers)}>
        <form
          name="customForm"
          onSubmit={(e: any) => handleSubmitForm(e)}
          className={classnames(styles.formContainer, "items-center")}
        >
          <div className={classnames(styles.title, styles.title1)}>
            <p> Wybierz rodzaj pomocy, której potrzebujesz </p>
          </div>
          <div>
            <div
              className={classnames(
                styles.singleSelect,
                styles.singleSelectMotivo
              )}
            >
              <Dropdown
                className={classnames(styles.dropdownnnn)}
                options={contactReason}
                onChange={(e: any) => handleChange(e, "Reason")}
                value={fields["Reason"]}
                placeholder="Wybierz rodzaj pomocy"
              />
              {errors.Reason ? (
                <span
                  id="ReasonError"
                  className={classnames(styles.inputError)}
                >
                  {errors.Reason}
                </span>
              ) : null}
            </div>
          </div>
          <div className={classnames(styles.title1, styles.title)}>
            <p> Dane osobowe </p>
          </div>
          <div className={classnames(styles.supportReturn)}>
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
                <div
                  className={classnames(
                    styles.inputTitle,
                    styles.requiredInput
                  )}
                >
                  <label htmlFor="Name">IMIĘ</label>
                </div>
                {errors.Name ? (
                  <span
                    id="NomeError"
                    className={classnames(styles.inputError)}
                  >
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

                <div
                  className={classnames(
                    styles.inputTitle,
                    styles.requiredInput
                  )}
                >
                  <label htmlFor="Surname">NAZWISKO</label>
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
                <div
                  className={classnames(
                    styles.inputTitle,
                    styles.requiredInput
                  )}
                >
                  <label htmlFor="Address">ADRES</label>
                </div>
                {errors.Address ? (
                  <span
                    id="IndirizzoError"
                    className={classnames(styles.inputError)}
                  >
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
                <div
                  className={classnames(
                    styles.inputTitle,
                    styles.requiredInput
                  )}
                >
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
                <div
                  className={classnames(
                    styles.inputTitle,
                    styles.requiredInput
                  )}
                >
                  <label htmlFor="City">MIASTO</label>
                </div>
                {errors.City ? (
                  <span
                    id="CittaError"
                    className={classnames(styles.inputError)}
                  >
                    {errors.City}
                  </span>
                ) : null}
              </div>
              {/* <div className={classnames(styles.singleInput)}>
            <div className={classnames(styles.singleSelectProvincia)}>
            <Dropdown
      options={province}
      onChange={(e: any) => handleChange(e, "Provincia")}
      value={fields["Provincia"]}
      />
      </div>
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="City">PROVINCIA </label>
            </div>
            {errors.Provincia ? (
              <span
                id="ProvinciaError"
                className={classnames(styles.inputError)}
              >
                {errors.Provincia}
              </span>
            ) : null}
         
          </div> */}
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
                  // placeholder="+33"
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
                  placeholder="youremail@example.com"
                />
                <div
                  className={classnames(
                    styles.inputTitle,
                    styles.requiredInput
                  )}
                >
                  <label htmlFor="Email">E-mail</label>
                </div>

                {errors.Email ? (
                  <span
                    id="EmailError"
                    className={classnames(styles.inputError)}
                  >
                    {errors.Email}
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
              <div
                className={classnames(styles.inputTitle, styles.requiredInput)}
              >
                <label htmlFor="Comment">MIEJSCE NA TWOJĄ WIADOMOŚĆ</label>
              </div>
              {errors.Comment ? (
                <span
                  id="SegnalazioneError"
                  className={classnames(styles.inputError)}
                >
                  {errors.Comment}
                </span>
              ) : null}
            </div>

            {!isGDPR && datiProdotto}

            {/* // consenso privacy */}

            <div className={classnames(styles.consenso)}>
              {/* <p className={classnames(styles.title)} >Zgoda na Przetwarzanie Danych Osobowych</p> */}
              <p className={classnames(styles.text)}>
                {" "}
                Przeczytałem i zrozumiałem treść
                <a
                  className={classnames(styles.formLink)}
                  href="/informacja-o-ochronie-prywatnosci"
                >
                  {" "}
                  informacji
                </a>{" "}
                dotyczących ochrony danych osobowych oraz:
              </p>
              <div className="mb3">
                <Checkbox
                  id="consent-check"
                  label={
                    "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.o przesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;"
                  }
                  name="default-checkbox-group"
                  required={false}
                  onChange={(e: any) => {
                    setConsent(e.target.checked);
                  }}
                  value={consent}
                  checked={consent}
                />
              </div>
              <div>
                <p>
                  Warunki przyznania zniżki znajdują się w Regulaminie Promocji
                  poniżej:{" "}
                </p>
                <p>
                  Kod na 50 złotych rabatu otrzymasz mailem po zapisaniu się do
                  newslettera, niemożliwe jest łączenie go z innymi promocjami,
                  można go użyć tylko raz.
                </p>
              </div>
            </div>

            <div className={classnames(styles.inviaButton)}>
              {isLoading ? (
                <div className={classnames(styles.loaderFormContainer)}>
                  <div className={classnames(styles.loaderForm)}></div>
                </div>
              ) : isResponse ? (
                <div className={classnames(styles.messageText)}>
                  <span>Dziękujemy</span>
                  <span>
                    Twoje zgłoszenie zostało pomyślnie wysłane. Za chwilę
                    otrzymasz wiadomość e-mail z podsumowaniem. &nbsp;
                  </span>
                  {/* <a className={classnames(styles.formLink)} href="/">
              
            Retour à la page d'accueil
            </a> */}
                </div>
              ) : (
                <Button type="submit" id="invia" name="invia" value="Submit">
                  WYŚLIJ
                </Button>
              )}
              {isFormIncomplete ? (
                <div className={classnames(styles.inputError)}>
                  Niektore wymagane pola są uzupełnione niepoprawnie
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
};

CustomForm.schema = {
  title: "editor.customForm.title",
  description: "editor.customForm.description",
  type: "object",
  properties: {},
};

export default CustomForm;
