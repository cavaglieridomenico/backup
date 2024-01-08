import React, { useState } from 'react'
import style from './styles.css'
import UserForm from './components/UserForm'
import DatasForFetch from './datasForFetch'
import FormSuccess from './components/FormSuccess'

interface FreeCheckupFormProps {
  //Form labels
  titoloLabel: string
  nameLabel: string
  surnameLabel: string
  addressLabel: string
  internoLabel: string
  capLabel: string
  cityLabel: string
  provinceLabel: string
  emailLabel: string
  confirmEmailLabel: string
  phoneLabel: string
  jobLabel: string
  ageLabel: string
  sendLabel: string
  formErrorLabel: string
  //Privacy section labels
  privacyTitleLabel: string
  privacySubTitleLabel: string
  privacySubTitleLinkLabel: string
  privacySubTitleLabel2: string
  privacyFirstPointLabel: string
  privacySecondPointLabel: string
  privacyCheckboxLabel: string
  //Product Info labels
  categoryLabel: string
  matricolaLabel: string
  modelLabel: string
  dateLabel: string
  productInfoTitleLabel: string
  productInfoTitle2Label: string
  productInfoSubTitleLabel: string
  addProductsLabel: string
  //Form Success labels
  titleSuccessFormLabel:string
  subtitleSuccessFormLabel:string
}

const FreeCheckupForm: StorefrontFunctionComponent<FreeCheckupFormProps> = ({
  titoloLabel,
  nameLabel,
  surnameLabel,
  addressLabel,
  internoLabel,
  capLabel,
  cityLabel,
  provinceLabel,
  emailLabel,
  confirmEmailLabel,
  phoneLabel,
  jobLabel,
  ageLabel,
  sendLabel,
  formErrorLabel,
  //Privacy section labels
  privacyTitleLabel,
  privacySubTitleLabel,
  privacySubTitleLinkLabel,
  privacySubTitleLabel2,
  privacyFirstPointLabel,
  privacySecondPointLabel,
  privacyCheckboxLabel,
  //Product Info labels
  categoryLabel,
  matricolaLabel,
  modelLabel,
  dateLabel,
  productInfoTitleLabel,
  productInfoTitle2Label,
  productInfoSubTitleLabel, 
  addProductsLabel,
  //Form Success labels
  titleSuccessFormLabel,
  subtitleSuccessFormLabel
}) => {
  const [isSubmitted, setIsSubmitted]: any = useState(false)
  const [error, setError]: any = useState(false)

  function submitForm(values: any, applianceDatas: any) {
    fetch('/app/crm-async-integration/vtex/3ycheckup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(DatasForFetch(values, applianceDatas)),
    })
      .then(response => {
        setIsSubmitted(response.ok)
        setError(!response.ok)
      })
      .catch(() => {
        setError(true)
      })
  }

  return (
    <>
      {!isSubmitted ? (
        <div className={style.formContainer}>
          <UserForm 
            submitForm={submitForm} 
            error={error} 
            //Labels Props
            titoloLabel={titoloLabel} 
            nameLabel={nameLabel} 
            surnameLabel={surnameLabel} 
            addressLabel={addressLabel} 
            internoLabel={internoLabel} 
            capLabel={capLabel} 
            cityLabel={cityLabel} 
            provinceLabel={provinceLabel}
            emailLabel={emailLabel}
            confirmEmailLabel={confirmEmailLabel}
            phoneLabel={phoneLabel}
            jobLabel={jobLabel}
            ageLabel={ageLabel}
            sendLabel={sendLabel}
            formErrorLabel={formErrorLabel}
            //Privacy section labels
            privacyTitleLabel={privacyTitleLabel}
            privacySubTitleLabel={privacySubTitleLabel}
            privacySubTitleLinkLabel={privacySubTitleLinkLabel}
            privacySubTitleLabel2={privacySubTitleLabel2}
            privacyFirstPointLabel={privacyFirstPointLabel}
            privacySecondPointLabel={privacySecondPointLabel}
            privacyCheckboxLabel={privacyCheckboxLabel}
            //Product Info labels
            categoryLabel={categoryLabel}
            matricolaLabel={matricolaLabel}
            modelLabel={modelLabel}
            dateLabel={dateLabel}
            productInfoTitleLabel={productInfoTitleLabel}
            productInfoTitle2Label={productInfoTitle2Label}
            productInfoSubTitleLabel={productInfoSubTitleLabel}
            addProductsLabel={addProductsLabel}
            />
        </div>
      ) : (
        <FormSuccess 
        //Labels
        titleSuccessFormLabel={titleSuccessFormLabel}
        subtitleSuccessFormLabel={subtitleSuccessFormLabel}
        />
      )}
    </>
  )
}


