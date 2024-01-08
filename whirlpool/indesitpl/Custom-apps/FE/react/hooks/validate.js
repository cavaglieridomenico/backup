export default function validate(values) {

    let errors={}

    let validRegexEmail= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let validRegexDate= /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/;

  
    if(!values.nome){
        errors.nome="To pole nie może być puste."
    }else if(!isNaN(values?.nome)){
        errors.nome="Liczby nie są dozwolone"
    }

    if(!values.cognome){
        errors.cognome="To pole nie może być puste."
    }else if(!isNaN(values?.cognome)){
        errors.cognome="Liczby nie są dozwolone"
    }

    if(!values.indirizzo){
        errors.indirizzo="To pole nie może być puste."
    }

    if(!values.cap){
        errors.cap="To pole nie może być puste."
    }else if(isNaN(values?.cap)){
        errors.cap="litery nie są dozwolone"
    }

    if(values.numeroDiTelefono && isNaN(values.numeroDiTelefono)){
        errors.numeroDiTelefono="litery nie są dozwolone"
    }

    if(!values.città){
        errors.città="To pole nie może być puste."
    }else if(!isNaN(values?.città)){
        errors.città="Liczby nie są dozwolone"
    }


    if(!values?.email){
        errors.email="To pole nie może być puste."
    }else if(!values?.email.match(validRegexEmail)){
        errors.email=`Niewłaściwy format wiadomości email`
    }

    if(!values.modello){
        errors.modello="To pole nie może być puste."
    }

    if(!values.dataDacquisto){
        errors.dataDacquisto="To pole nie może być puste."
    }else if(!values.dataDacquisto.match(validRegexDate)){
        errors.dataDacquisto="Zły format daty"
    }

    if(!values.testoSegnalazione){
        errors.testoSegnalazione="To pole nie może być puste."
    }

    
    if(values.dataFineGaranzia && !values.dataFineGaranzia.match(validRegexDate)){
       errors.dataFineGaranzia="Zły format daty"
    }
    
    return errors
    
}