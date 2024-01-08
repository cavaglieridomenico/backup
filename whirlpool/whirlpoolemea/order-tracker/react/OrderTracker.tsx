import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import styles from "./styles.css";
import { useQuery } from 'react-apollo';
import { useRuntime } from "vtex.render-runtime";
import { FormattedMessage } from 'react-intl';
import getLastOrder from "../graphql/getLastOrder.graphql";

interface OrderTrakerProps {
  phoneSectionTitle: string;
  phoneSectionTitleEN: string;
  callUsLabel: string;
  callUsLabelEN: string;
  optionalText: string;
  optionalTextEN: string;
  orderStatusTitle: string;
  orderStatusTitleEN: string;
  noOrderLabel: string;
  noOrderLabelEN: string;
  labelFirstButton: string;
  labelFirstButtonEN: string;
  linkFirstButton: string;
  labelSecondButton: string;
  labelSecondButtonEN: string;
  linkSecondButton: string;
  orderPlacedLabel: string;
  orderPlacedLabelEN: string;
  paymentApproved: string;
  paymentApprovedEN: string;
  readyForShipping: string;
  readyForShippingEN: string;
  delivered: string;
  deliveredEN: string;
  expectedDeliveryDate: string;
  expectedDeliveryDateEN: string;
}

const CSS_HANDLES = [
  "containerBlock",
  "containerNumberBlock",
  "containerOrderBlock",
  "phoneSectionTitle",
  "imagePhoneNumber",
  "phoneNumber",
  "paragraphStyle",
  "firstColOrderSection",
  "secondColOrderSection",
  "paraghaphStyle",
  "orderBlockTitle",
  "linkGuest",
  "firstButton",
  "secondButton",
  "containerOrderBlockLoggedin",
  "containerOrderBlockGuest",
  "timelineSection2Col",
  "containerOrderBlockLoggedinTimeline",
  "paraghaphTimelineVoice",
  "paraghaphMyaccountLabel",
  "paraghaphDeliveryLabel",
  "spanDeliveryLabel",
  "timeline",
  "timelineProgressStep1",
  "timelineProgressStep2",
  "timelineProgressStep3",
  "timelineProgressStep4",
  "timelineItems",
  "timelineItem1",
  "timelineItem2",
  "timelineItem3",
  "timelineItem4",
  "timelineItem1Blue",
  "timelineItem2Blue",
  "timelineItem3Blue",
  "timelineItem4Blue",
  "timelineContent"
] as const;

