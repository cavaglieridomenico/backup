import React, { useState } from "react";
import style from "../styles/style.css";
import { Checkbox, Modal, Spinner } from "vtex.styleguide";
import { useIntl, defineMessages } from "react-intl";
import { formatPrice, formatPriceMultilanguage } from "../utils/utils";
import useCart from "itccwhirlpool.checkout-container-custom/CartContext";
import CartModal from "./CartModal";
import { tooltipIcon } from "../../assets/tooltip";
import { usePixel } from "vtex.pixel-manager";

interface AdditionalServicesWrapperProps {
  services: Service[] | undefined;
  installationModal: boolean;
  itemIndex: any;
  item: any;
  tooltipProps: any
  multilanguageOfferings: any
  currency: string
  fixedServiceTypeIds?: Array<number>
}
interface Service {
  id: string;
  name: string;
  price: number;
  __typename: string;
}

const messages = defineMessages({
  offeringsTitle: {
    defaultMessage: "Select the additional services included in the price",
    id: "store/custom-additional-services.offeringsTitle",
  },
  offeringsFreeLabel: {
    defaultMessage: "Free",
    id: "store/custom-additional-services.offeringsFreeLabel",
  },
  offeringsNameForModal: {
    defaultMessage: "Installation",
    id: "store/custom-additional-services.offeringsNameForModal",
  },
  removalLabel: {
    defaultMessage: "Your appliance will need to be disconnected and ready for collection, currently we will be unable to collect any appliance still connected",
    id: "store/custom-additional-services.removalLabel",
  },
});

const AdditionalServicesWrapper: StorefrontFunctionComponent<
  AdditionalServicesWrapperProps
