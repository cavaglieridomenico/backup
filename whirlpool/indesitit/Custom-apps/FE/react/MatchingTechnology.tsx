/* eslint-disable */
import _ from "lodash";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import type { SpecificationGroup } from "vtex.product-context";
// @ts-ignore
import { useProduct } from "vtex.product-context";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";

interface ProductSpecificationsWithRulesProps {
  groupName: string;
  filter?: {
    type: "hide" | "show";
    specificationGroups: string[];
  };
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}
interface FieldDataModel {
  Name: string;
  Description: string;
}
const defaultFilter: ProductSpecificationsWithRulesProps["filter"] = {
  type: "hide",
  specificationGroups: [],
};

interface Specification {
  name: string;
  originalName: string;
  values: string[];
  __typename: string;
}
interface Dictionary<T> {
  [key: string]: T;
}
enum SpecType {
  both = "1",
  nameOnly = "2",
  hide = "3",
}
interface SpecificationWithType extends Specification {
  type: SpecType;
}

const CSS_HANDLES = [
  "prodSpecMT__group",
  "prodSpecMT__groupName",
  "prodSpecMT__container",
  "prodSpecMT__separator",
  "prodSpecMT__containerText",
  "prodSpecMT__button",
  "prodSpecMT__content",
  "prodSpecMT__list",
  "prodSpecMT__text",
  "prodSpec__containerWhiteArrow",
  "prodSpec__whiteArrow",
  "prodSpec__darkArrowContainer",
  "prodSpec__closeArrow",
  "prodSpec__containerLeftElement",
  "prodSpec__wrapperLeftElement",
  "prodSpec__containerDescription",
  "prodSpec__containerMT",
  "prodSpec__rowAccordion",
  "prodSpecMT__containerSeparator",
  "prodSpec__openArrow",
] as const;
  /* TRACKING MT */
  interface WindowGTM extends Window {
    dataLayer: any[];
  }
