/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'

const accessoriesCustomH1Mobile = ({editableh1}) => {
    return (
        <div className='vtex-rich-text-0-x-container vtex-rich-text-0-x-container--titleSearchPage flex tc items-start justify-start t-body c-on-base'>
            <h1 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--titleSearchPage t-heading-1 vtex-rich-text-0-x-headingLevel1 vtex-rich-text-0-x-headingLevel1--titleSearchPage vtex-rich-text-0-x-heading-level-1">{editableh1}</h1>
        </div>
    )
}

accessoriesCustomH1Mobile.schema = {
    title: 'Mobile accessories pages h1 editable',
    description: "Change the mobile h1",
    type: 'object',
    properties: {
        editableh1: {
            title: "editableh1",
            type: "string"
        }
    },
  }

export default accessoriesCustomH1Mobile

