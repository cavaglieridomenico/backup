import React, { useState } from 'react';
import style from './style.css';
import { useDevice } from 'vtex.device-detector';

interface FilterLabelProps {
  labels: LabelProps[]
  showMoreButton: string
  showLessButton: string
}

interface LabelProps {
  buttonLabel: string;
  buttonLink: string
}

const FilterLabel: StorefrontFunctionComponent<FilterLabelProps> = ({ showMoreButton, showLessButton, labels }) => {
  const [showMoreLabels, setShowMoreLabels] = useState<boolean>(false);
  const { isMobile } = useDevice();

  const handleShowMoreLabels = () => {
    setShowMoreLabels(!showMoreLabels)
  };  

  return (
    <div className={style.filterLabelsContainer}>
      {labels && labels.map((item: LabelProps, index: number) => (
        <a key={index} className={`${style.filterLabel} ${(!showMoreLabels && !isMobile) ? style.hideFilterLabel : null}`} href={item.buttonLink}>
          {item.buttonLabel}
        </a>
      ))}
      {(!isMobile && labels?.length > 7) ? <p className={style.showMore} onClick={() => handleShowMoreLabels()}>{!showMoreLabels ? showMoreButton : showLessButton}</p> : null}
    </div>
  )
}

FilterLabel.schema = {
  title: "Filter label",
  type: "object",
  properties: {
    showMoreButton: {
      type: "string",
      title: 'showMoreButton',
      default: 'Show More'
    },
    showLessButton: {
      type: "string",
      title: 'showLessButton',
      default: 'Show Less'
    },
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
