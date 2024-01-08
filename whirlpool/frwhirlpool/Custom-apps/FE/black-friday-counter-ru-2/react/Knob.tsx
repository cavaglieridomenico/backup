import React from "react";
import { useDevice } from "vtex.device-detector";
import style from "./style.css";

interface KnobProps {
  degree: number;
}

const Knob: StorefrontFunctionComponent<KnobProps> = ({ degree }) => {
  const { isMobile } = useDevice();

  let topP = isMobile ? 0 : 50; //top position in percentual
  let leftP = isMobile ? 50 : 0; //left position in percentual
  let k = 50; //half diameter in percentual
  //Make array of 40 cleats
  let cleatsArr = Array.from({ length: 40 }, (_, i) => {
    let deg = 9 * i;
    let rad = (90 - deg) * (Math.PI / 180); //convert gradius to radiant
    topP = k - Math.sin(rad) * k; //calculate top position in percentual
    leftP = k + Math.cos(rad) * k; //calculate left position in percentual

    return isMobile ? (
      <svg
        key={i}
        width={"3"}
        height={"8"}
        viewBox={"0 0 3 8"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={style.cleat}
        style={{
          transform: `rotate(${deg}deg)`,
          top: `${topP}%`,
          left: `${leftP}%`,
        }}
      >
        <ellipse
          rx="0.866182"
          ry="3.82564"
          transform="matrix(-0.999988 0.004866 0.004866 0.999988 1.13291 3.86546)"
          fill={deg <= degree + 3 && deg >= degree - 3 ? "#EDAC09" : "white"}
        />
      </svg>
    ) : (
      <svg
        key={i}
        width="7"
        height="28"
        viewBox="0 0 7 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={style.cleat}
        style={{
          transform: `rotate(${deg}deg)`,
          top: `${topP}%`,
          left: `${leftP}%`,
        }}
      >
        <ellipse
          cx="3.46937"
          cy="14.1117"
          rx="3.04633"
          ry="13.4547"
          fill={deg <= degree + 3 && deg >= degree - 3 ? "#EDAC09" : "white"}
        />
      </svg>
    );
  });

  return (
    <div className={style.washingMachine}>
      <div className={style.cleatsContainer}>
        {cleatsArr.map((item) => item)}
        <div className={style.knobContainer}>
          <img
            className={style.knob}
            style={{
              transform: `rotate(${degree}deg)`,
              transition: degree === 0 ? "1ms" : "1000ms linear all",
            }}
            src={
              isMobile
                ? "https://frwhirlpool.vtexassets.com/arquivos/clock_mobile_bf.png"
                : "https://frwhirlpool.vtexassets.com/arquivos/knob2_bf.png"
            }
            alt={"Knob"}
          />
        </div>
      </div>
    </div>
  );
};

export default Knob;
