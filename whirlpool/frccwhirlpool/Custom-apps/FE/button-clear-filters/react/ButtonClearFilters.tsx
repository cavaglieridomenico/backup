import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { checkSearchString, clearFilters } from "./utils/generic";
import styles from "./style.css";

interface ButtonClearFiltersProps {}

const ButtonClearFilters: StorefrontFunctionComponent<ButtonClearFiltersProps> =
  ({}) => {
    const [hasFilters, setHasFilters] = useState(false);

    if (window.location !== undefined) {
      let searchString: string = window.location.search;
      useEffect(() => {
        searchString.length > 0 && checkSearchString(searchString)
          ? setHasFilters(true)
          : setHasFilters(false);
      }, [searchString.length]);
    }

    return (
      <>
        {hasFilters && ( //Button to show only when there are applied filters
          <div
            className={styles.containerButtonClearFilters}
            onClick={() => clearFilters()}
          >
            <FormattedMessage id="editor.buttonclearfilters.label" />
          </div>
        )}
      </>
    );
  };

// ButtonClearFilters.schema = {
//   title: "editor.buttonclearfilters.title",
//   description: "editor.buttonclearfilters.description",
//   type: "object",
//   properties: {
//     buttonLabel: {
//       title: "Button clear filters label",
//       description: "Text of the button clear filters",
//       type: "string",
//       default: "очистить фильтры",
//     },
//   },
// };

export default ButtonClearFilters;
