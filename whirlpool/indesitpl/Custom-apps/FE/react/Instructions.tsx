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

interface WindowGTM extends Window {
  dataLayer: any[];
}

let dataLayer = (window as unknown as WindowGTM).dataLayer || [];

const CSS_HANDLES = [
  "instructionsMT__container",
  "instructionsMT__wrapper",
  "instructionsMT__list",
  "instructionsMT__containerCol",
  "instructionsMT__imagePdfContainer",
  "instructionsMT__imagePdf",
  "instructionsMT__nameContainer",
  "instructionsMT__name",
  "instructionsMT__buttonContainer",
  "instructionsMT__label",
] as const;

const Instructions: StorefrontFunctionComponent<ProductSpecificationsWithRulesProps> =
  ({ hasTargetBlank, classes, filter = defaultFilter }) => {
    const { handles } = useCssHandles(CSS_HANDLES, { classes });

    const analyticsCallback = (specification: any) => {
      let url = specification.values[0].split(
        "https://whirlpool-cdn.thron.com/delivery/public/document/whirlpool/"
      )[1];
      let analyticsJson = {
        event: "pdfDownload",
        eventCategory: "Support",
        eventAction: `Download - ${url}`,
        eventLabel: `${product?.items[0].name} - ${product?.productName}`,
      };

      dataLayer.push(analyticsJson);
    };

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

    const nameChanger = (specification) => {
      switch (specification.name) {
        //Polish options
        case "energy-label":
          return "Etykieta efektywności energetycznej";
        case "product-fiche":
          return "karta produktu";
        case "product-data-sheet":
          return "Specyfikacja produktu";
        case "health-safety-environmental":
          return "Instrukcja bezpieczeństwa i montażu";
        case "use-care":
          return "Instrukcja bezpieczeństwa, obsługi i montażu";
        case "daily-reference-guide":
          return "Przewodnik użytkownika";
        case "installation_instructions":
          return "Instrukcja instalacji";
        case "instruction-for-use":
          return "Instrukcja obslugi";
        case "program-chart":
          return "Wykres programu"
        case "new-energy-label":
          return "Nowa etykieta efektywności energetycznej (NEL)";
        case "product-information-sheet":
          return "Karta produktu";
        case "nel-data-sheet":
          return "Informacje techniczne NEL";
        //English options
        case "new-energy-label":
          return "Nouvelles étiquettes énergétiques";
        case "product-information-sheet":
          return "Fiche d’information produit";
        case "use-care":
          return "Utilisation et entretien";
        case "health-safety-environmental":
          return "Information santé et environnement";
        case "nel-data-sheet":
          return "Fiche produit NEL";
        case "daily-reference-guide":
          return "Guide d'utilisation quotidienne";
        case "instruction-for-use":
          return "Mode d'emploi";
        case "repairability-index":
          return "Indice de réparabilité";
        case "notation-table":
          return "Table de notation";
        case "energy-label":
          return "Étiquette énergétique";
        case "product-fiche":
          return "Fiche produit";
        case "product-data-sheet":
          return "Caractéristiques produit";
        case "program-chart":
          return "Tableau des programmes";
        case "installation-instructions":
          return "Instructions d'installation";
        case "safety-data-sheet":
          return "Fiche de données de sécurité";
        default:
          return specification.name;
      }
    };

    return (
      <>
        <div className={handles.instructionsMT__container}>
          {enrichedGroups.map((group, index) => (
            <div
              className={handles.instructionsMT__wrapper}
              key={`${index} - ${group && group.originalName}`}
            >
              <div className={handles.instructionsMT__list}>
                {group.specifications
                  .filter(
                    (s: SpecificationWithType) => s.type !== SpecType.hide
                  )
                  .map((specification: SpecificationWithType, i: number) => (
                    <div
                      key={"instructions" + i}
                      className={handles.instructionsMT__containerCol}
                    >
                      {/* image */}
                      <div
                        className={handles.instructionsMT__imagePdfContainer}
                      >
                        <span
                          className={handles.instructionsMT__imagePdf}
                        ></span>
                      </div>
                      {/* name */}
                      <div className={handles.instructionsMT__nameContainer}>
                        <p className={handles.instructionsMT__name}>
                          {nameChanger(specification)}
                        </p>
                      </div>
                      {/* Button download */}
                      {specification.type === SpecType.both && (
                        <div
                          className={handles.instructionsMT__buttonContainer}
                          onClick={() => analyticsCallback(specification)}
                        >
                          <a
                            className={handles.instructionsMT__label}
                            href={specification.values[0]}
                            target={hasTargetBlank ? "_blank" : undefined}
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

Instructions.schema = {
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

export default Instructions;
