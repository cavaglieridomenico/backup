import React from "react";
import CountdownBlackFriday from "./CountdownBlackFriday"
import Description from "./Description"
import SubscribeForm from "./SubscribeForm"
import { useDevice } from 'vtex.device-detector'
import { CampaignContextProvider } from "./components/CampaignContext"


interface CountdownAppProps {
    countdownDate: string,
    buttonLink: string,
    campaignName: 
    | "form_HP_soldes"
    | "form_LP_soldes"
    | "form_PDP_promo_5%disc"
    | "form_PLP_promo_5%disc"
    | "form_LP_promo_5%disc"
    | "myAcc_promo_5%disc"
    | "checkout_promo_5%disc"
    | "form_HP_blackfriday"
    | "form_LP_blackfriday";
  }
  
  const CountdownApp: StorefrontFunctionComponent<CountdownAppProps> = ({ countdownDate, buttonLink, campaignName }) => {
    const { isMobile } = useDevice()
    return (
      <CampaignContextProvider
      campaign={campaignName !== undefined ? campaignName : ""}
    >{
        isMobile ? (
          <>
            <Description countdownDate = {countdownDate}/>
            <CountdownBlackFriday countdownDate = {countdownDate}/>
            <SubscribeForm countdownDate = {countdownDate} buttonLink={buttonLink} sourceCampaign={campaignName}/>
          </>
        ): (
          <>
            <CountdownBlackFriday countdownDate = {countdownDate}/>
            <Description countdownDate = {countdownDate}/>
            <SubscribeForm countdownDate = {countdownDate} buttonLink={buttonLink} sourceCampaign={campaignName}/>
          </>
        )
      }
      </CampaignContextProvider>
    )
  }

  CountdownApp.schema = {
    title: "CountdownApp",
    description: "CountdownApp component",
    type: 'object',
    properties: {
      countdownDate: {
        title: 'Date start countdown',
        description: 'Date where start the countdown, use a string in this format 2021-12-25T00:00:01',
        type: 'string',
        default: "2021-11-26T00:00:01",
      },
      buttonLink: {
        title: 'Link Button',
        description: 'Link when countdown is finished',
        type: 'string',
        default: "/soldes",
      },
      campaignName: {
        title: "Campaign",
        description: "",
        type: "string",
        enum: [
          "form_HP_promo_5%disc",
          "popup_HP_promo_5%disc",
          "form_PDP_promo_5%disc",
          "form_PLP_promo_5%disc",
          "form_LP_promo_5%disc",
          "myAcc_promo_5%disc",
          "checkout_promo_5%disc",
          "form_HP_blackfriday",
          "form_LP_blackfriday",
          "form_HP_soldes",
          "form_LP_soldes",
        ],
        enumNames: [
          "form_HP_promo_5%disc",
          "popup_HP_promo_5%disc",
          "form_PDP_promo_5%disc",
          "form_PLP_promo_5%disc",
          "form_LP_promo_5%disc",
          "myAcc_promo_5%disc",
          "checkout_promo_5%disc",
          "form_HP_blackfriday",
          "form_LP_blackfriday",
          "form_HP_soldes",
          "form_LP_soldes",
        ],
        default: "form_HP_promo_5%disc",
      },
    },
  }

  export default CountdownApp