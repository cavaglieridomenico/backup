import discontinedProducts from './graphql/discontinued-products.graphql';
import { Helmet, useRuntime } from 'vtex.render-runtime';
import { useProduct } from 'vtex.product-context';
import { useQuery } from 'react-apollo';

function SymmetricPdpTitle() {
  const { getSettings } = useRuntime();
  const settings = getSettings('vtex.store');
  const { route } = useRuntime();
  // @ts-ignore
  const { slug } = route.queryString;
  const prodValue = useProduct();

  const { data } = useQuery(discontinedProducts, {
    variables: {
      slug: slug
    }
  });

  const originalTitle = prodValue?.product?.titleTag;
  const brand = data?.product?.brand;
  const productCode = data?.product?.properties?.filter((e: any) => e.name == 'CommercialCode_field')[0]?.values[0];
  const productCategoryOBJ = data?.product?.categoryTree[2]?.name;
  
  const productCategoryLastChar =
    productCategoryOBJ?.[productCategoryOBJ.length - 1] == 's'
    ? productCategoryOBJ?.substring(0, productCategoryOBJ.length - 1)
    : productCategoryOBJ;
  
  const productCategory = productCategoryLastChar?.charAt(0).toUpperCase() + productCategoryLastChar?.slice(1);
  const customTitle = data?.product?.productName;
  const customTitleDef = data ? brand + ' ' + productCode + ' ' + productCategory : customTitle;

  const sellableIterator = data?.product?.properties?.find((e: any) => e.name == 'sellable')?.values;
  const isDiscontinuedIterator = data?.product?.properties?.find((e: any) => e.name == 'isDiscontinued')?.values;

  if (sellableIterator?.[0] === 'false') {
    if (isDiscontinuedIterator?.[0] === 'true') {
      if (productCategory) {
        return (
          <Helmet>
            <title>{`${customTitleDef} - ${settings.storeName.split(' ')[0]}`}</title>
            <meta
              name="description"
              content={
                'Discover ' +
                customTitleDef +
                ' designed to meet your needs and stand the test of time. Learn more about our home appliances product range.'
              }
            />
          </Helmet>
        )
      } else {
        return (
          <Helmet>
            <title>{`${customTitle} - ${settings.storeName}`}</title>
            <meta
              name="description"
              content={
                'Discover ' +
                customTitle +
                ' designed to meet your needs and stand the test of time. Learn more about our home appliances product range.'
              }
            />
          </Helmet>
        )
      }
    } else
      return (
        <Helmet>
          <title>{`${data?.product?.titleTag} - ${settings.storeName}`} </title>
          <meta name="description" content={data?.product?.metaTagDescription} />
        </Helmet>
      )
  } else
    return (
      <Helmet>
        <title>{`${originalTitle} - ${settings.storeName}`}</title>
      </Helmet>
    )
};

export default SymmetricPdpTitle;