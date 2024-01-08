import React from 'react';
import { useCssHandles } from "vtex.css-handles";
import { useDevice } from 'vtex.device-detector';
import { useProduct } from "vtex.product-context";
import consegnaIcon from "./assets/consegnaPiano.svg";
import consulenzaIcon from "./assets/consulenzaTelefonica.svg";
import installazioneIcon from "./assets/installazione.svg";
import ritiroIcon from "./assets/ritiroUsato.svg";
import { AdditionalService, AdditionalServicesPlpProps, ProductContextState, SpecificationGroups, SpecificationItem } from "./typings/global";

const CSS_HANDLES = [
  "serviceWrapper",
  "serviceContainer",
  "serviceIcon",
  "serviceName",
  "servicePrice"
] as const

const AdditionalServicesPlp: StorefrontFunctionComponent<AdditionalServicesPlpProps> = ({servicesFromTheme}) => {

  const productContext: ProductContextState = useProduct();
  const {device} = useDevice();
  const handles = useCssHandles(CSS_HANDLES)

  const findAdditionalServices = (specifications: SpecificationGroups[]) => {
    const jsonAdditionalServices = specifications?.filter((item: SpecificationGroups) => item.name === "allSpecifications")[0]?.specifications?.filter((item: SpecificationItem) => item.name === 'additionalServices');
    const parsedAdditionalServices: AdditionalService[] = JSON.parse(jsonAdditionalServices[0]?.values[0]).concat(servicesFromTheme ?? [])
    const finalAdditionalServices: AdditionalService[] = parsedAdditionalServices?.map((item: AdditionalService) => {
      switch (item.name) {
        case "Consegna al piano":
          return {...item, image: consegnaIcon}
        case "Consulenza Telefonica per te":
          return {...item, image: consulenzaIcon}
        case "L'esperto per te":
          return {...item, image: consulenzaIcon}
        case "Installazione":
          return {...item, image: installazioneIcon}
        case "Ritiro dell'usato contestuale alla consegna":
          return {...item, image: ritiroIcon}
        default:
          return {...item, image: installazioneIcon}
      }
  })

    const sortingFunction = (a: AdditionalService, b: AdditionalService) => a.name.localeCompare(b.name);
    
    return device !== "phone" ? finalAdditionalServices?.filter((item: AdditionalService) => !item.name.includes("Consulenza") && !item.name.includes("esperto")).sort(sortingFunction) : finalAdditionalServices?.sort(sortingFunction)
  }

  const additionalServices: AdditionalService[] = (findAdditionalServices(productContext.product.specificationGroups)).map(x => {
    const imgWidth = 18;
    const imgHeight = x.name === 'Consegna al piano' || x.name === "Ritiro dell'usato contestuale alla consegna" ? 15 : 20;
    
    x.imgWidth = imgWidth;
    x.imgHeight = imgHeight;
    
    return x;
  });

  return (
    <div className={handles.serviceWrapper}>
      {additionalServices?.map((service: AdditionalService, index: number) => (
        <div className={`${handles.serviceContainer} flex items-center`} key={index}>
          <img className={`${handles.serviceIcon}`} style={{ width: service.imgWidth, height: service.imgHeight }} src={service.image} alt="Additional service icon" />
          <p className={`${handles.serviceName} c-on-base`}>{service.name.substring(0, 30)}</p>
          <span className={`${handles.servicePrice} ttu underline`}>{service.price > 0 ? `€${service.price}` : "GRATUITO"}</span>
        </div>
      ))}
    </div>
  )
}

AdditionalServicesPlp.schema = {
  title: 'Additional services in plp',
  description: 'Additional services in plp',
  type: 'object',
  properties: {}
}

export default AdditionalServicesPlp