FreeCheckupForm.schema = {
  title: 'Free Checkup Form Labels',
  description: 'Theese are the checkup form labels',
  type: 'object',
  properties: {
    //Form labels
    titoloLabel: {
      title: 'Title label',
      description: 'Label of title section',
      default: 'Titolo*',
      type: 'string',
    },
    nameLabel: {
      title: 'nameLabel',
      description: 'nameLabel section',
      default: 'Nome*',
      type: 'string',
    },
    surnameLabel: {
      title: 'surnameLabel',
      description: 'surnameLabel title section',
      default: 'Cognome*',
      type: 'string',
    },
    addressLabel: {
      title: 'addressLabel',
      description: 'addressLabel title section',
      default: 'Indirizzo*',
      type: 'string',
    },
    internoLabel: {
      title: 'internoLabel',
      description: 'internoLabel title section',
      default: 'Interno',
      type: 'string',
    },
    capLabel: {
      title: 'capLabel',
      description: 'capLabel of title section',
      default: 'Cap*',
      type: 'string',
    },
    cityLabel: {
      title: 'cityLabel',
      description: 'cityLabel title section',
      default: 'Città*',
      type: 'string',
    },
    provinceLabel: {
      title: 'provinceLabel',
      description: 'provinceLabel title section',
      default: 'Provincia*',
      type: 'string',
    },
    emailLabel: {
      title: 'emailLabel',
      description: 'emailLabel title section',
      default: 'Email*',
      type: 'string',
    },
    confirmEmailLabel: {
      title: 'confirmEmailLabel',
      description: 'confirmEmailLabel title section',
      default: 'Conferma Email*',
      type: 'string',
    },
    phoneLabel: {
      title: 'phoneLabel',
      description: 'phoneLabel title section',
      default: 'Numero di telefono*',
      type: 'string',
    },
    jobLabel: {
      title: 'jobLabel',
      description: 'jobLabel title section',
      default: 'Professione',
      type: 'string',
    },
    ageLabel: {
      title: 'ageLabel',
      description: 'ageLabel title section',
      default: 'Età',
      type: 'string',
    },
    sendLabel: {
      title: 'sendLabel',
      description: 'sendLabel title section',
      default: 'Invia il modulo >',
      type: 'string',
    },
    formErrorLabel: {
      title: 'formErrorLabel',
      description: 'formErrorLabel title section',
      default: 'Si è verificato un errore, per favore riprova.',
      type: 'string',
    },
    //Privacy section labels
    privacyTitleLabel: {
      title: 'privacyTitleLabel',
      description: 'privacyTitleLabel title section',
      default: 'Consenso al trattamento dei dati personali',
      type: 'string',
    },
    privacySubTitleLabel: {
      title: 'privacySubTitleLabel',
      description: 'privacySubTitleLabel title section',
      default: "Ho compreso e prendo atto del contenuto dell'",
      type: 'string',
    },
    privacySubTitleLinkLabel: {
      title: 'privacySubTitleLinkLabel',
      description: 'privacySubTitleLinkLabel title section',
      default: 'informativa sulla privacy',
      type: 'string',
    },
    privacySubTitleLabel2: {
      title: 'privacySubTitleLabel2',
      description: 'privacySubTitleLabel2 title section',
      default: 'e:',
      type: 'string',
    },
    privacyFirstPointLabel: {
      title: 'privacyFirstPointLabel',
      description: 'privacyFirstPointLabel title section',
      default: 'a) Accetto di ricevere comunicazioni di marketing personalizzate relative a Hotpoint e altri marchi di Whirlpool Corporation.',
      type: 'string',
    },
    privacySecondPointLabel: {
      title: 'privacySecondPointLabel',
      description: 'privacySecondPointLabel title section',
      default: 'b) Desidero essere contattato da Servizi Domestic & General Italia S.r.l. in relazione ai servizi di garanzia.',
      type: 'string',
    },
    privacyCheckboxLabel: {
      title: 'privacyCheckboxLabel',
      description: 'privacyCheckboxLabel title section',
      default: 'ACCETTO',
      type: 'string',
    },
    //Product Info labels
    categoryLabel: {
      title: 'categoryLabel',
      description: 'categoryLabel title section',
      default: 'Categoria prodotto*',
      type: 'string',
    },
    matricolaLabel: {
      title: 'matricolaLabel',
      description: 'matricolaLabel title section',
      default: 'Matricola*',
      type: 'string',
    },
    modelLabel: {
      title: 'modelLabel',
      description: 'modelLabel title section',
      default: 'Modello*',
      type: 'string',
    },
    dateLabel: {
      title: 'dateLabel',
      description: 'dateLabel title section',
      default: "Data d'acquisto*",
      type: 'string',
    },
    productInfoTitleLabel: {
      title: 'productInfoTitleLabel',
      description: 'productInfoTitleLabel title section',
      default: 'Per visualizzare dove si trova la matricola seleziona la linea prodotto',
      type: 'string',
    },
    productInfoTitle2Label: {
      title: 'productInfoTitle2Label',
      description: 'productInfoTitle2Label title section',
      default: 'Per visualizzare dove si trova la matricola seleziona la linea prodotto',
      type: 'string',
    },
    productInfoSubTitleLabel: {
      title: 'productInfoSubTitleLabel',
      description: 'productInfoSubTitleLabel title section',
      default: "La matricola è indicata sul certificato di garanzia che trovi nella documentazione dell'elettrodomestico, il modello del prodotto si trova nella prima pagina del libretto di istruzioni oppure puoi trovare matricola e modello sull'etichetta apposita situata sul tuo elettrodomestico.",
      type: 'string',
    },
    addProductsLabel: {
      title: 'addProductsLabel',
      description: 'addProductsLabel title section',
      default: 'Aggiungi un prodotto',
      type: 'string',
    },
    //Form Success labels
    titleSuccessFormLabel: {
      title: 'titleSuccessFormLabel',
      description: 'titleSuccessFormLabel title section',
      default: 'Grazie',
      type: 'string',
    },
    subtitleSuccessFormLabel: {
      title: 'subtitleSuccessFormLabel',
      description: 'subtitleSuccessFormLabel title section',
      default: 'La tua richiesta è stata correttamente inviata.',
      type: 'string',
    },
  },
}

export default FreeCheckupForm
