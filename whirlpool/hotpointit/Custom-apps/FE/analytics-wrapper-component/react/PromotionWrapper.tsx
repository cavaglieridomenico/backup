import React, { Suspense, useRef } from "react";
import Analytics, { AnalyticsWrapperProps } from "./Analytics";
import useIntersectionObserver from "./utils/useIntersectionObserver";

interface PromotionAnalType {
  id: string;
  name: string;
  creative: string;
  position: string;
}

interface AnalyticsWrapperType {
  isLeazy: boolean;
  propsAnalytics: PromotionAnalType;
  children: any;
}
const PromotionWrapper: StorefrontFunctionComponent<AnalyticsWrapperType> = ({
  isLeazy = true,
  propsAnalytics,
  children,
}: AnalyticsWrapperType) => {
  const createProps = (promotionProps: PromotionAnalType, child: any) => {
    let keys = Object.keys(promotionProps);
    let data: any[] = [];
    keys.map((key: string) => {
      data.push({title:key,value:(promotionProps as any)[key]});
    });
    let objToSendAsProps: AnalyticsWrapperProps = {
      analyticsProperties: 'provide',
      nameEvent: "promotionClick",
      name: "promotions",
      isView: true,
      nameView: "promoView",
      data: data,
      children: child,
    };
    return objToSendAsProps;
  };

  if (!isLeazy) {
    return <Analytics {...createProps(propsAnalytics, children)} />;
  }
  const wrapper = useRef(null);
  const AnalyticsLazy = React.lazy(() => import("./Analytics"));
  const isWrapperVisible = useIntersectionObserver(wrapper);

  return (
    <section ref={wrapper}>
      {isWrapperVisible && (
        <Suspense fallback={<></>}>
          <AnalyticsLazy {...createProps(propsAnalytics, children)} />
        </Suspense>
      )}
    </section>
  );
};

PromotionWrapper.schema = {
  title: "PromotionAnalyticsWrapper",
  description: "PromotionAnalyticsWrapper permette il wrapper di qualsiasi componente",
  type: "object",
  properties: {
    isLeazy: {
      type: "boolean",
      default: true,
      title: "Caricamento lento del componente",
    },
    propsAnalytics: {
      type: "object",
      properties: {
        id: {
          type: "string",
          default: "",
          title: "Id promozione",
        },
        name: {
          type: "string",
          default: "",
          title: "Nome della promozione",
        },
        position: {
          type: "string",
          default: "",
          title: "Posizione promozione",
        },
        creative: {
          type: "string",
          default: "",
          title: "Creative della promozione",
        },
      },
    },
  },
};

export default PromotionWrapper;
