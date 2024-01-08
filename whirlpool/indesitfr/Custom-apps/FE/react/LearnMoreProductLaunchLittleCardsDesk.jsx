import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreProductLaunchLittleCardsDesk({
  firstTitle,
    firstDescription,
    secondTitle,
    secondDescription,
    thirdTitle,
    thirdDescription,
    forthTitle,
    forthDescription,
    fifthTitle,
    fifthDescription,
    sixthTitle,
    sixthDescription
}) {
  const CSS_HANDLES = [
    "LearnMoreProductLaunchLittleCardsDesk__learnMoreButtonContainer",
    "LearnMoreProductLaunchLittleCardsDesk__learnMoreButton",
    "LearnMoreProductLaunchLittleCardsDesk__learnMoreButtonLabel",
    "LearnMoreProductLaunchLittleCardsDesk__littleCardsMaxiContainerHidden",
    "LearnMoreProductLaunchLittleCardsDesk__littleCardsMaxiContainerVisible",
    "LearnMoreProductLaunchLittleCardsDesk__littleCardsContainer",
    "LearnMoreProductLaunchLittleCardsDesk__threeCardsRow",
    "LearnMoreProductLaunchLittleCardsDesk__singleCardContainer",
    "LearnMoreProductLaunchLittleCardsDesk__singleCard",
    "LearnMoreProductLaunchLittleCardsDesk__singleCardTitle",
    "LearnMoreProductLaunchLittleCardsDesk__singleCardDescription",
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
            ? handles.LearnMoreProductLaunchLittleCardsDesk__littleCardsMaxiContainerVisible
            : handles.LearnMoreProductLaunchLittleCardsDesk__littleCardsMaxiContainerHidden
        }
      >
        <div
          className={
            handles.LearnMoreProductLaunchLittleCardsDesk__littleCardsContainer
          }
        >
          {/*first three card*/}
          {/*first card*/}
          <div
            className={
              handles.LearnMoreProductLaunchLittleCardsDesk__threeCardsRow
            }
          >
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsDesk__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsDesk__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardTitle
                  }
                >
                  {firstTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  {firstDescription}
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsDesk__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsDesk__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardTitle
                  }
                >
                 {secondTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  {secondDescription}
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsDesk__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsDesk__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardTitle
                  }
                >
                 {thirdTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  {thirdDescription}
                </span>
              </div>
            </div>
          </div>
          {/*second group three cards*/}
          {/*first card*/}
          <div
            className={
              handles.LearnMoreProductLaunchLittleCardsDesk__threeCardsRow
            }
          >
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsDesk__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsDesk__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardTitle
                  }
                >
                  {forthTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  {forthDescription}
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsDesk__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsDesk__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardTitle
                  }
                >
                  {fifthTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                 {fifthDescription}
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreProductLaunchLittleCardsDesk__singleCardContainer
              }
            >
              <div
                className={
                  handles.LearnMoreProductLaunchLittleCardsDesk__singleCard
                }
              >
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardTitle
                  }
                >
                  {sixthTitle}
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                 {sixthDescription}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          handles.LearnMoreProductLaunchLittleCardsDesk__learnMoreButtonContainer
        }
      >
        <button
          className={
            handles.LearnMoreProductLaunchLittleCardsDesk__learnMoreButton
          }
          onClick={() => {
            setIsLittleCardsVisible(!isLittleCardsVisible);
          }}
        >
          <label
            className={
              handles.LearnMoreProductLaunchLittleCardsDesk__learnMoreButtonLabel
            }
          >
            LEARN MORE
          </label>
        </button>
      </div>
    </>
  );
}


LearnMoreProductLaunchLittleCardsDesk.schema = {
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
    },
  forthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Maximum load capacity"
    },
  forthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Quick description of the specific value quick description"
    },
  fifthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Eco 40-60"
    },
  fifthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Duration of “Eco 40-60” cycle program in full load conditions"
    },
  sixthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Weighted energy consumption"
    },
  sixthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"in litres/operating cycle (in Eco 40-60 program)"
    }
  }
}