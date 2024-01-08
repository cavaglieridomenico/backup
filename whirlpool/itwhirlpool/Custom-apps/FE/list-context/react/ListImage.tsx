import React from "react";
import { ImagesSchema } from "./typings/images";
import { ImageList } from "vtex.store-image";
import { SliderLayout } from "vtex.slider-layout";
import { useDevice } from "vtex.device-detector";
import { ImagesFromSchema } from "./ImagesFromSchema";
import styles from "./style.css";
import { getCss } from "./utils/cssFunction";

interface ListImageProps {
  interfaceType: "slider" | "list";
  images: ImagesSchema;
  height?: number;
  itemsPerPage?: any;
  showNavigationArrows?: "mobileOnly" | "desktopOnly" | "always" | "never";
  showPaginationDots?: "mobileOnly" | "desktopOnly" | "always" | "never";
  fullWidth?: boolean;
  blockClass?: any;
}

const ListImage: StorefrontFunctionComponent<ListImageProps> = ({
  interfaceType = "list",
  images,
  height = 420,
  itemsPerPage = { desktop: 1, tablet: 1, phone: 1 },
  showNavigationArrows = "always",
  showPaginationDots = "always",
  fullWidth = true,
  blockClass,
}: ListImageProps) => {
  const { isMobile } = useDevice();

  const isSlider = interfaceType == "slider";
  const slider = isSlider && (
    <ImageList
      images={images}
      preload={true}
      height={height}
      children={
        <SliderLayout
          itemsPerPage={itemsPerPage}
          infinite={true}
          blockClass={blockClass}
          showNavigationArrows={showNavigationArrows}
          showPaginationDots={showPaginationDots}
          fullWidth={fullWidth}
        />
      }
    />
  );
  const imagesToPrint =
    !isSlider && ImagesFromSchema(images, isMobile, height, true);

  return (
    <React.Fragment>
      {slider && slider}
      {imagesToPrint && <div className={styles.container+getCss(styles.container,blockClass)}>{imagesToPrint}</div>}
    </React.Fragment>
  );
};

ListImage.schema = {
  title: "ListImage",
  description: "ListImage component",
  type: "object",
  properties: {
    height: {
      type: "number",
      default: 420,
      title: "Massima altezza immagini",
    },
    images: {
      type: "array",
      title: "Lista di immagini",
      items: {
        properties: {
          image: {
            type: "string",
            default: "",
            title: "admin/editor.image-list.images.image.title",
            widget: {
              "ui:widget": "image-uploader",
            },
          },
          mobileImage: {
            type: "string",
            default: "",
            title: "admin/editor.image-list.images.mobileImage.title",
            widget: {
              "ui:widget": "image-uploader",
            },
          },
          description: {
            type: "string",
            default: "",
            title: "admin/editor.image-list.images.description.title",
          },
          title: {
            title: "admin/editor.image-list.images.title.title",
            type: "string",
            default: "",
          },
          link: {
            title: "",
            type: "object",
            properties: {
              url: {
                type: "string",
                default: "",
              },
              attributeNofollow: {
                type: "boolean",
                default: "",
              },
              attributeTitle: {
                type: "string",
                default: undefined,
              },
              openNewTab: {
                type: "boolean",
                default: undefined,
              },
              newTab: {
                type: "boolean",
                default: undefined,
              },
            },
          },
          width: {
            title: "admin/editor.image-list.images.width.title",
            description: "admin/editor.image-list.images.width.description",
            type: "string",
            default: "100%",
          },
          analyticsProperties: {
            title: "admin/editor.image.analytics.title",
            description: "admin/editor.image.analytics.description",
            enum: ["none", "provide"],
            enumNames: [
              "admin/editor.image.analytics.none",
              "admin/editor.image.analytics.provide",
            ],
            widget: {
              "ui:widget": "radio",
            },
            default: "none",
          },
        },
        dependencies: {
          analyticsProperties: {
            oneOf: [
              {
                properties: {
                  analyticsProperties: {
                    enum: ["provide"],
                  },
                  promotionId: {
                    title: "admin/editor.image.analytics.promotionId",
                    type: "string",
                    default: "",
                  },
                  promotionName: {
                    title: "admin/editor.image.analytics.promotionName",
                    type: "string",
                    default: "",
                  },
                  promotionPosition: {
                    title: "admin/editor.image.analytics.promotionPosition",
                    type: "string",
                    default: "",
                  },
                },
              },
              {
                properties: {
                  analyticsProperties: {
                    enum: ["none"],
                  },
                },
              },
            ],
          },
        },
      },
    },
    interfaceType: {
      title: "Tipologia interfaccia",
      type: "string",
      enum: ["slider", "list"],
      enumNames: ["slider", "list"],
      enumValues: ["slider", "list"],
      default: "list",
    },
  },
  dependencies: {
    interfaceType: {
      oneOf: [
        {
          properties: {
            interfaceType: {
              enum: ["slider"],
            },
            itemsPerPage: {
              title: "Elementi per device",
              type: "object",
              properties: {
                desktop: {
                  type: "number",
                  default: 1,
                },
                tablet: {
                  type: "number",
                  default: 1,
                },
                phone: {
                  type: "number",
                  default: 1,
                },
              },
            },
            infinite: {
              title: "Scorrimento infinito slider",
              type: "boolean",
              default: true,
            },
            showNavigationArrows: {
              title: "Frecce slider",
              type: "string",
              enum: ["mobileOnly", "desktopOnly", "always", "never"],
              enumNames: ["mobileOnly", "desktopOnly", "always", "never"],
              enumValues: ["mobileOnly", "desktopOnly", "always", "never"],
              default: "always",
            },
            showPaginationDots: {
              title: "Dot slider",
              type: "string",
              enum: ["mobileOnly", "desktopOnly", "always", "never"],
              enumNames: ["mobileOnly", "desktopOnly", "always", "never"],
              enumValues: ["mobileOnly", "desktopOnly", "always", "never"],
              default: "always",
            },
          },
        },
        {
          properties: {
            interfaceType: {
              enum: ["list"],
            },
          },
        },
      ],
    },
  },
};

export default ListImage;
