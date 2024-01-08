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
          {bannerHTML === "piekarniki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit oferuje szeroką gamę piekarników do zabudowy - w wariancie
              gazowym lub elektrycznym. Nasze urządzenia posiadają specjalną
              technologię samoczyszczącą oraz wiele innych funkcji, które są
              odpowiedzią na Twoje oczekiwania. Wybieraj z szerokiej gamy
              kolorów i stylów, aby Twoja kuchnia tworzyła jedną całość.
              Przejrzyj nasz katalog, przeczytaj opinie online i znajdź
              najbliższy punkt, w którym kupisz piekarnik Indesit.
            </div>
          ) : bannerHTML === "plyty" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Aby w pełni odpowiedzieć na potrzeby dotyczące przygotowania
              potraw, czy rozmiarów kuchni, oferujemy szeroką linię płyt
              grzewczych i palników o różnych wielkościach. Możesz przejrzeć
              nasz katalog płyt gazowych, elektrycznych oraz naszą coraz
              bardziej popularną kategorię płyt indukcyjnych. Przeczytaj opinie
              online i znajdź najbliższy punkt, w którym kupisz płytę grzewczą
              Indesit.
            </div>
          ) : bannerHTML === "okapy" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Okapy Indesit są zarówno stylowe i wydajne, a jednocześnie
              dostępne w różnych rozmiarach, aby jak najlepiej dopasować się do
              Twojej kuchni. Możesz wybrać okap w wersji kominowej, pionowej
              oraz tradycyjnej, w rozmiarze od 40 cm do 90 cm. Wybieraj z
              szerokiej gamy kolorów i stylów, aby Twoja kuchnia tworzyła jedną
              całość. Przejrzyj nasz katalog, przeczytaj opinie online i znajdź
              najbliższy punkt, w którym kupisz okap Indesit.
            </div>
          ) : bannerHTML === "kuchenki-mikrofalowe" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit oferuje szeroką gamę kuchenek mikrofalowych pod zabudowę.
              Możesz wybierać spośród licznych funkcji specjalnych, aby dobrać
              produkt, który wpasuje się w Twoje potrzeby. Wybieraj z szerokiej
              gamy kolorów i stylów, aby Twoja kuchnia tworzyła jedną całość.
              Przejrzyj nasz katalog, przeczytaj opinie online i znajdź
              najbliższy punkt, w którym kupisz kuchenkę mikrofalową Indesit.
            </div>
          ) : bannerHTML === "kuchenki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit oferuje szeroką gamę wolnostojących kuchenek gazowych i
              elektrycznych, z różnymi rodzajami płyt grzewczychi i
              technologiami samoczyszczącymi w piekarnikach oraz wyposażonych w
              podwójne piekarniki. Nasze kuchenki są dostępne w różnych kolorach
              - czarnym, białym czy srebrnym. Wybieraj z szerokiej gamy kolorów
              i stylów, aby Twoja kuchnia tworzyła jedną całość. Przejrzyj nasz
              katalog, przeczytaj opinie online i znajdź najbliższy punkt, w
              którym kupisz swoją kuchenkę Indesit.
            </div>
          ) : bannerHTML === "lodowki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Indesit oferuje szeroką gamę różnych typów lodówek -
              wolnostojących, do zabudowy, dwudrzwiowych oraz podblatowych oraz
              wiele funkcji specjalnych. Wybieraj z szerokiej gamy kolorów i
              stylów, aby Twoja kuchnia tworzyła jedną całość. Przejrzyj nasz
              katalog, przeczytaj opinie online i znajdź najbliższy punkt, w
              którym kupisz lodówkę Indesit.
            </div>
          ) : bannerHTML === "zamrazarki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Oferta zamrażarek Indesit to szeroka gama modeli wolnostojących
              oraz skrzyniowych. Wybieraj spośród różnych, specjalnych funkcji,
              takie jak systemy powstrzymujące powstawanie szronu oraz system
              BlackOut 2.0, który gwarantuje, że podczas przerwy w zasilaniu
              Twoje jedzenie nie ulegnie częściowemu rozmrożeniu oraz
              poinformuje Cię o zdatności do spożycia danych produktów. Wybieraj
              z szerokiej gamy kolorów i stylów, aby Twoja kuchnia tworzyła
              jedną całość. Przejrzyj nasz katalog, przeczytaj opinie online i
              znajdź najbliższy punkt, w którym kupisz zamrażarkę Indesit
            </div>
          ) : bannerHTML === "pralki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Pralki Indesit wyposażone są w specjalne technologie, aby
              zapewniać doskonałe rezulataty, niezależnie od typu tkanin. Nasza
              oferta obejmuje modele pralek do zabudowy oraz wolnostojących, w
              serii slim lub w rozmiarze standardowym. Pojemność urządzeń wynosi
              od 4 kg do 10 kg. Pralki dostępne są w kilku kolorach, w tym w
              czarnym i srebrnym. Przejrzyj nasz katalog, przeczytaj opinie
              online i znajdź najbliższy punkt, w którym kupisz pralkę Indesit.
            </div>
          ) : bannerHTML === "suszarki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Suszarki bębnowe marki Indesit to gwarancja wyjątkowej opieki dla
              Twoich ubrań. W naszej ofercie znajdziesz suszarki kondensacyjne,
              modele z pompą ciepła oraz suszarki wentylowane. Dodatkowo oferta
              zawiera modele ładowane od frontu i ładowane od góry. Wybieraj
              spośród wielu stylowych kolorów, takich jak czarny, srebrny lub
              biały. Przejrzyj nasz katalog, przeczytaj opinie online i znajdź
              najbliższy punkt, w którym kupisz pralkosuszarkę Indesit.
            </div>
          ) : bannerHTML === "pralkosuszarki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Pralkosuszarki ładowane od frontu marki Indesit pozwalają Ci na
              komfortowe pranie i suszenie ubrań w tym samym urządzeniu. W
              naszej ofercie znajdziesz zarówno modele wolnostojące, jak i do
              zabudowy, a każda z nich jest wyposażona w specjalną technologię
              oraz funkcje, dopasowane do Twoich potrzeb. Wybieraj spośród wielu
              stylowych kolorów, takich jak czarny, srebrny lub biały. Przejrzyj
              nasz katalog, przeczytaj opinie online i znajdź najbliższy punkt,
              w którym kupisz pralko-suszarkę Indesit.
            </div>
          ) : bannerHTML === "zmywarki" ? (
            <div className={handles.ConditionLayoutBanner_textContainer}>
              Oferta zmywarek Indesit to modele wolnostojące, z panelem zakrytym
              (całkowicie zintegrowane) i odkrytym (częściowo zintegrowane).
              Ponadto, dostepne są zmywarki wolnostojące z serii slim oraz o
              standardowym rozmiarze - dzięki temu możesz idealnie dopasować
              zmywarkę do swojej kuchni. Wszystkie nasze zmywarki mają klasę
              energetyczną A lub wyższą. Wybieraj z szerokiej gamy kolorów i
              stylów, aby Twoja kuchnia tworzyła jedną całość. Przejrzyj nasz
              katalog, przeczytaj opinie online i znajdź najbliższy punkt, w
              którym kupisz zmywarkę Indesit.
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
