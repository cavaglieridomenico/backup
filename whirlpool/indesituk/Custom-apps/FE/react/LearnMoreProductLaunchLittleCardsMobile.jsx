import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreProductLaunchLittleCardsMobile() {
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
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
            LEARN MORE
          </label>
        </button>
      </div>
    </>
  );
}
