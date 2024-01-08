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
  { id: 1, name: "Pralka" },
  { id: 2, name: "Suszarka" },
  { id: 3, name: "Pralko-suszarka" },
  { id: 4, name: "Chłodziarko-zamrażarka" },
  { id: 5, name: "Zamrażarka" },
  { id: 6, name: "Piekarnik" },
  { id: 7, name: "Kuchenka mikrofalowa" },
  { id: 8, name: "Okap" },
  { id: 9, name: "Płyta grzewcza" },
  { id: 10, name: "Kuchenki" },
  { id: 11, name: "Zmywarka" },
];

function ManualsDropdown() {
  const [isProductsListShow, setIsProductsListShow] = useState(false);
  const [currentProductValue, setCurrentProductValue] =
    useState("Wybierz kategorię");

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
            currentProductValue === "Wybierz kategorię" ? (
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
        {currentProductValue === "Pralka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Washer} />
            </div>
          </div>
        ) : currentProductValue === "Suszarka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Dryer} />
            </div>
          </div>
        ) : currentProductValue === "Zmywarka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Dishwasing} />
            </div>
          </div>
        ) : currentProductValue === "Płyta grzewcza" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Example} />
            </div>
          </div>
        ) : currentProductValue === "Piekarnik" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Oven} />
            </div>
          </div>
        ) : currentProductValue === "Chłodziarko-zamrażarka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Cooling} />
            </div>
          </div>
        ) : currentProductValue === "Pralko-suszarka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Dryer} />
            </div>
          </div>
        ) : currentProductValue === "Zamrażarka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Freezer} />
            </div>
          </div>
        ) : currentProductValue === "Ekspres do kawy w zabudowie" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Freezer} />
            </div>
          </div>
        ) : currentProductValue === "Zmywarka" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Freezer} />
            </div>
          </div>
        ) : currentProductValue === "Okap" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Hobs} />
            </div>
          </div>
        ) : currentProductValue === "Kuchenka mikrofalowa" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Microwaves} />
            </div>
          </div>
        ) : currentProductValue === "Klimatyzator" ? (
          <div className={handles.ManualsDropdown_imageCol}>
            <div className={handles.ManualsDropdown_Img_Fluid}>
              <img className={handles.ManualsDropdown_Img_Freezer} />
            </div>
          </div>
        ) : currentProductValue === "Kuchenki" ? (
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
