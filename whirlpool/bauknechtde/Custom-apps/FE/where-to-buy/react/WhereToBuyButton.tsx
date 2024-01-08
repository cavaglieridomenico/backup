import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import { Window } from "./typings/global";
import { getRetailers } from "./utils/wtbIntegration";
interface WhereToBuyButtonProps {
  WhereToBuyModalTrigger: any;
  WhereToBuyModal: any;
}

const WhereToBuyButton: StorefrontFunctionComponent<WhereToBuyButtonProps> = ({
  WhereToBuyModalTrigger,
  WhereToBuyModal,
}) => {
  const productContext = useProduct();
  const { name } = productContext.selectedItem;
  const [retailers, setRetailers] = useState<Record<any, any>[]>([]);
  const isProduction = (window as unknown as Window).__RUNTIME__.production;
  const testingRetailer = [
{
"__metadata": {
"uri": "https://services.internetbuyer.co.uk/REST.svc/ProductMerchants(CategoryID=16,CategoryName='Dishwashers',CurrencyCode='GBP',FamilyID=4194,FamilyName='Slimline',MerchantName='Otto%20DE',MerchantReference=guid'37a22476-ba25-42a9-866e-d161c5832246',MerchantWebsite='https%3A//www.otto.de/',PriceLastChecked=datetime'2023-04-19T11%3A44%3A00',ProductId=36857,ProductMerchantReference=guid'd85862d7-49af-4f29-ae5a-6e74d66091e2',ProductName='BSFO%203O21%20PF%20-%20Bauknecht%20Geschirrsp%C3%BCler%3A%2045cm%2C%20Kompaktger%C3%A4t%2C%20Farbe%20Weiss',ProductPartNumber='869991624600',ProductPrice=429.0000M)", "type": "ReadModel.ProductMerchant"
}, "ProductMerchantReference": "d85862d7-49af-4f29-ae5a-6e74d66091e2", "ProductPartNumber": "869991624600", "MerchantName": "Otto DE", "NavigateUrl": "https://manufacturers.internetbuyer.co.uk/tracker/?d=IaTBQvL43FA6%2fa9hIqvnXkwGJR%2fOzXE0Q8a9mcHy6bN2RCv2kvlKlFcR%2fHOM%2b6DtOFDYOq70JDhSvpsAYQRpHlZt1z96Zv9P", "ProductPrice": "429.0000", "MerchantLogoUrl": "https://internetbuyerltdstorage.blob.core.windows.net/merchants/otto_DE_121x42.png", "PriceLastChecked": "\/Date(1681904640000)\/", "CurrencyCode": "GBP", "MerchantReference": "37a22476-ba25-42a9-866e-d161c5832246", "ProductEAN": "4011577860054", "MerchantWebsite": "https://www.otto.de/", "Product12NC": null, "ProductId": 36857, "ProductName": "BSFO 3O21 PF - Bauknecht Geschirrsp\u00fcler: 45cm, Kompaktger\u00e4t, Farbe Weiss", "CategoryID": 16, "CategoryName": "Dishwashers", "FamilyID": 4194, "FamilyName": "Slimline"
}
]

  useEffect(() => {
    isProduction ? 
    getRetailers(name)
      .then((response) => response.json())
      .then((data) => setRetailers(data.d))
    : setRetailers(testingRetailer)
  }, []);

  return retailers.length !== 0 ? (
    <>
      <WhereToBuyModalTrigger />
      <WhereToBuyModal />
    </>
  ) : (
    <></>
  );
};

export default WhereToBuyButton;
