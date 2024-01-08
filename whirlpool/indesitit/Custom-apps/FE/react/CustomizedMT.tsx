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
import ReactPlayer from "react-player";

interface CustomizedMTWithRulesProps {
  url: string;
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
const defaultFilter: CustomizedMTWithRulesProps["filter"] = {
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
  "customizedMT__container",
  "customizedMT__group",
  "customizedMT__containerText",
  "customizedMT__list",
  "customizedMT__row",
  "customizedMT__col",
  "customizedMT__containerCard",
  "customizedMT__containerImage",
  "customizedMT__containerDescr",
  "customizedMT__containerDescrDim",
  "customizedMT__title",
  "customizedMT__valueDesc",
  "customizedMT__value",
  "customizedMT__valueName",
  "customizedMT__valueNameDim",
  "customizedMT__titleDim",
  "customizedMT__imageRank1",
  "customizedMT__imageRank2",
  "customizedMT__imageRank3",
  "customizedMT__valuesContainer",
  "customizedMT__containerValuesDim",
  "customizedMT__video",
  "customizedMT__readMoreLink"
] as const;

const CustomizedMT: StorefrontFunctionComponent<CustomizedMTWithRulesProps> = ({
  classes,
  filter = defaultFilter,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  const [enrichedGroups, setEnrichedGroups] = useState(
    [] as SpecificationGroup[]
  );
  const [readMore, setReadMore] = useState(false);
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

        const hasGroup = filterSpecificationGroups.includes(group.originalName);

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
    return () => { };
  }, [specificationGroups, type, filterSpecificationGroups]);

  let skuCode = product.productReference.substring(0, 7);

  function getUrlLink(skuCode: string) {
    let URL = "";
    switch (skuCode) {
      case "F158671":
        URL =
          "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-947bb6dc-494a-42a8-aef4-2fdf275718e5/sckne7/std/1000x1000/DG201969683.jpg?format=JPEG&fillcolor=rgba:255,255,255";
        break;
      case "F158675":
        URL =
          "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-947bb6dc-494a-42a8-aef4-2fdf275718e5/sckne7/std/1000x1000/DG201969683.jpg?format=JPEG&fillcolor=rgba:255,255,255";
        break;
      case "F158703":
        URL =
          "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a89d165b-b4e5-4e2d-b4a5-c4dcfc0e214e/sckne7/std/1000x1000/DG201971204.jpg?format=JPEG&fillcolor=rgba:255,255,255";
        break;
      case "F158705":
        URL =
          "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-6c38ce6a-ef93-46ee-8916-5814df22158f/sckne7/std/1000x1000/DG201971206.jpg?format=JPEG&fillcolor=rgba:255,255,255";
        break;
      case "F158715":
        URL =
          "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-f65412b0-ef5e-4fb9-b586-5f35defded48/sckne7/std/1000x1000/DG201971211.jpg?format=JPEG&fillcolor=rgba:255,255,255";
        break;

      default:
        URL = "";
        break;
    }

    return URL;
  }

  function getVideoUrl(spec) {
    let URL = "";
    switch (spec) {
      case "Push&Go":
        URL =
          "https://whirlpool-cdn.thron.com/ios/49YJPJ_Copia_di_INDESIT_DW_NEW_ML_2020_PUSH___GO_def_JL19TR.mp4/49YJPJ_Copia_di_INDESIT_DW_NEW_ML_2020_PUSH___GO_def-2000.m3u8?v=4";
        break;
      case "Full Load Fast cycles":
        URL =
          "https://whirlpool-cdn.thron.com/ios/XXDEGC_INDESIT_WM_MYTIME_2020_PILL_BREAKFAST_def_OPDAS8.mp4/XXDEGC_INDESIT_WM_MYTIME_2020_PILL_BREAKFAST_def-2000.m3u8?v=4";
        break;
      case "Fast&Clean":
        URL =
          "https://whirlpool-cdn.thron.com/ios/BRSL0L_INDESIT_DW_NEW_ML_2020_MAIN_VIDEO_FAST_CLEAN_def_31KLXW.mp4/BRSL0L_INDESIT_DW_NEW_ML_2020_MAIN_VIDEO_FAST_CLEAN_def-1200.m3u8?v=4";
        break;

      default:
        URL = "";
        break;
    }
    return URL;
  }


  const linkName = readMore ? 'read less' : 'read more'




