import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "react-apollo";
import { Button, Input, Checkbox } from "vtex.styleguide";
import { useProduct } from "vtex.product-context";
import type { Seller } from "vtex.product-context";
import { useRuntime } from "vtex.render-runtime";
import { usePixel } from "vtex.pixel-manager";
import ADD_TO_AVAILABILITY_SUBSCRIBER_MUTATION from "./graphql/addToAvailabilitySubscriberMutation.graphql";
import styles from "./AvailabilitySubscriber.css";
import { getDefaultSeller } from "./utils/sellers";

interface MutationVariables {
  acronym: string;
  document: {
    fields: Array<{
      key: string;
      value?: string | null;
    }>;
  };
}
interface Props {
  /* Product's availability */
  available?: boolean;
  /* SKU id to subscribe to */
  skuId?: string;
}

const isAvailable = (commertialOffer?: Seller["commertialOffer"]) => {
  return (
    commertialOffer &&
    (Number.isNaN(+commertialOffer.AvailableQuantity) ||
      commertialOffer.AvailableQuantity > 0)
  );
};

/**
 * Availability Subscriber Component.
 * A form where users can sign up to be alerted
 * when a product becomes available again
 */
function AvailabilitySubscriber(props: Props) {
  const { binding } = useRuntime();
  const productContext = useProduct();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [didBlurEmail, setDidBlurEmail] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(false);
  const productContextValue = useProduct();
  const { push } = usePixel();

  const tradePolicyCodeEPP = "1bbaf935-b5b4-48ae-80c0-346623d9c0c9";
  const tradePolicyCodeFF = "b9f7bf3a-c865-4169-8950-4fbb8b55ec09";
  const tradePolicyCodeVIP = "17564333-171d-4290-998d-276aae4a3ee5";

  const getTradePolicyName = (b: any) => {
    let tradePolicy = "";
    switch (b) {
      case "1bbaf935-b5b4-48ae-80c0-346623d9c0c9":
        tradePolicy = "EPP";
        break;
      case "b9f7bf3a-c865-4169-8950-4fbb8b55ec09":
        tradePolicy = "FF";
        break;
      case "17564333-171d-4290-998d-276aae4a3ee5":
        tradePolicy = "VIP";
        break;
      default:
        tradePolicy = "ECC";
        break;
    }
    return tradePolicy;
  };
  const getTradePolicyNumber = (b: any) => {
    let tradePolicy = "";
    switch (b) {
      //ecc
      case tradePolicyCodeEPP:
        tradePolicy = "1";
        break;
      // FF
      case tradePolicyCodeFF:
        tradePolicy = "2";
        break;
      // VIP
      case tradePolicyCodeVIP:
        tradePolicy = "3";
        break;
      default:
        tradePolicy = "1";
        break;
    }
    return tradePolicy;
  };

  let tradePolicyName = getTradePolicyName(binding?.id);
  let tradePolicyNumber = getTradePolicyNumber(binding?.id);

  console.log("This is the tradePolicyName: %s", tradePolicyName);
  console.log("This is the tradePolicyNumber: %s", tradePolicyNumber);
  const sellable =
    productContext?.product?.properties?.find(
      (prop: any) => prop.name == `sellable${tradePolicyName}`
    )?.values[0] == "true";
  const hasNoStock =
    productContextValue?.selectedItem?.sellers[0]?.commertialOffer
      ?.AvailableQuantity == 0
      ? true
      : false;
  /*-----------------------------------------------*/

  const [signUp, { loading, error, data }] = useMutation<
    unknown,
    MutationVariables
  >(ADD_TO_AVAILABILITY_SUBSCRIBER_MUTATION);

  const intl = useIntl();

  const seller = getDefaultSeller(productContext.selectedItem?.sellers);

  const available = props.available ?? isAvailable(seller?.commertialOffer);
  const skuId = props.skuId ?? productContext.selectedItem?.itemId;

  // Render component only if the product is out of stock
  if (available || !skuId) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tradePolicyId
    const variables: MutationVariables = {
      acronym: "AS",
      document: {
        fields: [
          {
            key: "skuId",
            value: skuId,
          },
          {
            key: "name",
            value: name,
          },
          {
            key: "email",
            value: email,
          },
          {
            key: "notificationSend",
            value: "false",
          },
          {
            key: "createdAt",
            value: new Date().toISOString(),
          },
          {
            key: "sendAt",
            value: null,
          },
          {
            key: "tradePolicy",
            value: tradePolicyNumber,
          },
        ],
      },
    };

    const signUpMutationResult = await signUp({
      variables,
    });

    if (!signUpMutationResult.errors) {
      setName("");
      setEmail("");
      //GA4FUNREQ61
      push({
        event: "ga4-optin",
      });
    }

    const event = new CustomEvent("message:success", {
      detail: {
        success: true,
        message: intl.formatMessage({
          id: "store/availability-subscriber.added-message",
        }),
      },
    });

    document.dispatchEvent(event);
  };

  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    setEmailError(!emailRegex.test(newEmail.toLowerCase()));
    //GA4FUNREQ58
    const ga4Data = {
      event: "ga4-custom_error",
      type: "error message",
      description: "Invalid email format",
    };
    push({ ...ga4Data });
  };
  // console.log("privacy",isPrivacy);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  let emailErrorMessage = "";

  if (didBlurEmail && emailError) {
    emailErrorMessage = intl.formatMessage({
      id: "store/availability-subscriber.invalid-email",
    });
  }

  const isFormDisabled =
    name === "" || email === "" || emailError || loading || isPrivacy === false;
  return (
    <>
      {sellable && hasNoStock && (
        <div className={styles.subscriberContainer}>
          <div className={`${styles.title} t-body mb3`}>
            {intl.formatMessage({ id: "store/availability-subscriber.title" })}
          </div>
          <div className={`${styles.subscribeLabel} t-small fw3`}>
            {intl.formatMessage({
              id: "store/availability-subscriber.subscribe-label",
            })}
          </div>
          <form
            className={`${styles.form} mb4`}
            onSubmit={(e) => handleSubmit(e)}
          >
            <div>
              <div
                className={`${styles.content} flex-ns justify-between mt4 mw6`}
              >
                <div
                  className={`${styles.input} ${styles.inputName} w-100 mr5 mb4`}
                >
                  <Input
                    name="name"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "store/availability-subscriber.name-placeholder",
                    })}
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <div
                  className={`${styles.input} ${styles.inputEmail} w-100 mr5 mb4`}
                >
                  <Input
                    name="email"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "store/availability-subscriber.email-placeholder",
                    })}
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setDidBlurEmail(true)}
                    error={didBlurEmail && emailError}
                    errorMessage={emailErrorMessage}
                  />
                </div>
              </div>
              <div className={`${styles.checkbox}`}>
                <Checkbox
                  name="privacy"
                  id="privacy"
                  checked={isPrivacy}
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "store/availability-subscriber.email-placeholder",
                  })}
                  value={isPrivacy}
                  onChange={(e: any) => {
                    setIsPrivacy(e.target.checked);
                  }}
                  required={true}
                  label=""
                />
                <span className={`${styles.checkboxText}`}>
                  {intl.formatMessage({
                    id: "store/availability-subscriber.checkbox-text",
                  })}
                  <a
                    className={styles.link}
                    href="/pages/politique-de-protection-des-donnees-a-caractere-personnel"
                  >
                    {" "}
                    {intl.formatMessage({
                      id: "store/availability-subscriber.checkbox-text-highlight",
                    })}
                  </a>
                  {")"}
                </span>
              </div>
              <div className={`${styles.submit} flex items-center mb4`}>
                <Button
                  className={styles.avvisamiBtn}
                  type="submit"
                  variation="primary"
                  size="small"
                  disabled={isFormDisabled}
                  isLoading={loading}
                >
                  {intl.formatMessage({
                    id: "store/availability-subscriber.send-label",
                  })}
                </Button>
              </div>
            </div>
            {!error && data && (
              <div className={`${styles.success} t-body c-success`}>
                {intl.formatMessage({
                  id: "store/availability-subscriber.added-message",
                })}
              </div>
            )}
            {error && (
              <div className={`${styles.error} c-danger`}>
                {intl.formatMessage({
                  id: "store/availability-subscriber.error-message",
                })}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default AvailabilitySubscriber;
