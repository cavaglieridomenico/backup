import React, { useState } from "react";
import { Input, Button, Dropdown,Checkbox   } from "vtex.styleguide";
import styles from "./styles.css";
import classnames from "classnames";
import { useEffect } from "react";
import { useIntl, defineMessages } from 'react-intl'
interface CustomFormProps {

}

interface WindowGTM extends Window{
  dataLayer: any
}

const SubscriberAttributes = {
  Nome: "",
  Cognome: "",
  Indirizzo: "",
  Cap:"",
  Citta: "",
  // Provincia:"Seleziona la tua provincia",
  Email: "",
  Telefono: "",
  Segnalazione:"",
  Matricola:"",
  Modello:"",
  DataAcquisto:"",
  PuntoVendita:"",
  EstensioneDiGaranzia:"",
  DataFineGaranziaEstensione:"",
  Reason: "",
  supportEmail:"",
  ComunicazioneWhirlpool:false,
  ComunicazioneGaranzia:false
};

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({
 
}) => {
  const intl = useIntl()
  const [fields, setFields] = useState<{ [index: string]: any }>(
    SubscriberAttributes
  );
  const [errors, setErrors] = useState<{ [index: string]: any }>({});
  const [selectedImage, setSelectedImage] = useState<{ [index: string]: string }>({});
  const [urlImage, setUrlImage] = useState(String);
  const [isGDPR, setIsGDPR] = useState(false);
  // interface formTosend { [key: string]: any }

  const [isLoading, setLoading] = useState(false);
  const [isResponse , setResponse] = useState(false);
  const [isFormIncomplete , setFormIncomplete] = useState(false);

const contactReason = [
  { value: "Contrats de garantie", label: "Contrats de garantie" },
  { value: "Assistance technique", label: "Assistance technique" },
  { value: "Gestion de la confidentialitè", label: "Gestion de la confidentialitè" },
  { value: "Assistance appareils connectés", label: "Assistance appareils connectés" },
  { value: "Autre motifs", label: "Autre motifs" },
  { value: "Achat de produits (informations, conseils)", label: "ESHOP: Achat de produits (informations, conseils)"},
  { value: "Commande en cours (modification des informations ou des produits)", label: "ESHOP: Commande en cours (modification des informations ou des produits)"},
  { value: "Paiement", label: "ESHOP: Paiement"},
  { value: "Suivi de ma commande, livraison, installation", label: "ESHOP: Suivi de ma commande, livraison, installation"},
  { value: "Demande de rétractation", label: "ESHOP: Demande de rétractation"},
  { value: "Suivi de ma demande de rétractation (statut, remboursement)", label: "ESHOP: Suivi de ma demande de rétractation (statut, remboursement)"},
  // { value: "Déclarer un produit endommagé à la livraison", label: "Déclarer un produit endommagé à la livraison"},
  // { value: "Suivi de ma déclaration de produit endommagé (statut, remplacement)", label: "Suivi de ma déclaration de produit endommagé (statut, remplacement)"},
  { value: "Autres demandes", label: "ESHOP: Autres demandes"}
]
const contactReasonTranslation = [
  { value: "Contrats de garantie", label: "Guarantee contracts" },
  { value: "Assistance technique", label: "Technical assistance" },
  { value: "Gestion de la confidentialitè", label: "Confidentiality management" },
  { value: "Assistance appareils connectés", label: "Support connected devices" },
  { value: "Autre motifs", label: "Other reasons" },
  { value: "Achat de produits (informations, conseils)", label: "ESHOP: Product Purchase (information, advice)"},
  { value: "Commande en cours (modification des informations ou des produits)", label: "ESHOP: Order in progress (modification of information or products)"},
  { value: "Paiement", label: "ESHOP: Payment"},
  { value: "Suivi de ma commande, livraison, installation", label: "ESHOP: Order, delivery and installation tracking"},
  { value: "Demande de rétractation", label: "ESHOP: Withdrawal Request"},
  { value: "Suivi de ma demande de rétractation (statut, remboursement)", label: "ESHOP: Withdrawal request follow-up (status, reimbursement)"},
  { value: "Autres demandes", label: "ESHOP: Other requests"}
]
const matricoleImage = [
  // {label:"Categoria prodotto",name:"Categoria prodotto", value:""},
  {label:"Cuisinière",name:"Cuisinière", value:"matricola_prodotto_pianicottura___018f8558608ba3c51e58612d8bbbfc03.jpg"},
  {label:"Sèche-linge",name:"Sèche-linge", value:"matricola_prodotto_asciugatrici___4afb41caeeebeeb8523c868570012a8e.png"},
  // {label:"Cuisinière",name:"Cuisinière", value:"matricola_prodotto_cucine___061caa1e10af24ee92b4d6a120d85610.png"},
  {label:"Four encastrable",name:"Four encastrable", value:"matricola_prodotto_forni___543c5799f2f7bc2878545b6175414470.png"},
  {label:"Réfrigérateur",name:"Réfrigérateur", value:"matricola_prodotto_frigoriferi___2635b8fbc906dcc82f467ba06dc7be9e.png"},
  {label:"Lavante-séchante",name:"Lavante-séchante", value:"matricola_prodotto_lavasciuga___11706c1a65ddb3504571fada0e5d4efc.png"},
  {label:"Lave-vaisselle",name:"Lave-vaisselle", value:"matricola_prodotto_lavastoviglie___2707233b9f07df2042fd03414319ed47.png"},
  {label:"Lave-linge",name:"Lave-linge", value:"matricola_prodotto_lavatrici___0669612a8f3754d41d960828667932a8.png"},
  {label:"Congélateur",name:"Congélateur", value:"matricola_prodotto_congelatori___f1564b60d8675ce37781690a4fbf70a8.png"},

]

const estensioneDiGaranzia = [
  // {label:"EstensioneDiGaranzia", value:"EstensioneDiGaranzia"},
  {label:"Oui", value:"Oui"},
  {label:"Non", value:"Non"},

]

const pushEvent = (json:any) =>{
  let dl = (window as unknown as WindowGTM).dataLayer || []
  dl.push(json)
}
  

  function isValidDate(date: string) {
    // const dateString: string = date.value;
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) return false;

    // Parse the date parts to integers
    var parts: any = date.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

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
  function isValidDatee(date: string) {
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) return false
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
  const submitForm = (e: any) => {
    e.preventDefault();
    handleValidation();
    if (handleValidation()) {
      setLoading(true);
      let formToSend: { [index: string]: any } = {};
      formToSend = {
        "Nome": {"value": ""},
        "Cognome": {"value": ""},
        "Indirizzo":{"value": ""},
        "Cap":{"value": ""},
        "Citta": {"value": ""},
        // "Provincia":{"value": ""},
        "Email": {"value": ""},
        "Telefono": {"value":""},
        "Segnalazione": {"value" : "" },
        "Matricola":{"value": ""},
        "Modello":{"value": ""},
        "DataAcquisto":{"value": ""},
        "PuntoVendita":{"value": ""},
        "EstensioneDiGaranzia":{"value": ""},
        "DataFineGaranziaEstensione":{"value": ""},
        "Reason": {"value": ""},
        "supportEmail": {"value": ""},
        "ComunicazioneWhirlpool":{"value": false},
        "ComunicazioneGaranzia":{"value": false}
      }
      // formToSend["ContactAttributes"] = {};
      // formToSend["Indirizzo"] = fields.Email;
      // formToSend["SubscriberKey"] = fields.Email;
      // formToSend["ContactAttributes"]["SubscriberAttributes"] = fields;
      Object.keys(fields).map((f) => {
        fields[f] ? formToSend[f]["value"] = fields[f] : formToSend[f]["value"] = ""
      })
      if(
        fields["Reason"] == "Contrats de garantie" ||
        fields["Reason"] == "Assistance technique" ||
        fields["Reason"] == "SAR Request" ||
        fields["Reason"] == "Assistance appareils connectés" ||
        fields["Reason"] == "Autre motifs"){
          formToSend["supportEmail"] = {"value": "france@fr.whirlpool.eu"}
      }else if (
        fields["Reason"] == "Achat de produits (informations, conseils)" ||
        fields["Reason"] == "Commande en cours (modification des informations ou des produits)" ||
        fields["Reason"] == "Paiement" ||
        fields["Reason"] == "Suivi de ma commande, livraison, installation" ||
        fields["Reason"] == "Suivi de ma demande de rétractation (statut, remboursement)" ||
        fields["Reason"] == "Déclarer un produit endommagé à la livraison" ||
        fields["Reason"] == "Autres demandes"
      ){
        formToSend["supportEmail"] = {"value": "eshop@whirlpool.com"}
      }else if (
        fields["Reason"] == "E-SHOP : Demande de rétractation"
      ){
        formToSend["supportEmail"] = {"value": "eshop@whirlpool.com"}
      }else if(
        fields["Reason"] == "E-SHOP : Déclarer un produit endommagé à la livraison"
      ){
        formToSend["supportEmail"] = {"value": "eshop@whirlpool.com"}
      }
      formToSend["ComunicazioneGaranzia"]= fields.ComunicazioneGaranzia
      formToSend["ComunicazioneWhirlpool"]= fields.ComunicazioneWhirlpool


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
          let translatedReason:any = contactReasonTranslation.filter((item)=>{
            if(item.value == fields["Reason"])
              return item
            else
              return null
          })
          pushEvent({
            event: "serviceContactFormSubmit",
            serviceReason: translatedReason[0].label
          })
        }
      });
    } else {
      setFormIncomplete(true);
    }

  };

  const validateField = (field:string) => {

    switch(field){
      case "Nome":
      case "Cognome":
      case "EstensioneDiGaranzia":
      // case "Modello":
      case "Citta":
      case "Cap":
      // case "Provincia":
      case "Reason":
      case "Indirizzo":
        if (!fields[field]) {
          errors[field] = "Cette valeur ne doit pas être vide.";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      case "Email":
        if (!ValidateEmail(fields["Email"])) {
          errors["Email"] = "Cette valeur n'est pas une adresse e-mail valide.";
        } else {
          errors["Email"] = "";
          setFormIncomplete(false);
        }
        break;
      case "Segnalazione":
        if (fields[field].length < 12) {
          errors[field] = "Cette valeur ne doit pas être vide.";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      case "DataAcquisto":
        if (!isValidDate(fields[field])) {
          errors[field] = "Le champ est obligatoire et ne peut pas inclure de date future";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      // case "DataFineGaranziaEstensione":
      //   if (!isValidDatee(fields[field])) {
      //     errors[field] = "Data non valida";
      //   } else {
      //     errors[field] = "";
      //     setFormIncomplete(false);
      //   }
      //   break;
    }
    
  }
  
  const handleValidation = () => {
    const EmptyFieldErrMsg = "Cette valeur ne doit pas être vide.";

    let formIsValid = true;

    if (!fields["Reason"]) {
      errors["Reason"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Reason"] = "";
    }
    if (!fields["Nome"]) {
      errors["Nome"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Nome"] = "";
    }
    if (!fields["Cognome"]) {
      errors["Cognome"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Cognome"] = "";
    }
    // if (!fields["Modello"] && !isGDPR) {
    //   errors["Modello"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // } else {
    //   errors["Modello"] = "";
    // }
    if (!fields["Citta"]) {
      errors["Citta"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Citta"] = "";
    }
    if (!fields["Cap"]) {
      errors["Cap"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Cap"] = "";
    }
    if (fields["Provincia"] === "Seleziona la tua provincia") {
      errors["Provincia"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Provincia"] = "";
    }
    if (!fields["Indirizzo"]) {
      errors["Indirizzo"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Indirizzo"] = "";
    }
    // if (!fields["EstensioneDiGaranzia"] && !isGDPR) {
    //   errors["EstensioneDiGaranzia"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // } else {
    //   errors["EstensioneDiGaranzia"] = "";
    // }
    // if(fields["Email"] ==="") {
    //   errors["Cognome"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // }
    if (!ValidateEmail(fields["Email"])) {
      errors["Email"] = "Cette valeur n'est pas une adresse e-mail valide.";
      formIsValid = false;
    } else {
      errors["Email"] = "";
    }
    
    if (!fields["Segnalazione"]) {
      errors["Segnalazione"] = EmptyFieldErrMsg
      formIsValid = false;
    } else {
      errors["Segnalazione"] = "";
    }
    // if (!isValidDate(fields["DataAcquisto"]) && !isGDPR) {
    //   errors["DataAcquisto"] = "Le champ est obligatoire et ne peut pas inclure de date future";
    //   formIsValid = false;
    // } else {
    //   errors["DataAcquisto"] = "";
    // }
    if (!isValidDatee(fields["DataFineGaranziaEstensione"]) && fields["DataFineGaranziaEstensione"].length > 0 && !isGDPR) {
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
    if (field === "ComunicazioneGaranzia" || field === "ComunicazioneWhirlpool") {
      fields[field] = e.target.checked
    } else{
      fields[field] = e.target.value;
    }
    (fields["Reason"] === "Aggiornare /cancellare dati personali (gestione privacy) / GDPR cancellazione account") ? setIsGDPR(true) : setIsGDPR(false);
    
    setFields({ ...fields });
    validateField(field);
  };
  const handleselectedImage = (e: any) => {
    let imageToRender : any = e.target.value
    matricoleImage[imageToRender]
    let urlImage = `https://itwhirlpoolqa.vtexassets.com/assets/vtex/assets-builder/reply.whl-theme/1.0.0/contattaci-matricola-prodotti/${imageToRender}`
    setSelectedImage(imageToRender)
    setUrlImage(urlImage)
  };
  const handleSubmitForm = (e:any) => {
    if(fields["Reason"] == "Richiesta assistenza tecnica su  prodotto coperto da piano di estensione di assistenza e oltre il 24 mese di vita" ||
    fields["Reason"] == "Devo aggiornare i dati del mio appuntamento" ||
    fields["Reason"] == "Spostare o cancellare un appuntamento"){
      window.open("/supporto/fissa-un-appuntamento")
    }else{
      submitForm(e)
    }
  }

  useEffect(() => {
    if(fields.Reason === "Aggiornare /cancellare dati personali (gestione privacy) / GDPR cancellazione account") {
      setIsGDPR(true);
    }
  }, []);

  const datiProdotto = (<div className={classnames("w-100")}><div className={classnames(styles.paragraphh)}>
  <p className={classnames(styles.title)}>
  Informations sur le produit
  </p>
  <p>Les informations sur les produits contribuent à rendre notre service d'assistance plus rapide et plus efficace.
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
<div
className={classnames(
styles.inputTitle,
)}
>
<label htmlFor="Matricola">NUMÉRO DE SÉRIE</label>
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
<div
className={classnames(
styles.inputTitle,
// styles.requiredInput,
)}
>
<label htmlFor="Modello">MODÈLE</label>
</div>
{errors.Modello ? (
<span
id="ModelloError"
className={classnames(styles.inputError)}
>
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
placeholder="jj/mm/aaaa"
/>
<div
className={classnames(
styles.inputTitle,
// styles.requiredInput,
)}
>
<label htmlFor="DataAcquisto">DATE D'ACHAT</label>
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
<div
className={classnames(
styles.inputTitle,
)}
>
<label htmlFor="PuntoVendita">POINT DE VENTE</label>
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
<div
className={classnames(
styles.inputTitle,
)}
>
<label htmlFor="EstensioneDiGaranzia">AVEZ-VOUS UNE EXTENSION DE GARANTIE</label>
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
placeholder="jj/mm/aaaa"
autoComplete="off"
disabled={fields.EstensioneDiGaranzia === "No"}
/>
<div
className={classnames(
styles.inputTitle
)}
>
<label htmlFor="DataFineGaranziaEstensione">DATE D'EXPIRATION DE LA GARANTIE</label>
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
<div className={classnames(styles.asterisco)}><p>Les champs marqués d'un * sont obligatoires.</p></div>

{/* ----------------------------matricola select --------------- */}
<div>
<div className={classnames(styles.dropdownContainer, styles.widerDiv)}>
<div className={classnames(styles.imageDropdownMatricola)}>
<div className={styles.matricola}>
<p className={classnames(styles.title)}>
Comment trouver le numéro de série et le modèle de votre appareil ?
</p>
<p className={classnames(styles.text)}> Le numéro de série et le code des appareils se trouvent sur l'étiquette signalétique du produit.</p>
<p>Le numéro de série est également indiqué sur le certificat de garantie fourni avec l'appareil et le code du modèle sur la première page du mode d'emploi.</p>
<p>Pour trouver le numéro de série et le modèle de votre appareil, sélectionnez ici une catégorie de produits :</p>
</div>
<div >
<img src="https://itwhirlpoolqa.vtexassets.com/assets/vtex/assets-builder/reply.whl-theme/1.0.0/contattaci-matricola-prodotti/matricola_prodotto_pianicottura___018f8558608ba3c51e58612d8bbbfc03.jpg"></img>
</div>
</div>
<div className={classnames(styles.singleSelectProdotto)}>
<Dropdown
selectTestId="imageSelect"
options={matricoleImage}
onChange={(e: any) => handleselectedImage(e)}
value={selectedImage}
placeholder ="Catégorie de produits"
/>
</div>
<div className={classnames(styles.imageDropdown)}>
<img src= {urlImage} alt=""/>
</div>
</div>
</div>
</div>);
  return (
    <div className={classnames(styles.containers)}>
      <form
        name="customForm"
        onSubmit={(e: any) => handleSubmitForm(e)}
        className={classnames(styles.formContainer,'items-center')}
      >
      <div className={classnames(styles.title,styles.title1)}>
        <p> Veuillez sélectionner l'objet de votre demande </p>
        </div><div>
        <div className={classnames(styles.singleSelect, styles.singleSelectMotivo)}>
    <Dropdown
      className={classnames(styles.dropdownnnn)}
      options={contactReason}
      onChange={(e: any) => {
        handleChange(e, "Reason")
    }}
      value={fields["Reason"]}
      placeholder="Choisissez un sujet"
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
  <div className={classnames(styles.title1,styles.title)}>

      <p> Données personnelles </p>
  </div>
        <div className={classnames(styles.supportReturn)}>
        <div className={classnames(styles.groupInput)}>
          <div className={classnames(styles.singleInput)}>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Nome")}
                value={fields["Nome"]}
                id="Nome"
                name="Nome"
                placeholder=""
              />

            </div>
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
                )}
                >
              <label htmlFor="Nome">PRÉNOM</label>
            </div>
              {errors.Nome ? (
                <span
                  id="NomeError"
                  className={classnames(styles.inputError)}
                >
                  {errors.Nome}
                </span>
              ) : null}
          </div>
          <div className={classnames(styles.singleInput)}>
            
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: any) => handleChange(e, "Cognome")}
                value={fields["Cognome"]}
                id="Cognome"
                name="Cognome"
                placeholder=""
              />
          
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="Cognome">NOM</label>
            </div>
            {errors.Cognome ? (
              <span
                id="firstNameError"
                className={classnames(styles.inputError)}
              >
                {errors.Cognome}
              </span>
            ) : null}
          </div>
          
        </div>
        <div className={classnames(styles.groupInput)}>
          <div className={classnames(styles.singleInput, "w-100")}>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "Indirizzo")}
              value={fields["Indirizzo"]}
              id="Indirizzo"
              name="Indirizzo"
              placeholder=""
            />
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="Indirizzo">ADRESSE</label>
            </div>
            {errors.Indirizzo ? (
              <span
                id="IndirizzoError"
                className={classnames(styles.inputError)}
              >
                {errors.Indirizzo}
              </span>
            ) : null}

           
          </div>
        </div>
          <div className={classnames(styles.groupInput)}>
          <div className={classnames(styles.singleInput)}>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "Cap")}
              value={fields["Cap"]}
              id="Cap"
              name="Cap"
              placeholder=""
            />
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="Cap">CODE POSTAL</label>
            </div>
            {errors.Cap ? (
              <span
                id="CapError"
                className={classnames(styles.inputError)}
              >
                {errors.Cap}
              </span>
            ) : null}

           
          </div>
          <div className={classnames(styles.singleInput)}>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: any) => handleChange(e, "Citta")}
              value={fields["Citta"]}
              id="Citta"
              name="Citta"
              placeholder=""
            />
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="Citta">Ville</label>
            </div>
            {errors.Citta ? (
              <span
                id="CittaError"
                className={classnames(styles.inputError)}
              >
                {errors.Citta}
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
              // pattern="^((\+)33|0)[1-9](\d{2}){4}$"
              onChange={(e: any) => handleChange(e, "Telefono")}
              value={fields["Telefono"]}
              id="Telefono"
              name="Telefono"
              placeholder="+33"
            />
            <div className={classnames(styles.inputTitle)}>
              <label htmlFor="Telefono">TÉLÉPHONE</label>
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
              placeholder="tonemail@example.com"
            />
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="Email">Email</label>
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
            id="Segnalazione"
            name="Segnalazione"
            placeholder=""
            onChange={(e: any) => handleChange(e, "Segnalazione")}
            value={fields["Segnalazione"]}
            rows={10}
          ></textarea>
        <div className={classnames(styles.inputTitle, styles.requiredInput,)}>
              <label htmlFor="Segnalazione">VEUILLEZ SAISIR ICI VOTRE MESSAGE</label>
            </div>
            {errors.Segnalazione ? (
              <span
                id="SegnalazioneError"
                className={classnames(styles.inputError)}
              >
                {errors.Segnalazione}
              </span>
            ) : null}
        </div>

{!isGDPR && datiProdotto}




{/* // consenso privacy */}

  <div className={classnames(styles.consenso)}>
    {/* <p className={classnames(styles.title)} >Consentement au traitement des Données Personnelles</p> */}
    <p className={classnames(styles.text)}> Je comprends le contenu de <a className={classnames(styles.formLink)} href="/pages/politique-de-protection-des-donnees-a-caractere-personnel"> Politique de protection des données personnelles</a> et:</p>
    <div className="mb3">
      <Checkbox
        checked={fields["ComunicazioneWhirlpool"]}
        id="ComunicazioneWhirlpool"
        label={`${intl.formatMessage(messages.optinLabel)}`}
        name="default-checkbox-group"
        // onChange={e => setState({ check1: !state.check1 })}
        onChange={(e: any) => handleChange(e, "ComunicazioneWhirlpool")}
        value={fields["ComunicazioneWhirlpool"]}
        className={styles.consensoCheckbox}
      />
    </div>
    {/* <div>
      <p>{`${intl.formatMessage(messages.optinLabel2)}`}</p>
    </div>
    <div className="mb3">
      <Checkbox
      className={classnames(styles.checkbox)}
        checked={fields["ComunicazioneGaranzia"]}

        id="ComunicazioneGaranzia"
        label="J'accepte"
        name="default-checkbox-group"
        onChange={(e: any) => handleChange(e, "ComunicazioneGaranzia")}
        value={fields["ComunicazioneGaranzia"]}
      />
    </div> */}
</div>

<div className={classnames(styles.inviaButton)}>
  {isLoading ? (
    <div className={classnames(styles.loaderFormContainer)}>
      <div className={classnames(styles.loaderForm)}></div>
    </div>
    ) 
    : 
    isResponse ? (
      <div className={classnames(styles.messageText)}>
        <span>
          Merci de nous avoir contactés. Nous vous avons envoyé un email du rapport des données. &nbsp;
        </span> 
        <a className={classnames(styles.formLink)} href="/">Retour à la page d'accueil</a>
      </div>
    ) 
    : 
    (<Button
      type="submit"
      id="invia"
      name="invia"
      value="Submit"
    >
      ENVOYER
    </Button>)}
    {isFormIncomplete ? (
      <div className={classnames(styles.inputError)}>Certains champs obligatoires ne sont pas remplis correctement</div>)
        : null}
        
          </div>

      </div>
      </form>
    </div>
  );
};

const messages = defineMessages({
  optinLabel: {
    defaultMessage: 'Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S de m\'envoyer des bulletins d\'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S même achetés ou enregistrés par vous.',
    id: 'contattaci.optin-label',
  },
  optinLabel2: {
    defaultMessage: "b) J'accepte d'être contacté par Domestic & General Insurance PLC concernant les garanties.",
    id: 'contattaci.optin-label-2',
  },
})

CustomForm.schema = {
  title: "editor.customForm.title",
  description: "editor.customForm.description",
  type: "object",
  properties: {},
};

export default CustomForm;
