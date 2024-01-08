import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";

export default function BazaarVoice() {
    const { product } = useProduct();
    const [sitePosition, setSitePosition] = useState("");
    const productFcode = product.items[0].name;

    useEffect(() => {
        getBazaarVoice();
        setSitePositionCheck();
    }, []);

    function getBazaarVoice() {
        const test = document.getElementById("bazaarvoice-loader");

        if (!test) {

            const script = document.createElement("script");

            script.defer = "defer";
            script.src = "https://apps.bazaarvoice.com/deployments/whirlpoolcorp-it/d2c_website/production/it_IT/bv.js";
            script.id = "bazaarvoice-loader";
            script.async = true;
            document.body.appendChild(script);
        }
    }

    function setSitePositionCheck() {
        if (window.location.host) {
            setSitePosition(window.location.host.concat(product.link));
        }
    }

    return (
        <>
            <p> AAAAAAAAAAAAAAAAAAA </p>

            <div data-bv-show="inline_rating" data-bv-productId="852573899000" data-bv-seo="false" 
                data-bv-redirect-url="https://www.whirlpool.it/forno-elettrico-incasso-whirlpool-colore-inox-autopulente-akp9-738-ix-852573899000"></div>

            <div data-bv-show="inline_rating" data-bv-productId="852573899000" data-bv-seo="false"
                data-bv-redirect-url="https://www.whirlpool.it/forno-elettrico-incasso-whirlpool-colore-inox-autopulente-akp9-738-ix-852573899000">
            </div>
        </>
    );
}