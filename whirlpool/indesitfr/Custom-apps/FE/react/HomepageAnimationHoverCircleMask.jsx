import React, { useEffect, useRef } from "react";
import classnames from "classnames";
import { useCssHandles } from "vtex.css-handles";

export default function HomepageAnimationHoverCircleMask({
  titleText,
  subtitleText,
  isLeft,
  id,
  id_close_animation
}) {
  const CSS_HANDLES = [
    "homepage_CircleAnimationBanner",
    "homepage_CircleAnimationBanner_reverse",
    "homepage_CircleAnimationBanner_ellipse_reverse",
    "homepage_CircleAnimationBanner_ellipse",
    "homepage_text_sublabel_visible",
    "homepage_svg_container",
    "homepage_text_label_container",
    "homepage_text_label",
    "homepage_text_sublabel",
    "homepage_text_label_container_reverse",
    "homepage_text_label_reverse",
    "homepage_text_sublabel_reverse",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);
  const myRef = useRef(null)
  let toggle = "closed";
  let r = 0;
  let r_minValue = (window.innerWidth / 5.2);
  let r_maxValue = r_minValue * 3.5;
  let dur = 0.9;

  const baseImageWidth = 80;

  //labels css
  const baseHeadLabelCss = {
    color: "#005C92",
    "margin-top": "0px"
  };
  const expandedHeadLabelCss = {
    color: "#fff",
    "margin-top": "-40px"
  };
  const baseSubLabelCss = {
    color: "#005C92"
  };
  const expandedSubLabelCss = {
    color: "#fff"
  };

  //elements id
  const baseBackgroundSize = 56;

  let svg_container = "svg_container_" + id;
  let home_circle_animation_mask = "home_circle_animation_mask_" + id;
  let home_mask_container = "home_mask_container_" + id;
  let animated_title_text = "animated_title_text_" + id;
  let animated_subtitle_text = "animated_subtitle_text_" + id;
  let goAway = "goAway_" + id;
  let circle_container = "circle_container_" + id;
  let circle_container_close = "circle_container_" + id_close_animation;
  let maskUrl = "url(#" + home_mask_container + ")";

  let firstTitle = "Di lunga durata,<br/> affidabili e resistenti."
  let secondTitle = "La tua soluzione per<br/> risparmiare tempo, denaro<br/> e fatica."
  let thirdTitle = "Semplice da usare, solida<br/> qualità, piacevole<br/> alla vista."
 
  let firstSubTitle = "Gli elettrodomestici Indesit<br/> sono sicuri ed affidabili<br/> e resistono anche ai più piccoli."
  let secondSubTitle = "Sempre pronti, intuitivi e facili da usare, i nostri elettrodomestici ti danno esattamente ciò di cui hai bisogno."
  let thirdSubtitle = "Design intuitivo realizzato<br/> per stare al passo con i bisogni della<br/> vita familiare."

  useEffect(() => {
    loadScriptGSAP();
  });

  function loadScriptGSAP() {
    //if (!document.getElementById("gsapScriptCore")) {
    const scriptGsap = document.createElement("script");
    scriptGsap.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.8.0/gsap.min.js";
    scriptGsap.async = true;
    document.body.appendChild(scriptGsap);
    scriptGsap.onload = () => {
      scriptGsap.id = "gsapScriptCore";
      animation();
    };
    // }     
  }

  function animation() {
    gsap.to("#" + home_circle_animation_mask, { attr: { r: r_minValue }, duration: dur });
  }


  function hoverResize() {
    executeScroll()
    gsap.to("#" + home_circle_animation_mask, {
      attr: { r: r_maxValue + r_minValue },
    }).duration(1);
    gsap.to("#" + svg_container, {
      css: {
        "background-size": evalImageSize(1),
      },
    }).duration(1);
    gsap.to("#" + home_circle_animation_mask, {
      css: {
        height: evalBackgroundSize(1),
      },
    }).duration(1);
    document.querySelector(
      "#" + animated_subtitle_text
    ).style.visibility = "visible";
    gsap.set("#" + animated_title_text, { css: expandedHeadLabelCss });
    gsap.set("#" + animated_subtitle_text, {
      css: expandedSubLabelCss,
    });

  }



  function hardResetImages() {
    gsap.to("#" + home_circle_animation_mask, { attr: { r: r_minValue }, duration: dur });
    gsap.to("#" + svg_container, {
      css: {
        "background-size": evalImageSize(0),
      },
    });
    gsap.to("#" + home_circle_animation_mask, {
      css: {
        height: evalBackgroundSize(0),
      },
    });
    gsap.set("#" + animated_title_text, { css: baseHeadLabelCss });
    gsap.set("#" + animated_subtitle_text, { css: baseSubLabelCss });
  }

  const executeScroll = () => myRef.current.scrollIntoView() 

  function evalBackgroundSize(progress) {
    return baseBackgroundSize + 30 * progress + "vh";
  }

  function evalImageSize(progress) {
    let missing = (100 - baseImageWidth) * progress;
    return (
      baseImageWidth + (missing >= 0 ? missing : 0) + "vw auto"
    );
  } 
  return (
    <>
      <div
        className={classnames(isLeft ? handles.homepage_CircleAnimationBanner_reverse : handles.homepage_CircleAnimationBanner)}
        id={circle_container}
        ref={myRef}
      >
        <div
          className={classnames(
            isLeft ? handles.homepage_CircleAnimationBanner_ellipse_reverse : handles.homepage_CircleAnimationBanner_ellipse
          )}
        ></div>
        <svg
          onMouseEnter={() => hoverResize()}
          onMouseLeave={() => hardResetImages()}
          className={classnames(handles.homepage_svg_container)}
          id={svg_container}
        >
          <defs>
            {isLeft && <mask id={home_mask_container}>
              <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
              <circle
                id={home_circle_animation_mask}
                l="0"
                fill="black"
                cx="25%"
                cy="50%"
              />

            </mask>}
            {!isLeft && <mask id={home_mask_container}>
              <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
              <circle
                id={home_circle_animation_mask}
                r="0"
                fill="black"
                cx="73%"
                cy="50%"
              />

            </mask>}
          </defs>
          <g mask={maskUrl}>
            <rect
              id={goAway}
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="#F8FBFD"
            />
          </g>
        </svg>
        <div className={isLeft ? handles.homepage_text_label_container_reverse : handles.homepage_text_label_container}>
          {!isLeft && <p id={animated_title_text} className={handles.homepage_text_label} dangerouslySetInnerHTML={{ __html: titleText }} />}
          {isLeft && <p id={animated_title_text} className={handles.homepage_text_label_reverse} dangerouslySetInnerHTML={{ __html: titleText }} />}
        


          {!isLeft  && <p id={animated_subtitle_text} className={handles.homepage_text_sublabel} dangerouslySetInnerHTML={{ __html: subtitleText }} />}
          {isLeft && <p id={animated_subtitle_text} className={handles.homepage_text_sublabel_reverse} dangerouslySetInnerHTML={{ __html: subtitleText }} />}
         
        </div>
      </div>
    </>
  );
}