const OrderTraker: StorefrontFunctionComponent<OrderTrakerProps> = ({
  phoneSectionTitle,
  phoneSectionTitleEN,
  callUsLabel,
  callUsLabelEN,
  optionalText,
  optionalTextEN,
  orderStatusTitle,
  orderStatusTitleEN,
  noOrderLabel,
  noOrderLabelEN,
  labelFirstButton,
  labelFirstButtonEN,
  linkFirstButton,
  labelSecondButton,
  labelSecondButtonEN,
  linkSecondButton,
  orderPlacedLabel,
  orderPlacedLabelEN,
  paymentApproved,
  paymentApprovedEN,
  readyForShipping,
  readyForShippingEN,
  delivered,
  deliveredEN,
  expectedDeliveryDate,
  expectedDeliveryDateEN
}) => {

  const handles = useCssHandles(CSS_HANDLES);
  const [isLogged, setIsLoggedIn] = useState<any>('false')

  const {
    culture: { locale },
  } = useRuntime();
  const lang = locale == "it-IT" ? "_it" : "_en";

  useEffect(() => {
    let loginInfo = sessionStorage.getItem("loggedIn");
    setIsLoggedIn(loginInfo)
    console.log(isLogged, "ISLOGGED")
  });

  const { data } = useQuery(getLastOrder, {
    ssr: false,
  })
  const dates = data?.getLastOrder;

  const dateString = dates && (dates[0].ShippingEstimatedDate || dates[0].ShippingEstimatedDateMax)
  const formatDate = (dateString: any) => {
    const options: any = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className={`${handles.containerBlock} ${styles.containerBlock}`}>
      <div className={`${handles.containerNumberBlock} ${styles.containerNumberBlock}`}>
        <span className={`${handles.phoneSectionTitle} ${styles.phoneSectionTitle}`}>{lang == "_it" ? phoneSectionTitle : phoneSectionTitleEN}</span>
        <p className={`${handles.paraghaphStyle} ${styles.paraghaphStyle}`}> {lang == "_it" ? callUsLabel : callUsLabelEN}
          <img
            alt=""
            className={`${handles.imagePhoneNumber} ${styles.imagePhoneNumber}`}
            src="https://itccwhirlpoolqa.vtexassets.com/arquivos/Phone.svg"
          />
          <a className={`${handles.phoneNumber} ${styles.phoneNumber}`} href="tel:03448224224">03448224224</a>
        </p>
        <p className={`${handles.paraghaphStyle} ${styles.paraghaphStyle}`}> {lang == "_it" ? optionalText : optionalTextEN}
        </p>
      </div>
      {isLogged == 'false' || isLogged == null || isLogged == undefined ?
        <>
          <div className={`${handles.containerOrderBlockGuest} ${styles.containerOrderBlockGuest}`}>
            <span className={`${handles.orderBlockTitle} ${styles.orderBlockTitle}`}>{lang == "_it" ? orderStatusTitle : orderStatusTitleEN}</span>
            <p className={`${handles.paraghaphStyle} ${styles.paraghaphStyle}`}>
              <FormattedMessage id="store/order-tracked.firstPart" />
              <a className={`${handles.linkGuest} ${styles.linkGuest}`} href="/login"><FormattedMessage id="store/order-tracked.firstLink" /></a>
              <FormattedMessage id="store/order-tracked.lastPart" />
            </p>
          </div>
        </>
        :
        <>
          {dates == undefined || dates == null ?
            <>
              <div className={`${handles.containerOrderBlockLoggedin} ${styles.containerOrderBlockLoggedin}`}>
                <div className={`${handles.firstColOrderSection} ${styles.firstColOrderSection}`}>
                  <span className={`${handles.orderBlockTitle} ${styles.orderBlockTitle}`}>{lang == "_it" ? orderStatusTitle : orderStatusTitleEN}</span>
                  <p className={`${handles.paraghaphStyle} ${styles.paraghaphStyle}`}>
                    {lang == "_it" ? noOrderLabel : noOrderLabelEN}
                  </p>
                </div>
                <div className={`${handles.secondColOrderSection} ${styles.secondColOrderSection}`}>
                  <a className={`${handles.firstButton} ${styles.firstButton}`} href={linkFirstButton}>{lang == "_it" ? labelFirstButton : labelFirstButtonEN}</a>
                  <a className={`${handles.secondButton} ${styles.secondButton}`} href={linkSecondButton}>{lang == "_it" ? labelSecondButton : labelSecondButtonEN}</a>
                </div>
              </div>
            </>
            :
            <>
              <div className={`${handles.containerOrderBlockLoggedinTimeline} ${styles.containerOrderBlockLoggedinTimeline}`}>
                <div className={`${handles.timelineSection} ${styles.timelineSection}`}>
                  <span className={`${handles.orderBlockTitle} ${styles.orderBlockTitle}`}>{lang == "_it" ? orderStatusTitle : orderStatusTitleEN}</span>
                  <p className={`${handles.paraghaphMyaccountLabel} ${styles.paraghaphMyaccountLabel}`}>
                    <FormattedMessage id="store/order-tracked.firstPartMyaccountLabel" />
                    <a className={`${handles.linkGuest} ${styles.linkGuest}`} href="/account"><FormattedMessage id="store/order-tracked.myaccountLink" /></a>
                    <FormattedMessage id="store/order-tracked.lastPartMyaccountLabel" />
                  </p>
                </div>
                <div className={`${handles.timelineSection2Col} ${styles.timelineSection2Col}`}>
                  {dates && dates[0].status == "waiting-for-seller-confirmation" ? <>
                    <div className={`${handles.timeline} ${styles.timeline}`}>
                      <div className={`${handles.timelineProgressStep1} ${styles.timelineProgressStep1}`}></div>
                      <div className={`${handles.timelineItems} ${styles.timelineItems}`}>
                        <div className={`${handles.timelineItem1Blue} ${styles.timelineItem1Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? orderPlacedLabel : orderPlacedLabelEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem2} ${styles.timelineItem2}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? paymentApproved : paymentApprovedEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem3} ${styles.timelineItem3}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? readyForShipping : readyForShippingEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem4} ${styles.timelineItem4}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? delivered : deliveredEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </> : null}
                  {dates && dates[0].status == "payment-approved" ? <>
                    <div className={`${handles.timeline} ${styles.timeline}`}>
                      <div className={`${handles.timelineProgressStep2} ${styles.timelineProgressStep2}`}></div>
                      <div className={`${handles.timelineItems} ${styles.timelineItems}`}>
                        <div className={`${handles.timelineItem1Blue} ${styles.timelineItem1Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? orderPlacedLabel : orderPlacedLabelEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem2Blue} ${styles.timelineItem2Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? paymentApproved : paymentApprovedEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem3} ${styles.timelineItem3}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? readyForShipping : readyForShippingEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem4} ${styles.timelineItem4}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? delivered : deliveredEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </> : null}
                  {dates && dates[0].status == "ready-for-handling" ? <>
                    <div className={`${handles.timeline} ${styles.timeline}`}>
                      <div className={`${handles.timelineProgressStep3} ${styles.timelineProgressStep3}`}></div>
                      <div className={`${handles.timelineItems} ${styles.timelineItems}`}>
                        <div className={`${handles.timelineItem1Blue} ${styles.timelineItem1Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? orderPlacedLabel : orderPlacedLabelEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem2Blue} ${styles.timelineItem2Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? paymentApproved : paymentApprovedEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem3Blue} ${styles.timelineItem3Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? readyForShipping : readyForShippingEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem4} ${styles.timelineItem4}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? delivered : deliveredEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </> : null}
                  {dates && dates[0].status == "invoiced" ? <>
                    <div className={`${handles.timeline} ${styles.timeline}`}>
                      <div className={`${handles.timelineProgressStep4} ${styles.timelineProgressStep4}`}></div>
                      <div className={`${handles.timelineItems} ${styles.timelineItems}`}>
                        <div className={`${handles.timelineItem1Blue} ${styles.timelineItem1Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? orderPlacedLabel : orderPlacedLabelEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem2Blue} ${styles.timelineItem2Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? paymentApproved : paymentApprovedEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem3Blue} ${styles.timelineItem3Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? readyForShipping : readyForShippingEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem4Blue} ${styles.timelineItem4Blue}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? delivered : deliveredEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </> : null}
                  {(dates && dates[0].status != "waiting-for-seller-confirmation") && (dates && dates[0].status != "payment-approved") && (dates && dates[0].status != "ready-for-handling") && (dates && dates[0].status != "invoiced") ? <>
                    <div className={`${handles.timeline} ${styles.timeline}`}>
                      <div className={`${handles.timelineProgressStep1} ${styles.timelineProgressStep1}`}></div>
                      <div className={`${handles.timelineItems} ${styles.timelineItems}`}>
                        <div className={`${handles.timelineItem1} ${styles.timelineItem1}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? orderPlacedLabel : orderPlacedLabelEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem2} ${styles.timelineItem2}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? paymentApproved : paymentApprovedEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem3} ${styles.timelineItem3}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? readyForShipping : readyForShippingEN}</p>
                          </div>
                        </div>
                        <div className={`${handles.timelineItem4} ${styles.timelineItem4}`}>
                          <div className={`${handles.timelineContent} ${styles.timelineContent}`}>
                            <p className={`${handles.paraghaphTimelineVoice} ${styles.paraghaphTimelineVoice}`}>{lang == "_it" ? delivered : deliveredEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </> : null}
                  <p className={`${handles.paraghaphDeliveryLabel} ${styles.paraghaphDeliveryLabel}`}>{lang == "_it" ? expectedDeliveryDate : expectedDeliveryDateEN} <span className={`${handles.spanDeliveryLabel} ${styles.spanDeliveryLabel}`}>{formatDate(dateString)}</span></p>
                </div>
              </div>
            </>
          }
        </>
      }

    </div>
  );
}

OrderTraker.schema = {
  title: "Order Traker",
  description: "Order traker custom",
  type: "object",
  properties: {
    phoneSectionTitle: {
      title: "IT: Title Phone section",
      description: "Title Phone section",
      default: "Need help choosing right appliance?",
      type: "string",
    },
    phoneSectionTitleEN: {
      title: "EN: Title Phone section",
      description: "Title Phone section",
      default: "Need help choosing right appliance?",
      type: "string",
    },
    callUsLabel: {
      title: "IT: Label call us",
      description: "Label call us",
      default: "Give us a call:",
      type: "string",
    },
    callUsLabelEN: {
      title: "EN: Label call us",
      description: "Label call us",
      default: "Give us a call:",
      type: "string",
    },
    optionalText: {
      title: "IT: Insert optional text",
      description: "Insert optional text",
      default: "Text",
      type: "string",
    },
    optionalTextEN: {
      title: "EN: Insert optional text",
      description: "Insert optional text",
      default: "Text",
      type: "string",
    },
    orderStatusTitle: {
      title: "IT: Title Order status section",
      description: "Title Order status section",
      default: "Status of your last order",
      type: "string",
    },
    orderStatusTitleEN: {
      title: "EN: Title Order status section",
      description: "Title Order status section",
      default: "Status of your last order",
      type: "string",
    },
    noOrderLabel: {
      title: "IT: Label no order",
      description: "Label no order",
      default: "You don't have any order yet",
      type: "string",
    },
    noOrderLabelEN: {
      title: "EN: Label no order",
      description: "Label no order",
      default: "You don't have any order yet",
      type: "string",
    },
    labelFirstButton: {
      title: "IT: Label first button",
      description: "Label first button",
      default: "Support",
      type: "string",
    },
    labelFirstButtonEN: {
      title: "EN: Label first button",
      description: "Label first button",
      default: "Support",
      type: "string",
    },
    linkFirstButton: {
      title: "Link first button",
      description: "Link first button",
      default: "/support",
      type: "string",
    },
    labelSecondButton: {
      title: "IT: Label second button",
      description: "Label second button",
      default: "See all appliances",
      type: "string",
    },
    labelSecondButtonEN: {
      title: "EN: Label second button",
      description: "Label second button",
      default: "See all appliances",
      type: "string",
    },
    linkSecondButton: {
      title: "Link second button",
      description: "Link second button",
      default: "/appliances",
      type: "string",
    },
    orderPlacedLabel: {
      title: "IT: Order placed Label",
      description: "Order placed Label",
      default: "Order placed",
      type: "string",
    },
    orderPlacedLabelEN: {
      title: "EN: Order placed Label",
      description: "Order placed Label",
      default: "Order placed",
      type: "string",
    },
    paymentApproved: {
      title: "IT: Payment approved Label",
      description: "Payment approved Label",
      default: "Payment approved",
      type: "string",
    },
    paymentApprovedEN: {
      title: "EN: Payment approved Label",
      description: "Payment approved Label",
      default: "Payment approved",
      type: "string",
    },
    readyForShipping: {
      title: "IT: Ready For Shipping Label",
      description: "Ready For Shipping Label",
      default: "Ready for shipping",
      type: "string",
    },
    readyForShippingEN: {
      title: "EN: Ready For Shipping Label",
      description: "Ready For Shipping Label",
      default: "Ready for shipping",
      type: "string",
    },
    delivered: {
      title: "IT: Delivered Label",
      description: "Delivered Label",
      default: "Delivered",
      type: "string",
    },
    deliveredEN: {
      title: "EN: Delivered Label",
      description: "Delivered Label",
      default: "Delivered",
      type: "string",
    },
    expectedDeliveryDate: {
      title: "IT: Expected delivery date",
      description: "Expected delivery date",
      default: "Expected delivery date",
      type: "string",
    },
    expectedDeliveryDateEN: {
      title: "EN: Expected delivery date",
      description: "Expected delivery date",
      default: "Expected delivery date",
      type: "string",
    },
  }
}

export default OrderTraker