  return (
    <>
      <div className={handles.customizedMT__container}>
        <>
          {/* first row */}
          <div className={handles.customizedMT__row}>
            {/* RANK1 */}
            {enrichedGroups.map((group) =>
              group.specifications.map((specification: SpecificationWithType) =>
                group.originalName === "RatingGroupAttrLogo" ? (
                  specification.name === "Fast&Clean" ||
                    specification.name === "Inverter Motor" ? (
                    <div className={handles.customizedMT__col}>
                      {/* image */}
                      <div className={handles.customizedMT__containerImage}>
                        {specification.name === "Fast&Clean" ? (
                          <div className={handles.customizedMT__video}>
                            <ReactPlayer
                              style={{
                                overflow: "hidden",
                                borderRadius: "20px",
                              }}
                              width="240px"
                              height="238px"
                              url={getVideoUrl(specification.name)}
                              controls={true}
                              config={{
                                file: {
                                  attributes: {
                                    disablepictureinpicture: "true",
                                    controlsList: "nodownload",
                                  },
                                },
                              }}
                            />
                          </div>
                        ) : specification.name === "Inverter Motor" ? (
                          <img
                            className={handles.customizedMT__imageRank1}
                            src={"https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-fa700019-144e-4597-99e3-5a40a500ec71/sckne7/std/1000x1000/DG201969685.jpg?format=JPEG&fillcolor=rgba:255,255,255"}
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </div>

                      {/* description */}
                      <div className={handles.customizedMT__containerDescr}>
                        <div className={handles.customizedMT__title}>
                          Advanced Technology
                        </div>

                        {specification.name === "Inverter Motor" ? (
                          <>
                            <div className={handles.customizedMT__valueName}>
                              {"Water Balance Plus"}
                            </div>

                            <div className={handles.customizedMT__valueDesc}>
                              {
                                "By adapting the amount of water used according to the cycle’s need, there’s minimal wastage which helps save money on your bills."
                              }
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={handles.customizedMT__valueName}>
                              {specification.name}
                            </div>

                            <div className={handles.customizedMT__valueDesc}>
                              {specification.values}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )
              )
            )}

            {/* Measurements */}
            <div className={handles.customizedMT__col}>
              <div className={handles.customizedMT__containerDescrDim}>
                <div className={handles.customizedMT__titleDim}>
                  Measurements
                </div>

                <div className={handles.customizedMT__containerValuesDim}>
                  {enrichedGroups.map((group) =>
                    group.originalName === "Dimensions"
                      ? group.specifications.map(
                        (specification: SpecificationWithType) => (
                          <>
                            <div
                              className={
                                handles.customizedMT__valuesContainer
                              }
                            >
                              <div
                                className={handles.customizedMT__valueNameDim}
                              >
                                {specification.name}:
                              </div>

                              <div className={handles.customizedMT__value}>
                                {specification.values}
                              </div>
                            </div>
                          </>
                        )
                      )
                      : ""
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* second row */}
          <div className={handles.customizedMT__row}>
            {/* RANK2 */}
            {enrichedGroups.map((group) =>
              group.specifications.map((specification: SpecificationWithType) =>
                group.originalName === "RatingGroupAttrLogo" ? (
                  specification.name === "(Auto) Intensive" ||
                    specification.name === "Full Load Fast cycles" ? (
                    <div className={handles.customizedMT__col}>
                      {/* image */}
                      <div className={handles.customizedMT__containerImage}>
                        {specification.name === "Full Load Fast cycles" ? (
                          <div className={handles.customizedMT__video}>
                            <ReactPlayer
                              style={{
                                overflow: "hidden",
                                borderRadius: "20px",
                              }}
                              width="240px"
                              height="238px"
                              url={getVideoUrl(specification.name)}
                              controls={true}
                              config={{
                                file: {
                                  attributes: {
                                    disablepictureinpicture: "true",
                                    controlsList: "nodownload",
                                  },
                                },
                              }}
                            />
                          </div>
                        ) : specification.name === "(Auto) Intensive" ? (
                          <img
                            className={handles.customizedMT__imageRank2}
                            src={getUrlLink(skuCode)}
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </div>

                      {/* description */}
                      <div className={handles.customizedMT__containerDescr}>
                        <div className={handles.customizedMT__title}>
                          Advanced Technology
                        </div>

                        <>
                          <div className={handles.customizedMT__valueName}>
                            {specification.name}
                          </div>
                          <div className={handles.customizedMT__valueDesc}>
                          {!readMore && specification.values.toString().slice(0,140)}
                            {readMore && specification.values}{!readMore && "..."}
                            <a className={handles.customizedMT__readMoreLink} onClick={() => { setReadMore(!readMore) }}>{linkName}</a>
                          </div>
                        </>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )
              )
            )}

            {/* RANK3 */}
            {enrichedGroups.map((group) =>
              group.specifications.map((specification: SpecificationWithType) =>
                group.originalName === "RatingGroupAttrLogo" ? (
                  specification.name === "Push&Go" ||
                    specification.name === "Cotton 60" ? (
                    <div className={handles.customizedMT__col}>
                      {/* image */}
                      <div className={handles.customizedMT__containerImage}>
                        {specification.name === "Push&Go" ? (
                          <div className={handles.customizedMT__video}>
                            <ReactPlayer
                              style={{
                                overflow: "hidden",
                                borderRadius: "20px",
                              }}
                              width="240px"
                              height="238px"
                              url={getVideoUrl(specification.name)}
                              controls={true}
                              config={{
                                file: {
                                  attributes: {
                                    disablepictureinpicture: "true",
                                    controlsList: "nodownload",
                                  },
                                },
                              }}
                            />
                          </div>
                        ) : specification.name === "Cotton 60" ? (
                          <img
                            className={handles.customizedMT__imageRank3}
                            src={getUrlLink(skuCode)}
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </div>

                      {/* description */}
                      <div className={handles.customizedMT__containerDescr}>
                        <div className={handles.customizedMT__title}>
                          Advanced Technology
                        </div>

                        <>
                          <div className={handles.customizedMT__valueName}>
                            {specification.name}
                          </div>

                          <div className={handles.customizedMT__valueDesc}>
                            {specification.values}
                          </div>
                        </>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )
              )
            )}
          </div>
        </>
      </div>
    </>
  );
};

CustomizedMT.schema = {
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

export default CustomizedMT;
