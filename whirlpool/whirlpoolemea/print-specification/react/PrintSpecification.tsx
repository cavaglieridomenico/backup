import React from "react";
import { useProduct } from "vtex.product-context";
import { cleanValue } from "./utils/utils";
import { useCssHandles } from "vtex.css-handles";

interface PrintSpecificationProps {
  specificationsToCheck?: Specification[];
  aggregateSymbol?: string;
  measureUnit?: string;
  isLink?: string;
  blockClass?: string;
  aggregateLabel?: string;
  fixedDecimals?: number;
  stringToReplace?: string;
  stringReplacement?: string;
  stringBefore?: string;
  stringAfter?: string;
}

interface Specification {
  name?: string;
  valueToCheck?: any;
}
const CSS_HANDLES = ["container", "link", "text", "value", "attribute", "specificationValue"];

const PrintSpecification: StorefrontFunctionComponent<PrintSpecificationProps> = ({
  specificationsToCheck,
  aggregateSymbol = "",
  measureUnit = "",
  isLink = false,
  blockClass,
  aggregateLabel = "",
  fixedDecimals = -1,
  stringToReplace = undefined,
  stringReplacement = undefined,
  stringBefore = undefined,
  stringAfter = undefined

}) => {
  const { handles } = useCssHandles(CSS_HANDLES, { blockClass });
  const finalAggregateLabel = aggregateLabel && aggregateLabel + " ";
 
  // const {
  //   product: { properties },
  //   product: {
  //     items: [
  //       {
  //         sellers: [
  //           {
  //             commertialOffer: { AvailableQuantity },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // } = useProduct();

  const context = useProduct();
  const properties = context?.product?.properties
  const AvailableQuantity = context?.product?.items?.[0]?.sellers?.[0]?.commertialOffer?.AvailableQuantity

  /*------------- CHECK ON AVAILABILITY ----------*/
  const minimumQuantityThreshold = properties?.find(
    (prop: any) => prop?.name == "minimumQuantityThreshold"
  )?.values?.[0];

  const isSellable = "sellable"; //check if the product is sellable online
  const category = (context?.product?.categories?.[0])?.substring(
    0,
    context?.product?.categories?.[0]?.length - 1
  );


  const categoryNumber =
    context?.product?.categories?.length === 2
      ? "category-1,category-2,"
      : context?.product?.categories?.length === 3
      ? "category-1,category-2,category-3,"
      : "category-1,";
  let filteredLink = category + "?map=" + categoryNumber;

  const isAvailable = minimumQuantityThreshold
    ? AvailableQuantity >= minimumQuantityThreshold
    : AvailableQuantity >= 1;

  // /*------------- CREATE THE VALUE TO PRINT ----------*/
  let valueToPrint = "";

  const specsArray: any[] = [];

  let sellableFound = false

  specificationsToCheck?.forEach((spec: any) =>
    // Getting the values of specificationName array
    {

      const propSpecification = properties?.find(
        (prop: any) => prop?.name == spec?.name
      );

      if(propSpecification){

        let propToPush

        if (propSpecification?.name == isSellable) {
          propToPush =
            propSpecification?.values?.[0] == "true" && isAvailable
              ? "true"
              : "false";
          
          sellableFound = true

          // search for outofstock property
          let outOfStockProperty = properties?.find(
            (prop: any) => prop?.name == "inStock_custom_property"
          );
    
          // add outOfStockProperty
          if(!outOfStockProperty)
            properties.push({
              name:"inStock_custom_property",
              values:[
                propToPush
              ],
              __typename:"Property"
            })
  

        }
          
      }

      propSpecification?.values?.[0] &&
      specsArray.push(
        spec?.valueToCheck?.[propSpecification?.values?.[0]]
          ? spec?.valueToCheck?.[propSpecification?.values?.[0]]
          : propSpecification?.values?.[0]
      );

    }
  );

  if (sellableFound){

    valueToPrint = finalAggregateLabel

  } else if (specsArray?.length > 0){

    /*------------- ADD AGGREGATE SYMBOL && MEASURE UNIT ----------*/
    valueToPrint = `${finalAggregateLabel +
      specsArray?.join(`${aggregateSymbol}`)}`?.trim();

    // check on decimals
    try{

      if(fixedDecimals >= 0) {
        valueToPrint = JSON.parse(valueToPrint).toFixed(fixedDecimals)
        
      }

    } catch (exc) {
      console.log("Error - fixedDecimals:", fixedDecimals, "valueToPrint:", valueToPrint, "exception:", exc)
    }

    try{

      // check on Float punctuation
      if(stringToReplace && stringReplacement){
        valueToPrint = valueToPrint.replace(stringToReplace, stringReplacement)
      }

    } catch (exc) {
      console.log("Error - stringToReplace:", stringToReplace, "stringReplacement:", stringReplacement, "valueToPrint:", valueToPrint, "exception:", exc)
    }
    
    try{
      // place string before
      if (stringBefore){
        valueToPrint = stringBefore + valueToPrint
      }
      
    } catch (exc) {
      console.log("Error - stringBefore:", stringBefore, "valueToPrint:", valueToPrint, "exception:", exc)
    }
    
    try{

      // place string after
      if (stringAfter){
        valueToPrint += stringAfter
      }

    } catch (exc) {
      console.log("Error - stringAfter", stringAfter, "valueToPrint:", valueToPrint, "exception:", exc)
    }
    
    try{
      
      // add measure unit
      valueToPrint = `${valueToPrint} ${measureUnit}`?.trim();

    } catch (exc) {
      console.log("Error - measureUnit", "valueToPrint:", valueToPrint, valueToPrint, "exception:", exc)
    }
    
  }

  return (
    <>
      {
        valueToPrint && <div
        className={`${handles.container}`} >
          <p className={`${handles.attribute}`} //specific class for the value of the specification
          >
            {!isLink ? (
              <span className={`${handles.value} ${handles.attribute} ${handles.text} ${
                handles?.specificationValue
              }-${cleanValue(specsArray?.[0])}`}>{valueToPrint}</span>
            ) : (
              <>
                <a
                  className={`${handles.link} ${handles.value} ${handles.attribute} ${handles.text} ${
                    handles?.specificationValue
                  }-${cleanValue(specsArray[0])}`}
                  href={cleanValue(
                    filteredLink +
                      specificationsToCheck?.[0]?.name +
                      "&query=" +
                      category +
                      "/" +
                      specsArray?.[0] +
                      "&searchState"
                  )}
                >
                  <span className={handles.text}>{valueToPrint}</span>
                </a>
              </>
            )}
          </p>
        </div>
      }
    </>
  );
};

PrintSpecification.schema = {
  title: "editor.print.specification.title",
  description: "editor.print.specification.description",
};

export default PrintSpecification;
