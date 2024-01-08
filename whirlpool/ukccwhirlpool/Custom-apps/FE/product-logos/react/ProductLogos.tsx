import React, { useState, useEffect } from "react";
import { useProduct } from "vtex.product-context";
import { useLazyQuery } from "react-apollo";
import getProductLogos from "../graphql/getProductLogos.graphql";
import { useCssHandles } from "vtex.css-handles";
import ContentLoader from "react-content-loader";

/*---------- CSS HANDLES ----------*/
const CSS_HANDLES = [
  "skeletonContainer",
  "skeletonWrapper",
  "productImagesContainer",
  "productImagesWrapper",
  "productImage",
  "productImageZoomed",
] as const;

/*---------- SKELETON ----------*/
const Skeleton: React.FC = () => (
  <ContentLoader
    speed={2}
    width={48}
    height={48}
    viewBox="0 0 48 48"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="50" ry="50" width="48" height="48" />
  </ContentLoader>
);

interface ProductLogosProps {
  shouldZoomIn: boolean;
}

const ProductLogos: StorefrontFunctionComponent<ProductLogosProps> = ({
  shouldZoomIn = true,
}) => {
  const handles = useCssHandles(CSS_HANDLES);

  const productContext = useProduct();
  const itemId = productContext?.product?.items?.[0]?.itemId;

  /*---------- STATES ----------*/
  const [isZoomedIn, setZoomedIn] = useState(-1);

  /*---------- QUERY TO RETRIEVE AWARDED LOGOS ----------*/
  const [getProductLogosQuery, { data, loading, error }] = useLazyQuery(
    getProductLogos,
    {
      onCompleted: () => {
        if (!itemId) console.error("Product Context goes wrong");
      },
    }
  );

  useEffect(() => {
    if (itemId) {
      getProductLogosQuery({
        variables: {
          skuId: itemId,
        },
      });
    }
  }, [itemId]);

  const productLogos = data?.productLogos || [];

  /*---------- ERROR HANDLING ----------*/
  if (error) {
    console.error(error);
    return <></>;
  }

  return (
    <>
      {loading ? (
        <div className={handles.skeletonContainer}>
          <div className={handles.skeletonWrapper}>
            <Skeleton />
          </div>
          <div className={handles.skeletonWrapper}>
            <Skeleton />
          </div>
          <div className={handles.skeletonWrapper}>
            <Skeleton />
          </div>
        </div>
      ) : (
        <a
          onClick={(e) => {
            e.preventDefault(), e.stopPropagation();
          }}
        >
          <div className={handles.productImagesContainer}>
            {productLogos?.map((imageUrl: string, index: number) => (
              <div key={index} className={handles.productImagesWrapper}>
                <img
                  onMouseEnter={() => shouldZoomIn && setZoomedIn(index)}
                  onMouseLeave={() => shouldZoomIn && setZoomedIn(-1)}
                  onClick={() => shouldZoomIn && setZoomedIn(index)}
                  key={index}
                  src={imageUrl}
                  className={handles.productImage}
                  alt="product-image"
                />
                {isZoomedIn == index && shouldZoomIn && (
                  <img
                    onMouseEnter={() => setZoomedIn(index)}
                    onMouseLeave={() => setZoomedIn(-1)}
                    onClick={() => setZoomedIn(-1)}
                    key={index}
                    src={imageUrl}
                    className={handles.productImageZoomed}
                    alt="product-image"
                  />
                )}
              </div>
            ))}
          </div>
        </a>
      )}
    </>
  );
};

ProductLogos.schema = {
  title: "Product Logos",
  description: "Product logos component",
  type: "object",
  properties: {
    shouldZoomIn: {
      title: "Should logo Zoom in?",
      type: "boolean",
      default: true,
    },
  },
};

export default ProductLogos;
