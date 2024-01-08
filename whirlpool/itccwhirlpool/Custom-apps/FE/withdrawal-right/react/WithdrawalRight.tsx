import React, { useState, useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import CustomFormAppliances from "./CustomFormAppliances";
import { useRuntime } from "vtex.render-runtime";
import { useDevice } from "vtex.device-detector";

interface WithdrawalRightInterface {
  supportEmail: string;
  showAssistenza: boolean;
  downloadLink: string;
}

const WithdrawalRight: StorefrontFunctionComponent<
  WithdrawalRightInterface
> = ({ supportEmail, children, showAssistenza, downloadLink }) => {
  const CSS_HANDLES = [
    "withdrawalRightTitle",
    "withdrawalRightSubTitle",
    "textBeforeButtons",
    "textAfterButtons",
    "withdrawalButtonGroups",
    "buttonLink",
  ] as const;

  const handles = useCssHandles(CSS_HANDLES);

  const [toggleForm, setToggleForm] = useState(true);
  const [toggleAppliances, setToggleAppliances] = useState(false);
  const [toggleAccessories, setToggleAccessories] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const [hash, setHash] = useState("");
  const { production } = useRuntime();

  const handleFormRouting = (urlHash: string, isFirstTime: boolean) => {
    urlHash != "" && setHash(urlHash);
    if (urlHash.includes("elettrodomestici")) {
      setToggleAppliances(true);
      isFirstTime && setToggleForm(false);
    } else if (urlHash.includes("accessori")) {
      setToggleAccessories(true);
      isFirstTime && setToggleForm(false);
    } else {
      setToggleForm(true);
      setToggleAppliances(false);
      setToggleAccessories(false);
    }
  };

  useEffect(() => {
    if (window) {
      handleFormRouting(window.location.hash, true);
      /*----------- EVENT LISTENER -------------*/
      window.addEventListener("hashchange", () => {
        handleFormRouting(window.location.hash, false);
      });
    }
  }, [typeof window]);

  let refundUrlSubmit = "/app/sfmc/order/refund";
  let returnUrlSubmit = "/app/sfmc/order/return";
  const url = window.location.href;
  if (!production) {
    if (url.includes("bindingAddress=epp.whirlpoolgroup.it")) {
      refundUrlSubmit =
        "/app/sfmc/order/refund?host=testepp123.whirlpoolgroup.it";
      returnUrlSubmit =
        "/app/sfmc/order/return?host=testepp123.whirlpoolgroup.it";
    } else if (url.includes("bindingAddress=vip.whirlpoolgroup.it")) {
      refundUrlSubmit =
        "/app/sfmc/order/refund?host=testvip123.whirlpoolgroup.it";
      returnUrlSubmit =
        "/app/sfmc/order/return?host=testvip123.whirlpoolgroup.it";
    } else if (url.includes("bindingAddress=ff.whirlpoolgroup.it")) {
      refundUrlSubmit =
        "/app/sfmc/order/refund?host=testff123.whirlpoolgroup.it";
      returnUrlSubmit =
        "/app/sfmc/order/return?host=testff123.whirlpoolgroup.it";
    }
  }

  const { isMobile } = useDevice();

  const withdrawalRightTitle = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#withdrawalRightTitle"
  );
  const withdrawalRightSubTitle = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#withdrawalRightSubTitle"
  );
  const textBeforeButtons = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#textBeforeButtons"
  );
  const withdrawalButton1 = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#withdrawalButton1"
  );
  const withdrawalButton2 = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#withdrawalButton2"
  );
  const withdrawalButton3 = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#withdrawalButton3"
  );
  const textAfterButtons = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#textAfterButtons"
  );
  const appliancesFormTitle = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#appliancesFormTitle"
  );
  const appliancesFormTitleRecesso = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#appliancesFormTitleRecesso"
  );
  const appliancesFormSubTitle = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#appliancesFormSubTitle"
  );
  const appliancesFormSubText = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#appliancesFormSubText"
  );
  const accessoriesFormSubTitle = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#accessoriesFormSubTitle"
  );
  const privacyLabel = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#privacyLabel"
  );
  const privacyLinkLabel = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#privacyLinkLabel"
  );
  const privacyLink = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#privacyLink"
  );
  const accessoriesFormTitle = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#accessoriesFormTitle"
  );
  const accessoriesFormTitleRecesso = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#accessoriesFormTitleRecesso"
  );
  const accessoriesFormSubText = (children as any)?.find(
    (child: any) => child.props.id === "rich-text#accessoriesFormSubText"
  );

  return (
    <>
      {toggleForm && (
        <div>
          <div className={handles.withdrawalRightTitle}>
            {withdrawalRightTitle}
            {appliancesFormTitleRecesso}
          </div>
          <div className={handles.withdrawalRightSubTitle}>
            {withdrawalRightSubTitle}
          </div>
          <div className={handles.textBeforeButtons}>{textBeforeButtons}</div>
          <div className={handles.withdrawalButtonGroups}>
            {!isMobile ? (
              <a
                className={handles.buttonLink}
                onClick={() => {
                  setToggleForm(false);
                  window.location.hash = hash + "-elettrodomestici";
                  setActiveItem(hash);
                }}
              >
                {withdrawalButton1}
              </a>
            ) : (
              <a
                className={handles.buttonLink}
                onClick={() => {
                  setToggleForm(false);
                  setActiveItem(hash);
                  setToggleAppliances(true);
                }}
              >
                {withdrawalButton1}
              </a>
            )}
            {!isMobile ? (
              <a
                className={handles.buttonLink}
                onClick={() => {
                  setToggleForm(false);
                  window.location.hash = hash + "-accessori";
                  setActiveItem(hash);
                }}
              >
                {withdrawalButton2}
              </a>
            ) : (
              <a
                className={handles.buttonLink}
                onClick={() => {
                  setToggleForm(false);
                  setActiveItem(hash);
                  setToggleAccessories(true);
                }}
              >
                {withdrawalButton2}
              </a>
            )}
            <a
              className={handles.buttonLink}
              href={downloadLink}
              target="_blank"
            >
              {withdrawalButton3}
            </a>
          </div>
          <div className={handles.textAfterButtons}>{textAfterButtons}</div>
        </div>
      )}

      {/* Refund form */}
      {activeItem?.search("dirittoDiRecesso") >= 0 && toggleAppliances && (
        <>
          <div className={handles.withdrawalRightTitle}>
            {appliancesFormTitle}
          </div>
          <div className={handles.withdrawalRightSubTitle}>
            {appliancesFormSubTitle}
          </div>
          <div className={handles.textBeforeButtons}>
            {appliancesFormSubText}
          </div>
          <CustomFormAppliances
            url={refundUrlSubmit}
            isReturn={false}
            isProduct={true}
            privacyLabel={privacyLabel}
            privacyLinkLabel={privacyLinkLabel}
            privacyLink={privacyLink}
            supportEmail={supportEmail}
          />
        </>
      )}
      {activeItem?.search("dirittoDiRecesso") >= 0 && toggleAccessories && (
        <>
          <div className={handles.withdrawalRightTitle}>
            {accessoriesFormTitleRecesso}
          </div>
          <div className={handles.withdrawalRightSubTitle}>
            {accessoriesFormSubTitle}
          </div>
          <div className={handles.textBeforeButtons}>
            {accessoriesFormSubText}
          </div>
          <CustomFormAppliances
            url={refundUrlSubmit}
            isReturn={false}
            isProduct={false}
            privacyLinkLabel={privacyLinkLabel}
            privacyLabel={privacyLabel}
            privacyLink={privacyLink}
            supportEmail={supportEmail}
            showAssistenza={showAssistenza}
          />
        </>
      )}
      {/* End refund form */}

      {/* Substitution form */}
      {activeItem?.search("sostituzioneProdottoDanneggiato") >= 0 &&
        toggleAppliances && (
          <>
            <div className={handles.withdrawalRightTitle}>
              {appliancesFormTitle}
            </div>
            <div className={handles.textBeforeButtons}>
              {appliancesFormSubText}
            </div>
            <CustomFormAppliances
              url={returnUrlSubmit}
              isReturn={true}
              isProduct={true}
              privacyLinkLabel={privacyLinkLabel}
              privacyLabel={privacyLabel}
              privacyLink={privacyLink}
              supportEmail={supportEmail}
            />
          </>
        )}
      {activeItem?.search("sostituzioneProdottoDanneggiato") >= 0 &&
        toggleAccessories && (
          <>
            <div className={handles.withdrawalRightTitle}>
              {accessoriesFormTitle}
            </div>
            <div className={handles.textBeforeButtons}>
              {appliancesFormSubText}
            </div>
            <CustomFormAppliances
              url={returnUrlSubmit}
              isReturn={true}
              isProduct={false}
              privacyLinkLabel={privacyLinkLabel}
              privacyLabel={privacyLabel}
              privacyLink={privacyLink}
              supportEmail={supportEmail}
            />
          </>
        )}
      {/* End return form */}
      {/* ASSISTENZA TECNICA FORM */}
      {showAssistenza && (
        <>
          <CustomFormAppliances
            privacyLinkLabel={privacyLinkLabel}
            privacyLabel={privacyLabel}
            privacyLink={privacyLink}
            supportEmail={supportEmail}
            showAssistenza={showAssistenza}
            url={returnUrlSubmit}
          />
        </>
      )}
      {/* ASSISTENZA TECNICA FORM */}
    </>
  );
};

WithdrawalRight.schema = {
  title: "Diritto di recesso",
  description: "Diritto di recesso",
  type: "object",
  properties: {
    supportEmail: {
      title: "Support Email",
      description: "Support Email",
      type: "string",
    },
    downloadLink: {
      title: "Link URL",
      description: "Insert the url",
      type: "string",
    },
  },
};

export default WithdrawalRight;
