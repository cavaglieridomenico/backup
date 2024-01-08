import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";
import ButtonAssistenza from "./ButtonAssistenza";

const CSS_HANDLES = [
  "ManualsCarouselCard_cardContainer",
  "ManualsCarouselCard_imageContainer",
  "ManualsCarouselCard_image",
  "ManualsCarouselCard_rightContainer",
  "ManualsCarouselCard_cardTitle",
  "ManualsCarouselCard_cardDescription",
  "ManualsCarouselCard_cardButton",
  "ManualsCarouselCard_cardButtonContainer",
];

function ManualsCarouselCard(card) {
  const { handles } = useCssHandles(CSS_HANDLES);

  const url = useInterpolatedLink(card.path);

  let gaEvent;

  if (card.title === "Prenota un appuntamento") {
    gaEvent = "clickBookAppointment";
  } else if (card.title === "Piani di protezione") {
    gaEvent = "clickProtectionPlans";
  }

  return (
    <>
      <div className={handles.ManualsCarouselCard_cardContainer}>
        <div className={handles.ManualsCarouselCard_imageContainer}></div>
        <div className={handles.ManualsCarouselCard_rightContainer}>
          <p className={handles.ManualsCarouselCard_cardTitle}>{card.title}</p>
          {card.text && (
            <p className={handles.ManualsCarouselCard_cardDescription}>
              {card.text}
            </p>
          )}
          <div className={handles.ManualsCarouselCard_cardButtonContainer}>
            <ButtonAssistenza
              src={url}
              isBlank={true}
              text={"Scopri di più"}
              isPrimary={true}
              gaEvent={gaEvent}
              labelGa={"Scopri di più"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualsCarouselCard;
