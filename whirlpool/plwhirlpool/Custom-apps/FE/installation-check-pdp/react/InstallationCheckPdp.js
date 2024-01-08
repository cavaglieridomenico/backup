import React, { useEffect, useState } from 'react'
import { useProduct } from "vtex.product-context";
import style from "./style.css";

const InstallationCheckPdp = () => {

  const [fetchResponse, setResponse] = useState("")
  const [imageSource, setImageSource] = useState("")
  const productContext = useProduct()


  useEffect(() => {

    const getButtonDiv = document.getElementsByClassName("vtex-store-components-3-x-shippingContainer")[0]
    const getButton = getButtonDiv.getElementsByClassName("vtex-button")[0]
    const getForm = getButtonDiv.getElementsByClassName("vtex-address-form__postalCode")[0]

    const installationCheck = () => {

      const zipCode = getButtonDiv.getElementsByClassName("vtex-address-form-4-x-input")[0].value
      const url = window.location.origin

      const skuId = productContext.product.items[0].itemId
      const constructionType = productContext.product.properties.find(spec => spec.name === "TYPE D'INSTALLATION:")?.values[0]

      if (constructionType && constructionType !== "Pose libre") {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
        fetch(url + "/_v/wrapper/api/catalog/service/installation?skuId=" + skuId + "&zip=" + zipCode).then(
          (response) => {
            if (response.ok) {
              return response.json();
            }
            else {
              return new Promise(resolve => resolve({ data: "KO" }))
            }
          }).then((res) => {
            if (res.data.toLowerCase() == "ok") {
              setResponse("L’installation est possible dans votre département")
              setImageSource("/arquivos/check-solid.svg")
            }
            else {
              setResponse("L’installation n’est pas disponible dans votre département")
              setImageSource("/arquivos/times-solid.svg")
            }
          });
      }
    }

    getForm?.addEventListener("submit", installationCheck)
    getButton?.addEventListener("click", installationCheck)

  }, [document.body.innerHTML])

  return (
    <>
      {
        <div className={style.container}>
          <img class={style.tickIconInstall} src={imageSource} />
          <p className={style.textResponse}>{fetchResponse}</p>
        </div>
      }
    </>
  )
}

export default InstallationCheckPdp
