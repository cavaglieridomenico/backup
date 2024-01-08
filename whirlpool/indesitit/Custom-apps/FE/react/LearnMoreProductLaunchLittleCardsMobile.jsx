import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreProductLaunchLittleCardsMobile({
  firstTitle,
    firstDescription,
    secondTitle,
    secondDescription,
    thirdTitle,
    thirdDescription,
}) {
  const CSS_HANDLES = [
    "LearnMoreProductLaunchLittleCardsMobile__learnMoreButtonContainer",
    "LearnMoreProductLaunchLittleCardsMobile__learnMoreButton",
    "LearnMoreProductLaunchLittleCardsMobile__learnMoreButtonLabel",
    "LearnMoreProductLaunchLittleCardsMobile__littleCardsMaxiContainerHidden",
    "LearnMoreProductLaunchLittleCardsMobile__littleCardsMaxiContainerVisible",
    "LearnMoreProductLaunchLittleCardsMobile__littleCardsContainer",
    "LearnMoreProductLaunchLittleCardsMobile__threeCardsRow",
    "LearnMoreProductLaunchLittleCardsMobile__singleCardContainer",
    "LearnMoreProductLaunchLittleCardsMobile__singleCard",
    "LearnMoreProductLaunchLittleCardsMobile__singleCardTitle",
    "LearnMoreProductLaunchLittleCardsMobile__singleCardDescription",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [isLittleCardsVisible, setIsLittleCardsVisible] = useState(false);
  useEffect(() => {
    showMoreCards();
    return () => {};
  }, []);

  function showMoreCards() {}
  return (
    <>
      <div
        className={
          isLittleCardsVisible
            ? handles.LearnMoreProductLaunchLittleCardsMobile__littleCardsMaxiContainerVisible
            : handles.LearnMoreProductLaunchLittleCardsMobile__littleCardsMaxiContainerHidden
        }
      >
        <div
          className={
            handles.LearnMoreProductLaunchLittleCardsMobile__littleCardsContainer
          }
        >
          {/*first three card*/}
          {/*first card*/}
          <div
            className={
              handles.LearnMoreProductLaunchLittleCardsMobile__threeCardsRow
            }
          >
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsMobile__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardTitle
                  }
                >
                 {firstTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardDescription
                  }
                >
                 {firstDescription}
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsMobile__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardTitle
                  }
                >
                 {secondTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardDescription
                  }
                >
                  {secondDescription}
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsMobile__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardTitle
                  }
                >
                  {thirdTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardDescription
                  }
                >
                  {thirdDescription}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          handles.LearnMoreProductLaunchLittleCardsMobile__learnMoreButtonContainer
        }
      >
        <button
          className={
            handles.LearnMoreProductLaunchLittleCardsMobile__learnMoreButton
          }
          onClick={() => {
            setIsLittleCardsVisible(!isLittleCardsVisible);
          }}
        >
          <label
            className={
              handles.LearnMoreProductLaunchLittleCardsMobile__learnMoreButtonLabel
            }
          >
            {isLittleCardsVisible ? "SCOPRI DI MENO" : "SCOPRI DI PIÚ" }
          </label>
        </button>
      </div>
    </>
  );
}

LearnMoreProductLaunchLittleCardsMobile.schema = {
  title: 'titolo e descrizione cards',
  type: 'object',
  properties: {
      firstTitle:{
          type:"string",
          description:"per la modifica del primo titolo",
          title:"primo titolo",
          default:"QR code"
        },
  firstDescription:{
      type:"string",
      description:"per la modifica della prima descrizione",
      title:"prima descrizione",
      default:"Quick description of the specific value quick description of the specific value"
    },
  secondTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Energy efficiency class*"
    },
  secondDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Quick description of the specific value quick description"
    },
  thirdTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Weighted energy consumption"
    },
  thirdDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"in kWh/100 operating cycles (in Eco 40-60 program)"
    }
  }
}
