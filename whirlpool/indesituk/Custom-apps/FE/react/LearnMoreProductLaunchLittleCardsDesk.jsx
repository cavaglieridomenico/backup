import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreProductLaunchLittleCardsDesk() {
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
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
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreProductLaunchLittleCardsDesk__singleCardDescription
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
