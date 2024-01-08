import React, {useState,useEffect} from 'react'
import { useCssHandles } from "vtex.css-handles";
import validate from "../react/hooks/validate"
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
    "FormServiceCare_Img_Dishwasing"
];

const services=[
    {id:1,name:"Seleziona il tuo motivo",},
    {id:2,name:"Informazioni sui prodotti",value:"id_sp_reason_products"},
    {id:4,name:"Richiesta assistenza tecnica su prodotto 0-24 mesi", value:"id_sp_reason_assistance"},
    {id:6,name:"Richiesta assistenza tecnica su prodotto con più di 24 mesi",value:"id_sp_reason_out_of_warranty"},
    {id:5,name:"Richiesta assistenza tecnica su prodotto coperto da estensione di assistenza",value:"id_sp_reason_assistance_extended"},
    //{id:7,name:"Informazioni/Segnalazioni intervento in corso", value:""},
    {id:10,name:"Spostare, modificare o cancellare un appuntamento", value:"id_sp_reason_update_appointment_reservation"},
    {id:12,name:"Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account",value:"id_pd_1"}
];

const products=[
    {id:1,name:"Asciugatrici"},
    {id:2,name:"Lavatrici"},
    {id:3,name:"Lavasciuga"},
    {id:4,name:"Lavastoviglie"},
    {id:6,name:"Forni"},
    {id:7,name:"Frigoriferi"},
    {id:8,name:"Piani cottura"},
    {id:9,name:"Congelatori"},
    {id:10,name:"Cucine"}
];

const cities = [
    {name:'',value:""},
    {name:'Agrigento',value:"AG"},
    {name:'Alessandria',value:"AL"},
    {name:'Ancona',value:"AN"},
    {name:'Aosta',value:"AO"},
    {name:'Arezzo',value:"AR"},
    {name:'Ascoli Piceno',value:"AP"},
    {name:'Asti',value:"AT"},
    {name:'Avellino',value:"AV"},
    {name:'Bari',value:"BA"},
    {name:'Barletta-Andria-Trani',value:"BT"},
    {name:'Belluno',value:"BL"},
    {name:'Benevento',value:"BN"},
    {name:'Bergamo',value:"BG"},
    {name:'Biella',value:"BI"},
    {name:'Bologna',value:"BO"},
    {name:'Bolzano',value:"BZ"},
    {name:'Brescia',value:"BR"},
    {name:'Brindisi',value:"BR"},
    {name:'Cagliari',value:"CA"},
    {name:'Caltanissetta',value:"CL"},
    {name:'Campobasso',value:"CB"},
    {name:'Carbonia-Iglesias',value:"CI"},
    {name:'Caserta',value:"CE"},
    {name:'Catania',value:"CT"},
    {name:'Catanzaro',value:"CZ"},
    {name:'Chieti',value:"CH"},
    {name:'Como',value:"CO"},
    {name:'Cosenza',value:"CS"},
    {name:'Cremona',value:"CR"},
    {name:'Crotone',value:"KR"},
    {name:'Cuneo',value:"CN"},
    {name:'Enna',value:"EN"},
    {name:'Fermo',value:"FM"},
    {name:'Ferrara',value:"FE"},
    {name:'Firenze',value:"FI"},
    {name:'Foggia',value:"FG"},
    {name:'Forlì-Cesena',value:"FO"},
    {name:'Frosinone',value:"FR"},
    {name:'Genova',value:"GE"},
    {name:'Gorizia',value:"GO"},
    {name:'Grosseto',value:"GR"},
    {name:'Imperia',value:"IM"},
    {name:'Isernia',value:"IS"},
    {name:'La Spezia',value:"SP"},
    {name:'L\'Aquila',value:"AQ"},
    {name:'Latina',value:"LT"},
    {name:'Lecce',value:"LE"},
    {name:'Lecco',value:"LC"},
    {name:'Livorno',value:"LI"},
    {name:'Lodi',value:"LO"},
    {name:'Lucca',value:"LU"},
    {name:'Macerata',value:"MC"},
    {name:'Mantova',value:"MN"},
    {name:'Massa-Carrara',value:"MS"},
    {name:'Matera',value:"MT"},
    {name:'Messina',value:"ME"},
    {name:'Milano',value:"MI"},
    {name:'Modena',value:"MO"},
    {name:'Monza e della Brianza',value:"MB"},
    {name:'Napoli',value:"NA"},
    {name:'Novara',value:"NO"},
    {name:'Nuoro',value:"NU"},
    {name:'Olbia-Tempio',value:"OT"},
    {name:'Oristano',value:"OR"},
    {name:'Padova',value:"PD"},
    {name:'Palermo',value:"PA"},
    {name:'Parma',value:"PR"},
    {name:'Pavia',value:"PV"},
    {name:'Perugia',value:"PE"},
    {name:'Pesaro e Urbino',value:"PS"},
    {name:'Pescara',value:"PE"},
    {name:'Piacenza',value:"PC"},
    {name:'Pisa',value:"PI"},
    {name:'Pistoia',value:"PT"},
    {name:'Pordenone',value:"PN"},
    {name:'Potenza',value:"PZ"},
    {name:'Prato',value:"PO"},
    {name:'Ragusa',value:"RG"},
    {name:'Ravenna',value:"RA"},
    {name:'Reggio Calabria',value:"RC"},
    {name:'Reggio Emilia',value:"RE"},
    {name:'Rieti',value:"RI"},
    {name:'Rimini',value:"RN"},
    {name:'Roma',value:"RM"},
    {name:'Rovigo',value:"RV"},
    {name:'Salerno',value:"SA"},
    {name:'Medio Campidano',value:"SS"},
    {name:'Sassari',value:"SV"},
    {name:'Savona',value:"SV"},
    {name:'Siena',value:"SI"},
    {name:'Siracusa',value:"SR"},
    {name:'Sondrio',value:"SO"},
    {name:'Taranto',value:"TA"},
    {name:'Teramo',value:"TE"},
    {name:'Terni',value:"TR"},
    {name:'Torino',value:"TO"},
    {name:'Ogliastra',value:""},
    {name:'Trapani',value:"TP"},
    {name:'Trento',value:"TN"},
    {name:'Treviso',value:"TV"},
    {name:'Trieste',value:"TS"},
    {name:'Udine',value:"UD"},
    {name:'Varese',value:"VA"},
    {name:'Venezia',value:"VE"},
    {name:'Verbano-Cusio-Ossola',value:"VB"},
    {name:'Vercelli',value:"VC"},
    {name:'Verona',value:"VR"},
    {name:'Vibo Valentia',value:"VV"},
    {name:'Vicenza',value:"VI"},
    {name:'Viterbo',value:"VT"}
];



