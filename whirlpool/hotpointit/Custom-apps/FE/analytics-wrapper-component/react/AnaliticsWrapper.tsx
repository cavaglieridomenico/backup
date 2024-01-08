import React, { /*Suspense,*/ useRef, useEffect, useState } from "react";
import { usePixel } from "vtex.pixel-manager";
import Analytics, { dataToSend } from "./Analytics";
//import useIntersectionObserver from "./utils/useIntersectionObserver";

interface PartialAnalyticsWrappertype {
  analyticsProperties: "provide" | "none";
  nameEvent: string;
  name?: string;
  data: dataToSend[];
  isView: boolean;
  nameView?: string;
}
interface WindowGTM extends Window {
  dataLayer: any[];
}
interface AnalyticsWrapperType {
  isLeazy: boolean;
  isRedeem: boolean;
  //isSlider?: boolean;
  isHpSlider?: boolean;
  propsAnalytics: PartialAnalyticsWrappertype;
  children: any;
  redeemPropsItem: any[];
}
const AnaliticsWrapper: StorefrontFunctionComponent<AnalyticsWrapperType> = ({
  isLeazy = true,
  isRedeem = false,
  //isSlider = false,
  isHpSlider = false,
  propsAnalytics,
  children,
  redeemPropsItem,
}: AnalyticsWrapperType) => {
  const { push } = usePixel();

  if (!isLeazy) {
    return <Analytics children={children} {...propsAnalytics} />;
  }
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];
  const wrapper = useRef(null);
  //const AnalyticsLazy = React.lazy(() => import("./Analytics"));
  //const isWrapperVisible = useIntersectionObserver(wrapper);
  const [isListener, setIsListener] = useState(false);

  var waitForEl = function(wrapperSection: any, selector: any, callback: any) {
    let element = wrapperSection?.querySelector(selector);
    if (element && window?.getComputedStyle(element)?.visibility == "visible") {
      callback();
    } else {
      setTimeout(function() {
        waitForEl(wrapperSection, selector, callback);
      }, 100);
    }
  };

  useEffect(() => {
    if (isListener) return;

    setIsListener(true);

    if (isRedeem && wrapper && typeof document != undefined) {
      redeemPropsItem?.forEach((infoCard: any, index: number) => {
        waitForEl(null, `[href="${infoCard.buttonHref}"]`, function() {
          const element = document?.querySelector(
            `[href="${infoCard.buttonHref}"]`
          );

          element?.addEventListener("click", function() {
            dataLayer.push({
              event: "redeemAPromo",
              eventCategory: "Promo",
              eventAction: redeemPropsItem[index].action,
              eventLabel: redeemPropsItem[index].label,
            });
          });
        });
      });
    } else if (isHpSlider && wrapper && typeof document != undefined) {
      redeemPropsItem?.forEach((infoCard: any, index: number) => {
        const wrapperSection: any = wrapper?.current;
        waitForEl(
          wrapperSection,
          `[href="${infoCard.buttonHref}"]`,
          function() {
            const elements = wrapperSection?.querySelectorAll(
              `[href="${infoCard.buttonHref}"]`
            );

            const onClickListener = () => {
              push({
                event: "ga4-sliderClick",
                urlPath: redeemPropsItem[index]?.buttonHref,
              });
            };

            elements.forEach((element: any) => {
              element.addEventListener("click", onClickListener);
            });
          }
        );
      });
    }
  }, [wrapper, typeof document]);

  return (
    <section ref={wrapper}>
      <Analytics children={children} {...propsAnalytics} />
    </section>
  );

  // return (
  //   <section ref={wrapper}>
  //     {isWrapperVisible && (
  //       <Suspense fallback={<></>}>
  //         <AnalyticsLazy children={children} {...propsAnalytics} />
  //       </Suspense>
  //     )}
  //   </section>
  // );
};

AnaliticsWrapper.schema = {
  title: "AnaliticsWrapper",
  description:
    "AnaliticsWrapper allows to wrap any component and send a pixel message",
  type: "object",
  properties: {
    isLeazy: {
      type: "boolean",
      default: true,
      title:
        "Lazy loading of component, if component is at top of page, set to false",
    },
    redeemPropsItem: {
      type: "array",
      title: "redeemPropsItem",
      items: {
        properties: {
          action: {
            type: "string",
            default: "Event Description",
            title: "Event Description",
          },
          label: {
            type: "string",
            default: "Event Label",
            title: "Event Label",
          },
          buttonHref: {
            type: "string",
            default: "Button Href",
            title: "Button Href",
          },
        },
      },
    },
    propsAnalytics: {
      type: "object",
      properties: {
        analyticsProperties: {
          title: "Analytics event",
          enum: ["none", "provide"],
          enumNames: ["No", "Si"],
          widget: {
            "ui:widget": "radio",
          },
          default: "provide",
        },
      },
      dependencies: {
        analyticsProperties: {
          oneOf: [
            {
              properties: {
                analyticsProperties: {
                  enum: ["provide"],
                },
                nameEvent: {
                  type: "string",
                  default: "",
                  title: "Name of analytics event",
                },
                name: {
                  type: "string",
                  default: "data",
                  title: "Name of data",
                },
                data: {
                  type: "array",
                  title: "Group of data",
                  items: {
                    title: "Dato",
                    properties: {
                      title: {
                        type: "string",
                        default: "",
                        title: "Id dato",
                      },
                      value: {
                        type: "string",
                        default: "",
                        title: "Valore per l'id specificato",
                      },
                    },
                  },
                },
                isView: {
                  type: "boolean",
                  default: true,
                  title: "Trigger analytics view event?",
                },
                nameView: {
                  type: "string",
                  default: "",
                  title: "Analytics view event",
                },
              },
            },
            {
              properties: {
                analyticsProperties: {
                  enum: ["none"],
                },
              },
            },
          ],
        },
      },
    },
  },
};

export default AnaliticsWrapper;
