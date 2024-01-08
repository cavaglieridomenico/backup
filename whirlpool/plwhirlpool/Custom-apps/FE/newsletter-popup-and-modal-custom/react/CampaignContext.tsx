import React, { createContext, useState } from "react";

interface CampaignContextInterface {
  children: any;
  campaign: string;
}

const initailValue = (campaign: string) => {
  const [campaignState, setcampaignState] = useState(campaign);

  return {
    campaignState,
    setcampaignState,
  };
};

const CampaignContext = createContext({} as ReturnType<typeof initailValue>);

const CampaignContextProvider = ({
  children,
  campaign,
}: CampaignContextInterface) => {
  //const [campaignState, setcampaignState] = useState(campaign);
  return (
    <CampaignContext.Provider value={initailValue(campaign)}>
      {children}
    </CampaignContext.Provider>
  );
};

export { CampaignContext, CampaignContextProvider };
