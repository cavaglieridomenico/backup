// @ts-ignore
import React, { useState, useReducer } from "react";
import { Input, Button, RadioGroup } from "vtex.styleguide";
import styles from "./styles.css";
// @ts-ignore
import classnames from "classnames";

interface CustomFormProps {
  url: string;
  isReturn: boolean;
  isProduct: boolean;
}

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
});

const requiredForm = {
  FirstName: "",
  Surname: "",
  ClientEmail: "",
  PhoneNumber: "",
  City: "",
  Address: "",
  OrderNumber: "",
  ProductCode: "",
  WithdrawType: "",
};
const returnRequiredForm = {
  ...requiredForm,
  PickUpAddress: "",
  DocumentTransportNumber: "",
};
const initialForm = {
  RefundReason: "",
  DamageDescription: "",
  Note: "",
};

const CustomForm: StorefrontFunctionComponent<CustomFormProps> = ({
  url,
  isReturn,
  isProduct,
}: {
  url: string;
  isReturn: boolean;
  isProduct: boolean;
}) => {
  const [form, dispatch] = useReducer(reducer, {
    ...initialForm,
    itemType: isProduct ? "product" : "accessory",
  });
  const [isLoading, setLoading] = useState(false);
  const [isResponse, setResponse] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const errors: { [key: string]: boolean } = Object.keys(
    isReturn ? returnRequiredForm : requiredForm
  ).reduce((acc, curr) => ({ [curr]: !form[curr], ...acc }), {});
  const formIsValid = Object.values(errors).every((error) => !error);
  console.log("🚀 ~ errors", errors, formIsValid);

  const handleBlur = (e: any) => {
    (errors as any)[e.target.name] =
      !e.target.validity.valid || !e.target.value;
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setShowErrors(true);
    errors.WithdrawType = !form.WithdrawType;
    console.log(
      "🚀 ~ file: CustomForm.tsx ~ line 72 ~ submitForm ~ errors",
      errors
    );
    if (formIsValid) {
      let formToSend = {
        Address: form.ClientEmail,
        SubscriberKey: form.ClientEmail,
        ContactAttributes: {
          SubscriberAttributes: form,
        },
      };
      const fetchUrl = url;
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToSend),
      };
      setLoading(true);
      fetch(fetchUrl, options).then((response) => {
        setLoading(false);
        setResponse(response.status === 200);
      });
    }
  };
  console.log("🚀 ~ file: CustomForm.tsx ~ line 469 ~ form", form);

  return (
    <div className={classnames(styles.containers)}>
      <form
        name="customForm"
        onSubmit={(e: any) => submitForm(e)}
        className={classnames(styles.formContainer)}
      >
        <div className={classnames(styles.supportReturn)}>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="FirstName">PRÉNOM *</label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                onBlur={handleBlur}
                value={form.FirstName}
                id="FirstName"
                name="FirstName"
                placeholder=""
              />
              {showErrors && <ErrorComponent error={errors.FirstName} />}
            </div>
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Surname">NOM *</label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                value={form.Surname}
                id="Surname"
                name="Surname"
                placeholder=""
                onBlur={handleBlur}
              />
            </div>
            {showErrors && <ErrorComponent error={errors.Surname} />}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ClientEmail">EMAIL *</label>
            </div>
            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              onBlur={handleBlur}
              value={form.ClientEmail}
              id="ClientEmail"
              name="ClientEmail"
              pattern={/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g}
              placeholder="votre_email@exemple.com"
            />
            {showErrors && (
              <ErrorComponent
                error={errors.ClientEmail}
                message="Entrez un e-mail valide."
              />
            )}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div className={classnames(styles.inputTitle)}>
              <label htmlFor="PhoneNumber">TÉLÉPHONE</label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="tel"
              pattern="(\+33)?\s?[0-9]*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              onBlur={handleBlur}
              value={form.PhoneNumber}
              id="PhoneNumber"
              name="PhoneNumber"
              placeholder="+33"
            />

            {showErrors && <ErrorComponent error={errors.PhoneNumber} />}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="City">VILLE *</label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              onBlur={handleBlur}
              value={form.City}
              id="City"
              name="City"
              placeholder=""
            />

            {showErrors && <ErrorComponent error={errors.City} />}
          </div>
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="Address">RUE *</label>
            </div>

            <Input
              className={classnames(styles.inputTitle)}
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              onBlur={handleBlur}
              value={form.Address}
              id="Address"
              name="Address"
              placeholder=""
            />

            {showErrors && <ErrorComponent error={errors.Address} />}
          </div>

          {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "frwhirlpool-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="PickUpAddress">
                  ADRESSE OÙ RETIRER LE PRODUIT *
                </label>
              </div>
              <div className={classnames(styles.inputTtitle)}>
                <Input
                  className={classnames(styles.inputTitle)}
                  type="text"
                  id="PickUpAddress"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(e.target)
                  }
                  onBlur={handleBlur}
                  value={form.PickUpAddress}
                  name="PickUpAddress"
                  placeholder=""
                />
              </div>
              {showErrors && <ErrorComponent error={errors.PickUpAddress} />}
            </div>
          ) : null}
          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="OrderNumber">NUMÉRO DE COMMANDE *</label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                id="OrderNumber"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                onBlur={handleBlur}
                value={form.OrderNumber}
                name="OrderNumber"
                placeholder=""
              />
            </div>
            {showErrors && <ErrorComponent error={errors.OrderNumber} />}
          </div>

          <div className={classnames(styles.singleInput)}>
            <div
              className={classnames(
                styles.inputTitle,
                "frwhirlpool-custom-form-0-x-requiredInput"
              )}
            >
              <label htmlFor="ProductCode">CODE PRODUIT *</label>
            </div>
            <div className={classnames(styles.inputTtitle)}>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                onBlur={handleBlur}
                value={form.ProductCode}
                id="ProductCode"
                name="ProductCode"
                placeholder=""
              />
            </div>
            {showErrors && <ErrorComponent error={errors.ProductCode} />}
          </div>

          {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="DocumentTransportNumber">
                  N. DOCUMENT DE TRANSPORT
                </label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                onBlur={handleBlur}
                value={form.DocumentTransportNumber}
                id="DocumentTransportNumber"
                name="DocumentTransportNumber"
                placeholder=""
              />

              {showErrors && (
                <ErrorComponent error={errors.DocumentTransportNumber} />
              )}
            </div>
          ) : null}
          {!isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div className={classnames(styles.inputTitle)}>
                <label htmlFor="RefundReason">MOTIF DU RETOUR</label>
              </div>

              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                onBlur={handleBlur}
                value={form.RefundReason}
                id="RefundReason"
                name="RefundReason"
                placeholder=""
              />
            </div>
          ) : null}

          {isReturn ? (
            <div className={classnames(styles.singleInput)}>
              <div
                className={classnames(
                  styles.inputTitle,
                  "frwhirlpool-custom-form-0-x-requiredInput"
                )}
              >
                <label htmlFor="DamageDescription">
                  DESCRIPTION DES DOMMAGES CONSTATÉS
                </label>
              </div>
              <Input
                className={classnames(styles.inputTitle)}
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(e.target)
                }
                onBlur={handleBlur}
                value={form.DamageDescription}
                id="DamageDescription"
                name="DamageDescription"
                placeholder=""
              />
            </div>
          ) : null}
        </div>
        <br></br>
        <div>
          <span className={classnames(styles.inputTitle)}>COMMENTAIRE</span>
          <textarea
            className={classnames(styles.textArea)}
            id="Note"
            name="Note"
            placeholder="Ecrivez-vos commentaires ici"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              dispatch(e.target)
            }
            onBlur={handleBlur}
            value={form.Note}
            rows={10}
          ></textarea>
        </div>
        <div>
          {isReturn ? (
            <div className={classnames(styles.fotoDanno)}>
              Des photos des dommages doivent être envoyées à l'adresse
              électronique:&nbsp;
              <a
                className={classnames(styles.mailTo)}
                href="mailto:eshop@whirlpool.com"
              >
                eshop@whirlpool.com
              </a>
            </div>
          ) : (
            ""
          )}
          <div className={classnames(styles.campiObbligatori)}>
            *Champs requis
          </div>
        </div>
        <div className={classnames(styles.radioGroup)}>
          <RadioGroup
            hideBorder
            name="WithdrawType"
            errorMessage={
              showErrors && errors.WithdrawType ? "*Champs requis" : ""
            }
            options={[
              {
                value: "home",
                label: "Je renvoie le produit(s) par mes propres moyens",
              },
              {
                value: "whirlpool",
                label:
                  "Je souhaite bénéficier de la prise en charge du retour au tarif de 80€ TTC pour le gros éléctroménager ou 40€ TTC (micro-ondes pose libre) selon les modalités qui me seront communiquées et accepte que la somme soit déduite du montant remboursé",
              },
            ]}
            value={form.WithdrawType}
            onChange={(e: any) => dispatch(e.target)}
          />
        </div>
        <div className={classnames(styles.privacyLink)}>
          <span>
            Je comprends le contenu de{" "}
            <a
              className={classnames(styles.privacyLinkText)}
              href="/pages/politique-de-protection-des-donnees-a-caractere-personnel"
            >
              Politique de protection des données personnelles.
            </a>
          </span>
        </div>
        {isLoading ? (
          <div className={classnames(styles.loaderFormContainer)}>
            <div className={classnames(styles.loaderForm)}></div>
          </div>
        ) : isResponse ? (
          <div className={classnames(styles.messageText)}>
            <span>
              Merci de nous contacter! Nous vous avons envoyé un e-mail avec le.
              rapport de données &nbsp;
            </span>
            <a className={classnames(styles.formLink)} href="/">
              Revenir à la page
            </a>
          </div>
        ) : (
          <div className={classnames(styles.inviaButton)}>
            <Button
              type="submit"
              id="support_return_product_save"
              name="support_return_product[save]"
              value="Submit"
            >
              ENVOYER
            </Button>
          </div>
        )}
        {showErrors && !isLoading && !isResponse && (
          <ErrorComponent
            error={!isResponse}
            message="Une erreur s'est produite, vérifiez les champs et réessayez"
          />
        )}
      </form>
    </div>
  );
};

const ErrorComponent = ({
  error,
  message,
}: {
  error: boolean;
  message?: string;
}) =>
  error ? (
    <span id="firstNameError" className={classnames(styles.inputError)}>
      {message ?? "Cette valeur ne devrait pas être vide."}
    </span>
  ) : null;

CustomForm.schema = {
  title: "editor.customForm.title",
  description: "editor.customForm.description",
  type: "object",
  properties: {
    url: {
      title: "url servizio",
      description: "",
      type: "string",
      default: null,
    },
    isReturn: {
      title: "isReturn",
      description: "return o refun",
      type: "boolean",
      default: null,
    },
    isProduct: {
      title: "isProduct",
      description: "prodotto o accessorio",
      type: "boolean",
      default: null,
    },
  },
};

export default CustomForm;
