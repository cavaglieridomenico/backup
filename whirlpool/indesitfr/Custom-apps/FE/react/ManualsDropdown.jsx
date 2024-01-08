import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "ManualsDropdown_SingleRow",
  "ManualsDropdown_Col",
  "ManualsDropdown_Instructions",
  "ManualsDropdown_ProductName",
  "ManualsDropdown_ProductNamePlaceholder",
  "ManualsDropdown_Products_List",
  "ManualsDropdown_ArrowDown",
  "ManualsDropdown_ArrowDown_Reverse",
  "ManualsDropdown_imageCol",
  "ManualsDropdown_Img_Fluid",
  "ManualsDropdown_Img_Washer",
  "ManualsDropdown_Img_Dryer",
  "ManualsDropdown_Img_Dishwasing",
  "ManualsDropdown_Img_Example",
  "ManualsDropdown_Img_Oven",
  "ManualsDropdown_Img_Cooling",
  "ManualsDropdown_Img_Microwaves",
  "ManualsDropdown_Img_Hobs",
  "ManualsDropdown_Img_Freezer",
  "ManualsDropdown_Img_Cookers",
  "ManualsDropdown_Product",
];

const products = [
  { id: 1, name: "Lave-linge" },
  { id: 2, name: "Sèche-linge" },
  { id: 3, name: "Lave-linge séchant" },
  { id: 4, name: "Réfrigérateur" },
  { id: 5, name: "Congélateur" },
  { id: 6, name: "Four" },
  { id: 7, name: "Micro-ondes" },
  { id: 8, name: "Hotte" },
  { id: 9, name: "Plaque de cuisson" },
  { id: 10, name: "Cuisinières" },
  { id: 11, name: "Lave-vaisselle" },
];

function ManualsDropdown() {
  const [isProductsListShow, setIsProductsListShow] = useState(false);
  const [currentProductValue, setCurrentProductValue] = useState(
    "Choisir une catégorie"
  );

  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <>
      <div className={handles.ManualsDropdown_SingleRow}>
        <div className={handles.ManualsDropdown_Col}>
          <div
            className={handles.ManualsDropdown_Instructions}
            onClick={() => setIsProductsListShow(!isProductsListShow)}
          >
            {currentProductValue &&
            currentProductValue === "Choisir une catégorie" ? (
              <strong
                className={handles.ManualsDropdown_ProductNamePlaceholder}
              >
                {" "}
                {currentProductValue}{" "}
              </strong>
            ) : (
              <strong className={handles.ManualsDropdown_ProductName}>
                {" "}
                {currentProductValue}{" "}
              </strong>
            )}
            {isProductsListShow && (
              <div className={handles.ManualsDropdown_Products_List}>
                {products
                  .filter((p) => p.name !== currentProductValue)
                  .map((p) => {
                    return (
                      <div
                        className={handles.ManualsDropdown_Product}
                        onClick={() => setCurrentProductValue(p.name)}
                        key={p.id}
                      >
                        <strong className={handles.ManualsDropdown_ProductName}>
                          {" "}
                          {p.name}{" "}
                        </strong>
                      </div>
                    );
                  })}
              </div>
            )}
            <svg
              width="10"
              height="6"
              viewBox="-2.5 -5 75 60"
              preserveAspectRatio="none"
              className={
                !isProductsListShow
                  ? handles.ManualsDropdown_ArrowDown
                  : handles.ManualsDropdown_ArrowDown_Reverse
              }
            >
              <path
                d="M0,0 l35,50 l35,-50"
                fill="none"
                stroke="black"
                stroke-linecap="round"
                stroke-width="5"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className={handles.ManualsDropdown_SingleRow}>
        {currentProductValue === "Lave-linge" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Washer} />
            </div>
          </div>
        ) : currentProductValue === "Sèche-linge" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Dryer} />
            </div>
          </div>
        ) : currentProductValue === "Lave-vaisselle" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Dishwasing} />
            </div>
          </div>
        ) : currentProductValue === "Plaque de cuisson" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Example} />
            </div>
          </div>
        ) : currentProductValue === "Four" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Oven} />
            </div>
          </div>
        ) : currentProductValue === "Réfrigérateur" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Cooling} />
            </div>
          </div>
        ) : currentProductValue === "Lave-linge séchant" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Dryer} />
            </div>
          </div>
        ) : currentProductValue === "Congélateur" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Freezer} />
            </div>
          </div>
        ) : currentProductValue === "Hotte" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Hobs} />
            </div>
          </div>
        ) : currentProductValue === "Micro-ondes" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Microwaves} />
            </div>
          </div>
        ) : currentProductValue === "Plaque de cuisson" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Freezer} />
            </div>
          </div>
        ) : currentProductValue === "Cuisinières" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Cookers} />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default ManualsDropdown;
