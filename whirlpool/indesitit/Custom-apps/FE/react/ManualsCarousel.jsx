import React from "react";
import ManualsCarouselCard from "./ManualsCarouselCard";
import SliderGlide from "./SliderGlide";

const carouselOptions = {
  type: "carousel",
  gap: 64,
  peek: {
    before: 540,
    after: 540,
  },
  perView: 1,
  startAt: 0,
  focusAt: "center",
  breakpoints: {
    1920: {
      perView: 1,
      peek: {
        before: 351,
        after: 351,
      },
    },
    1840: {
      perView: 1,
      peek: {
        before: 320,
        after: 320,
      },
    },
    1640: {
      perView: 1,
      peek: {
        before: 220,
        after: 220,
      },
    },
    1540: {
      perView: 1,
      peek: {
        before: 170,
        after: 170,
      },
    },
    1440: {
      perView: 1,
      peek: {
        before: 120,
        after: 120,
      },
    },
    1366: {
      perView: 1,
      peek: {
        before: 83,
        after: 83,
      },
    },
    1280: {
      perView: 1,
      peek: {
        before: 40,
        after: 40,
      },
    },
    1024: {
      perView: 1,
      gap: 64,
      peek: {
        before: 300,
        after: 300,
      },
    },
    768: {
      perView: 1,
      gap: 32,
      peek: {
        before: 245,
        after: 245,
      },
    },
    414: {
      perView: 1,
      gap: 24,
      peek: {
        before: 58,
        after: 58,
      },
    },
    375: {
      perView: 1,
      gap: 18,
      peek: {
        before: 44,
        after: 44,
      },
    },
    360: {
      perView: 1,
      gap: 16,
      peek: {
        before: 40,
        after: 40,
      },
    },
    320: {
      perView: 1,
      gap: 32,
      peek: {
        before: 22,
        after: 22,
      },
    },
  },
};

const carouselText = [
  {
    title: "Prenota un appuntamento",
    text: "Prenota, modifica o cancella il tuo appuntamento con i nostri esperti Indesit.",
    path: "/assistenza/richiedi-un-intervento",
  },
  {
    title: "Piani di protezione",
    text: "Ricevi una tranquillità extra con il nostro piano di assistenza. La protezione Indesit offre riparazioni su più elettrodomestici per mantenerli come nuovi",
    path: "/assistenza/piani-di-protezione",
  },
];

function ManualsCarousel() {
  return (
    <>
      <style>
        {
          "\
            .single-bullet{\
                cursor:pointer;\
                margin-right: 11px;\
                border-radius: 999px;\
                width: 8px;\
                height: 8px;\
                border: none;\
                background:#0090D0;\
                padding: 0px;\
            }\
            .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_cardContainer {\
                height: 570px;\
                display: flex;\
            }\
            @media screen and (max-width: 765px) {\
                .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_cardContainer {\
                    flex-direction: column;\
                    height: 678px;\
                }\
                .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_rightContainer {\
                    padding: 40px 8px 28px !important;\
                    height: 391px;\
                    justify-contet: flex-start;\
                }\
                .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_imageContainer {\
                    height: 263px;\
                }\
                .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_imageContainer, .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_rightContainer {\
                    width: unset !important;\
                }\
                .glide__slide.slider {\
                    height: 100%;\
                }\
            }\
            .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_imageContainer, .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_rightContainer {\
                width: 50%;\
            }\
            .glide__slide .indesitit-custom-apps-0-x-ManualsCarouselCard_rightContainer {\
                padding: 0 33px 0 88px;\
                display: flex;\
                flex-direction: column;\
                justify-content: center;\
                user-select: none;\
            }\
            .single-bullet.glide__bullet--active {\
                background: #005C92;\
                border-radius: 13px;\
                border: none;\
                width: 21px;\
                height: 8px;\
            }\
            .carousel_0 .indesitit-custom-apps-0-x-ManualsCarouselCard_imageContainer {\
              content: url('https://indesitit.vtexassets.com/assets/vtex/assets-builder/indesitit.indesit-theme/3.0.54/main-service/technician-locator___f0a416e7eebe1cdd541f59f95ea1bfe3.png');\
            }\
            .carousel_1 .indesitit-custom-apps-0-x-ManualsCarouselCard_imageContainer {\
              content: url('https://indesitit.vtexassets.com/assets/vtex/assets-builder/indesitit.indesit-theme/3.0.54/intervention-banner___99e68c01260f0caa3ea71d03b6099df0.png');\
            }\
          "
        }
      </style>
      <SliderGlide options={carouselOptions}>
        {carouselText.map((card, i) => {
          return (
            <>
              <div
                id={"carousel_" + i}
                className={"glide__slide slider carousel_" + i}
              >
                <ManualsCarouselCard
                  title={card.title}
                  text={card.text}
                  path={card.path}
                />
              </div>
            </>
          );
        })}
      </SliderGlide>
    </>
  );
}

export default ManualsCarousel;
