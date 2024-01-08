//@ts-nocheck
import React from 'react'
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";

interface BreadcrumbPlpProps {
  BreadcrumbPlpDefault: string
}

const BreadcrumbPlp: StorefrontFunctionComponent<BreadcrumbPlpProps> = ({BreadcrumbPlpDefault}) => {

  const { searchQuery } = useSearchPage();
  const breadPlp = searchQuery?.variables?.selectedFacets[2]?.value.replace(/-/g," ");
  const sumOdd = (arr) => {
     arr.reduce((prev, curr) => {
      if(curr % 2 === 0){
        return prev + curr
      }
    }, 0)
  }
  console.log("-----------", sumOdd([0, 1, 2, 3 , 4, 5]))
  return (
    <>
    {
    breadPlp ?
    <div>{breadPlp}</div>
    :
    <div>{BreadcrumbPlpDefault}</div>
    }
    </>
    );
};

export default BreadcrumbPlp

BreadcrumbPlp.schema = {
  title: 'BreadcrumbPlp default value',
  description: 'editor.breadcrumbPlp.description',
  type: 'object',
  properties: {
    BreadcrumbPlpDefault: {
       title: 'BreadcrumbPlpDefault',
       description: 'BreadcrumbPlp Default label',
       type: 'string',
       default: '',
    },
  },
}
