export default function validate(values) {

    let errors = {}

    let validRegexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //let validRegexDate= /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$/;

    if (!values.nome) {
        errors.nome = "Campo obbligatorio"
    } else if (!isNaN(values?.nome)) {
        errors.nome = "Non sono ammessi numeri"
    }

    if (!values.cognome) {
        errors.cognome = "Campo obbligatorio"
    } else if (!isNaN(values?.cognome)) {
        errors.cognome = "Non sono ammessi numeri"
    }
    /*
        if(!values.indirizzo){
            errors.indirizzo="Campo obbligatorio"
        }
    
        if(!values.cap){
            errors.cap="Campo obbligatorio"
        }else if(isNaN(values?.cap)){
            errors.cap="Non sono ammesse lettere"
        }
    */
    if (!values.numeroDiTelefono) {
        errors.numeroDiTelefono = "Campo obbligatorio"
    } else if (isNaN(values?.numeroDiTelefono)) {
        errors.numeroDiTelefono = "Non sono ammesse lettere"
    }
    /*
        if(!values.città){
            errors.città="Campo obbligatorio"
        }else if(!isNaN(values?.città)){
            errors.città="Non sono ammessi numeri"
        }
    
    
        if(!values.provincia){
            errors.provincia="Campo obbligatorio"
        }
    */
    if (!values?.email) {
        errors.email = "Campo obbligatorio"
    } else if (!values?.email.match(validRegexEmail)) {
        errors.email = `Formato email non valido`
    }
    /*
        if(!values.modello){
            errors.modello="Campo obbligatorio"
        }
    
        if(!values.dataDacquisto){
            errors.dataDacquisto="Campo obbligatorio"
        }else if(!values.dataDacquisto.match(validRegexDate)){
            errors.dataDacquisto="Formato data errato"
        }
    
        if(!values.testoSegnalazione){
            errors.testoSegnalazione="Campo obbligatorio"
        }
    
        
        if(values.dataFineGaranzia && !values.dataFineGaranzia.match(validRegexDate)){
           errors.dataFineGaranzia="Formato data errato"
        }
    */
    return errors

}