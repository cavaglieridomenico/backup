
import React, { useState } from 'react';
import style from './style.css';
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = ["filterLabelsContainer", "filterLabel", "hideFilterLabel", "showMore"] as const;

interface FilterLabelProps {
  labels: LabelProps[]
}

interface LabelProps {
  buttonLabel: string;
  buttonLink: string
}

const FilterLabel: StorefrontFunctionComponent<FilterLabelProps> = ({ labels }) => {
  const [showMoreLabels, setShowMoreLabels] = useState<boolean>(false);
  const handles = useCssHandles(CSS_HANDLES);

  const handleShowMoreLabels = () => {
    setShowMoreLabels(!showMoreLabels)
  };

  return (
    <div className={handles.filterLabelsContainer}>
      {labels && labels.map((item: LabelProps, index: number) => (
        <a key={index} className={`${style.filterLabel} ${(!showMoreLabels) ? style.hideFilterLabel : null}`} href={item.buttonLink}>
          {item.buttonLabel}
        </a>
      ))}
      {(labels?.length > 7) ? <p className={handles.showMore} onClick={() => handleShowMoreLabels()}>{!showMoreLabels ? 'Mehr anzeigen' : 'Zeige weniger'}</p> : null}
    </div>
  )
}

FilterLabel.schema = {
  title: "Filter label",
  type: "object",
  properties: {
    labels: {
      type: "array",
      title: 'Array section',
      items: {
        properties: {
          buttonLink: {
            title: "Button Link",
            type: "string"
          },
          buttonLabel: {
            title: "Button Label",
            type: "string"
          }
        }
      }
    }
  }

}

export default FilterLabel
