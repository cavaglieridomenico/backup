import React from "react";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "modalManualCode__wrapper",
  "modalManualCode__container",
  "modalManualCode__contentItems",
  "modalManualCode__containerTitle",
  "modalManualCode__contentTitle",
  "modalManualCode__containerImage",
  "modalManualCode__contentImage",
  "modalManualCode__containerSubtitle",
  "modalManualCode__contentSubtitle",
];

export default function ModalManuals({
  isOpen = false,
  handleClose,
  classes,
  pathImage,
}) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return (
    <div className={handles.modalManualCode__wrapper}>
      <div className={handles.modalManualCode__container}>
        <div className={handles.modalManualCode__contentItems}>
          <div className={handles.modalManualCode__containerTitle}>
            <div className={handles.modalManualCode__contentTitle}>
              Tutaj znajdziesz kod produktu
            </div>
          </div>
          <div className={handles.modalManualCode__containerImage}>
            <div className={handles.modalManualCode__contentImage}>
              <img src={pathImage} alt="Modal image code" />
            </div>
          </div>
          <div className={handles.modalManualCode__containerSubtitle}>
            <div className={handles.modalManualCode__contentSubtitle}>
              Numer modelu znajdziesz na naklejce lub tabliczce znamionowej.
              Numery modeli składają się z zestawu liter i cyfr i mogą zawierać
              znaki takie jak ukośnik (/) lub myślnik (-).
            </div>
          </div>
        </div>
      </div>
    </div>
  ); //Chiusura return
} //Chiusura
