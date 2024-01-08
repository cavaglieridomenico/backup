/* eslint-disable */
import _ from "lodash";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct, SpecificationGroup } from "vtex.product-context";
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
  values: Array<string>;
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
  "prodSpec__group",
  "prodSpec__groupName",
  "prodSpec__name",
  "prodSpec__container",
  "prodSpec__separator",
  "prodSpec__containerText",
  "prodSpec__list",
  "prodSpec__element",
  "prodSpec__text",
  "prodSpec__values",
  "prodSpec__containerSeparator",
  "prodSpec__separator",
  "prodSpec__bullet",
  "prodSpec__structuralFeatures",
] as const;

const ProductSpecificationsWithRules: StorefrontFunctionComponent<ProductSpecificationsWithRulesProps> =
  ({ classes, filter = defaultFilter }) => {
    const { handles } = useCssHandles(CSS_HANDLES, { classes });

    const [enrichedGroups, setEnrichedGroups] = useState(
      [] as Array<SpecificationGroup>
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
      const groups: Array<SpecificationGroup> = specificationGroups.filter(
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
      /* groups */
      const tempEnrichedGroups: Array<SpecificationGroup> = groups.map(
        (grp: SpecificationGroup) => {
          const oldSpecs: Array<Specification> = grp["specifications"];
          const newSpecs: Array<SpecificationWithType> = oldSpecs?.map(
            (sp) => ({
              ...sp,
              type: SpecType.both,
            })
          );
          return {
            ...grp,
            specifications: newSpecs,
          };
        }
      );

      let fieldsIds: Array<string> = [];
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
        <div className={handles.prodSpec__container}>
          {enrichedGroups.map((group, index) => (
            <div
              className={handles.prodSpec__group}
              key={`${index} - ${group && group.originalName}`}
            >
              <div className={handles.prodSpec__groupName}>
                <p
                  className={group.name == "Structural features" ? handles.prodSpec__structuralFeatures : handles.prodSpec__name }
                  dangerouslySetInnerHTML={{ __html: group.name }}
                ></p>
              </div>
              <div className={handles.prodSpec__containerText}>
                <ul className={handles.prodSpec__list}>
                  {group.specifications
                    .filter(
                      (s: SpecificationWithType) => s.type !== SpecType.hide
                    )
                    .map((specification: SpecificationWithType, i: number) => (
                      <li key={"productSpecificationsWithRules" + i} className={handles.prodSpec__element}>
                        <span className={handles.prodSpec__bullet}></span>
                        <p className={handles.prodSpec__text}>
                          {specification?.name}:
                          <b
                            style={{ marginLeft: "5px" }}
                            className={handles.prodSpec__values}
                          >
                            {specification.values}
                          </b>
                        </p>
                      </li>
                    ))}
                </ul>
                <div className={handles.prodSpec__containerSeparator}>
                  <div className={handles.prodSpec__separator} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

ProductSpecificationsWithRules.schema = {
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

export default ProductSpecificationsWithRules;
