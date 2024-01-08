import React from 'react'
import { useRuntime } from "vtex.render-runtime";
import { useCssHandles } from 'vtex.css-handles';

interface SupportButtonsProps {
	buttonsList: ButtonList[]
}

interface ButtonList {
	buttonLabel: string,
	buttonLabelEN: string,
	buttonUrl: string
}

const CSS_HANDLES = [
	"supportCenterButtonContainer",
	"supportCenterButton"
]

function openButtonLink(link: string) {
	window.location.href = link;
}

const SupportCenterButtons: StorefrontFunctionComponent<SupportButtonsProps> = ({buttonsList}: SupportButtonsProps) => {
	const {
     culture: { locale },
  } = useRuntime();
  const lang = locale == "it-IT" ? "_it" : "_en";
  const handles = useCssHandles(CSS_HANDLES);
		return (
      <div className={handles.supportCenterButtonContainer}>
        {buttonsList?.map((button) => (
          <div
            className={handles.supportCenterButton}
            onClick={() => {
              openButtonLink(button.buttonUrl);
            }}
          >
            {lang === "_it" ? button.buttonLabel : button.buttonLabelEN}
          </div>
        ))}
      </div>
    );
}

SupportCenterButtons.schema = {
  title: "Support buttons list",
  description: "Add or remove button to be displayed inside support section",
  type: "object",
  properties: {
    buttonsList: {
      title: "Buttons list",
      type: "array",
      items: {
        properties: {
          buttonLabel: {
            title: "Button label",
            type: "string",
          },
					buttonLabelEN: {
            title: "Button label english",
            type: "string",
          },
          buttonUrl: {
            title: "Button url",
            type: "string",
          },
        },
      },
    },
  },
};

export default SupportCenterButtons

