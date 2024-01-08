import React, { useState } from "react";
import { Input, Button, Dropdown,Checkbox   } from "vtex.styleguide";
import styles from "./styles.css";
import classnames from "classnames";

interface CustomFormProps {

}

const SubscriberAttributes = {
  Nome: "",
  Cognome: "",
  Indirizzo: "",
  Cap:"",
  Citta: "",
  Provincia:"Seleziona la tua provincia",
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
  ComunicazioneWhirlpool:false,
  ComunicazioneGaranzia:false
};

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({

}) => {
  const [fields, setFields] = useState<{ [index: string]: any }>(
    SubscriberAttributes
  );
  const [errors, setErrors] = useState<{ [index: string]: any }>({});
  const [selectedImage, setSelectedImage] = useState<{ [index: string]: string }>({});
  const [urlImage, setUrlImage] = useState(String);
  // interface formTosend { [key: string]: any }

  const [isLoading, setLoading] = useState(false);
  const [isResponse , setResponse] = useState(false);
  const [isFormIncomplete , setFormIncomplete] = useState(false);

const province = [
  {label:'Seleziona la tua provincia' ,value:'Seleziona la tua provincia'},
  {label:'Agrigento' ,value:'Agrigento'},
  {label:'Alessandria' ,value:'Alessandria'},
  {label:'Ancona' ,value:'Ancona'},
  {label:'Aosta' ,value:'Aosta'},
  {label:'Arezzo' ,value:'Arezzo'},
  {label:'Ascoli Piceno' ,value:'Ascoli Piceno'},
  {label:'Asti' ,value:'Asti'},
  {label:'Avellino' ,value:'Avellino'},
  {label:'Bari' ,value:'Bari'},
  {label:'Barletta - Andria - TR' ,value:'Barletta - Andria - TR'},
  {label:'Belluno' ,value:'Belluno'},
  {label:'Benevento' ,value:'Benevento'},
  {label:'Bergamo' ,value:'Bergamo'},
  {label:'Biella' ,value:'Biella'},
  {label:'Bologna' ,value:'Bologna'},
  {label:'Bolzano' ,value:'Bolzano'},
  {label:'Brescia' ,value:'Brescia'},
  {label:'Brindisi' ,value:'Brindisi'},
  {label:'Cagliari' ,value:'Cagliari'},
  {label:'Caltanisetta' ,value:'Caltanisetta'},
  {label:'Campobasso' ,value:'Campobasso'},
  {label:'Carbonia - Iglasias' ,value:'Carbonia - Iglasias'},
  {label:'Caserta' ,value:'Caserta'},
  {label:'Catania' ,value:'Catania'},
  {label:'Catanzaro' ,value:'Catanzaro'},
  {label:'Chieti' ,value:'Chieti'},
  {label:'Como' ,value:'Como'},
  {label:'Cosenza' ,value:'Cosenza'},
  {label:'Cremona' ,value:'Cremona'},
  {label:'Crotone' ,value:'Crotone'},
  {label:'Cuneo' ,value:'Cuneo'},
  {label:'Enna' ,value:'Enna'},
  {label:'Fermo' ,value:'Fermo'},
  {label:'Ferrara' ,value:'Ferrara'},
  {label:'Firenze' ,value:'Firenze'},
  {label:'Foggia' ,value:'Foggia'},
  {label:'Forlì' ,value:'Forlì'},
  {label:'Forlì Cesena' ,value:'Forlì Cesena'},
  {label:'Frosinone' ,value:'Frosinone'},
  {label:'Genova' ,value:'Genova'},
  {label:'Gorizia' ,value:'Gorizia'},
  {label:'Grosseto' ,value:'Grosseto'},
  {label:'Imperia' ,value:'Imperia'},
  {label:'Isernia' ,value:'Isernia'},
  {label:"L'Aquila" ,value:"L'Aquila"},
  {label:'La Spezia' ,value:'La Spezia'},
  {label:'Latina' ,value:'Latina'},
  {label:'Lecce' ,value:'Lecce'},
  {label:'Lecco' ,value:'Lecco'},
  {label:'Livorno' ,value:'Livorno'},
  {label:'Lodi' ,value:'Lodi'},
  {label:'Lucca' ,value:'Lucca'},
  {label:'Macerata' ,value:'Macerata'},
  {label:'Mantova' ,value:'Mantova'},
  {label:'Massa Carrara' ,value:'Massa Carrara'},
  {label:'Matera' ,value:'Matera'},
  {label:'Medio Campidano' ,value:'Medio Campidano'},
  {label:'Messina' ,value:'Messina'},
  {label:'Milano' ,value:'Milano'},
  {label:'Modena' ,value:'Modena'},
  {label:'Monza e Brianza' ,value:'Monza e Brianza'},
  {label:'Napoli' ,value:'Napoli'},
  {label:'Novara' ,value:'Novara'},
  {label:'Nuoro' ,value:'Nuoro'},
  {label:'Ogliastra' ,value:'Ogliastra'},
  {label:'Olbia - Tempio' ,value:'Olbia - Tempio'},
  {label:'Oristano' ,value:'Oristano'},
  {label:'Padova' ,value:'Padova'},
  {label:'Palermo' ,value:'Palermo'},
  {label:'Parma' ,value:'Parma'},
  {label:'Pavia' ,value:'Pavia'},
  {label:'Perugia' ,value:'Perugia'},
  {label:'Pesaro' ,value:'Pesaro'},
  {label:'Pesaro Urbino' ,value:'Pesaro Urbino'},
  {label:'Pescara' ,value:'Pescara'},
  {label:'Piacenza' ,value:'Piacenza'},
  {label:'Pisa' ,value:'Pisa'},
  {label:'Pistoia' ,value:'Pistoia'},
  {label:'Pordenone' ,value:'Pordenone'},
  {label:'Potenza' ,value:'Potenza'},
  {label:'Prato' ,value:'Prato'},
  {label:'Ragusa' ,value:'Ragusa'},
  {label:'Ravenna' ,value:'Ravenna'},
  {label:'Reggio Calabria' ,value:'Reggio Calabria'},
  {label:'Reggio Emilia' ,value:'Reggio Emilia'},
  {label:'Rieti' ,value:'Rieti'},
  {label:'Rimini' ,value:'Rimini'},
  {label:'Roma' ,value:'Roma'},
  {label:'Rovigo' ,value:'Rovigo'},
  {label:'Salerno' ,value:'Salerno'},
  {label:'Sassari' ,value:'Sassari'},
  {label:'Savona' ,value:'Savona'},
  {label:'Siena' ,value:'Siena'},
  {label:'Siracusa' ,value:'Siracusa'},
  {label:'Sondrio' ,value:'Sondrio'},
  {label:'Taranto' ,value:'Taranto'},
  {label:'Teramo' ,value:'Teramo'},
  {label:'Terni' ,value:'Terni'},
  {label:'Torino' ,value:'Torino'},
  {label:'Trapani' ,value:'Trapani'},
  {label:'Trento' ,value:'Trento'},
  {label:'Treviso' ,value:'Treviso'},
  {label:'Trieste' ,value:'Trieste'},
  {label:'Udine' ,value:'Udine'},
  {label:'Varese' ,value:'Varese'},
  {label:'Venezia' ,value:'Venezia'},
  {label:'Verbania' ,value:'Verbania'},
  {label:'Vercelli' ,value:'Vercelli'},
  {label:'Verona' ,value:'Verona'},
  {label:'Vibo Valentia' ,value:'Vibo Valentia'},
  {label:'Vicenza' ,value:'Vicenza'},
  {label:'Viterbo' ,value:'Viterbo'},

]
const contactReason = [
  // { value: 'Seleziona il motivo', label: 'Seleziona il motivo' },
  { value: 'Info su acquisto prodotti', label: 'Info su acquisto prodotti' },
  { value: 'Info acquisto accessori e prodotti per pulizia', label: 'Info acquisto accessori e prodotti per pulizia' },
  { value: 'Info assistenza estesa', label: 'Info assistenza estesa' },
  { value: 'Segnalazioni', label: 'Segnalazioni' },
  { value: 'Accedi ai tuoi dati (gestione Privacy)', label: 'Accedi ai tuoi dati (gestione Privacy)' },
  { value: 'Assistenza elettrodomestici connessi', label: 'Assistenza elettrodomestici connessi' },
]
const matricoleImage = [
  // {label:"Categoria prodotto",name:"Categoria prodotto", value:""},
  {label:"pianicottura",name:"pianicottura", value:"matricola_prodotto_pianicottura___018f8558608ba3c51e58612d8bbbfc03.jpg"},
  {label:"asciugatrici",name:"asciugatrici", value:"matricola_prodotto_asciugatrici___4afb41caeeebeeb8523c868570012a8e.png"},
  {label:"cucine",name:"cucine", value:"matricola_prodotto_cucine___061caa1e10af24ee92b4d6a120d85610.png"},
  {label:"forni",name:"forni", value:"matricola_prodotto_forni___543c5799f2f7bc2878545b6175414470.png"},
  {label:"frigoriferi",name:"frigoriferi", value:"matricola_prodotto_frigoriferi___2635b8fbc906dcc82f467ba06dc7be9e.png"},
  {label:"lavasciuga",name:"lavasciuga", value:"matricola_prodotto_lavasciuga___11706c1a65ddb3504571fada0e5d4efc.png"},
  {label:"lavastoviglie",name:"lavastoviglie", value:"matricola_prodotto_lavastoviglie___2707233b9f07df2042fd03414319ed47.png"},
  {label:"lavatrici",name:"lavatrici", value:"matricola_prodotto_lavatrici___0669612a8f3754d41d960828667932a8.png"},
  {label:"congelatori",name:"congelatori", value:"matricola_prodotto_congelatori___f1564b60d8675ce37781690a4fbf70a8.png"},

]

const estensioneDiGaranzia = [
  // {label:"EstensioneDiGaranzia", value:"EstensioneDiGaranzia"},
  {label:"Si", value:"Si"},
  {label:"No", value:"No"},

]





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
        "Provincia":{"value": ""},
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
      formToSend["ComunicazioneGaranzia"]= fields.ComunicazioneGaranzia
      formToSend["ComunicazioneWhirlpool"]= fields.ComunicazioneGaranzia


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
      case "Modello":
      case "Citta":
      case "Cap":
      case "Provincia":
      case "Indirizzo":
        if (!fields[field]) {
          errors[field] = "Questo valore non dovrebbe essere vuoto.";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      case "Email":
        if (!ValidateEmail(fields["Email"])) {
          errors["Email"] = "Questo valore non è un indirizzo email valido.";
        } else {
          errors["Email"] = "";
          setFormIncomplete(false);
        }
        break;
      case "Segnalazione":
        if (fields[field].length < 12) {
          errors[field] = "Questo valore non dovrebbe essere vuoto.";
        } else {
          errors[field] = "";
          setFormIncomplete(false);
        }
        break;
      case "DataAcquisto":
        if (!isValidDate(fields[field])) {
          errors[field] = "Il campo è obbligatorio e non può includere una data futura";
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
    const EmptyFieldErrMsg = "Questo valore non dovrebbe essere vuoto.";

    let formIsValid = true;

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
    if (!fields["Modello"]) {
      errors["Modello"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["Modello"] = "";
    }
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
    if (!fields["EstensioneDiGaranzia"]) {
      errors["EstensioneDiGaranzia"] = EmptyFieldErrMsg;
      formIsValid = false;
    } else {
      errors["EstensioneDiGaranzia"] = "";
    }
    // if(fields["Email"] ==="") {
    //   errors["Cognome"] = EmptyFieldErrMsg;
    //   formIsValid = false;
    // }
    if (!ValidateEmail(fields["Email"])) {
      errors["Email"] = "Questo valore non è un indirizzo email valido.";
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
    if (!isValidDate(fields["DataAcquisto"])) {
      errors["DataAcquisto"] = "Il campo è obbligatorio e non può includere una data futura";
    } else {
      errors["DataAcquisto"] = "";
    }
    if (!isValidDatee(fields["DataFineGaranziaEstensione"]) && fields["DataFineGaranziaEstensione"].length > 0) {
      errors["DataFineGaranziaEstensione"] = "Data non valida";
      formIsValid = false;
    } else {
      errors["DataFineGaranziaEstensione"] = "";
    }


    setErrors({ ...errors });
    setFormIncomplete(!formIsValid);
    return formIsValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    if (field === "ComunicazioneGaranzia" || field === "ComunicazioneWhirlpool"){
      fields[field] = e.target.checked
    }else{
      fields[field] = e.target.value;


    }
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

  return (
    <div className={classnames(styles.containers)}>
      <form
        name="customForm"
        onSubmit={(e: any) => submitForm(e)}
        className={classnames(styles.formContainer,'items-center')}
      >
      <div className={classnames(styles.title,styles.title1)}>
        <p> Seleziona il motivo del contatto con il nostro servizio clienti</p>
        </div><div>
        <div className={classnames(styles.singleSelect, styles.singleSelectMotivo)}>
    <Dropdown
      className={classnames(styles.dropdownnnn)}
      options={contactReason}
      onChange={(e: any) => handleChange(e, "Reason")}
      value={fields["Reason"]}
      placeholder="Seleziona il tuo motivo "
    />
      </div>
  </div>
  <div className={classnames(styles.title1,styles.title)}>

      <p> Dati anagrafici </p>
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
              <label htmlFor="Nome">Nome</label>
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
              <label htmlFor="Cognome">Cognome</label>
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
              <label htmlFor="Indirizzo">Indirizzo</label>
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
              <label htmlFor="Cap">CAP</label>
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
              <label htmlFor="Citta">CITTA</label>
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
          <div className={classnames(styles.singleInput)}>
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

          </div>
          </div>
        <div className={classnames(styles.groupInput)}>

          <div className={classnames(styles.singleInput)}>
            <Input
              className={classnames(styles.inputTitle)}
              type="tel"
              pattern="(\+39)?\s?[0-9]*"
              onChange={(e: any) => handleChange(e, "Telefono")}
              value={fields["Telefono"]}
              id="Telefono"
              name="Telefono"
              placeholder="+39"
            />
            <div className={classnames(styles.inputTitle)}>
              <label htmlFor="Telefono">NUMERO DI TELEFONO</label>
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
              placeholder="latuaemail@esempio.com"
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
              <label htmlFor="Segnalazione">INSERISCI QUI IL TESTO DELLA TUA SEGNALAZIONE</label>
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








                <div className={classnames(styles.paragraphh)}>
                  <p className={classnames(styles.title)}>
                  Dati prodotto
                  </p>
                  <p>Le informazioni sul prodotto aiutano a rendere il servizio assistenza più rapido ed efficiente
</p>
                </div>



{/* /dati prodotto */}


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
              <label htmlFor="Matricola">MATRICOLA </label>
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
                styles.requiredInput,
              )}
            >
              <label htmlFor="Modello">MODELLO  </label>
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
              placeholder="GG/MM/AAAA"
            />
            <div
              className={classnames(
                styles.inputTitle,
                styles.requiredInput,
              )}
            >
              <label htmlFor="DataAcquisto">DATA D'ACQUISTO </label>
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
              <label htmlFor="PuntoVendita">PUNTO VENDITA
 </label>
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
                styles.requiredInput,
              )}
            >
              <label htmlFor="EstensioneDiGaranzia">ESTENSIONE DI GARANZIA
 </label>
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
              placeholder="GG/MM/AAAA"
              autoComplete="off"
              disabled={fields.EstensioneDiGaranzia === "No"}
            />
            <div
              className={classnames(
                styles.inputTitle
              )}
            >
              <label htmlFor="DataFineGaranziaEstensione">DATA FINE GARANZIA / ESTENSIONE</label>
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
<div className={classnames(styles.asterisco)}><p>I campi con asterisco (*) sono obbligatori</p></div>


{/* ----------------------------matricola select --------------- */}
<div>
<div className={classnames(styles.dropdownContainer, styles.widerDiv)}>
  <div className={classnames(styles.imageDropdownMatricola)}>
    <div className={styles.matricola}>
      <p className={classnames(styles.title)}>
      Dove trovi la matricola ?
      </p>
      <p className={classnames(styles.text)}> Per visualizzare dove si trova la matricola seleziona la linea prodotto.</p>
      <p>La matricola è indicata sul certificato di garanzia che trovi nella documentazione dell'elettrodomestico,
        il modello del prodotto si trova nella prima pagina del libretto di istruzioni oppure puoi trovare matricola
        e modello sull'etichetta apposita situata sul tuo elettrodomestico. </p>
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
    placeholder ="Categoria prodotto"
    />
      </div>
  <div className={classnames(styles.imageDropdown)}>
      <img src= {urlImage} alt=""/>
    </div>
</div>
</div>





{/* // consenso privacy */}

<div className={classnames(styles.consenso)}>
  <p className={classnames(styles.title)} >Consenso al trattamento dei dati personali
</p>
<p className={classnames(styles.text)}> Ho compreso e prendo atto del contenuto dell'<a className={classnames(styles.formLink)} href="/pagine/informativa-sulla-privacy">informativa sulla privacy e:</a></p>
  <div>
  <p>a) Accetto di ricevere comunicazioni di marketing personalizzate relative a Whirlpool e altri marchi di Whirlpool Corporation.</p>
  </div>
<div className="mb3">
    <Checkbox
      checked={fields["ComunicazioneWhirlpool"]}
      id="ComunicazioneWhirlpool"
      label="Accetto"
      name="default-checkbox-group"
      // onChange={e => setState({ check1: !state.check1 })}
      onChange={(e: any) => handleChange(e, "ComunicazioneWhirlpool")}
      value={fields["ComunicazioneWhirlpool"]}
    />
  </div>
  <div>
    <p> b) Desidero essere contattato da Servizi Domestic & General Italia S.r.l. in relazione ai servizi di garanzia. </p>
    </div>
  <div className="mb3">
  <Checkbox
  className={classnames(styles.checkbox)}
    checked={fields["ComunicazioneGaranzia"]}

    id="ComunicazioneGaranzia"
    label="Accetto"
    name="default-checkbox-group"
    onChange={(e: any) => handleChange(e, "ComunicazioneGaranzia")}
    value={fields["ComunicazioneGaranzia"]}
  />
  </div>
</div>


<div className={classnames(styles.inviaButton)}>
{isLoading ? (
          <div className={classnames(styles.loaderFormContainer)}>
            <div className={classnames(styles.loaderForm)}></div>
          </div>
        ) : isResponse ? (
          <div className={classnames(styles.messageText)}>
            <span>
              Grazie per averci contattato! Ti abbiamo inviato una email con il
              resoconto dei dati &nbsp;
            </span>
            <a className={classnames(styles.formLink)} href="/">

              torna alla home
            </a>
          </div>
        ) : (
            <Button
              type="submit"
              id="invia"
              name="invia"
              value="Submit"
            >
              INVIA IL MODULO
            </Button>
        )}
        {isFormIncomplete ? (
          <div className={classnames(styles.inputError)}>Alcuni campi obbligatori non sono correttamente compilati</div>)
        : null}

          </div>

      </div>
      </form>
    </div>
  );
};

CustomForm.schema = {
  title: "editor.customForm.title",
  description: "editor.customForm.description",
  type: "object",
  properties: {},
};

export default CustomForm;