> = ({ services, installationModal = false, itemIndex, item, tooltipProps, multilanguageOfferings = [], currency= "", fixedServiceTypeIds =[]}) => {

  console.log(fixedServiceTypeIds, "__ fixedServiceTypeIds add serv wrapper")

  const intl = useIntl();
  const { push } = usePixel();
  const [offeringState, setOfferingState] = useState<any>();
  const [isInstallationClicked, setIsinstallationClicked] =
    useState<boolean>(false);
  const [dataForModal, setDataForModal] = useState<any>();
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const { addItemOfferings, removeItemOfferings, removeOfferingLoading } =
    useCart();

  const createSvg = (svgString: string) => {
    const svgBase64 = Buffer.from(svgString).toString("base64");
    return `data:image/svg+xml;base64,${svgBase64}`;
  };


  const checkboxClickHandler = (e: any, offering: any) => {
    setOfferingState(offering);
    setIsinstallationClicked(true);

    /* CHECKING IF THE CHECKBOX CLICKED SHOULD POP MODAL 
		"Installation" --> Usata una key per renderlo configurabile
		@marco Gatto fare unica chiamata graphQl con  dati modale
		*/

    if (e?.target?.checked == true) {
      if (
        offering?.name?.includes(
          intl.formatMessage(messages.offeringsNameForModal)
        ) &&
        installationModal
      ) {
        fetch(
          `/_v/wrapper/api/additional-services/contents?productId=${item?.productId}`
        )
          .then((response: any) => response.json())
          .then((secondData: any) => {
            setDataForModal(secondData);
            if (secondData.length) {
              setShowCartModal(true);
              push({
                event: "popupInteraction",
                data: { eventAction: "cartModalContainer", eventLabel: "view" },
              });
              setIsinstallationClicked(false);
            } else {
              addItemOfferings(itemIndex, offering.id);
              setIsinstallationClicked(false);
            }
          });
      } else {
        addItemOfferings(itemIndex, offering?.Id?.toString());
        setIsinstallationClicked(false);
      }
    } else {
      removeItemOfferings(itemIndex, offering?.Id?.toString());
      setIsinstallationClicked(false);
    }
  };

  const closeModalHandler = () => {
    setShowCartModal(false);
    setIsinstallationClicked(false);
  };
  const modalSaveButtonHandler = () => {
    addItemOfferings(itemIndex, offeringState.id);
    setShowCartModal(false);
    setIsinstallationClicked(false);
  };

  const isOfferingSelected = (offeringId: string) =>
    item?.bundleItems?.some((bundleItem: any) => bundleItem.id == offeringId);

  const renderServiceName = (name: string) => {
    let arrayFromName = name.split("_");
    return arrayFromName[arrayFromName.length - 1];
  };

  return (
    <>
      {services && services?.length != 0 ? (
        <div className={`${style.offeringsContainer} b--action-primary`}>
          <div className={style.offeringsTitleContainer}>
            <span className={style.offeringsTitle}>
              {intl.formatMessage(messages.offeringsTitle)}
            </span>
          </div>
          {removeOfferingLoading || isInstallationClicked ? (
            <span className="c-action-primary">
              <Spinner color="currentColor" />
            </span>
          ) : ( multilanguageOfferings && multilanguageOfferings?.length>0 ?
            <>
            {multilanguageOfferings?.map((offering: any, index: number) => (
                <div key={index} className={`${style.offeringRow} flex`}>
                  <div className={`${style.offeringLeft} mr3 flex items-center`}>
                    <div className="mr3">
                      {fixedServiceTypeIds.includes(offering.Id) ?
                      <>
                      <Checkbox
                          id={offering?.Name}
                          label={offering?.Name}
                          name="default-checkbox-group"
                          onChange={() => {}}
                          checked={true}
                        />
                      </>:
                      <>
                        <Checkbox
                          checked={isOfferingSelected(offering?.Id)}
                          id={offering?.Name}
                          label={offering?.Name}
                          name="default-checkbox-group"
                          onChange={(e: any) => checkboxClickHandler(e, offering)}
                          value={offering?.Name}
                        />
                      </>}
                    </div>
                    {offering?.Description && 
                    <div className={style.tootltipContainer}>
                      <img
                        className={style.offeringTootltipLogo}
                        src={createSvg(tooltipIcon)}
                        alt="tooltip icon"
                      />
                      <span className={style.offeringTootltipText}>
                        {offering?.Description}
                      </span>
                    </div>}
                  </div>
                  <div className={style.offeringRight}>
                    <span
                      className={`${
                        offering?.Price == 0
                          ? style.offeringPriceTextFree
                          : style.offeringPriceText
                      } c-action-primary`}
                    >
                      {offering.Price == 0
                        ? intl.formatMessage(messages.offeringsFreeLabel)
                        : `+ ${formatPriceMultilanguage(offering?.Price, currency)}`}
                    </span>
                  </div>
                </div>
              ))}
            </> :
            <>
              {services?.map((offering: any, index: number) => (
                <div key={index} className={`${style.offeringRow} flex`}>
                  <div className={`${style.offeringLeft} mr3 flex items-center`}>
                    <div className="mr3">
                      <Checkbox
                        checked={isOfferingSelected(offering.id)}
                        id={offering.name}
                        label={renderServiceName(offering.name)}
                        name="default-checkbox-group"
                        onChange={(e: any) => checkboxClickHandler(e, offering)}
                        value={offering.name}
                      />
                    </div>

                    {tooltipProps?.additionalServicesInfos && tooltipProps?.additionalServicesInfos.map((item:any, index:number)=>{
                      if(item.filterName == renderServiceName(offering?.name) && item.asTooltip){
                        return(
                      <div className={style.tootltipContainer} key={index}>
                        <img
                          className={style.offeringTootltipLogo}
                          src={createSvg(tooltipIcon)}
                          alt="tooltip icon"
                        />
                        <span className={style.offeringTootltipText}>
                          {item.asDescription}
                        </span>
                      </div>)
                      }
                      else return <></>
                    }) 
                    }
                  </div>
                  <div className={style.offeringRight}>
                    <span
                      className={`${
                        offering.price == 0
                          ? style.offeringPriceTextFree
                          : style.offeringPriceText
                      } c-action-primary`}
                    >
                      {offering.price == 0
                        ? intl.formatMessage(messages.offeringsFreeLabel)
                        : `+ ${formatPrice(offering.price, currency)}`}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : null}

      {installationModal && (
        <Modal
          isOpen={showCartModal}
          onClose={closeModalHandler}
          showCloseIcon={false}
        >
          <CartModal
            onCloseModal={closeModalHandler}
            onSave={modalSaveButtonHandler}
            modalData={dataForModal}
          />
        </Modal>
      )}
    </>
  );
};

export default AdditionalServicesWrapper;
