import React from "react";
import style from "./style.css";
import { useProduct } from "vtex.product-context";

interface ImageProps {
  specificationName: string;
  imageLink: string;
  label?: string;
  labelWithHref: boolean;
  target?: string;
  isPrevent: boolean;
}

const findSpecification = (
  specificationName: string,
  specificationGropu: any
) => {
  return specificationGropu == undefined
    ? []
    : specificationGropu.filter((e: any) => e.name == specificationName);
};
const getLabel = (label: string, specificationGropu: any) => {
  if (label.split("/").length > 1) {
    var result = findSpecification(label.split("/")[1], specificationGropu);
    return result.length > 0 ? result[0].values[0] : "";
  } else {
    return label;
  }
};

const PreventEvent = (isPrevent: boolean, e: any) => {
  if (isPrevent) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }
};

const putLink = (
  children: any,
  link: string,
  specifications: any,
  target: string
) => {
  if (link == "#") {
    return children;
  } else if (link.indexOf("Specification.") !== -1) {
    const hrefArray = findSpecification(link.split(".")[1], specifications);
    return hrefArray.length > 0 ? (
      <a
        onClick={(e: any) => {
          PreventEvent(true, e);
        }}
        target={target}
        href={hrefArray[0].values[0]}
      >
        {children}
      </a>
    ) : (
      children
    );
  } else {
    return (
      <a
        onClick={(e: any) => {
          PreventEvent(true, e);
        }}
        target={target}
        href={link}
      >
        {children}
      </a>
    );
  }
};

const urlLabel = (urlImage: string, imageLink: string, specifications: any) => {
  if (imageLink == "#") {
    return urlImage;
  } else if (imageLink.indexOf("Specification.") !== -1) {
    const hrefArray = findSpecification(
      imageLink.split(".")[1],
      specifications
    );
    return hrefArray.length > 0 ? hrefArray[0].values[0] : urlImage;
  } else {
    return urlImage;
  }
};

const Image: StorefrontFunctionComponent<ImageProps> = ({
  specificationName,
  imageLink = "#",
  label,
  labelWithHref = false,
  target = "_self",
  isPrevent = true,
}: ImageProps) => {
  const productContextValue = useProduct();

  const urlToPrint = findSpecification(
    specificationName,
    productContextValue?.product?.properties
  );

  const render = () => {
    if (productContextValue && urlToPrint.length > 0) {
      let app = "?format=PNG&fillcolor=rgba:255,255,255";
      let actualUrl = urlToPrint[0].values[0];
      if (specificationName === "EnergyLogo_image"){
        actualUrl = actualUrl.split('?')[0] + app; 
      } 
      
      if (!label) {
        return (
          <div className={style.container}>
            {putLink(
              <img className={style.image} src={actualUrl} />,
              imageLink,
              productContextValue?.product?.properties,
              target
            )}
          </div>
        );
      } else {
        label = getLabel(label, productContextValue?.product?.properties);
        if (label && !labelWithHref) {
          return (
            <div className={style.container}>
              {putLink(
                <img className={style.image} src={actualUrl} alt={label} />,
                imageLink,
                productContextValue?.product?.properties,
                target
              )}
              <span className={style.label}>{label}</span>
            </div>
          );
        } else {
          return (
            <div
              onClick={(e: any) => {
                PreventEvent(isPrevent, e);
              }}
              className={style.container}
            >
              {putLink(
                <img className={style.image} src={actualUrl} alt={label} />,
                imageLink,
                productContextValue?.product?.properties,
                target
              )}
              <a
                href={urlLabel(
                  actualUrl,
                  imageLink,
                  productContextValue?.product?.properties
                )}
                className={style.labelLink}
                target={target}
              >
                <span>{label}</span>
              </a>
            </div>
          );
        }
      }
    } else {
      return <></>;
    }
  };
  return render();
};

Image.schema = {
  title: "Image printer",
  description: "Image prited by url in specification value",
  type: "object",
  properties: {
    specificationName: {
      title: "Specification name",
      description: "Mandatory field",
      default: "",
      type: "string",
    },
    imageLink: {
      title: "Link image",
      description:
        "Link image, use normal href or with 'Specification.{nameSpecification} use a dynamic url",
      default: "#",
      type: "string",
    },
    label: {
      title: "Label",
      description:
        "Label put on the image right, with a / is possible get description from specification (Es '/DescriptionImage')",
      default: "",
      type: "string",
    },
    labelWithHref: {
      title: "A tag for the label",
      description: "The same href in img tag is put for the label",
      default: false,
      type: "boolean",
    },
    target: {
      title: "Target",
      description: "Target attribute for the label link",
      default: "_self",
      type: "string",
    },
  },
};

export default Image;
