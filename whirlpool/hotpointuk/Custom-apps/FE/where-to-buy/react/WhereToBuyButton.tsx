//@ts-nocheck
import React, {useState,useEffect} from "react"
import { useProduct } from "vtex.product-context";
import { getRetailers } from './utils/wtbIntegration';
import style from "./style.css";
interface WhereToBuyButtonProps {
  WhereToBuyModalTrigger: any,
  WhereToBuyModal: any
}

const WhereToBuyButton: StorefrontFunctionComponent<WhereToBuyButtonProps> = ({ WhereToBuyModalTrigger, WhereToBuyModal }) => {

  const productContext = useProduct()
  const name = productContext?.selectedItem?.name
  const [retailers, setRetailers] = useState([])

  useEffect(() => {
    getRetailers(name)
      .then(response => response.json())
      .then(data => setRetailers(data.d))
  }, []);

  return(
    retailers.length !== 0 ?
    <>
      <WhereToBuyModalTrigger />
      <WhereToBuyModal />
    </>
    : 
    <></>
  );

}

export default WhereToBuyButton;