const MatchingTechnologies: StorefrontFunctionComponent<ProductSpecificationsWithRulesProps> =
  ({ classes, filter = defaultFilter }) => {

  let dataLayer = (window as unknown as WindowGTM).dataLayer || [];
    
    const { handles } = useCssHandles(CSS_HANDLES, { classes });
    const [openAccordion, setOpenAccordion] = useState([
      {
        open: false,
        id: "",
      },
    ]);

    const [enrichedGroups, setEnrichedGroups] = useState(
      [] as SpecificationGroup[]
    );

    const { product } = useProduct();

    if (!product) {
      return null;
    }

    const itemId = product.items[0] && product.items[0].itemId;
    const { type, specificationGroups: filterSpecificationGroups } = filter;
    const specificationGroups = product?.specificationGroups ?? [];
    let specTypes: Dictionary<SpecType> = {};

    useEffect(() => {
      const groups: SpecificationGroup[] = specificationGroups.filter(
        (group: SpecificationGroup) => {
          if (group.originalName === "allSpecifications") {
            return false;
          }

          const hasGroup = filterSpecificationGroups.includes(
            group.originalName
          );

          if ((type === "hide" && hasGroup) || (type === "show" && !hasGroup)) {
            return false;
          }

          return true;
        }
      );

      const tempEnrichedGroups: SpecificationGroup[] = groups.map(
        (grp: SpecificationGroup) => {
          const oldSpecs: Specification[] = grp.specifications;
          const newSpecs: SpecificationWithType[] = oldSpecs?.map((sp) => ({
            ...sp,
            type: SpecType.both,
          }));

          return {
            ...grp,
            specifications: newSpecs,
          };
        }
      );

      let fieldsIds: string[] = [];
      // fetch(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${itemId}`, {
      // fetch(`_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`,
      fetch(
        // `${window.location.protocol}//${window.location.hostname}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${itemId}`,
        `/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          fieldsIds =
            json &&
            json.ProductSpecifications &&
            json.ProductSpecifications.length &&
            json.ProductSpecifications.filter((spec: any) =>
              filterSpecificationGroups.includes(spec.FieldGroupName)
            ).map((prodSpec: any) => prodSpec.FieldId);

          if (fieldsIds && fieldsIds.length) {
            const fieldsUrls = fieldsIds.map(
              (id) =>
                // "/api/catalog_system/pub/specification/fieldGet/".concat(id)
                // "_v/wrapper/api/catalog_system/pub/specification/fieldGet/".concat(id)
                // `${window.location.protocol}//${window.location.hostname}/api/catalog_system/pub/specification/fieldGet/${id}`
                `/_v/wrapper/api/catalog_system/pub/specification/fieldGet/${id}`
            );

            Promise.all(
              fieldsUrls.map((u) =>
                fetch(u, {
                  method: "GET",
                }).then((resp) => resp.json())
              )
            ).then((fields) => {
              specTypes = {};
              fields.forEach((field: FieldDataModel) => {
                let tempType: SpecType;

                switch (field.Description) {
                  case "1":
                    tempType = SpecType.both;
                    break;

                  case "2":
                    tempType = SpecType.nameOnly;
                    break;

                  case "3":
                    tempType = SpecType.hide;
                    break;

                  default:
                    tempType = SpecType.both;
                    break;
                }

                specTypes[field.Name] = tempType;
              });
              setEnrichedGroups(
                tempEnrichedGroups.map((group: SpecificationGroup) => ({
                  ...group,
                  specifications: group.specifications.map(
                    (spec: SpecificationWithType) => ({
                      ...spec,
                      type: specTypes[spec.originalName],
                    })
                  ),
                }))
              );
            });
          }
        });
      return () => {};
    }, [specificationGroups, type, filterSpecificationGroups]);

    useEffect(() => {
      if (enrichedGroups.length) {
        let elements: any = [];

        enrichedGroups[0].specifications.map((el: any) => {
          elements.push({ open: false, id: el.name });
        });
        setOpenAccordion(elements);
      }
    }, [enrichedGroups]);

    function changeAccordionOpenValues(name: string) {
      name = name.replace(/(\r\n|\n|\r)/gm, "");
      let newElems = openAccordion.map((el: any) => {
        if (el.id !== name) {
          return el;
        } else {
          return { open: !el.open, id: el.id };
        }
      });

      setOpenAccordion(newElems);
    }

    function findElByName(name: string) {
      name = name.replace(/(\r\n|\n|\r)/gm, "");
      let isOpen = false;

      openAccordion.map((el: any) => {
        if (el.id === name) {
          return (isOpen = el.open);
        }
      });

      return isOpen;
    }
    function trackingOpenMT(specification, product, name: string) {
      /* Find arrow state */
      let selected = openAccordion.find((el) => el.id == name);
      /* Push dati nel datalayer */
      dataLayer.push({
        event: "matchingTechnology",
        eventCategory: "Matching Technology Tracking",
        eventAction: `${selected?.open ? "close" : "open"} - ${
          specification.values[0].split("><")[1]
        }` || specification.name,
        eventLabel:
          product.productReference.split("-")[0] +
          " " +
          "-" +
          " " +
          product.productName,
      });
    }

    return (
      <>
        <div className={handles.prodSpecMT__container}>
          {enrichedGroups.map((group, index) => (
            <div
              className={handles.prodSpecMT__group}
              key={`${index} - ${group && group.originalName}`}
            >
              <div className={handles.prodSpecMT__containerText}>
                <ul className={handles.prodSpecMT__list}>
                  {group.specifications
                    .slice(0, 4)
                    .filter(
                      (s: SpecificationWithType) => s.type !== SpecType.hide
                    )
                    .map((specification: SpecificationWithType, i: number) => (
                      <>
                        <div
                          key={"matchingTechnology" + i}
                          className={handles.prodSpec__containerMT}
                        >
                          <div
                            className={handles.prodSpec__containerLeftElement}
                          >
                            <a
                              style={{ cursor: "pointer" }}
                              className={handles.prodSpec__rowAccordion}
                              onClick={(e) => {
                                e.stopPropagation();
                                trackingOpenMT(
                                  specification,
                                  product,
                                  e.currentTarget.innerText
                                );
                                changeAccordionOpenValues(
                                  e.currentTarget.innerText
                                );
                              }}
                            >
                              <div
                                className={handles.prodSpec__wrapperLeftElement}
                              >
                                <div
                                  className={
                                    handles.prodSpec__containerWhiteArrow
                                  }
                                >
                                  <span
                                    className={handles.prodSpec__whiteArrow}
                                  ></span>
                                </div>
                                <button className={handles.prodSpecMT__button}>
                                  {specification?.name}
                                </button>
                              </div>

                              <div
                                className={handles.prodSpec__darkArrowContainer}
                              >
                                {findElByName(specification.name) ? (
                                  <span
                                    className={handles.prodSpec__openArrow}
                                  />
                                ) : (
                                  <span
                                    className={handles.prodSpec__closeArrow}
                                  />
                                )}
                              </div>
                            </a>

                            <div
                              className={handles.prodSpec__containerDescription}
                            >
                              {specification.type === SpecType.both &&
                                findElByName(specification.name) && (
                                  <div className={handles.prodSpecMT__content}>
                                    <span
                                      className={handles.prodSpecMT__text}
                                      dangerouslySetInnerHTML={{
                                        __html: `${specification.values.join(
                                          `.`
                                        )}`,
                                      }}
                                    />
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className={handles.prodSpecMT__containerSeparator}>
                          <div className={handles.prodSpecMT__separator} />
                        </div>
                      </>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

MatchingTechnologies.schema = {
  title: "editor.product-specifications-with-images.title",
  description: "editor.product-specifications-with-images.description",
  type: "object",
  properties: {
    filter: {
      title: "Filter",
      description: "",
      default: "",
      type: "[string]",
    },
  },
};

export default MatchingTechnologies;
