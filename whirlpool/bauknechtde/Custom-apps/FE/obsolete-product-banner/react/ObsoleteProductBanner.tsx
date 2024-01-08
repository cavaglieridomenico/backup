//@ts-nocheck
import React, {  useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'
//import { useCssHandles } from 'vtex.css-handles'
import { contains } from 'ramda'
import styles from './style.css'

interface ObsoleteProductBannerProps {
  iconObsolete: string
}
const ObsoleteProductBanner = ({
  iconObsolete='data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="currentColor" d="M15.7 14.2q.275.125.563.025q.287-.1.387-.375q.2-.45.275-.912Q17 12.475 17 12q0-.95-.362-1.888q-.363-.937-1.088-1.662q-.725-.725-1.637-1.075q-.913-.35-1.863-.35l.45-.45q.225-.225.213-.525q-.013-.3-.238-.525q-.225-.225-.525-.225q-.3 0-.525.225L9.45 7.475q-.15.15-.15.35q0 .2.15.35l1.975 1.95q.225.2.525.212q.3.013.525-.212q.225-.225.225-.525q0-.3-.225-.525L11.9 8.5q.675 0 1.375.262q.7.263 1.2.763t.763 1.15q.262.65.262 1.3q0 .3-.037.6q-.038.3-.163.575q-.125.35-.012.637q.112.288.412.413Zm-4.175 4.275q.225.225.525.225q.3 0 .525-.225l1.975-1.95q.15-.15.15-.35q0-.2-.15-.35l-1.975-1.95q-.225-.2-.525-.213q-.3-.012-.525.213q-.225.225-.225.525q0 .3.225.525l.55.55q-.7.025-1.362-.225q-.663-.25-1.188-.775q-.5-.5-.763-1.15q-.262-.65-.262-1.3q0-.325.038-.613q.037-.287.162-.587q.1-.275.025-.538q-.075-.262-.3-.412q-.3-.2-.638-.1q-.337.1-.462.4q-.2.45-.263.887Q7 11.5 7 12q0 .95.375 1.875t1.1 1.65q.725.725 1.625 1.088q.9.362 1.85.387l-.425.425q-.225.225-.225.525q0 .3.225.525ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z"%2F%3E%3C%2Fsvg%3E'
}) => {

  const productContext = useProduct();
  const product = productContext.product.productReference;
  const winnerCode = productContext?.product?.properties?.filter((e: any) => e.name == "cCode")[0]?.values[0]
  //const obsoleteModel = __RUNTIME__ ? __RUNTIME__.query.jcode : "";
  const [obsoleteModel, setObsoleteModel] = useState("")
  const [showObsoleteBannner, setShowObsoleteBannner]:boolean = useState(false)
  /*const CSS_HANDLES = [
    "substituteBanner",
    "iconObsoleteBanner",
    "textObsoleteBanner"
  ]*/

  useEffect(() => {
    let params = (new URL(document.location)).searchParams;
    let jcode = params.get("jcode")
    jcode && 
      setShowObsoleteBannner(true) 
      setObsoleteModel(jcode)
  }, [])
  
  

  //const handles = useCssHandles(CSS_HANDLES)
  return (
    <div>
      {showObsoleteBannner &&
        <div className={styles.substituteBanner}>
          <img className={styles.iconObsoleteBanner} src={iconObsolete} />
          <div className={styles.textObsoleteBanner}>
          Ersatzteil {obsoleteModel} wurde ersetzt durch {winnerCode} (Ersatzteil {product})
         </div>
        </div>
      }
    </div>
  )
  ObsoleteProductBanner.schema = {
    title: "ObsoleteProductBanner",
    description: "Obsolete Product Banner",
    type: "object",
    properties: {
      iconObsolete: {
        title: "Icon obsolete",
        description: "Icon obsolete",
        type: "string",
        widget: {
          //here you can choose a file in your computer
          "ui:widget": "image-uploader",
        },
      }
    }
  }

}

export default ObsoleteProductBanner

