import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ConditionLayoutBanner() {
  const CSS_HANDLES = [
    "ConditionLayoutBanner_container",
    "ConditionLayoutBanner_textContainer",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);

  const [result, setResult] = useState(false);
  const [bannerHTML, setBannerHTML] = useState("");

  const checkHistory = window.history ? window.history.state.key : "";

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [result, checkHistory]);

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  let pathName;

  const checkPath = () => {
    if (
      window.location.href &&
      window.location.href !== undefined &&
      window.location.href !== null
    ) {
      window.location.pathname.split("/")[3] === undefined
        ? (pathName = "")
        : (pathName = window.location.pathname.split("/")[3]);
      setBannerHTML(pathName);
      setResult(true);
    }
  };

  if (result) {
    return (
      <>
        <div className={handles.ConditionLayoutBanner_container}>
          {bannerHTML === "fours" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit propose un large choix de fours encastrables de différents
              types, à gaz ou électriques. Nos fours électriques sont équipés
              d'une technologie autonettoyante et tous nos fours prévoient des
              programmes de cuisson spécifiques pour cuire parfaitement chaque
              type d'aliment. Choisissez parmi une grande variété de couleurs et
              de design ceux qui s'adaptent le mieux à votre cuisine. Consultez
              notre catalogue, lisez les avis en ligne et découvrez le point de
              vente le plus proche de chez vous pour acheter votre four Indesit.
            </div>
          ) : bannerHTML === "plaques-de-cuisson" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Afin de satisfaire toutes vos exigences, depuis le type de cuisson
              jusqu'aux dimensions, Indesit propose un vaste choix de modèles de
              plaques de cuissons de différentes tailles. Vous trouverez dans
              notre catalogue en ligne des plaques de cuissons à gaz à 5 ou 4
              feux, des plaques électriques ainsi que des plaques à induction en
              vitrocéramique, une solution à la pointe de la modernité.
              Consultez notre catalogue, lisez les avis en ligne et découvrez le
              point de vente le plus proche de chez vous pour acheter vos
              plaques de cuisson Indesit.
            </div>
          ) : bannerHTML === "hottes" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Les hottes de cuisine Indesit allient l'efficacité d'une
              technologie de pointe à un design moderne pour s'adapter à votre
              cuisine en proposant un vaste choix de modèles et de dimensions.
              Choisissez entre les hottes encastrables et les hottes murales,
              entre les modèles traditionnels ou décoratives. Les hottes
              aspirantes de cuisine mesurent entre 60 à 90 cm, pour s'adapter
              aux différentes dimensions de votre cuisine. Consultez notre
              catalogue, lisez les avis en ligne et découvrez le point de vente
              le plus proche de chez vous pour acheter vos plaques de cuisson
              Indesit.
            </div>
          ) : bannerHTML === "micro-ondes" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Les hottes de cuisine Indesit allient l'efficacité d'une
              technologie de pointe à un design moderne pour s'adapter à votre
              cuisine en proposant un vaste choix de modèles et de dimensions.
              Choisissez entre les hottes encastrables et les hottes murales,
              entre les modèles traditionnels ou décoratives. Les hottes
              aspirantes de cuisine mesurent entre 60 à 90 cm, pour s'adapter
              aux différentes dimensions de votre cuisine. Consultez notre
              catalogue, lisez les avis en ligne et découvrez le point de vente
              le plus proche de chez vous pour acheter vos plaques de cuisson
              Indesit.
            </div>
          ) : bannerHTML === "cuisinieres" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit propose un vaste choix de cuisines en pose libre
              électriques ou à gaz, comprenant des plaques de cuisson (à gaz ou
              électrique) et un four performant avec système autonettoyant. Les
              dimensions disponibles varient entre 50 et 60 cm, afin de
              s'adapter à votre cuisine. Nos gazinières ou cuisinières
              électriques sont disponibles dans les couleurs suivantes : blanc,
              argent et inox. Consultez notre catalogue, lisez les avis en ligne
              et découvrez le point de vente le plus proche de chez vous pour
              acheter votre cuisinière en pose libre Indesit.
            </div>
          ) : bannerHTML === "refrigerateurs" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit offre un large choix de réfrigérateurs encastrables ou en
              pose libre de différents types : Réfrigérateurs double porte,
              réfrigérateurs congélateurs, mini réfrigérateur pour en citer
              quelques- uns. Sélectionnez les caractéristiques et les
              spécificités que vous préférez pour votre frigo dans notre
              catalogue en ligne. Vous y trouverez un vaste choix de couleurs et
              de design pour aller avec votre cuisine. Consultez notre
              catalogue, lisez les avis en ligne et découvrez le point de vente
              le plus proche de chez vous pour acheter votre frigo Indesit.
            </div>
          ) : bannerHTML === "congelateurs" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit offre un large choix de congélateurs coffre et de
              congélateurs armoire en pose libre. Sélectionnez les
              caractéristiques que vous souhaitez pour votre congélateur sur
              notre catalogue en ligne, comme la technologie No Frost qui
              empêche la formation de givre dans le freezer, et évite ainsi de
              devoir dégivrer le congélateur. Choisissez parmi un large choix de
              couleurs et de styles ceux qui s'adaptent le mieux à votre
              cuisine. Consultez notre catalogue, lisez les avis en ligne et
              découvrez le point de vente le plus proche de chez vous pour
              acheter votre congélateur Indesit.
            </div>
          ) : bannerHTML === "lave-linge" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Les lave-linge Indesit sont équipées des technologies les plus
              innovantes pour nettoyer parfaitement chacun de vos vêtements.
              Nous proposons un large choix de lave-linge encastrables et en
              pose libre avec chargement frontal ou par-dessus, de grandes ou
              petites dimensions, avec une capacité de chargement de 4 à 10 kg.
              Nous proposons nos machines à laver dans un large choix de
              couleurs: noir, blanc, inox et bien d'autres encore. Consultez
              notre catalogue, lisez les avis en ligne et découvrez le point de
              vente le plus proche de chez vous pour acheter votre lave-linge
              Indesit.
            </div>
          ) : bannerHTML === "seche-linge" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Les machines à laver Indesit sont équipées de technologies
              innovantes pour sécher votre linge sans abîmer les tissus. Nous
              proposons un large choix de sèche-linge de différents types et de
              différentes tailles : sèche-linge à pompe à chaleur, en pose
              libre, avec chargement par-dessus. Nos sèche-linge ont une
              capacité de de chargement de 7 à 8 kg. Vous avez à disposition un
              large choix de couleurs comme par exemple noir, blanc, inox et
              bien d'autres encore. Consultez notre catalogue, lisez les avis en
              ligne et découvrez le point de vente le plus proche de chez vous
              pour acheter votre sèche-linge Indesit.
            </div>
          ) : bannerHTML === "lave-linge-sechant" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Les lave-linge séchants à chargement frontal vous permettent de
              laver et sécher votre linge en utilisant un seul électroménager,
              réalisant ainsi un gain d'espace et d'énergie. Vous trouverez des
              lave-linge séchants encastrables ou en pose libre ; chacun est
              équipé de technologies innovantes et de programmes spécifiques
              afin de répondre à vos exigences de lavage et de séchage.
              Choisissez parmi un vaste choix de couleurs, noir, blanc, inox et
              d'autres encore. Consultez notre catalogue, lisez les avis en
              ligne et découvrez le point de vente le plus proche de chez vous
              pour acheter le meilleur lave-linge séchant Indesit.
            </div>
          ) : bannerHTML === "lave-vaisselle" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Les lave-vaisselle Indesit vous sont proposés dans différents
              modèles afin de mieux s'adapter à votre cuisine : vous trouverez
              dans notre catalogue des lave-vaisselle encastrables, semi
              encastrables, ou en pose libre. Choisissez la couleur et les
              dimensions : mini lave-vaisselle, lave- vaisselle traditionnel ou
              grand lave-vaisselle, un vaste choix de modèles pour répondre à
              vos besoins. Les couleurs proposées s'adaptent à tous les styles
              de cuisine : noir, blanc, inox, argenté. Tous nos lave-vaisselle
              possèdent la classe énergétique A ou plus. Consultez notre
              catalogue, lisez les avis en ligne et découvrez le point de vente
              le plus proche de chez vous pour acheter votre lave- vaisselle
              Indesit.
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
  return null;
}
