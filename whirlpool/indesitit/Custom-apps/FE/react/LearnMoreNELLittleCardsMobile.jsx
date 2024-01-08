import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreNELLittleCardsMobile() {
  const CSS_HANDLES = [
    "LearnMoreNELLittleCardsMobile__learnMoreButtonContainer",
    "LearnMoreNELLittleCardsMobile__learnMoreButton",
    "LearnMoreNELLittleCardsMobile__learnMoreButtonLabel",
    "LearnMoreNELLittleCardsMobile__littleCardsMaxiContainerHidden",
    "LearnMoreNELLittleCardsMobile__littleCardsMaxiContainerVisible",
    "LearnMoreNELLittleCardsMobile__littleCardsContainer",
    "LearnMoreNELLittleCardsMobile__threeCardsRow",
    "LearnMoreNELLittleCardsMobile__threeCardsRowLast",
    "LearnMoreNELLittleCardsMobile__singleCardContainer",
    "LearnMoreNELLittleCardsMobile__singleCard",
    "LearnMoreNELLittleCardsMobile__singleCardTitle",
    "LearnMoreNELLittleCardsMobile__singleCardDescription",
    "LearnMoreNELLittleCardsMobile__valuesApplyToQuarterContainer",
    "LearnMoreNELLittleCardsMobile__valuesApplyToQuarterLabel",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [isLittleCardsVisible, setIsLittleCardsVisible] = useState(false);
  useEffect(() => {
    showMoreCardsNELMobile();
    return () => {};
  }, []);

  function showMoreCardsNELMobile() {}
  return (
    <>
      <div
        className={
          isLittleCardsVisible
            ? handles.LearnMoreNELLittleCardsMobile__littleCardsMaxiContainerVisible
            : handles.LearnMoreNELLittleCardsMobile__littleCardsMaxiContainerHidden
        }
      >
        <div
          className={
            handles.LearnMoreNELLittleCardsMobile__littleCardsContainer
          }
        >
          {/*first three card*/}
          {/*first card*/}
          <div className={handles.LearnMoreNELLittleCardsMobile__threeCardsRow}>
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
          </div>
          {/*second group three cards*/}
          {/*first card*/}
          <div className={handles.LearnMoreNELLittleCardsMobile__threeCardsRow}>
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
          </div>
          {/*third group three cards*/}
          {/*first card*/}
          <div
            className={handles.LearnMoreNELLittleCardsMobile__threeCardsRowLast}
          >
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsMobile__singleCardContainer
              }
            >
              <div
                className={handles.LearnMoreNELLittleCardsMobile__singleCard}
              >
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsMobile__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            handles.LearnMoreNELLittleCardsMobile__valuesApplyToQuarterContainer
          }
        >
          <label
            className={
              handles.LearnMoreNELLittleCardsMobile__valuesApplyToQuarterLabel
            }
          >
            * Values apply to quarter, half and full loads.
          </label>
        </div>
      </div>

      <div
        className={
          handles.LearnMoreNELLittleCardsMobile__learnMoreButtonContainer
        }
      >
        <button
          className={handles.LearnMoreNELLittleCardsMobile__learnMoreButton}
          onClick={() => {
            setIsLittleCardsVisible(!isLittleCardsVisible);
          }}
        >
          <label
            className={
              handles.LearnMoreNELLittleCardsMobile__learnMoreButtonLabel
            }
          >
            {isLittleCardsVisible ? "SCOPRI DI MENO" : "SCOPRI DI PIÚ"}
          </label>
        </button>
      </div>
    </>
  );
}
