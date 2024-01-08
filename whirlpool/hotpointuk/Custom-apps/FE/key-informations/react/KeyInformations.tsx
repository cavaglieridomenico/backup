import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles';

// interface KeyInformationsProps {
//   richTextInstallations: any, 
//   richTextRemoval: any,
//   tooltip: string
// }

const CSS_HANDLES = [
  "productKeyInformationsTitle",
  "imgKeyInformations",
  "gapKeyInformations",
  "extraGapKeyInformations"
] as const;

const KeyInformations: StorefrontFunctionComponent = () => {

  const handles = useCssHandles(CSS_HANDLES);
  const productContext = useProduct()
  const product = productContext?.product;


  const width = product?.properties?.find((e: any) => e?.name === "Width (cm)")?.values[0];
  const depth = product?.properties?.find((e: any) => e?.name === "Depth (cm)")?.values[0];
  const height = product?.properties?.find((e: any) => e?.name === "Height (cm)")?.values[0];
  const urlDimensions = "https://hotpointuk.vteximg.com.br/arquivos/dimensions.png";

  return (
    <>
      <div className={`flex flex-column ${handles.extraGapKeyInformations}`}>
        <div className={`flex flex-row ${handles.gapKeyInformations}`}>
          <img className={handles.imgKeyInformations} src={urlDimensions} /> 
          <div className="flex flex-column">
            <div className={handles.productKeyInformationsTitle}>Dimensions (cm)</div>
            <div>{`${width} (Width) x ${depth} (Depth) x ${height} (Height)`}</div>
          </div>
        </div>
      </div>
    </>
  )
}

KeyInformations.schema = {
}

export default KeyInformations

