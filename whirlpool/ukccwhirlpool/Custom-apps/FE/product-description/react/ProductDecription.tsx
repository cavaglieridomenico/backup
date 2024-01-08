import React, { memo } from "react";
import type { MemoExoticComponent, PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { formatIOMessage } from "vtex.native-types";
import { useProduct } from "vtex.product-context";
import GradientCollapse from "./components/GradientCollapse";
import style from "./style.css";

type Props = {
  /** Description fallback */
  description?: string;
  /** Section title */
  title?: string;
  /** Define whether or not to show the title */
  showTitle?: boolean;
  /** Define if content should start collapsed or not */
  collapseContent?: boolean;
};

/**
 * Product Description Component.
 * Render the description of a product
 */
function ProductDescription(props: PropsWithChildren<Props>) {
  const intl = useIntl();
  const { product } = useProduct();

  const description = props.description ?? product?.description;
  const productCode = product?.productReference?.replace("-WER", "");
  const productName = product?.productName;

  if (!description) {
    return null;
  }

  const { collapseContent = true, showTitle = true, title } = props;

  return (
    <div className={style.productDescriptionContainer}>
      {showTitle && (
        <FormattedMessage id="store/product-description.title">
          {(txt) => (
            <h2
              className={`${style.productDescriptionTitle} t-heading-5 mb5 mt0`}
            >
              {title ? formatIOMessage({ id: title, intl }) : txt}
            </h2>
          )}
        </FormattedMessage>
      )}

      <div className={`${style.productDescriptionText} c-muted-1`}>
        {collapseContent ? (
          <GradientCollapse
            collapseHeight={220}
            productCode={productCode}
            productName={productName}
            showMoreLabel={intl.formatMessage({
              id: "store/product-description.collapse.showMore",
            })}
            showLessLabel={intl.formatMessage({
              id: "store/product-description.collapse.showLess",
            })}
          >
            <div>{description}</div>
          </GradientCollapse>
        ) : (
          <div>{description}</div>
        )}
      </div>
    </div>
  );
}

const MemoizedProductDescription: MemoExoticComponent<
  typeof ProductDescription
> & { schema?: Record<string, string> } = memo(ProductDescription);

MemoizedProductDescription.schema = {
  title: "admin/editor.product-description.title",
};

export default MemoizedProductDescription;
