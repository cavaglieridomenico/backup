import React, { useEffect, useState } from "react";
import { ExtensionPoint } from "vtex.render-runtime";
import { IconInfo, Modal } from "vtex.styleguide";
import { useDevice } from "vtex.device-detector";
import style from "./style.css";

interface InfoTooltip {
  showModalMobile: boolean;
  top: string;
  bottom: string;
  right: string;
  left: string;
  maxWidth: string;
}

const InfoTooltip: StorefrontFunctionComponent<InfoTooltip> = ({
  showModalMobile,
  top,
  bottom,
  right,
  left,
}) => {
  const [visible, setVisible] = useState<Boolean>(false);
  const { isMobile } = useDevice();

  useEffect(() => {
    if (typeof window != undefined) {
      window.addEventListener("click", () => {
        visible && setVisible(false);
      });
    }
  }, [typeof window, visible]);

  return (
    <>
      {!isMobile ? (
        <div
          className={style.tooltipMainContainerDesktop}
          onMouseLeave={() => setVisible(false)}
        >
          <span
            className="c-on-base pointer"
            onMouseEnter={() => setVisible(true)}
          >
            <IconInfo size={15} />
          </span>

          {visible && (
            <div
              className={style.tooltipTextContainer}
              style={{
                top: top,
                bottom: bottom,
                right: right,
                left: left,
              }}
            >
              <noindex>
                <ExtensionPoint id="rich-text" />
              </noindex>
            </div>
          )}
        </div>
      ) : (
        <>
          <a href="javascript:void(0);" onClick={(e) => e.stopPropagation()}>
            <span
              className={`${style.tooltipMainContainerMobile} c-on-base pointer`}
              onClick={() => setVisible(!visible)}
            >
              <IconInfo size={15} />
            </span>
          </a>

          {showModalMobile && (
            <Modal isOpen={visible} onClose={() => setVisible(false)} centered>
              <noindex>
                <ExtensionPoint id="rich-text" />
              </noindex>
            </Modal>
          )}

          {visible && !showModalMobile && (
            <a href="javascript:void(0);" onClick={(e) => e.stopPropagation()}>
              <div
                className={style.tooltipTextContainerMobile}
                style={{
                  top: top,
                  bottom: bottom,
                  right: right,
                  left: left,
                }}
                onClick={() => setVisible(false)}
              >
                <noindex>
                  <ExtensionPoint id="rich-text" />
                </noindex>
              </div>
            </a>
          )}
        </>
      )}
    </>
  );
};

InfoTooltip.schema = {
  title: "editor.tooltip.title",
  description: "editor.tooltip.description",
  type: "object",
  properties: {
    showModalMobile: {
      title: "Modal Mobile ",
      description: "Set to true to show the modal on MOBILE layout",
      default: false,
      type: "boolean",
    },
    top: {
      title: "Tooltip Position ",
      description: "Set the Top position of the Tooltip",
      default: "",
      type: "string",
    },
    bottom: {
      title: "Tooltip Position ",
      description: "Set the bottom position of the Tooltip",
      default: "",
      type: "string",
    },
    right: {
      title: "Tooltip Position ",
      description: "Set the right position of the Tooltip",
      default: "",
      type: "string",
    },
    left: {
      title: "Tooltip Position ",
      description: "Set the left position of the Tooltip",
      default: "",
      type: "string",
    },
  },
};
export default InfoTooltip;
