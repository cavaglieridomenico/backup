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

interface CustomizedMTMobileWithRulesProps {
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
const defaultFilter: CustomizedMTMobileWithRulesProps["filter"] = {
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
  "customizedMTMobile__container",
  "customizedMTMobile__group",
  "customizedMTMobile__containerText",
  "customizedMTMobile__list",
  "customizedMTMobile__row",
  "customizedMTMobile__col",
  "customizedMTMobile__containerCard",
  "customizedMTMobile__containerImage",
  "customizedMTMobile__containerDescr",
  "customizedMTMobile__containerDescrDim",
  "customizedMTMobile__title",
  "customizedMTMobile__valueDesc",
  "customizedMTMobile__value",
  "customizedMTMobile__valueName",
  "customizedMTMobile__valueNameDim",
  "customizedMTMobile__titleDim",
  "customizedMTMobile__imageRank1",
  "customizedMTMobile__imageRank2",
  "customizedMTMobile__imageRank3",
  "customizedMTMobile__valuesContainer",
  "customizedMTMobile__containerValuesDim",
  "customizedMTMobile__video",
  "customizedMTMobile__readMoreLink",
  "customizedMTMobile__hideReadMore",
] as const;

const CustomizedMTMobile: StorefrontFunctionComponent<CustomizedMTMobileWithRulesProps> =
  ({ classes, filter = defaultFilter }) => {
    const { handles } = useCssHandles(CSS_HANDLES, { classes });

    const [enrichedGroups, setEnrichedGroups] = useState(
      [] as SpecificationGroup[]
    );

    const { product } = useProduct();
    const [readMore, setReadMore] = useState(false);

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

    const linkName = readMore ? 'read less' : 'read more';
    const deviceWidth = window.innerWidth / 4.5;

    return (
      <>
        <div className={handles.customizedMTMobile__container}>
          <>
            <div className={handles.customizedMTMobile__title}>
              Advanced Technology
            </div>
            {/* row */}
            <div className={handles.customizedMTMobile__row}>
              {/* RANK1 */}
              {enrichedGroups.map((group) =>
                group.specifications.map(
                  (specification: SpecificationWithType) =>
                    group.originalName === "RatingGroupAttrLogo" ? (
                      specification.name === "Fast&Clean" ||
                        specification.name === "Inverter Motor" ? (
                        <div className={handles.customizedMTMobile__col}>
                          {/* image */}
                          <div
                            className={
                              handles.customizedMTMobile__containerImage
                            }
                          >
                            {specification.name === "Fast&Clean" ? (
                              <div
                                className={handles.customizedMTMobile__video}
                              >
                                <ReactPlayer
                                  style={{
                                    overflow: "hidden",
                                    borderRadius: "20px",
                                  }}
                                  width="140px"
                                  height="140px"
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
                                className={
                                  handles.customizedMTMobile__imageRank1
                                }
                                src={
                                  "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-fa700019-144e-4597-99e3-5a40a500ec71/sckne7/std/1000x1000/DG201969685.jpg?format=JPEG&fillcolor=rgba:255,255,255"
                                }
                                alt=""
                              />
                            ) : (
                              ""
                            )}
                          </div>

                          {/* description */}
                          <div
                            className={
                              handles.customizedMTMobile__containerDescr
                            }
                          >
                            {specification.name === "Inverter Motor" ? (
                              <>
                                <div
                                  className={
                                    handles.customizedMTMobile__valueName
                                  }
                                >
                                  {"Water Balance Plus"}
                                </div>

                                <div
                                  className={
                                    handles.customizedMTMobile__valueDesc
                                  }
                                >
                                  {
                                    "By adapting the amount of water used according to the cycle’s need, there’s minimal wastage which helps save money on your bills."
                                  }
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className={
                                    handles.customizedMTMobile__valueName
                                  }
                                >
                                  {specification.name}
                                </div>

                                <div
                                  className={
                                    handles.customizedMTMobile__valueDesc
                                  }
                                >
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

              {/* RANK2 */}
              {enrichedGroups.map((group) =>
                group.specifications.map(
                  (specification: SpecificationWithType) =>
                    group.originalName === "RatingGroupAttrLogo" ? (
                      specification.name === "(Auto) Intensive" ||
                        specification.name === "Full Load Fast cycles" ? (
                        <div className={handles.customizedMTMobile__col}>
                          {/* image */}
                          <div
                            className={
                              handles.customizedMTMobile__containerImage
                            }
                          >
                            {specification.name === "Full Load Fast cycles" ? (
                              <div
                                className={handles.customizedMTMobile__video}
                              >
                                <ReactPlayer
                                  style={{
                                    overflow: "hidden",
                                    borderRadius: "20px",
                                  }}
                                  width="140px"
                                  height="140px"
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
                                className={
                                  handles.customizedMTMobile__imageRank2
                                }
                                src={getUrlLink(skuCode)}
                                alt=""
                              />
                            ) : (
                              ""
                            )}
                          </div>

                          {/* description */}
                          <div
                            className={
                              handles.customizedMTMobile__containerDescr
                            }
                          >
                            <>
                              <div
                                className={
                                  handles.customizedMTMobile__valueName
                                }
                              >
                                {specification.name}
                              </div>
                              <div className={handles.customizedMTMobile__valueDesc}>
                                {!readMore && specification.values.toString().slice(0, deviceWidth)}
                                {readMore && specification.values}{!readMore && "..."}
                                <a className={ handles.customizedMTMobile__readMoreLink} onClick={() => { setReadMore(!readMore) }}>{linkName}</a>
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
                group.specifications.map(
                  (specification: SpecificationWithType) =>
                    group.originalName === "RatingGroupAttrLogo" ? (
                      specification.name === "Push&Go" ||
                        specification.name === "Cotton 60" ? (
                        <div className={handles.customizedMTMobile__col}>
                          {/* image */}
                          <div
                            className={
                              handles.customizedMTMobile__containerImage
                            }
                          >
                            {specification.name === "Push&Go" ? (
                              <div
                                className={handles.customizedMTMobile__video}
                              >
                                <ReactPlayer
                                  style={{
                                    overflow: "hidden",
                                    borderRadius: "20px",
                                  }}
                                  width="140px"
                                  height="140px"
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
                                className={
                                  handles.customizedMTMobile__imageRank3
                                }
                                src={getUrlLink(skuCode)}
                                alt=""
                              />
                            ) : (
                              ""
                            )}
                          </div>

                          {/* description */}
                          <div
                            className={
                              handles.customizedMTMobile__containerDescr
                            }
                          >
                            <>
                              <div
                                className={
                                  handles.customizedMTMobile__valueName
                                }
                              >
                                {specification.name}
                              </div>

                              <div
                                className={
                                  handles.customizedMTMobile__valueDesc
                                }
                              >
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

CustomizedMTMobile.schema = {
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

export default CustomizedMTMobile;
