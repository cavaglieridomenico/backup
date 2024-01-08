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
  "modalManualCode__contentSubtitle"
];

export default function ModalManuals({
  isOpen = false,
  handleClose,
  classes,
  pathImage
}) {

  const { handles } = useCssHandles(CSS_HANDLES, { classes });


  return(
    <div className={handles.modalManualCode__wrapper}>
      <div className={handles.modalManualCode__container}>
        <div className={handles.modalManualCode__contentItems}>
          <div className={handles.modalManualCode__containerTitle}>
            <div className={handles.modalManualCode__contentTitle}>
              Dove trovi matricola e modello del tuo elettrodomestico?
            </div>
          </div>
          <div className={handles.modalManualCode__containerImage}>
            <div className={handles.modalManualCode__contentImage}>
              <img src={pathImage} alt="Modal image code" />
            </div>
          </div>
          <div className={handles.modalManualCode__containerSubtitle}>
            <div className={handles.modalManualCode__contentSubtitle}>
            La matricola è indicata sul certificato di garanzia che trovi nella documentazione dell'elettrodomestico, il modello del prodotto si trova nella prima pagina del libretto di istruzioni oppure puoi trovare matricola e modello sull'etichetta apposita situata sul tuo elettrodomestico.
            </div>
          </div>
        </div>
      </div>
    </div>

  )//Chiusura return

}//Chiusura
