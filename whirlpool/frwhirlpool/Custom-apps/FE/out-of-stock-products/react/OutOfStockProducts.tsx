import React from "react";
import style from "./style.css";
import { useProduct } from "vtex.product-context";

const OutOfStockProducts: StorefrontFunctionComponent = () => {
  //const [startDate, setStartDate] = useState(null)
  //const [endDate, setEndDate] = useState(null)
  const productContext = useProduct();
  //useEffect(()=>{

  const listPrice =
    productContext.selectedItem.sellers[0].commertialOffer.ListPrice;
  const sellingPrice =
    productContext.selectedItem.sellers[0].commertialOffer.Price;
  const isDiscount = listPrice == sellingPrice ? false : true;
  const isPrice = listPrice != 0 && sellingPrice != 0 ? true : false;
  //const price = specifications.filter((e:any)=>e.name === "priceRange")
  console.log(
    "productContext.selectedItem.sellers[0].commertialOffer",
    productContext.selectedItem.sellers[0].commertialOffer
  );

  //},[])

  return (
    <div className={style.container}>
      {!isDiscount ? (
        <div className={style.sellingprice}>
          *{sellingPrice.toFixed(2)}&nbsp;€
        </div>
      ) : (
        <div className={style.priceooscont}>
          {isPrice ? (
            <div className={style.priceoos}>
              {/* <div className={style.risparmioosDesktop}>-{Math.round(100-(sellingPrice*100)/listPrice)} &nbsp;% </div> */}
              <div className={style.risparmiooscontainer}>
                <div className={style.listprice}>
                  {" "}
                  {listPrice.toFixed(2)} €{" "}
                </div>

                <div> </div>
              </div>
              <div className={style.listandsellingprice}>
                {/* <div className={style.risparmioos}>
                  {" "}
                  Risparmi: &nbsp;{(listPrice - sellingPrice).toFixed(2)}{" "}
                  &nbsp;€{" "}
                </div> */}
                <div className={style.risparmioosMobile}>
                  -{Math.round(100 - (sellingPrice * 100) / listPrice)} &nbsp;%{" "}
                </div>
                <div className={style.sellingprice}>
                  <span className={style.asterisc}>*</span>
                  {sellingPrice.toFixed(2)} €
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

OutOfStockProducts.schema = {
  title: "editor.outOfStockProducts.title",
  description: "editor.outOfStockProducts.description",
  type: "object",
};

export default OutOfStockProducts;
