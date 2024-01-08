import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreNELLittleCardsDesk() {
  const CSS_HANDLES = [
    "LearnMoreNELLittleCardsDesk__learnMoreButtonContainer",
    "LearnMoreNELLittleCardsDesk__learnMoreButton",
    "LearnMoreNELLittleCardsDesk__learnMoreButtonLabel",
    "LearnMoreNELLittleCardsDesk__littleCardsMaxiContainerHidden",
    "LearnMoreNELLittleCardsDesk__littleCardsMaxiContainerVisible",
    "LearnMoreNELLittleCardsDesk__littleCardsContainer",
    "LearnMoreNELLittleCardsDesk__threeCardsRow",
    "LearnMoreNELLittleCardsDesk__threeCardsRowLast",
    "LearnMoreNELLittleCardsDesk__singleCardContainer",
    "LearnMoreNELLittleCardsDesk__singleCard",
    "LearnMoreNELLittleCardsDesk__singleCardTitle",
    "LearnMoreNELLittleCardsDesk__singleCardDescription",
    "LearnMoreNELLittleCardsDesk__valuesApplyToQuarterContainer",
    "LearnMoreNELLittleCardsDesk__valuesApplyToQuarterLabel",
    "LearnMoreNELLittleCardsDesk__valuesApplyToQuarterContainer",
    "LearnMoreNELLittleCardsDesk__valuesApplyToQuarterLabel"
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [isLittleCardsVisible, setIsLittleCardsVisible] = useState(false);
  useEffect(() => {
    showMoreCardsNELDesk();
    return () => {};
  }, []);

  function showMoreCardsNELDesk() {}
  return (
    <>
      <div
        className={
          isLittleCardsVisible
            ? handles.LearnMoreNELLittleCardsDesk__littleCardsMaxiContainerVisible
            : handles.LearnMoreNELLittleCardsDesk__littleCardsMaxiContainerHidden
        }
      >
        <div
          className={handles.LearnMoreNELLittleCardsDesk__littleCardsContainer}
        >
          {/*first three card*/}
          {/*first card*/}
          <div className={handles.LearnMoreNELLittleCardsDesk__threeCardsRow}>
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
          </div>
          {/*second group three cards*/}
          {/*first card*/}
          <div className={handles.LearnMoreNELLittleCardsDesk__threeCardsRow}>
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*third card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
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
            className={handles.LearnMoreNELLittleCardsDesk__threeCardsRowLast}
          >
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*second card*/}
            <div
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
                  }
                >
                  Descrizione test
                </span>
              </div>
            </div>
            {/*third card last slide invisible for alignement*/}
            <div
              style={{ visibility: "hidden" }}
              className={
                handles.LearnMoreNELLittleCardsDesk__singleCardContainer
              }
            >
              <div className={handles.LearnMoreNELLittleCardsDesk__singleCard}>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardTitle
                  }
                >
                  Titolo test &nbsp;
                </span>
                <span
                  className={
                    handles.LearnMoreNELLittleCardsDesk__singleCardDescription
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
            handles.LearnMoreNELLittleCardsDesk__valuesApplyToQuarterContainer
          }
        >
          <label
            className={
              handles.LearnMoreNELLittleCardsDesk__valuesApplyToQuarterLabel
            }
          >
            * Values apply to quarter, half and full loads.
          </label>
        </div>
      </div>

      <div
        className={
          handles.LearnMoreNELLittleCardsDesk__learnMoreButtonContainer
        }
      >
        <button
          className={handles.LearnMoreNELLittleCardsDesk__learnMoreButton}
          onClick={() => {
            setIsLittleCardsVisible(!isLittleCardsVisible);
          }}
        >
          <label
            className={
              handles.LearnMoreNELLittleCardsDesk__learnMoreButtonLabel
            }
          >
            {isLittleCardsVisible ? "SCOPRI DI MENO" : "SCOPRI DI PIÚ"}
          </label>
        </button>
      </div>
    </>
  );
}