function FormServiceCare() {
    const [isAcceptedPrivacy,setIsAcceptedPrivacy]=useState(false);
    const [isAcceptedNewsLetter,setIsAcceptedNewsLetter]=useState(false);
    const [isProductsListShow,setIsProductsListShow]=useState(false);
    const [currentProductValue,setCurrentProductValue]=useState("Categoria prodotto");
    const [errorMessages,setErrorMessages]=useState([]);
    const [objForm, setObjForm] = useState([]);
    const [isValidating,setIsValidating]=useState(false);
    const [url, setUrl]= useState("")
    const [contactSupport,setContactSupport]=useState("")
    const [isSent,setIsSent]=useState(false)
    const { handles } = useCssHandles(CSS_HANDLES);
    const [GDPRTXT,setGDPRTXT]=useState("")
    const [isSarSent,setIsSarSent]=useState(false)

const { push } = usePixel();

    useEffect(() => {
        setErrorMessages(validate(objForm));
    }, [objForm])

    useEffect(() => {
        //Api based on the type of Support
        if(objForm.TipoAssistenza===`Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account`){
            setUrl("/v1/api/crm/sar")
        }
        if(objForm.TipoAssistenza!==`Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account`){
            setUrl("/api/dataentities/CU/documents")
        }
        if(objForm.TipoAssistenza==="Attivazione piano estensione di assistenza"){
            setContactSupport("gestioneconsumatore@whirlpool.com")
        }
        if(objForm.TipoAssistenza==="Informazioni sui prodotti"){
            setContactSupport("customcare@whirlpool.com")
        }
        if(objForm.TipoAssistenza==="Richiesta assistenza tecnica su prodotto 0-24 mesi"||objForm.TipoAssistenza==="Elettrodomestici connessi"){
            setContactSupport("assistenza@whirlpool.com")
        }
        if(objForm.TipoAssistenza==="Richiesta assistenza tecnica su prodotto con più di 24 mesi"){
            setContactSupport("itservice199@whirlpool.com")
        }
        if(objForm.TipoAssistenza==="Spostare, modificare o cancellare un appuntamento"){
            window.location.href = '/assistenza/richiedi-un-intervento#prenota-intervento'
        }
        if(objForm.TipoAssistenza==="Richiesta assistenza tecnica su prodotto coperto da estensione di assistenza"){
            window.location.href = 'https://idproduction.indesit.it/assistenza/richiedi-un-intervento#prenota-intervento'
        }

    }, [objForm.TipoAssistenza])

    const analyticsCallback = () => {
        // window.dataLayer = window.dataLayer || [];
        // let analyticsJson = {
        //     event: 'serviceContactFormSubmit',
        //     serviceReason: objForm.TipoAssistenza
        // }
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
            event: 'ga4-serviceContactFormSubmit',
            ga4Data
        })
    }

    const handleSubmit =()=>{
        setIsValidating(true);

        //GA4FUNREQ58
        setAnalyticCustomError(errorMessages, push);

        if
        (
            // isAcceptedNewsLetter
            // && isAcceptedNewsLetter
            Object.keys(errorMessages).length ===0
        )
        {
            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    "Cap": {
                        "value": objForm.cap
                    },
                    "Citta": {
                        "value": objForm.città
                    },
                    "Cognome": {
                        "value": objForm.cognome
                    },
                    "ComunicazioneGaranzia": true,
                    "ComunicazioneWhirlpool": true,
                    "DataAcquisto": {
                        "value": objForm.dataDacquisto
                    },
                    "DataFineGaranziaEstensione": {
                        "value": objForm.dataFineGaranzia
                    },
                    "Email": {
                        "value": objForm.email
                    },
                    "EstensioneDiGaranzia": {
                        "value": objForm.estensioneAssistenza
                    },
                    "Indirizzo": {
                        "value": objForm.indirizzo
                    },
                    "Matricola": {
                        "value": objForm.matricola
                    },
                    "Modello": {
                        "value": objForm.modello
                    },
                    "Nome": {
                        "value": objForm.nome
                    },
                    "Provincia": {
                        "value": objForm.provincia
                    },
                    "PuntoVendita": {
                        "value": objForm.PuntoVendita
                    },
                    "Reason": {
                        "value": objForm.TipoAssistenza
                    },
                    "Segnalazione": {
                        "value": objForm.testoSegnalazione
                    },
                    "Telefono": {
                        "value": objForm.numeroDiTelefono
                    },
                    "supportEmail": {
                        "value": contactSupport
                    }

                })
            })
            .then( (res) => {
                if(res.status===200 || res.status===201){
                    setIsSent(true)
                    analyticsCallback()

                    //GA4FUNREQ61
                    if (isAcceptedPrivacy) {
                    push({
                        event: "ga4-optin",
                    });
                    }
                }
            });
        } 
    }


    const handleSubmitGDPR =()=>{
        setIsValidating(true);
        if
        (
            // isAcceptedNewsLetter
            // && isAcceptedNewsLetter
            objForm.TipoAssistenza===`Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account`
            && errorMessages.nome===undefined
            && errorMessages.cognome===undefined
            && errorMessages.indirizzo===undefined
            && errorMessages.cap===undefined
            && errorMessages.città===undefined
            && errorMessages.email===undefined
            && errorMessages.testoSegnalazione===undefined
            && errorMessages.numeroDiTelefono === undefined
        )
        {
            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    "firstName": objForm.nome,

                    "lastName": objForm.cognome,

                    "address": objForm.indirizzo,

                    "postalCode": objForm.cap,

                    "city": objForm.città,

                    "email": objForm.email,

                    "message": objForm.testoSegnalazione

                })
            })
            .then( (res) => {
                setIsSent(true)
                let errorPromise = res.text()
                errorPromise.then((value)=>{
                    setGDPRTXT(value)
                })
                if(res.status===200){
                  analyticsCallback()
                  setIsSarSent(true)
                }
                if(res.status===400){
                    setIsSarSent(false)
                  }
            });
        }
    }


    return (
        <>
            <div className={handles.FormServiceCare_Container_Header}>

                <div classname={handles.FormServiceCare_SingleRow}>
                    <div className={handles.FormServiceCare_Col}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/></svg>
                    </div>
                    <div className={handles.FormServiceCare_Col} id="Assistenza_on_line">
                        <h1 className={handles.FormServiceCare_Container_Header_Title}>Assistenza on line</h1>
                    </div>
                    <div className={handles.FormServiceCare_Col}>
                        <p className={handles.FormServiceCare_Paragraph}>
                            Invia il form qui di seguito completo dei tuoi dati e delle richieste specifiche. Il nostro servizio clienti ti ricontatterà entro 24 ore dalla tua segnalazione il primo giorno lavorativo utile (dal lunedì al venerdì). Nei weekend il servizio clienti è attivo solo per le richieste in entrata.
                        </p>
                    </div>
                </div>
            </div>

            {!isSent ?
                <form className={handles.FormServiceCare_Wrapper_Container}
                    name="contact_form"
                >

                    <div className={handles.FormServiceCare__MainContainer}>

                        <div className={handles.FormServiceCare_SecondContainer}>

                            <h2 className={handles.FormServiceCare_MainTitle}>
                            Seleziona il motivo del contatto con il nostro servizio clienti
                            </h2>

                            <div  className={handles.FormServiceCare_SingleRow}>
                                <div  className={handles.FormServiceCare_Col}>

                                    <select className={handles.FormServiceCare_SelectPickerInput}
                                        required
                                        name="contact_form[contactReason]"
                                        id="contact_form_contactReason"

                                        onChange={(e)=>{
                                            if(e.target.value === "Richiesta assistenza tecnica su prodotto coperto da estensione di assistenza") {
                                                window.location.replace("https://www.indesit.it/assistenza/richiedi-un-intervento#prenota-intervento")
                                            }
                                            else if(e.target.value === "Spostare, modificare o cancellare un appuntamento") {
                                                window.location.replace("https://www.indesit.it/assistenza/easy-service?soid=#/")
                                            }
                                            else {
                                                setObjForm({ ...objForm, TipoAssistenza: e.target.value })
                                            }
                                        }}
                                    >
                                        {services.map(s=>
                                            <option
                                                key={s.id}>
                                                {s.name}
                                            </option>)
                                        }

                                    </select>
                                </div>
                            </div>

                            <h2 className={handles.FormServiceCare_MainTitle}>
                                Dati anagrafici
                            </h2>

                            {/* Form Richiesta informazioni prodotto */}
                            { objForm.TipoAssistenza!==`Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account` &&

                                <div className={handles.FormServiceCare_InputsContainer}>

                                    <div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col5}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_firstName"
                                            >

                                                <input
                                                    type="text"
                                                    name="contact_form[firstName]"
                                                    id="contact_form_firstName"
                                                    required
                                                    className={isValidating && errorMessages.nome ?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, nome: e.target.value })}}
                                                />

                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Nome* </span>
                                            {(isValidating && errorMessages || errorMessages && errorMessages.nome!=="Campo obbligatorio" ) &&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.nome}</span>
                                            }

                                        </div>

                                        <div className={handles.FormServiceCare_Col5}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_lastName"

                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[lastName]"
                                                    id="contact_form_lastName"
                                                    required
                                                    className={isValidating && errorMessages.cognome?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, cognome: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Cognome* </span>
                                            {(errorMessages && isValidating || errorMessages && errorMessages.cognome!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.cognome}</span>
                                            }
                                        </div>
                                    </div>

                                    {/*<div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_address"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[address]"
                                                    id="contact_form_address"
                                                    required
                                                    className={isValidating && errorMessages.indirizzo?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, indirizzo: e.target.value })}}
                                                />
                                            <span  className={handles.FormServiceCare_Lable_Span}> Indirizzo* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.indirizzo!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.indirizzo}</span>
                                            }
                                            </label>

                                        </div>
                                    </div>




                                    <div className={handles.FormServiceCare_SingleRow}>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_postalCode"

                                            >
                                                <input
                                                    className={isValidating && errorMessages.cap?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    type="text"
                                                    name="contact_form[postalCode]"
                                                    id="contact_form_postalCode"
                                                    required
                                                    onChange={(e)=>{setObjForm({ ...objForm, cap: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Cap* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.cap!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.cap}</span>
                                            }
                                        </div>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_city"

                                            >
                                                <input
                                                    className={isValidating && errorMessages.città?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    type="text"
                                                    name="contact_form[city]"
                                                    id="contact_form_city"
                                                    required
                                                    onChange={(e)=>{setObjForm({ ...objForm, città: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Città* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.città!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.città}</span>
                                            }
                                        </div>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_provinces"
                                            >
                                                <select
                                                    className={isValidating && errorMessages.provincia?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    type="select"
                                                    name="contact_form[provinces]"
                                                    id="contact_form_provinces"
                                                    onChange={(e)=>{setObjForm({ ...objForm, provincia: e.target.value })}}

                                                >
                                                    {cities.map(({name},i)=>{
                                                        return(
                                                            <option key={i} >
                                                                {name}
                                                            </option>
                                                        )}
                                                    )}
                                                </select>
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Provincia* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.provincia!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.provincia}</span>
                                            }
                                        </div>
                                    </div>*/}

                                    <div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col5}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_phone"
                                            >
                                                <input
                                                    className={isValidating && errorMessages.numeroDiTelefono ?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    type="text"
                                                    required
                                                    name="contact_form[phone]"
                                                    id="contact_form_phone"
                                                    onChange={(e)=>{setObjForm({ ...objForm, numeroDiTelefono: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Numero di telefono* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.numeroDiTelefono!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.numeroDiTelefono}</span>
                                            }

                                        </div>

                                        <div className={handles.FormServiceCare_Col5}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_email"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[email]"
                                                    id="contact_form_email"
                                                    required
                                                    className={isValidating && errorMessages.email?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, email: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Email* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.email!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.email}</span>
                                            }

                                        </div>
                                    </div>

                                    <div className={handles.FormServiceCare_SingleRow_TextArea}>
                                        <label className={handles.FormServiceCare_Col}
                                            for="contact_form_notes"
                                        >
                                            <span  className={handles.FormServiceCare_Lable_Span}> INSERISCI QUI IL TUO INDIRIZZO DI CASA COMPLETO E IL TESTO DELLA TUA SEGNALAZIONE* </span>
                                        </label>
                                    </div>
                                    {(errorMessages && isValidating  || errorMessages && errorMessages.testoSegnalazione!=="Campo obbligatorio")&&
                                        <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.testoSegnalazione}</span>
                                    }

                                    <div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col}>
                                            <textarea className={handles.FormServiceCare_Textarea} cols="55" rows="3"
                                                name="contact_form[notes]"
                                                id="contact_form_notes"
                                                onChange={(e)=>{setObjForm({ ...objForm, testoSegnalazione: e.target.value })}}
                                            >

                                            </textarea>
                                        </div>
                                    </div>

                                    {/*<h2 className={handles.FormServiceCare_MainTitle}>
                                        Dati prodotto
                                        <span className={handles.FormServiceCare_span} >Le informazioni sul prodotto aiutano a rendere il servizio assistenza più rapido ed efficiente.</span>
                                    </h2>

                                    <div className={handles.FormServiceCare_SingleRow}>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_productData_productCode"
                                            >
                                                <input
                                                    className={handles.FormServiceCare_Input_Text}
                                                    type="text"
                                                    name="contact_form[productData][productCode]"
                                                    id="contact_form_productData_productCode"
                                                    onChange={(e)=>{setObjForm({ ...objForm, matricola: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Matricola </span>

                                        </div>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_productData_commercialCode"
                                            >
                                                <input
                                                    className={isValidating && errorMessages.modello?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    type="text"
                                                    name="contact_form[productData][commercialCode]"
                                                    id="contact_form_productData_commercialCode"
                                                    required
                                                    onChange={(e)=>{setObjForm({ ...objForm, modello: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Modello* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.modello!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.modello}</span>
                                            }
                                        </div>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_productData_purchaseDate"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[productData][purchaseDate]"
                                                    id="contact_form_productData_purchaseDate"
                                                    required
                                                    placeholder="DD-MM-YYYY"
                                                    className={isValidating && errorMessages.dataDacquisto?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, dataDacquisto: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Data d'acquisto* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.dataDacquisto!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.dataDacquisto}</span>
                                            }
                                        </div>

                                    </div>*/}

                                    {/*<div className={handles.FormServiceCare_SingleRow}>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label  className={handles.FormServiceCare_Lable}
                                                for="contact_form_productData_store"
                                            >
                                                <input
                                                type="text"
                                                name="contact_form[productData][store]"
                                                id="contact_form_productData_store"
                                                className={handles.FormServiceCare_Input_Text}
                                                onChange={(e)=>{setObjForm({ ...objForm, PuntoVendita: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Punto Vendita </span>

                                        </div>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label htmlFor="warrantyExtension" className={handles.FormServiceCare_Lable}>
                                                <select
                                                    className={handles.FormServiceCare_Input_Text}
                                                    type="select"
                                                    name="contact_form[productData][extendedWarranty]"
                                                    id="contact_form_productData_extendedWarranty"
                                                    onChange={(e)=>{setObjForm({ ...objForm, estensioneAssistenza: e.target.value })}}
                                                >
                                                    <option></option>
                                                    <option>Si</option>
                                                    <option>No</option>

                                                </select>
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Estensione di assistenza </span>
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
                                                    onChange={(e)=>{setObjForm({ ...objForm, dataFineGaranzia: e.target.value })}}
                                                />
                                            </label>
                                            <span  className={handles.FormServiceCare_Lable_Span}> Data fine garanzia/estensione* </span>
                                            {errorMessages &&
                                                <span  className={handles.FormServiceCare_Lable_Span_Error}> {errorMessages.dataFineGaranzia} </span>
                                            }


                                        </div>

                                    </div>
                                    <div className={handles.FormServiceCare_Bottom_Container}>

                                        <h2 className={handles.FormServiceCare_MainTitle}>
                                            Dove trovi matricola e modello del tuo elettrodomestico?
                                        </h2>

                                        <div className={handles.FormServiceCare_SingleRow}>
                                            <div className={handles.FormServiceCare_Col7}>
                                                <p  className={handles.FormServiceCare_Paragraph}>
                                                    La matricola è indicata sul certificato di garanzia che trovi nella documentazione dell'elettrodomestico, il modello del prodotto si trova nella prima pagina del libretto di istruzioni oppure puoi trovare matricola e modello sull'etichetta apposita situata sul tuo elettrodomestico.
                                                </p>

                                                <br />

                                                <p className={handles.FormServiceCare_Paragraph}>
                                                    Per visualizzare dove trovarla seleziona la linea prodotto:
                                                </p>

                                            </div>
                                            <div className={handles.FormServiceCare_Col3}>
                                                <div className={handles.FormServiceCare_Img_Fluid}>
                                                    <img className={handles.FormServiceCare_Img_Example} />
                                                </div>
                                            </div>

                                        </div>

                                        <div  className={handles.FormServiceCare_SingleRow}>
                                            <div  className={handles.FormServiceCare_Col}>
                                                <div className={handles.FormServiceCare_Instructions}
                                                    onClick={()=>setIsProductsListShow(!isProductsListShow)}
                                                    >
                                                    {currentProductValue&&
                                                    <strong className={handles.FormServiceCare_ProductName}> {currentProductValue} </strong>
                                                    }
                                                    {isProductsListShow &&
                                                        <ul className={handles.FormServiceCare_Products_List}>
                                                            {products.filter(p=>p.name!==currentProductValue).map((p)=>{
                                                                return(
                                                                    <li onClick={()=>setCurrentProductValue(p.name)} key={p.id}>
                                                                        <strong className={handles.FormServiceCare_ProductName}> {p.name} </strong>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>

                                                    }
                                                    <svg width="10" height="6" viewBox="-2.5 -5 75 60" preserveAspectRatio="none"
                                                        className={!isProductsListShow?handles.FormServiceCare_ArrowDown:handles.FormServiceCare_ArrowDown_Reverse}
                                                    >
                                                    <path d="M0,0 l35,50 l35,-50" fill="none" stroke="black" stroke-linecap="round" stroke-width="5" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div  className={handles.FormServiceCare_SingleRow}>
                                            {currentProductValue==="Lavatrici"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Washer}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Asciugatrici"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Dryer}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Lavastoviglie"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Dishwasing}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Piani cottura"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Example}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Forni"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Oven}
                                                        />
                                                    </div>

                                                </div>
                                                :
                                                currentProductValue==="Frigoriferi"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Cooling}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Lavasciuga"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Dryer}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Congelatori"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Freezer}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                currentProductValue==="Cucine"?
                                                <div  className={handles.FormServiceCare_Col}>
                                                    <div  className={handles.FormServiceCare_Img_Fluid} >
                                                        <img
                                                            className={handles.FormServiceCare_Img_Cookers}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                ""
                                            }
                                        </div>

                                    </div>*/}

                                </div>
                            }


                            {/* Form Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account */}
                            {objForm.TipoAssistenza===`Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account` &&

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
                                                    className={isValidating && errorMessages.nome ?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, nome: e.target.value })}}
                                                />

                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Nome* </span>
                                            {(isValidating && errorMessages || errorMessages && errorMessages.nome!=="Campo obbligatorio" ) &&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.nome}</span>
                                            }

                                        </div>

                                        <div className={handles.FormServiceCare_Col5}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_lastName"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[lastName]"
                                                    id="contact_form_lastName"
                                                    required
                                                    className={isValidating && errorMessages.cognome?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, cognome: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Cognome* </span>
                                            {(errorMessages && isValidating || errorMessages && errorMessages.cognome!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.cognome}</span>
                                            }
                                        </div>
                                    </div>

                                    {/*<div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col}>
                                            <label  className={handles.FormServiceCare_Lable}
                                                for="contact_form_address"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[address]"
                                                    id="contact_form_address"
                                                    required
                                                    className={isValidating && errorMessages.indirizzo?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, indirizzo: e.target.value })}}
                                                />
                                            <span  className={handles.FormServiceCare_Lable_Span}> Indirizzo* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.indirizzo!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.indirizzo}</span>
                                            }
                                            </label>

                                        </div>
                                    </div>



                                    <div className={handles.FormServiceCare_SingleRow}>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label  className={handles.FormServiceCare_Lable}
                                                for="contact_form_postalCode"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[postalCode]"
                                                    id="contact_form_postalCode"
                                                    required
                                                    className={isValidating && errorMessages.cap?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, cap: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Cap* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.cap!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.cap}</span>
                                            }
                                        </div>

                                        <div className={handles.FormServiceCare_Col3}>

                                            <label className={handles.FormServiceCare_Lable}
                                                htmlFor="contact_form_city"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[city]"
                                                    id="contact_form_city"
                                                    required
                                                    className={isValidating && errorMessages.città?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, città: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Città* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.città!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.città}</span>
                                            }
                                        </div>

                                    </div>*/}

                                    <div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col5}>

                                            <label  className={handles.FormServiceCare_Lable}
                                                for="contact_form_phone"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[phone]"
                                                    id="contact_form_phone"
                                                    required
                                                    className={isValidating && errorMessages.numeroDiTelefono ?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, numeroDiTelefono: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Numero di telefono* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.numeroDiTelefono!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.numeroDiTelefono}</span>
                                            }

                                        </div>

                                        <div className={handles.FormServiceCare_Col5}>
                                            <label className={handles.FormServiceCare_Lable}
                                                for="contact_form_email"
                                            >
                                                <input
                                                    type="text"
                                                    name="contact_form[email]"
                                                    id="contact_form_email"
                                                    className={isValidating && errorMessages.email?handles.FormServiceCare_Input_Text_Error:handles.FormServiceCare_Input_Text}
                                                    onChange={(e)=>{setObjForm({ ...objForm, email: e.target.value })}}
                                                />
                                            </label>

                                            <span  className={handles.FormServiceCare_Lable_Span}> Email* </span>
                                            {(errorMessages && isValidating  || errorMessages && errorMessages.email!=="Campo obbligatorio")&&
                                                <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.email}</span>
                                            }

                                        </div>
                                    </div>

                                    <div className={handles.FormServiceCare_SingleRow_TextArea}>
                                        <div className={handles.FormServiceCare_Col}>
                                            <span  className={handles.FormServiceCare_Lable_Span}> INSERISCI QUI IL TUO INDIRIZZO DI CASA COMPLETO E IL TESTO DELLA TUA SEGNALAZIONE* </span>
                                        </div>
                                    </div>
                                    {(errorMessages && isValidating  || errorMessages && errorMessages.testoSegnalazione!=="Campo obbligatorio")&&
                                        <span className={handles.FormServiceCare_Lable_Span_Error} >{errorMessages.testoSegnalazione}</span>
                                    }

                                    <div className={handles.FormServiceCare_SingleRow}>
                                        <div className={handles.FormServiceCare_Col}>
                                            <textarea className={handles.FormServiceCare_Textarea}
                                                name="contact_form[notes]"
                                                id="contact_form_notes"
                                                cols="55"
                                                rows="3"
                                                required
                                                onChange={(e)=>{setObjForm({ ...objForm, testoSegnalazione: e.target.value })}}
                                            >

                                            </textarea>
                                        </div>
                                    </div>

                                </div>

                            }

                            <div className={handles.FormServiceCare_Privacy_Container}>
                                {/* <div className={handles.FormServiceCare_SingleRow}>
                  <span
                    className={handles.FormServiceCare_Privacy_Subtitle_Privacy}
                  >
                    Consenso al trattamento dei dati personali
                  </span>
                </div> */}

                <div className={handles.FormServiceCare_SingleRow}>
                  <span>
                    Ho letto e compreso il contenuto dell'
                    <a
                      href="/Informativa-sulla-Privacy"
                      style={{ color: "#0090d0" }}
                    >
                      informativa sulla privacy
                    </a>{" "}
                    e:
                  </span>
                </div>

                <div className={handles.FormServiceCare_SingleRow}>
                  <span>
                    Acconsento al trattamento dei miei dati personali per
                    permettere a Whirlpool Italia Srl di inviarmi
                    newsletter/comunicazioni di marketing (in forma elettronica
                    e non, anche tramite telefono, posta tradizionale, e-mail,
                    SMS, MMS, notifiche push su siti di terze parti tra cui
                    sulle piattaforme Facebook e Google) riguardanti prodotti e
                    servizi di Whirlpool Italia Srl, anche da me acquistati o
                    registrati, nonché di svolgere ricerche di mercato.
                  </span>
                </div>


                                <div  className={handles.FormServiceCare_SingleRow}>
                                    <div className={handles.FormServiceCare_Col}>
                                        <input
                                            className={handles.FormServiceCare_Privacy_Checkbox}
                                            type="checkbox"
                                            name="contact_form[privacy1]"
                                            onClick={()=>setIsAcceptedPrivacy(!isAcceptedPrivacy)}
                                        />

                                        <span className={handles.FormServiceCare_Privacy_Checkbox_Text}>Accetto</span>
                                    </div>
                                </div>
                            </div>

                            <div className={handles.FormServiceCare_SingleRow}>
                                <div className={handles.FormServiceCare_Col}>

                                    <button className={handles.FormServiceCare_Submit_Button} type="submit"
                                        name="contact_form[save]"
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            if(objForm.TipoAssistenza!==`Aggiornare/cancellare dati personali (privacy) / GDPR cancellazione account`){
                                                handleSubmit();
                                            }else{
                                                handleSubmitGDPR();
                                            }
                                        }}
                                    >
                                        INVIA LA RICHIESTA
                                    </button>

                                </div>

                            </div>

                            <div className={handles.FormServiceCare_SingleRow}>
                                <div className={handles.FormServiceCare_Col}>
                                    <span  className={handles.FormServiceCare_SpanPrivacy} >
                                        I campi con asterisco (*) sono obbligatori
                                    </span>
                                </div>
                            </div>


                        </div>

                    </div>

                </form>
                :

                <div classname={handles.FormServiceCare_SingleRow}
                style={{margin: "5rem 2rem 5rem"}}
                >
                    {!GDPRTXT?
                        <>
                            <div className={handles.FormServiceCare_Col}>
                                <h1 className={handles.FormServiceCare_Container_Header_Title}>Grazie per averci contatto!</h1>
                            </div>
                            <div className={handles.FormServiceCare_Col}>
                                <p
                                className={handles.FormServiceCare_Paragraph}
                                style={{
                                    fontFamily: "Roboto-Light, sans-serif",
                                    fontSize: "1.2rem",
                                }}
                                >
                               La tua richiesta è stata registrata con successo. Riceverai una mail di riepilogo dei dati inseriti.
                                </p>
                            </div>

                        </>
                        :
                        <>
                            <div className={handles.FormServiceCare_Col}>
                                <h1 className={handles.FormServiceCare_Container_Header_Title}>{isSarSent?"Grazie per averci contatto!":"Spiacenti."}</h1>
                            </div>

                            <div className={handles.FormServiceCare_Col} >
                                <p className={handles.FormServiceCare_Paragraph}
                                style={{fontFamily: "Roboto-Light, sans-serif",
                                fontSize:"1.2rem"}}>

                                    {isSarSent?"La tua richiesta è stata registrata con successo. Riceverai una mail di riepilogo dei dati inseriti.":GDPRTXT}
                                </p>
                            </div>
                        </>
                    }


                </div>
            }
        </>
    )
}

export default FormServiceCare
