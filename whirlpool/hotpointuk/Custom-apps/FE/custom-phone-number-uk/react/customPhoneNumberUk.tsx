 //@ts-nocheck
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { usePixel } from 'vtex.pixel-manager';
import { useRuntime } from 'vtex.render-runtime';
import styles from './styles.css';
import { isErrorPage, isProductErrorPage } from "./utils/generics";



interface customPhoneNumberUkProps {
  labelPhoneNumber: string
  phoneNumber: string
  labelPhoneNumberSpareParts: string
  phoneNumberSpareParts: string
  phoneIcon: string
}

const customPhoneNumberUk: StorefrontFunctionComponent<customPhoneNumberUkProps> = ({
  labelPhoneNumber="03448 224 224",
  phoneNumber="03448224224",
  labelPhoneNumberSpareParts="03330 605 606",
  phoneNumberSpareParts="03330605606",
  phoneIcon="https://hotpointuk.vtexassets.com/assets/vtex.file-manager-graphql/images/de312258-696c-4738-9dc5-0e6a4e0255b3___d7b256ed6b49240426623e33b5ef9335.png"
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  //GA4FUNREQ17
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const { push } = usePixel()
  const pushAnalyicsEvent = () => {
    dataLayer.push({
      event: "cta_click",
      eventCategory: 'CTA Click',
      eventAction: 'Call Service & Support',
      eventLabel: 'Click call CTA',
      link_url: 'tel:03448224224',
      link_text: 'Call', // dynamic value
      checkpoint: '1', // dynamic value
      area: getContentGrouping(window?.location.href), // dynamic value
      type: 'Call Service & Support' // dynamic value
    })
    push({
      event: "contacts_click",
      type: "telephone"
    })
  }
  function getPathFromUrl(url: string) {
    return url?.split("/")[3];
  }
  //Function to get content grouping
function getContentGrouping(url: string) {
  const urlWithoutQueryStrings = getPathFromUrl(url)
  const isSpareOrAccessories = url.includes("accessories") || url.includes("spare-parts");
  const isBom = url.includes("spare-parts/bom");
  const isFilteredCategory = url.includes("&searchState")
  const isCatalog = url.endsWith("/p#") || urlWithoutQueryStrings.endsWith("/p#") || urlWithoutQueryStrings.includes("appliances") || urlWithoutQueryStrings.includes("product-comparison") || isFilteredCategory

  const isCompany = urlWithoutQueryStrings.includes("about-us") || urlWithoutQueryStrings.includes("recycling") || urlWithoutQueryStrings.includes("tax-strategy") || urlWithoutQueryStrings.includes("share-your-content") || urlWithoutQueryStrings.includes("terms-and-conditions") || urlWithoutQueryStrings.includes("privacy-policy") || urlWithoutQueryStrings.includes("cookie-policy")

  const marketingTechUrlPaths = ["/3d-zone-wash", "/self-cleaning-ovens", "/direct-flame-gas-hob", "/flexi-duo", "/cookers", "/direct-injection-technology", "/active-oxygen", "/active-oxygen-fridge", "/multiflow-cookers", "/hoods", "/active-care-washing-machines", "/no-frost-system-freezers", "/stop-and-add", "/free-ariel-laundry", "/frost-free-fridge-freezers", "/day-1-fresher-for-longer", "multiflow-ovens", "/heat-pump-tumble-dryer", "/powerful-gentle-power-washing-machine", "/double-fan-oven", "/integrated-washing-machines", "/integrated-fridge-freezers", "/black-friday", "/common-template-black-friday"];
  const marketingUrlPaths = ["/microwaves", "/tumble-dryers", "/ovens", "/washing-machines", "/hobs", "/washer-dryers", "/fridge-freezers", "fridges", "/freezers", "/dishwashers", "/exclusive-benefits", ...marketingTechUrlPaths];
  const isMarketing = marketingUrlPaths.includes(urlWithoutQueryStrings)

  const isSupport = urlWithoutQueryStrings.includes("contact-us") || urlWithoutQueryStrings.includes("press-enquiries") || urlWithoutQueryStrings.includes("register-my-appliance") || urlWithoutQueryStrings.includes("store-locator") || urlWithoutQueryStrings.includes("-guide") || urlWithoutQueryStrings.includes("service");
  const isPromotions = urlWithoutQueryStrings.includes("appliances-sale-and-offers") || urlWithoutQueryStrings.includes("boxing-day-sales") || urlWithoutQueryStrings.includes("free-fairy-2021") || urlWithoutQueryStrings.includes("/black-friday-deals")

  const isPdpError = isProductErrorPage()
  const isError = isErrorPage();
  const isSearchPage = window?.history?.state?.state.navigationRoute.id === "store.search"


  if (isBom) {
    return "Bom"
  } else if (isSpareOrAccessories) {
    return "Accessories & Spare Parts"
  } else if (isPromotions) {
    return "Promotions"
  }
  else if (isCatalog && !isPdpError) {
    return "Catalog"
  }
  else if (isCompany) {
    return "Company"
  }
  else if (isMarketing) {
    return "Marketing"
  }
  // else if(urlWithoutQueryStrings.includes("account") || (urlWithoutQueryStrings.includes("login"))) { //I'm in personal area page
  //   return "Personal"
  // }

  // else if(urlWithoutQueryStrings.includes("recettes")) {
  //   return "Recipes"
  // }
  // else if(urlWithoutQueryStrings.includes("accessoires") || urlWithoutQueryStrings.includes("/services/pieces-detachees-d-origine")) {
  //   return "Accessories & Spare Parts"
  // }
  else if (isSupport) {
    return "Support"
  }
  else if (urlWithoutQueryStrings === "#") {
    return "Homepage"
  }
  else if (isSearchPage) {
    const notFoundTextElements = document.getElementsByClassName("lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--notFound vtex-rich-text-0-x-paragraph--center")
    if (notFoundTextElements?.length > 0) {  // Handling search page when there is an empty search
      return "Errors"
    }
    return "(Other)"
  }
  else if (isError || isPdpError) {
    return "Errors"
  }
  return "(Other)"
}
  const runtime = useRuntime()
  let url = runtime.route.path
  let isPdpSpare = runtime.route?.params?.slug?.split('-').filter(s => s.includes("j0")) ? true : false
  const isSpare = url.includes("spare-parts") || isPdpSpare

  const handlePopup = (event: React.MouseEvent<HTMLElement>, bool: boolean) => {
    event.stopPropagation()
    setIsOpen(bool);
  }
  useEffect(() => {
    const clickHandler = () => {
      setIsOpen(false);
    }
    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  }, [])

  return (
    <div className={styles.phoneNumberContainer}>
      <div className={styles.popup} onClick={(e) => handlePopup(e, true)}>
        <img src={phoneIcon} className={styles.phoneIcon} />
        <span className={styles.phoneNumberLabel}>{isSpare ? labelPhoneNumberSpareParts : labelPhoneNumber}</span>
        {/* {isOpen && ( */}
          <span className={`${styles.popuptext} ${isOpen && styles.show}`}>
            <div className={styles.rowLabel}>
              <span className={styles.labelPopup}> <FormattedMessage id="store/custom-phone-number-uk.labelPopup" /> </span>
            </div>
            <div className={styles.rowButton} onClick={pushAnalyicsEvent}>
              <a className={styles.linkPhoneNumber} href={`tel:${isSpare ? phoneNumberSpareParts : phoneNumber}`}><FormattedMessage id="store/custom-phone-number-uk.call" /></a>
              <div className={styles.linkPhoneNumber} onClick={(e) => handlePopup(e, false)}> <FormattedMessage id="store/custom-phone-number-uk.close" /></div>
            </div>
          </span>
        {/* )} */}
      </div>
    </div>
  )
}
customPhoneNumberUk.schema = {
  title: "customPhoneNumberUk",
  description: "customPhoneNumberUk",
  type: "object",
  properties: {
    labelPhoneNumber: {
      title: "label phone number",
      description: "label phone number",
      default: undefined,
      type: "string",
    },
    phoneNumber: {
      title: "phone number",
      description: "phone number",
      default: undefined,
      type: "string",
    },
    labelPhoneNumberSpareParts: {
      title: "label phone number spare parts",
      description: "label phone number spare parts",
      default: undefined,
      type: "string",
    },
    phoneNumberSpareParts: {
      title: "phone number spare parts",
      description: "phone number spare parts",
      default: undefined,
      type: "string",
    },
    phoneIcon: {
      type: "string",
      widget: { //here you can choose a file in your computer
        "ui:widget": "image-uploader"
      },
      title: "Phone icon"
    }
  },
};
export default customPhoneNumberUk
