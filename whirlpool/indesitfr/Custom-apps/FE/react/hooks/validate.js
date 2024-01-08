export default function validate(values) {

    let errors={}

    let validRegexEmail= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let validRegexDate= /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/;

    if(!values.nome){
        errors.nome="Champs requis"
    }else if(!isNaN(values?.nome)){
        errors.nome="Les chiffres ne sont pas autorisés"
    }

    if(!values.cognome){
        errors.cognome="Champs requis"
    }else if(!isNaN(values?.cognome)){
        errors.cognome="Les chiffres ne sont pas autorisés"
    }

    if(!values.indirizzo){
        errors.indirizzo="Champs requis"
    }

    if(!values.cap){
        errors.cap="Champs requis"
    }else if(isNaN(values?.cap)){
        errors.cap="Les lettres ne sont pas autorisées"
    }

    if(values.numeroDiTelefono && isNaN(values.numeroDiTelefono)){
        errors.numeroDiTelefono="Les lettres ne sont pas autorisées"
    }

    if(!values.città){
        errors.città="Champs requis"
    }else if(!isNaN(values?.città)){
        errors.città="Les chiffres ne sont pas autorisés"
    }



    if(!values?.email){
        errors.email="Champs requis"
    }else if(!values?.email.match(validRegexEmail)){
        errors.email=`Format d'email invalide`
    }

    if(!values.modello){
        errors.modello="Champs requis"
    }

    if(values.dataDacquisto && !values.dataDacquisto.match(validRegexDate)){
        errors.dataDacquisto="Format de date incorrect"
    }
    if(!values.dataDacquisto){
        errors.dataDacquisto="Champs requis"
    }

    if(!values.testoSegnalazione){
        errors.testoSegnalazione="Champs requis"
    }

    
    if(values.dataFineGaranzia && !values.dataFineGaranzia.match(validRegexDate)){
       errors.dataFineGaranzia="Format de date incorrect"
    }

    return errors
    
}