import React, { useState } from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

import ReactPlayer from "react-player";

export interface CategoryCardHomeProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
  text: string;
  url: string;
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}

const CSS_HANDLES = [
  "categoryHomePage__maxiContainer",
  "categoryHomePage__container",
  "categoryHomePage__containerImage",
  "categoryHomePage__wrapperStaticImage",
  "categoryHomePage__staticImage",
  "video__container",
  "video",
  "categoryHomePage__containerText",
  "categoryHomePage__text",
  "categoryHomePage__containerDiscover",
  "categoryHomePage__discoverMore",
  "categoryHomePage__discoverImage",
] as const;

export default function CategoryCardHome({
  classes,
  url,
  text,
  src,
}: CategoryCardHomeProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <div
        className={handles.categoryHomePage__maxiContainer}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <div className={handles.categoryHomePage__container}>
          <div className={handles.categoryHomePage__containerImage}>
            {/* STATIC IMAGE */}
            <div
              style={{ display: isShown ? "none" : "block" }}
              className={handles.categoryHomePage__wrapperStaticImage}
            >
              <img
                src={src}
                className={handles.categoryHomePage__staticImage}
              ></img>
            </div>
            {/* VIDEO COMPONENT */}
            <div className={handles.video__container}>
              {isShown && (
                <>
                  {text==="Washing machines" ?
                    <img
                      src={url}
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                      // className={handles.categoryHomePage__staticImage}
                    ></img>
                  :
                  text==="Dishwashers" ?
                    <img
                      src={url}
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                      // className={handles.categoryHomePage__staticImage}
                    ></img>
                  :
                  text==="Ovens" ?
                    <img
                      src={url}
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                      // className={handles.categoryHomePage__staticImage}
                    ></img>
                  :
                  text==="Cookers" ?
                    <img
                      src={url}
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                      // className={handles.categoryHomePage__staticImage}
                    ></img>
                  :
                  text==="Fridges" ?
                    <img
                      src={url}
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                      // className={handles.categoryHomePage__staticImage}
                    ></img>
                  :
                  text==="Freezers" ?
                    <img
                      src={url}
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                      // className={handles.categoryHomePage__staticImage}
                    ></img>
                  :
                  <ReactPlayer
                    style={{ borderRadius: "20px", overflow: "hidden" }}
                    url={url}
                    width="172px"
                    height="186px"
                    playing={true}
                    loop={true}
                  />
                  }
                </>
              )}
            </div>
          </div>

          {/* TEXT */}
          <div className={handles.categoryHomePage__containerText}>
            <span className={handles.categoryHomePage__text}>{text}</span>
          </div>
        </div>
        {isShown && (
          <div className={handles.categoryHomePage__containerDiscover}>
            <p className={handles.categoryHomePage__discoverMore}>
              Discover more
            </p>
            <span className={handles.categoryHomePage__discoverImage}></span>
          </div>
        )}
      </div>
    </>
  );
}
