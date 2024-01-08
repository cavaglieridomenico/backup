import React, { useState, useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import validate from "../react/hooks/validate";
import { usePixel } from "vtex.pixel-manager";
import { setAnalyticCustomError } from "./utils/ga4-analytics";

const CSS_HANDLES = [
  "FormServiceCare_Wrapper_Container",
  "FormServiceCare__MainContainer",
  "FormServiceCare_SecondContainer",
  "FormServiceCare_MainTitle",
  "FormServiceCare_SelectPickerBox",
  "FormServiceCare_SelectPickerInput",
  "FormServiceCare_InputsContainer",
  "FormServiceCare_SingleRow",
  "FormServiceCare_SelectPickerValue",
  "FormServiceCare_Col",
  "FormServiceCare_Col3",
  "FormServiceCare_Col5",
  "FormServiceCare_Col7",
  "FormServiceCare_Lable",
  "FormServiceCare_Input_Text",
  "FormServiceCare_Input_Text_Error",
  "FormServiceCare_Lable_Span",
  "FormServiceCare_Textarea",
  "FormServiceCare_span",
  "FormServiceCare_Paragraph",
  "FormServiceCare_Bottom_Container",
  "FormServiceCare_Privacy_Container",
  "FormServiceCare_Privacy_Subtitle_Privacy",
  "FormServiceCare_Submit_Button",
  "FormServiceCare_SingleRow_TextArea",
  "FormServiceCare_Privacy_Checkbox",
  "FormServiceCare_Privacy_Checkbox_Text",
  "FormServiceCare_ProductName",
  "FormServiceCare_Instructions",
  "FormServiceCare_Products_List",
  "FormServiceCare_SpanPrivacy",
  "FormServiceCare_Lable_Span_Error",
  "FormServiceCare_Img_Fluid",
  "FormServiceCare_ArrowDown",
  "FormServiceCare_ArrowDown_Reverse",
  "FormServiceCare_Container_Header",
  "FormServiceCare_Container_Header_Title",
  "FormServiceCare_Img_Example",
  "FormServiceCare_Img_Dryer",
  "FormServiceCare_Img_Oven",
  "FormServiceCare_Img_Washer",
  "FormServiceCare_Img_Cookers",
  "FormServiceCare_Img_Cooling",
  "FormServiceCare_Img_Freezer",
  "FormServiceCare_Img_Dishwasing",
];

const services = [
  {
    id: 1,
    name: "Informacje na temat zakupu cześci zamiennych i produktów do czyszczenia",
  },
  { id: 2, name: "Informacje dotyczce przedłużenia gwarancji/ Planów Ochrony" },
  { id: 3, name: "Zapytanie SAR (Zarządzanie Prywatnością)" },
  { id: 4, name: "Ważna informacja" },
  { id: 5, name: "Pomoc techniczna, komunikaty o błędach, zamawianie naprawy" },
];

const products = [
  { id: 1, name: "Suszarka" },
  { id: 2, name: "Pralka" },
  { id: 3, name: "Pralko-suszarka" },
  { id: 4, name: "Zmywarka" },
  { id: 5, name: "Zamrażarka" },
  { id: 6, name: "Piekarnik" },
  { id: 7, name: "Lodówka" },
  { id: 8, name: "Płyta kuchenna" },
  { id: 9, name: "Kuchenka" },
];

function FormServiceCare() {
  const [isAcceptedPrivacy, setIsAcceptedPrivacy] = useState(false);
  // const [isAcceptedNewsLetter,setIsAcceptedNewsLetter]=useState(false);
  const [isProductsListShow, setIsProductsListShow] = useState(false);
  const [currentProductValue, setCurrentProductValue] =
    useState("Kategoria produktu");
  const [errorMessages, setErrorMessages] = useState([]);
  const [objForm, setObjForm] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [url, setUrl] = useState("");
  const [contactSupport, setContactSupport] = useState("");
  const [GDPRTXT, setGDPRTXT] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSarSent, setIsSarSent] = useState(false);
  const { handles } = useCssHandles(CSS_HANDLES);

  const { push } = usePixel();

  useEffect(() => {
    setErrorMessages(validate(objForm));
  }, [objForm]);

  useEffect(() => {
    //Api based on the type of Support
    if (objForm.TipoAssistenza === services[2].name) {
      setUrl("/v1/api/crm/sar");
    }
    if (objForm.TipoAssistenza !== services[2].name) {
      setUrl("/api/dataentities/CU/documents");
      setContactSupport("service.pl@indesit.com");
    }
  }, [objForm.TipoAssistenza]);

  const handleSubmit = () => {
    setIsValidating(true);

    //GA4FUNREQ58
    setAnalyticCustomError(errorMessages, push);
    if (
      // isAcceptedNewsLetter
      // && isAcceptedNewsLetter
      Object.keys(errorMessages).length === 0
    ) {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          Cap: {
            value: objForm.cap,
          },
          Citta: {
            value: objForm.città,
          },
          Cognome: {
            value: objForm.cognome,
          },
          ComunicazioneGaranzia: true,
          ComunicazioneWhirlpool: true,
          DataAcquisto: {
            value: objForm.dataDacquisto,
          },
          DataFineGaranziaEstensione: {
            value: objForm.dataFineGaranzia,
          },
          Email: {
            value: objForm.email,
          },
          EstensioneDiGaranzia: {
            value: objForm.estensioneAssistenza,
          },
          Indirizzo: {
            value: objForm.indirizzo,
          },
          Matricola: {
            value: objForm.matricola,
          },
          Modello: {
            value: objForm.modello,
          },
          Nome: {
            value: objForm.nome,
          },
          Provincia: {
            value: objForm.provincia,
          },
          PuntoVendita: {
            value: objForm.PuntoVendita,
          },
          Reason: {
            value: objForm.TipoAssistenza
              ? objForm.TipoAssistenza
              : services[0].name,
          },
          Segnalazione: {
            value: objForm.testoSegnalazione,
          },
          Telefono: {
            value: objForm.numeroDiTelefono,
          },
          supportEmail: {
            value: contactSupport,
          },
        }),
      }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsSent(true);
          analyticsCallback();

          //GA4FUNREQ61
          if (isAcceptedPrivacy) {
            push({
              event: "ga4-optin",
            });
          }
        }
      });
    }
  };

  const handleSubmitGDPR = () => {
    setIsValidating(true);

    if (
      // isAcceptedNewsLetter
      // && isAcceptedNewsLetter
      objForm.TipoAssistenza === services[2].name &&
      errorMessages.nome === undefined &&
      errorMessages.cognome === undefined &&
      errorMessages.indirizzo === undefined &&
      errorMessages.cap === undefined &&
      errorMessages.città === undefined &&
      errorMessages.email === undefined &&
      errorMessages.testoSegnalazione === undefined
    ) {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          firstName: objForm.nome,
          lastName: objForm.cognome,
          address: objForm.indirizzo,
          postalCode: objForm.cap,
          city: objForm.città,
          email: objForm.email,
          message: objForm.testoSegnalazione,
        }),
      }).then((res) => {
        let errorPromise = res.text();
        errorPromise.then((value) => {
          setIsSent(true);
          setGDPRTXT(value);
        });
        if (res.status === 200) {
          setIsSarSent(true);
          analyticsCallback();

          //GA4FUNREQ61
          if (isAcceptedPrivacy) {
            push({
              event: "ga4-optin",
            });
          }
        }
        if (res.status === 400) {
          setIsSarSent(false);
        }
      });
    }
  };

  const analyticsCallback = () => {
    //Duplicated analytics event:
    // window.dataLayer = window.dataLayer || [];
    // let analyticsJson = {
    //   event: "serviceContactFormSubmit",
    //   serviceReason:
    //     objForm.TipoAssistenza ===
    //     "Informacje na temat zakupu cześci zamiennych i produktów do czyszczenia"
    //       ? "Accessories Request Info"
    //       : objForm.TipoAssistenza ===
    //         "Informacje dotyczce przedłużenia gwarancji/ Planów Ochrony"
    //       ? "Extended Warranty Info"
    //       : objForm.TipoAssistenza ===
    //         "Zapytanie SAR (Zarządzanie Prywatnością)"
    //       ? "Privacy &amp; Personal Data"
    //       : objForm.TipoAssistenza === "Ważna informacja"
    //       ? "General Report"
    //       : objForm.TipoAssistenza ===
    //         "Pomoc techniczna, komunikaty o błędach, zamawianie naprawy"
    //       ? "Extended Assistance Info"
    //       : "",
    // };
    // window.dataLayer.push(analyticsJson);

    //GA4FUNREQ19
    const ga4Data = {
      // serviceReason: getReason(fields["Reason"])
      serviceReason: objForm.TipoAssistenza
        ? objForm.TipoAssistenza
        : services[0].name,
      type: "support",
    };
    push({
      event: "ga4-serviceContactFormSubmit",
      ga4Data,
    });
  };

  return (
    <>
      {!isSent ? (
        <>
          <div className={handles.FormServiceCare_Container_Header}>
            <div classname={handles.FormServiceCare_SingleRow}>
              <div className={handles.FormServiceCare_Col}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                </svg>
              </div>
              <div className={handles.FormServiceCare_Col}>
                <h1 className={handles.FormServiceCare_Container_Header_Title}>
                  Pomoc online
                </h1>
              </div>
              <div className={handles.FormServiceCare_Col}>
                <p className={handles.FormServiceCare_Paragraph}>
                  Jeżeli potrzebujesz rozwiązania problemu, wpisz temat i
                  przedmiot w formularzu oraz wyślj go do nas. Doradca Indesit
                  udzieli Ci odpowiedzi w ciągu 24 godzin. W weekend usługa
                  dotyczy jedynie zgłoszeń przychodzących.
                </p>
              </div>
            </div>
          </div>

          <form
            className={handles.FormServiceCare_Wrapper_Container}
            name="contact_form"
          >
            <div className={handles.FormServiceCare__MainContainer}>
              <div className={handles.FormServiceCare_SecondContainer}>
                <h2 className={handles.FormServiceCare_MainTitle}>
                  Wybierz powód kontaktu z naszym centrum obslugi.
                </h2>

                <div className={handles.FormServiceCare_SingleRow}>
                  <div className={handles.FormServiceCare_Col}>
                    <select
                      className={handles.FormServiceCare_SelectPickerInput}
                      required
                      name="contact_form[contactReason]"
                      id="contact_form_contactReason"
                      onChange={(e) => {
                        setObjForm({
                          ...objForm,
                          TipoAssistenza: e.target.value,
                        });
                      }}
                    >
                      {services.map((s) => (
                        <option key={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <h2 className={handles.FormServiceCare_MainTitle}>
                  Dane osobowe
                </h2>

                {/* Form Richiesta informazioni prodotto */}
                {objForm.TipoAssistenza !== services[2].name && (
                  <div className={handles.FormServiceCare_InputsContainer}>
                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_firstName"
                        >
                          <input
                            type="text"
                            name="contact_form[firstName]"
                            id="contact_form_firstName"
                            required
                            className={
                              isValidating && errorMessages.nome
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({ ...objForm, nome: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          IMIĘ *{" "}
                        </span>
                        {((isValidating && errorMessages) ||
                          (errorMessages &&
                            errorMessages.nome !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.nome}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_lastName"
                        >
                          <input
                            type="text"
                            name="contact_form[lastName]"
                            id="contact_form_lastName"
                            required
                            className={
                              isValidating && errorMessages.cognome
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                cognome: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          NAZWISKO *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cognome !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.cognome}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_address"
                        >
                          <input
                            type="text"
                            name="contact_form[address]"
                            id="contact_form_address"
                            required
                            className={
                              isValidating && errorMessages.indirizzo
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                indirizzo: e.target.value,
                              });
                            }}
                          />
                          <span className={handles.FormServiceCare_Lable_Span}>
                            {" "}
                            ADRES *{" "}
                          </span>
                          {((errorMessages && isValidating) ||
                            (errorMessages &&
                              errorMessages.indirizzo !==
                                "To pole nie może być puste.")) && (
                            <span
                              className={
                                handles.FormServiceCare_Lable_Span_Error
                              }
                            >
                              {errorMessages.indirizzo}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_postalCode"
                        >
                          <input
                            className={
                              isValidating && errorMessages.cap
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            type="text"
                            name="contact_form[postalCode]"
                            id="contact_form_postalCode"
                            required
                            onChange={(e) => {
                              setObjForm({ ...objForm, cap: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          KOD POCZTOWY *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cap !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.cap}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_city"
                        >
                          <input
                            className={
                              isValidating && errorMessages.città
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            type="text"
                            name="contact_form[city]"
                            id="contact_form_city"
                            required
                            onChange={(e) => {
                              setObjForm({ ...objForm, città: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          MIASTO *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.città !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.città}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_phone"
                        >
                          <input
                            className={handles.FormServiceCare_Input_Text}
                            type="text"
                            name="contact_form[phone]"
                            id="contact_form_phone"
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                numeroDiTelefono: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          NUMER TELEFONU{" "}
                        </span>
                        {errorMessages && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.numeroDiTelefono}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_email"
                        >
                          <input
                            type="text"
                            name="contact_form[email]"
                            id="contact_form_email"
                            required
                            className={
                              isValidating && errorMessages.email
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({ ...objForm, email: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          ADRES E-MAIL *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.email !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow_TextArea}>
                      <label
                        className={handles.FormServiceCare_Col}
                        for="contact_form_notes"
                      >
                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          WPISZ TREŚĆ KOMUNIKATU O BŁĘDZIE *{" "}
                        </span>
                      </label>
                    </div>
                    {((errorMessages && isValidating) ||
                      (errorMessages &&
                        errorMessages.testoSegnalazione !==
                          "To pole nie może być puste.")) && (
                      <span
                        className={handles.FormServiceCare_Lable_Span_Error}
                      >
                        {errorMessages.testoSegnalazione}
                      </span>
                    )}

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col}>
                        <textarea
                          className={handles.FormServiceCare_Textarea}
                          cols="55"
                          rows="3"
                          name="contact_form[notes]"
                          id="contact_form_notes"
                          onChange={(e) => {
                            setObjForm({
                              ...objForm,
                              testoSegnalazione: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>

                    <h2 className={handles.FormServiceCare_MainTitle}>
                      Dane produktu
                      <span className={handles.FormServiceCare_span}>
                        Informacje o produkcie umożliwiają nam zapewnianie
                        szybszej i skuteczniejszej pomocy
                      </span>
                    </h2>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_productData_productCode"
                        >
                          <input
                            className={handles.FormServiceCare_Input_Text}
                            type="text"
                            name="contact_form[productData][productCode]"
                            id="contact_form_productData_productCode"
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                matricola: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          NUMER SERYJNY{" "}
                        </span>
                      </div>

                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_productData_commercialCode"
                        >
                          <input
                            className={
                              isValidating && errorMessages.modello
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            type="text"
                            name="contact_form[productData][commercialCode]"
                            id="contact_form_productData_commercialCode"
                            required
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                modello: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          MODEL *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.modello !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.modello}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_productData_purchaseDate"
                        >
                          <input
                            type="text"
                            name="contact_form[productData][purchaseDate]"
                            id="contact_form_productData_purchaseDate"
                            required
                            placeholder="DD-MM-YYYY"
                            className={
                              isValidating && errorMessages.dataDacquisto
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                dataDacquisto: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          DATA ZAKUPU *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.dataDacquisto !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.dataDacquisto}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_productData_store"
                        >
                          <input
                            type="text"
                            name="contact_form[productData][store]"
                            id="contact_form_productData_store"
                            className={handles.FormServiceCare_Input_Text}
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                PuntoVendita: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          SKLEP{" "}
                        </span>
                      </div>

                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          htmlFor="warrantyExtension"
                          className={handles.FormServiceCare_Lable}
                        >
                          <select
                            className={handles.FormServiceCare_Input_Text}
                            type="select"
                            name="contact_form[productData][extendedWarranty]"
                            id="contact_form_productData_extendedWarranty"
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                estensioneAssistenza: e.target.value,
                              });
                            }}
                          >
                            <option></option>
                            <option>Tak</option>
                            <option>Nie</option>
                          </select>
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          NUMER UMOWY O PRZEDŁUŻENIE GWARANCJI{" "}
                        </span>
                      </div>

                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_productData_warrantyEndDate"
                        >
                          <input
                            className={handles.FormServiceCare_Input_Text}
                            type="text"
                            name="contact_form[productData][warrantyEndDate]"
                            id="contact_form_productData_warrantyEndDate"
                            placeholder="DD-MM-YYYY"
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                dataFineGaranzia: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          DATA WYGAŚNIĘCIA GWARANCJI{" "}
                        </span>

                        {errorMessages && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {" "}
                            {errorMessages.dataFineGaranzia}{" "}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_Bottom_Container}>
                      <h2 className={handles.FormServiceCare_MainTitle}>
                        Gdzie znaleźć model produktu i jego numer seryjny
                      </h2>

                      <div className={handles.FormServiceCare_SingleRow}>
                        <div className={handles.FormServiceCare_Col7}>
                          <p className={handles.FormServiceCare_Paragraph}>
                            Numer seryjny produktu znajduje się na świadectwie
                            gwarancji w dokumentacji urządzenia, a model
                            produktu na pierwszej stronie instrukcji; numer
                            seryjny i model znajduje się również na odpowiedniej
                            naklejce na Twoim urządzeniu.
                          </p>
                        </div>
                        <div className={handles.FormServiceCare_Col3}>
                          <div className={handles.FormServiceCare_Img_Fluid}>
                            <img
                              className={handles.FormServiceCare_Img_Example}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={handles.FormServiceCare_SingleRow}>
                        <div className={handles.FormServiceCare_Col}>
                          <div
                            className={handles.FormServiceCare_Instructions}
                            onClick={() =>
                              setIsProductsListShow(!isProductsListShow)
                            }
                          >
                            {currentProductValue && (
                              <strong
                                className={handles.FormServiceCare_ProductName}
                              >
                                {" "}
                                {currentProductValue}{" "}
                              </strong>
                            )}
                            {isProductsListShow && (
                              <ul
                                className={
                                  handles.FormServiceCare_Products_List
                                }
                              >
                                {products
                                  .filter((p) => p.name !== currentProductValue)
                                  .map((p) => {
                                    return (
                                      <li
                                        onClick={() =>
                                          setCurrentProductValue(p.name)
                                        }
                                        key={p.id}
                                      >
                                        <strong
                                          className={
                                            handles.FormServiceCare_ProductName
                                          }
                                        >
                                          {" "}
                                          {p.name}{" "}
                                        </strong>
                                      </li>
                                    );
                                  })}
                              </ul>
                            )}
                            <svg
                              width="10"
                              height="6"
                              viewBox="-2.5 -5 75 60"
                              preserveAspectRatio="none"
                              className={
                                !isProductsListShow
                                  ? handles.FormServiceCare_ArrowDown
                                  : handles.FormServiceCare_ArrowDown_Reverse
                              }
                            >
                              <path
                                d="M0,0 l35,50 l35,-50"
                                fill="none"
                                stroke="black"
                                stroke-linecap="round"
                                stroke-width="5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={handles.FormServiceCare_SingleRow}>
                        {currentProductValue === "Pralka" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Washer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Suszarka" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Dryer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Zmywarka" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={
                                  handles.FormServiceCare_Img_Dishwasing
                                }
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Lodówka" ||
                          currentProductValue === "Płyta kuchenna" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Example}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Piekarnik" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Cooling}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Pralko-suszarka" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Dryer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Zamrażarka" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Freezer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Kuchenka" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Cookers}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Zapytanie SAR (Zarządzanie Prywatnością)*/}
                {objForm.TipoAssistenza === services[2].name && (
                  <div className={handles.FormServiceCare_InputsContainer}>
                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          for="contact_form_firstName"
                          className={handles.FormServiceCare_Lable}
                        >
                          <input
                            type="text"
                            name="contact_form[firstName]"
                            id="contact_form_firstName"
                            required
                            className={
                              isValidating && errorMessages.nome
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({ ...objForm, nome: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          IMIĘ *{" "}
                        </span>
                        {((isValidating && errorMessages) ||
                          (errorMessages &&
                            errorMessages.nome !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.nome}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_lastName"
                        >
                          <input
                            type="text"
                            name="contact_form[lastName]"
                            id="contact_form_lastName"
                            required
                            className={
                              isValidating && errorMessages.cognome
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                cognome: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          NAZWISKO *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cognome !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.cognome}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_address"
                        >
                          <input
                            type="text"
                            name="contact_form[address]"
                            id="contact_form_address"
                            required
                            className={
                              isValidating && errorMessages.indirizzo
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                indirizzo: e.target.value,
                              });
                            }}
                          />
                          <span className={handles.FormServiceCare_Lable_Span}>
                            ADRES *
                          </span>
                          {((errorMessages && isValidating) ||
                            (errorMessages &&
                              errorMessages.indirizzo !==
                                "To pole nie może być puste.")) && (
                            <span
                              className={
                                handles.FormServiceCare_Lable_Span_Error
                              }
                            >
                              {errorMessages.indirizzo}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_postalCode"
                        >
                          <input
                            type="text"
                            name="contact_form[postalCode]"
                            id="contact_form_postalCode"
                            required
                            className={
                              isValidating && errorMessages.cap
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({ ...objForm, cap: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          KOD POCZTOWY *
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cap !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.cap}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col3}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          htmlFor="contact_form_city"
                        >
                          <input
                            type="text"
                            name="contact_form[city]"
                            id="contact_form_city"
                            required
                            className={
                              isValidating && errorMessages.città
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({ ...objForm, città: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          MIASTO *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.città !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.città}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_phone"
                        >
                          <input
                            type="text"
                            name="contact_form[phone]"
                            id="contact_form_phone"
                            className={handles.FormServiceCare_Input_Text}
                            onChange={(e) => {
                              setObjForm({
                                ...objForm,
                                numeroDiTelefono: e.target.value,
                              });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          TÉLÉPHONE{" "}
                        </span>
                        {errorMessages && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.numeroDiTelefono}
                          </span>
                        )}
                      </div>

                      <div className={handles.FormServiceCare_Col5}>
                        <label
                          className={handles.FormServiceCare_Lable}
                          for="contact_form_email"
                        >
                          <input
                            type="text"
                            name="contact_form[email]"
                            id="contact_form_email"
                            className={
                              isValidating && errorMessages.email
                                ? handles.FormServiceCare_Input_Text_Error
                                : handles.FormServiceCare_Input_Text
                            }
                            onChange={(e) => {
                              setObjForm({ ...objForm, email: e.target.value });
                            }}
                          />
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          ADRES E-MAIL *{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.email !==
                              "To pole nie może być puste.")) && (
                          <span
                            className={handles.FormServiceCare_Lable_Span_Error}
                          >
                            {errorMessages.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={handles.FormServiceCare_SingleRow_TextArea}>
                      <div className={handles.FormServiceCare_Col}>
                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          WPISZ TREŚĆ KOMUNIKATU O BŁĘDZIE *{" "}
                        </span>
                      </div>
                    </div>
                    {((errorMessages && isValidating) ||
                      (errorMessages &&
                        errorMessages.testoSegnalazione !==
                          "To pole nie może być puste.")) && (
                      <span
                        className={handles.FormServiceCare_Lable_Span_Error}
                      >
                        {errorMessages.testoSegnalazione}
                      </span>
                    )}

                    <div className={handles.FormServiceCare_SingleRow}>
                      <div className={handles.FormServiceCare_Col}>
                        <textarea
                          className={handles.FormServiceCare_Textarea}
                          name="contact_form[notes]"
                          id="contact_form_notes"
                          cols="55"
                          rows="3"
                          required
                          onChange={(e) => {
                            setObjForm({
                              ...objForm,
                              testoSegnalazione: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                <div className={handles.FormServiceCare_Privacy_Container}>
                  <div className={handles.FormServiceCare_SingleRow}>
                    <span
                      className={
                        handles.FormServiceCare_Privacy_Subtitle_Privacy
                      }
                    >
                      Zgoda na Przetwarzanie Danych Osobowych
                    </span>
                  </div>

                  <div className={handles.FormServiceCare_SingleRow}>
                    <span>
                      Rozumiem treść{" "}
                      <a
                        href="/informacja-o-ochronie-prywatnosci"
                        style={{ color: "#0090d0" }}
                      >
                        {" "}
                        Informacji o Ochronie Prywatności{" "}
                      </a>{" "}
                      oraz:
                    </span>
                  </div>

                  <div className={handles.FormServiceCare_SingleRow}>
                    <span>
                      Wyrażam zgodę na otrzymywanie spersonalizowanej
                      komunikacji marketingowej związanej z INDESIT oraz innymi
                      spółkami Whirlpool Corporation.
                    </span>
                  </div>

                  <div className={handles.FormServiceCare_SingleRow}>
                    <div className={handles.FormServiceCare_Col}>
                      <input
                        className={handles.FormServiceCare_Privacy_Checkbox}
                        type="checkbox"
                        name="contact_form[privacy1]"
                        onClick={() => setIsAcceptedPrivacy(!isAcceptedPrivacy)}
                      />

                      <span
                        className={
                          handles.FormServiceCare_Privacy_Checkbox_Text
                        }
                      >
                        Wyrażam zgodę
                      </span>
                    </div>
                  </div>
                </div>

                <div className={handles.FormServiceCare_SingleRow}>
                  <div className={handles.FormServiceCare_Col}>
                    <button
                      className={handles.FormServiceCare_Submit_Button}
                      type="submit"
                      name="contact_form[save]"
                      onClick={(e) => {
                        e.preventDefault();
                        if (objForm.TipoAssistenza !== services[2].name) {
                          handleSubmit();
                        } else {
                          handleSubmitGDPR();
                        }
                      }}
                    >
                      Wyślij zgłoszenie
                    </button>
                  </div>
                </div>

                <div className={handles.FormServiceCare_SingleRow}>
                  <div className={handles.FormServiceCare_Col}>
                    <span className={handles.FormServiceCare_SpanPrivacy}>
                      Pola zaznaczone gwiazdką (*) są wymagane.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      ) : (
        <div
          classname={handles.FormServiceCare_SingleRow}
          style={{ margin: "5rem 2rem 5rem" }}
        >
          {!GDPRTXT ? (
            <>
              <div className={handles.FormServiceCare_Col}>
                <h1 className={handles.FormServiceCare_Container_Header_Title}>
                  Dziękujemy
                </h1>
              </div>

              <div className={handles.FormServiceCare_Col}>
                <p
                  className={handles.FormServiceCare_Paragraph}
                  style={{
                    fontFamily: "Roboto-Light, sans-serif",
                    fontSize: "1.2rem",
                  }}
                >
                  Dziękujemy za Twoje zgłoszenie. Twoje zgłoszenie zostało
                  przesłane. Otrzymasz wiadomość e-mail z podsumowaniem
                  przesłanych danych.
                  <br />
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={handles.FormServiceCare_Col}>
                <h1 className={handles.FormServiceCare_Container_Header_Title}>
                  {isSarSent ? "Dziękujemy." : "Przepraszamy."}
                </h1>
              </div>

              <div className={handles.FormServiceCare_Col}>
                <p
                  className={handles.FormServiceCare_Paragraph}
                  style={{
                    fontFamily: "Roboto-Light, sans-serif",
                    fontSize: "1.2rem",
                  }}
                >
                  {GDPRTXT === "OK" || isSarSent
                    ? "Dziękujemy za Twoje zgłoszenie.Twoje zgłoszenie zostało przesłane. Otrzymasz wiadomość e-mail z podsumowaniem przesłanych danych."
                    : GDPRTXT}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default FormServiceCare;
