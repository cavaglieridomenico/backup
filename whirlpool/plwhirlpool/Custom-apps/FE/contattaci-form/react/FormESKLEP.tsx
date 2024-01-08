import React from "react";
import { Dropdown, Button } from "vtex.styleguide";
import styles from "./styles.css";
import classnames from "classnames";
import PrivacyConsent from "./PrivacyConsent";
import FirstForm from "./forms/FirstForm";
import SecondForm from "./forms/SecondForm";
import ThirdForm from "./forms/ThirdForm";
import FourthForm from "./forms/FourthForm";
import FifthForm from "./forms/FifthForm";
import SixthForm from "./forms/SixthForm";

type ContactReason = {
  value: string;
  label: string;
};

interface FormProps {
  handleSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void;
  contactReason: ContactReason[];
  fields: { [index: string]: any };
  errors: { [index: string]: any };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  isLoading: boolean;
  isResponse: boolean;
  isFormIncomplete: boolean;
  consent: boolean;
  setConsent: (value: any) => void;
}

const reasons = {
  first: "[ESKLEP] Uwagi dotyczące funkcjonowania sklepu whirlpool.pl",
  second: "[ESKLEP] Informacje o złożonym zamówieniu",
  third: "[ESKLEP] Problemy z dokonaną płatnością",
  fourth: "[ESKLEP] Dostawa i instalacja zamówionego produktu",
  fifth: "[ESKLEP] Status zwrotu mojego produktu",
  sixth: "[ESKLEP] Kontakt w sprawie zakupów korporacyjnych",
};

const FormESKLEP: StorefrontFunctionComponent<FormProps> = (props) => {
  const {
    handleSubmitForm,
    contactReason,
    fields,
    errors,
    handleChange,
    isLoading,
    isResponse,
    isFormIncomplete,
    consent,
    setConsent,
  } = props;

  return (
    <div className={classnames(styles.containers)}>
      <form
        name="customForm"
        onSubmit={(e: any) => handleSubmitForm(e)}
        className={classnames(styles.formContainer, "items-center")}
      >
        <div className={classnames(styles.title, styles.title1)}>
          <p> Wybierz rodzaj pomocy, której potrzebujesz </p>
        </div>

        <div>
          <div
            className={classnames(
              styles.singleSelect,
              styles.singleSelectMotivo
            )}
          >
            <Dropdown
              className={classnames(styles.dropdownnnn)}
              options={contactReason}
              onChange={(e: any) => handleChange(e, "Reason")}
              value={fields["Reason"]}
              placeholder="Wybierz rodzaj pomocy"
            />
            {errors.Reason ? (
              <span id="ReasonError" className={classnames(styles.inputError)}>
                {errors.Reason}
              </span>
            ) : null}
          </div>
        </div>

        {fields["Reason"] === reasons.fifth && (
          <div className={classnames(styles.paragraphLabel)}>
            <p>
              Jeśli chcesz zgłosić chęć odstąpienia od umowy, kliknij{" "}
              <a href="/pomoc/zwrot-urzadzen">TUTAJ</a>. Jeśli chcesz zadać
              pytanie związane z Twoim zwrotem w toku, użyj poniższego
              formularza
            </p>
          </div>
        )}

        <div className={classnames(styles.title1, styles.title)}>
          <p> Dane kupującego </p>
        </div>

        <div className={classnames(styles.supportReturn)}>
          {fields["Reason"] === reasons.first && (
            <FirstForm
              fields={fields}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {fields["Reason"] === reasons.second && (
            <SecondForm
              fields={fields}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {fields["Reason"] === reasons.third && (
            <ThirdForm
              fields={fields}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {fields["Reason"] === reasons.fourth && (
            <FourthForm
              fields={fields}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {fields["Reason"] === reasons.fifth && (
            <FifthForm
              fields={fields}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {fields["Reason"] === reasons.sixth && (
            <SixthForm
              fields={fields}
              errors={errors}
              handleChange={handleChange}
            />
          )}

          <PrivacyConsent consent={consent} setConsent={setConsent} />

          <div className={classnames(styles.inviaButton)}>
            {isLoading ? (
              <div className={classnames(styles.loaderFormContainer)}>
                <div className={classnames(styles.loaderForm)}></div>
              </div>
            ) : isResponse ? (
              <div className={classnames(styles.messageText)}>
                <span>Dziękujemy</span>
                <span>
                  Twoje zgłoszenie zostało pomyślnie wysłane. Za chwilę
                  otrzymasz wiadomość e-mail z podsumowaniem. &nbsp;
                </span>
              </div>
            ) : (
              <Button type="submit" id="invia" name="invia" value="Submit">
                WYŚLIJ
              </Button>
            )}
            {isFormIncomplete ? (
              <div className={classnames(styles.inputError)}>
                Niektore wymagane pola są uzupełnione niepoprawnie
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormESKLEP;
