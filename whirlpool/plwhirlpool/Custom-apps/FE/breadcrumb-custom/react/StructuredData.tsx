import React, { FC } from 'react';
import Helmet from "react-helmet";
import { BreadcrumbList } from "schema-dts";
import { helmetJsonLdProp } from "react-schemaorg";
import { NavigationItem, StructuredDataProps } from './utils/types';

const getCustomBreadcrumb = (breadcrumb: NavigationItem[]) => {

  let origin = window?.location?.origin

  return helmetJsonLdProp<BreadcrumbList>({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb?.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item?.name,
      item: origin + item?.href,
    })),
  })
}

const StructuredData: FC<StructuredDataProps> = ({ breadcrumb }) => {
  const breadcrumbLD = getCustomBreadcrumb(breadcrumb!)
  return (<><Helmet script={[breadcrumbLD]}></Helmet></>)
}

export default StructuredData