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
  hasTargetBlank: boolean;
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
  "instructionOvens__container",
  "instructionOvens__wrapper",
  "instructionOvens__list",
  "instructionOvens__containerCol",
  "instructionOvens__imagePdfContainer",
  "instructionOvens__imagePdf",
  "instructionOvens__nameContainer",
  "instructionOvens__name",
  "instructionOvens__buttonContainer",
  "instructionOvens__label",
] as const;

const InstructionsOvens: StorefrontFunctionComponent<ProductSpecificationsWithRulesProps> =
  ({ hasTargetBlank, classes, filter = defaultFilter }) => {
    const { handles } = useCssHandles(CSS_HANDLES, { classes });

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
        `${window.location.protocol}//${window.location.hostname}/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`,
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
                `${window.location.protocol}//${window.location.hostname}/_v/wrapper/api/catalog_system/pub/specification/fieldGet/${id}`
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

    return (
      <>
        <div className={handles.instructionsOvens__container}>
          {enrichedGroups.map((group, index) => (
            <div
              className={handles.instructionsOvens__wrapper}
              key={`${index} - ${group && group.originalName}`}
            >
              <div className={handles.instructionOvens__list}>
                {group.specifications
                  .filter(
                    (s: SpecificationWithType) => s.type !== SpecType.hide
                  )
                  .map((specification: SpecificationWithType) => (
                    <div className={handles.instructionOvens__containerCol}>
                      {/* image */}
                      <div
                        className={handles.instructionOvens__imagePdfContainer}
                      >
                        <span
                          className={handles.instructionOvens__imagePdf}
                        ></span>
                      </div>
                      {/* name */}
                      <div className={handles.instructionOvens__nameContainer}>
                        <p className={handles.instructionOvens__name}>
                          {specification.name.replace(/-/gi, " ")}
                        </p>
                      </div>
                      {/* Button download */}
                      {specification.type === SpecType.both && (
                        <div
                          className={handles.instructionOvens__buttonContainer}
                        >
                          <a
                            className={handles.instructionOvens__label}
                            href={specification.values[0]}
                            target={
                              hasTargetBlank
                                ? "_blank"
                                : undefined
                            }
                          >
                            {"DOWNLOAD"}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

InstructionsOvens.schema = {
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

export default InstructionsOvens;
