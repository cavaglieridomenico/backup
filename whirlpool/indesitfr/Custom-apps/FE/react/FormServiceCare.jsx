import React, { useState, useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import { usePixel } from "vtex.pixel-manager";
import { setAnalyticCustomError } from "./utils/ga4-analytics";
import validate from "../react/hooks/validate";

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
  { id: 1, name: "Choisissez un sujet" },
  { id: 1, name: "Contrats de garantie" },
  { id: 2, name: "Assistance technique" },
  { id: 3, name: "Gestion de la confidentialité (SAR request)" },
  { id: 4, name: "Assistance appareils connectés" },
  { id: 5, name: "Autre motifs" },
];

const products = [
  { id: 1, name: "Sèche-linge" },
  { id: 2, name: "Lave-linge" },
  { id: 3, name: "Lavante-séchante" },
  { id: 4, name: "Lave-vaisselle" },
  { id: 5, name: "Four encastrable" },
  { id: 6, name: "Réfrigérateur" },
  { id: 7, name: "Plaques de cuisson" },
  { id: 8, name: "Congélateur" },
  { id: 9, name: "Cuisinière" },
];

function FormServiceCare() {
  const [isAcceptedPrivacy, setIsAcceptedPrivacy] = useState(false);
  //const [isAcceptedNewsLetter, setIsAcceptedNewsLetter] = useState(false);
  const [isProductsListShow, setIsProductsListShow] = useState(false);
  const [currentProductValue, setCurrentProductValue] = useState(
    "Catégorie de produits"
  );
  const [errorMessages, setErrorMessages] = useState([]);
  const [objForm, setObjForm] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [url, setUrl] = useState("");
  const [contactSupport, setContactSupport] = useState("");
  const [bccMail, setBccMail] = useState("");
  const [GDPRTXT, setGDPRTXT] = useState("");
  const [isSent, setIsSent] = useState(false);
  const { handles } = useCssHandles(CSS_HANDLES);
  const [isSarSent, setIsSarSent] = useState(false);

  const { push } = usePixel();

  useEffect(() => {
    setErrorMessages(validate(objForm));
  }, [objForm]);

  useEffect(() => {
    //Api based on the type of Support
    if (
      objForm.TipoAssistenza === `Gestion de la confidentialité (SAR request)`
    ) {
      setUrl("/v1/api/crm/sar");
    }
    if (
      objForm.TipoAssistenza !== `Gestion de la confidentialité (SAR request)`
    ) {
      setUrl("/api/dataentities/CU/documents");
      setContactSupport("contact_fr_whirlpool@whirlpool.com");
      setBccMail("service.fr@indesit.com");
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
            value: objForm.TipoAssistenza,
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
          BCCMail: {
            value: bccMail,
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
        if (res.status === 403) {
        }
      });
    }
  };

  const handleSubmitGDPR = () => {
    setIsValidating(true);
    if (
      // isAcceptedNewsLetter
      // && isAcceptedNewsLetter
      objForm.TipoAssistenza ===
        `Gestion de la confidentialité (SAR request)` &&
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
        }
        if (res.status === 400) {
          setIsSarSent(false);
        }
      });
    }
  };

  const analyticsCallback = () => {
    // window.dataLayer = window.dataLayer || [];
    // let analyticsJson = {
    //   event: "serviceContactFormSubmit",
    //   serviceReason: objForm.TipoAssistenza,
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
                  Assistance en ligne
                </h1>
              </div>
              <div className={handles.FormServiceCare_Col}>
                <p className={handles.FormServiceCare_Paragraph}>
                  Complétez le formulaire ci-dessous. Un conseiller vous
                  contactera au plus vite pour répondre à votre demande.
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
                  Veuillez sélectionner l'objet de votre demande
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
                  Données personnelles
                </h2>

                {/* Form Richiesta informazioni prodotto */}
                {objForm.TipoAssistenza !==
                  `Gestion de la confidentialité (SAR request)` && (
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
                          Nom*{" "}
                        </span>
                        {((isValidating && errorMessages) ||
                          (errorMessages &&
                            errorMessages.nome !== "Champs requis")) && (
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
                          Prénom*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cognome !== "Champs requis")) && (
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
                            Adresse*{" "}
                          </span>
                          {((errorMessages && isValidating) ||
                            (errorMessages &&
                              errorMessages.indirizzo !== "Champs requis")) && (
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
                          Code postal*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cap !== "Champs requis")) && (
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
                          Ville*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.città !== "Champs requis")) && (
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
                          Téléphone{" "}
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
                          Email*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.email !== "Champs requis")) && (
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
                          VEUILLEZ SAISIR ICI VOTRE MESSAGE*{" "}
                        </span>
                      </label>
                    </div>
                    {((errorMessages && isValidating) ||
                      (errorMessages &&
                        errorMessages.testoSegnalazione !==
                          "Champs requis")) && (
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
                      Informations sur le produit
                      <span className={handles.FormServiceCare_span}>
                        Les informations sur les produits contribuent à rendre
                        notre service d'assistance plus rapide et plus efficace.
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
                          NUMÉRO DE SÉRIE{" "}
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
                          MODÈLE*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.modello !== "Champs requis")) && (
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
                            placeholder="jj-mm-aaaa"
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
                          DATE D'ACHAT*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.dataDacquisto !==
                              "Champs requis")) && (
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
                          POINT DE VENTE{" "}
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
                            <option>Oui</option>
                            <option>Non</option>
                          </select>
                        </label>

                        <span className={handles.FormServiceCare_Lable_Span}>
                          {" "}
                          AVEZ-VOUS UNE EXTENSION DE GARANTIE{" "}
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
                            placeholder="jj-mm-aaaa"
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
                          DATE D'EXPIRATION DE LA GARANTIE{" "}
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
                        Comment trouver le numéro de série et le modèle de votre
                        appareil?
                      </h2>

                      <div className={handles.FormServiceCare_SingleRow}>
                        <div className={handles.FormServiceCare_Col7}>
                          <p className={handles.FormServiceCare_Paragraph}>
                            Le numéro de série et le code des appareils se
                            trouvent sur l'étiquette signalétique du produit.Le
                            numéro de série est également indiqué sur le
                            certificat de garantie fourni avec l'appareil et le
                            code du modèle sur la première page du mode
                            d'emploi.
                          </p>

                          <br />

                          <p className={handles.FormServiceCare_Paragraph}>
                            Pour trouver le numéro de série et le modèle de
                            votre appareil, sélectionnez ici une catégorie de
                            produits :
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
                        {currentProductValue === "Lave-linge" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Washer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Sèche-linge" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Dryer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Lave-vaisselle" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={
                                  handles.FormServiceCare_Img_Dishwasing
                                }
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Plaques de cuisson" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Example}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Four encastrable" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Oven}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Réfrigérateur" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Cooling}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Lavante-séchante" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Dryer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Congelatori" ? (
                          <div className={handles.FormServiceCare_Col}>
                            <div className={handles.FormServiceCare_Img_Fluid}>
                              <img
                                className={handles.FormServiceCare_Img_Freezer}
                              />
                            </div>
                          </div>
                        ) : currentProductValue === "Cuisinière" ? (
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

                {/* Gestion de la confidentialité (SAR request)*/}
                {objForm.TipoAssistenza ===
                  `Gestion de la confidentialité (SAR request)` && (
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
                          NOM*{" "}
                        </span>
                        {((isValidating && errorMessages) ||
                          (errorMessages &&
                            errorMessages.nome !== "Champs requis")) && (
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
                          PRÈNOM*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cognome !== "Champs requis")) && (
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
                            ADRESSE*{" "}
                          </span>
                          {((errorMessages && isValidating) ||
                            (errorMessages &&
                              errorMessages.indirizzo !== "Champs requis")) && (
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
                          CODE POSTAL*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.cap !== "Champs requis")) && (
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
                          {" "}
                          VILLE*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.città !== "Champs requis")) && (
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
                          EMAIL*{" "}
                        </span>
                        {((errorMessages && isValidating) ||
                          (errorMessages &&
                            errorMessages.email !== "Champs requis")) && (
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
                          VEUILLEZ SAISIR ICI VOTRE MESSAGE*{" "}
                        </span>
                      </div>
                    </div>
                    {((errorMessages && isValidating) ||
                      (errorMessages &&
                        errorMessages.testoSegnalazione !==
                          "Champs requis")) && (
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
                    <span>
                      J'ai lu et compris le contenu de la{" "}
                      <a
                        href="/politique-de-protection-des-donnees-a-caractere-personnel"
                        style={{ color: "#0090d0" }}
                      >
                        {" "}
                        Politique de protection des données à caractère
                        personnel{" "}
                      </a>{" "}
                      et:
                    </span>
                  </div>

                  <div className={handles.FormServiceCare_SingleRow}>
                    <span>
                      Je consens au traitement de mes données personnelles pour
                      permettre à Whirlpool France S.A.S de m'envoyer des
                      bulletins d'information/communications marketing (sous
                      forme électronique et non électronique, y compris par
                      téléphone, courrier traditionnel, e-mail, SMS, MMS,
                      notifications push sur des sites tiers, y compris sur les
                      plateformes Facebook et Google) concernant les produits et
                      services de Whirlpool France S.A.S même achetés ou
                      enregistrés par vous.
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
                        J'accepte
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
                        if (
                          objForm.TipoAssistenza !==
                          `Gestion de la confidentialité (SAR request)`
                        ) {
                          handleSubmit();
                        } else {
                          handleSubmitGDPR();
                        }
                      }}
                    >
                      ENVOYER
                    </button>
                  </div>
                </div>

                <div className={handles.FormServiceCare_SingleRow}>
                  <div className={handles.FormServiceCare_Col}>
                    <span className={handles.FormServiceCare_SpanPrivacy}>
                      Les champs marqués par (*) sont obligatoires
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
                  Merci
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
                  Votre demande a bien été enregistrée. Vous recevrez un email
                  récapitulatif des données saisies.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={handles.FormServiceCare_Col}>
                <h1 className={handles.FormServiceCare_Container_Header_Title}>
                  {isSarSent ? "Merci" : "Pardon"}
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
                    ? "Votre demande a bien été enregistrée. Vous recevrez un email récapitulatif des données saisies."
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
