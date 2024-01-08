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
];

function ManualsCarouselCard(card) {
  const { handles } = useCssHandles(CSS_HANDLES);

  const url = useInterpolatedLink(card.path);

  let gaEvent;

  if (card.title === "Zarezerwuj wizytę") {
    gaEvent = "clickBookAppointment";
  } else if (card.title === "Plany ochrony") {
    gaEvent = "clickProtectionPlans";
  }

  return (
    <>
      <div className={handles.ManualsCarouselCard_cardContainer}>
        <div className={handles.ManualsCarouselCard_imageContainer}>
          {card.img && (
            <img src={card.img} className={handles.ManualsCarouselCard_image} />
          )}
        </div>
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
              text={"Dowiedz się więcej"}
              isPrimary={true}
              gaEvent={gaEvent}
              labelGa={"Dowiedz się więcej"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualsCarouselCard;
