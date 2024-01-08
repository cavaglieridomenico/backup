import React, { useEffect } from "react";
import classnames from "classnames";
import { useCssHandles } from "vtex.css-handles";

export default function HomepageAnimationCircleMask({
  // titleText,
  // subtitleText,
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
  ];

  const { handles } = useCssHandles(CSS_HANDLES);

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

  useEffect(() => {
    loadScriptGSAP();
  });

  function loadScriptGSAP() {
    if (document.getElementById("gsapScriptCore")) {
      scrollToPluginLoad();
    }
    else {
      const scriptGsap = document.createElement("script");
      scriptGsap.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.2/gsap.min.js";
      scriptGsap.async = true;
      document.body.appendChild(scriptGsap);
      scriptGsap.onload = () => {
        scriptGsap.id = "gsapScriptCore";
        scrollToPluginLoad();
      }
    }
  }

  function scrollToPluginLoad() {
    if (document.getElementById("gsapPlugScrollTo")) {
      scrollTtriggerPluginLoad();
    }
    else {
      const scriptScrollTo = document.createElement("script");
      scriptScrollTo.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/ScrollToPlugin.min.js";
      scriptScrollTo.async = true;
      document.body.appendChild(scriptScrollTo);
      scriptScrollTo.onload = () => {
        scriptScrollTo.id = "gsapPlugScrollTo";
        scrollTtriggerPluginLoad();
      }
    }
  }

  function scrollTtriggerPluginLoad() {
    if (document.getElementById("gsapPlugScrollTrigger")) {
      animation();
    }
    else {
      const scriptScrollTrigger = document.createElement("script");
      scriptScrollTrigger.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/ScrollTrigger.min.js";
      scriptScrollTrigger.async = true;
      document.body.appendChild(scriptScrollTrigger);
      scriptScrollTrigger.onload = () => {
        scriptScrollTrigger.id = "gsapPlugScrollTrigger";
        animation();
      }
    }
  }

  function animation() {
    window.scrollTo(0, 0);
    if (!TweenLite) {
      return;
    }
    TweenLite.defaultEase = Power2.easeInOut;
    TweenMax.to("#" + home_circle_animation_mask, dur, { attr: { r: r_minValue } });
    figureMask();
  }

  function figureMask() {

    hardResetImages();

    if (document.querySelector("#" + goAway)) {
      let data = document.querySelector("#" + goAway).getBBox();
      r = figureRadius(data.width, data.height);
      if (toggle != "closed") {
        gsap.set("#" + home_circle_animation_mask, { attr: { r: r } });
      }
    }

    gsap.to("#" + home_circle_animation_mask, {
      scrollTrigger: {
        trigger: "#" + circle_container,
        endTrigger: id_close_animation ? "#" + circle_container_close : "#" + circle_container,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate: ({ progress }) => {
          if (progress > .45) {
            gsap.set("#" + home_circle_animation_mask, {
              attr: { r: r_maxValue + r_minValue },
            });
            gsap.to("#" + svg_container, {
              css: {
                "background-size": evalImageSize(1),
              },
            });
            gsap.set("#" + home_circle_animation_mask, {
              css: {
                height: evalBackgroundSize(1),
              },
            });
            document.querySelector(
              "#" + animated_subtitle_text
            ).style.visibility = "visible";
            gsap.set("#" + animated_title_text, { css: expandedHeadLabelCss });
            gsap.set("#" + animated_subtitle_text, {
              css: expandedSubLabelCss,
            });
          } else {
            gsap.set("#" + home_circle_animation_mask, {
              attr: { r: r_maxValue * progress + r_minValue },
            });
            gsap.to("#" + svg_container, {
              css: {
                "background-size": evalImageSize(progress),
              },
            });
            gsap.set("#" + home_circle_animation_mask, {
              css: {
                height: evalBackgroundSize(progress),
              },
            });
            document.querySelector(
              "#" + animated_subtitle_text
            ).style.visibility = "hidden";
            gsap.set("#" + animated_title_text, { css: baseHeadLabelCss });
            gsap.set("#" + animated_subtitle_text, { css: baseSubLabelCss });
          }
        }
      },
    });
  }

  function hardResetImages() {
    TweenMax.to("#" + home_circle_animation_mask, dur, { attr: { r: r_minValue } });

    gsap.set("#" + svg_container, {
      css: {
        "background-size": evalImageSize(0),
      },
    });
    gsap.set("#" + home_circle_animation_mask, {
      css: {
        height: evalBackgroundSize(0),
      },
    });
  }

  function evalBackgroundSize(progress) {
    return baseBackgroundSize + 20 * progress + "vh";
  }

  function evalImageSize(progress) {
    let missing = (100 - baseImageWidth) * progress;
    return (
      baseImageWidth + (missing >= 0 ? missing : 0) + "vw auto"
    );
  }

  function figureRadius(w, h) {
    return Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
  }

  // if (isRight) {
  return (
    <>
      <div
        className={classnames(handles.homepage_CircleAnimationBanner)}
        id={circle_container}
      >
        <div
          className={classnames(
            handles.homepage_CircleAnimationBanner_ellipse
          )}
        ></div>
        <svg
          className={classnames(handles.homepage_svg_container)}
          id={svg_container}
        >
          <defs>
            <mask id={home_mask_container}>
              <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
              <circle
                id={home_circle_animation_mask}
                r="0"
                fill="black"
                cx="73%"
                cy="50%"
              />
            </mask>
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
        <div className={handles.homepage_text_label_container}>
          <p id={animated_title_text} className={handles.homepage_text_label}>
            {/* {titleText} */}
            Durable, fiable <br></br>et de qualité
          </p>
          <p
            id={animated_subtitle_text}
            className={handles.homepage_text_sublabel}
          >
            {/* {subtitleText} */}
            Les appareils électroménagers <br></br>Indesit sont sûrs et fiables,<br></br>et résistent même aux enfants.
          </p>
        </div>
      </div>
    </>
  );
}
