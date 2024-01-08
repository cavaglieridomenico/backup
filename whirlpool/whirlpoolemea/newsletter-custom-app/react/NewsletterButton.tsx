/**
 * @param {buttonText,linkUrl,campaign}
 * @returns React.Fragment rapresenting the Newsletter Button that redirect you to Newsletter Landing Page
 */

import React from "react";
import { Button } from "vtex.styleguide";
import { useRuntime } from "vtex.render-runtime";
import { useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { useCssHandles } from "vtex.css-handles";
import { CSS_HANDLES, messages } from "./utils/utils";

interface NewsletterButtonProps {
  buttonText: string;
  linkUrl?: string;
  campaign?: string;
  pixelEventName?: string;
}

const NewsletterButton: StorefrontFunctionComponent<NewsletterButtonProps> = ({
  buttonText,
  linkUrl,
  campaign,
  pixelEventName = "newsletterLink",
}: NewsletterButtonProps) => {
  /**
   * handles const for the style
   */
  const handles = useCssHandles(CSS_HANDLES);
  /**
   * formatMessage function for FormattedMessages
   */
  const { formatMessage } = useIntl();
  /**
   * navigate function to redirect to Newsletter Landing Page
   */
  const { navigate } = useRuntime();
  /**
   * push function from usePixel for pixel events
   */
  const { push } = usePixel();

  /**
   * handle click on NewsletterButton
   */
  const handleOnClick = () => {
    //GA Event
    push({
      event: pixelEventName,
      text: buttonText ?? formatMessage(messages.newsletterButtonText),
    });
    //Redirect to linkUrl
    navigate({
      to: linkUrl,
      query: campaign ? `campaign=${campaign}` : "",
    });
  };

  return (
    <React.Fragment>
      <div
        className={`${handles["container__btn"]} flex justify-center items-center`}
      >
        <Button onClick={handleOnClick}>
          {buttonText ?? formatMessage(messages.newsletterButtonText)}
        </Button>
      </div>
    </React.Fragment>
  );
};

NewsletterButton.schema = {
  title: "Newsletter Button",
  description:
    "Button for the Newsletter, it will redirect you to Newsletter Landing Page",
  type: "object",
  properties: {
    buttonText: {
      title: "Button Text",
      description: "Text shown in the Newsletter button",
      type: "string",
    },
    linkUrl: {
      title: "Link Url",
      description: "Link to the Newsletter Landing page",
      type: "string",
    },
    campaign: {
      title: "Campaign",
      description: "Campaign that will be used in Newsletter Form Subscription",
      type: "string",
    },
  },
};

export default NewsletterButton;
