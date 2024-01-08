import React from 'react'
import styles from "./styles.css";
import classnames from "classnames";
import { Checkbox } from "vtex.styleguide";

interface PrivacyProps {
  consent: boolean;
  setConsent: (e: React.ChangeEvent) => void;
}

const PrivacyConsent: StorefrontFunctionComponent<PrivacyProps> = (props) => {
  
  const {consent, setConsent} = props;

  return (
    <>
      <div className={classnames(styles.asterisco)}><p>Pola oznaczone (*) są wymagane</p></div>
      <div className={classnames(styles.consenso, styles.consensoMargin)}>
        <p className={classnames(styles.text)}>Przeczytałem i zrozumiałem treść<a className={classnames(styles.formLink)} href="/informacja-o-ochronie-prywatnosci"> informacji</a> dotyczących ochrony danych osobowych oraz<a className={classnames(styles.formLink)} href="/regulamin-sklepu"> Regulamin sklepu</a></p>
        <div className="mb3">
            <Checkbox
                id="consent-check"
                label={"Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.o przesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;"}
                name="default-checkbox-group"
                required={false}
                onChange={(e: any) => {
                  setConsent(e.target.checked);
                }}
                value={consent}
                checked={consent}
            />
        </div>
      </div>
  </>
  )
}

export default PrivacyConsent