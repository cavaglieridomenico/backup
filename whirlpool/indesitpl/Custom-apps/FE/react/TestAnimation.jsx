import React, { useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function TestAnimation() {
  useEffect(() => {
    loadScriptGSAP();
  });

  function loadScriptGSAP() {
    const script = document.createElement("script");

    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.2/gsap.min.js";
    script.async = true;
    script.onload = () => loadScriptScrollTrigger();
    document.body.appendChild(script);
  }

  function loadScriptScrollTrigger() {
    const script = document.createElement("script");

    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.2/ScrollTrigger.min.js";
    script.async = true;
    script.onload = () => scriptLoaded();
    document.body.appendChild(script);
  }

  function scriptLoaded() {
    const frameCount = 9;
    const offsetValue = 100;

    // eslint-disable-next-line no-undef
    gsap.to("#viewer", {
      backgroundPosition: `${-offsetValue * frameCount * 2}px 50%`,
      ease: `steps(${frameCount})`, // use a stepped ease for the sprite sheet
      scrollTrigger: {
        trigger: "#scene",
        start: "top top",
        end: `+=${frameCount * offsetValue}`,
        pin: true,
        scrub: true,
      },
    });
  }

  const CSS_HANDLES = [
    "headerAnimation",
    "sectionAnimation",
    "centerAnimation",
    "sceneAnimation",
    "viewerAnimation",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <div style={{ height: "100vh" }}>
      <header
        className={`${handles.headerAnimation} ${handles.sectionAnimation}`}
      >
        <div className={handles.centerAnimation}>&darr;</div>
      </header>

      <section
        className={`${handles.sceneAnimation} ${handles.sectionAnimation}`}
        id="scene"
      >
        <div className={handles.viewerAnimation} id="viewer" />
      </section>

      <section className={handles.sectionAnimation}>
        <div className={handles.centerAnimation}>End</div>
      </section>
    </div>
  );
}
