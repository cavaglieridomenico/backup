/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'

const accessoriesCustomH1Desktop = ({editableh1}) => {
    return <h1 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--titleSearchPage t-heading-2 vtex-rich-text-0-x-headingLevel2 vtex-rich-text-0-x-headingLevel2--titleSearchPage vtex-rich-text-0-x-heading-level-2">{editableh1}</h1>
}

accessoriesCustomH1Desktop.schema = {
    title: 'Desktop accessories pages h1 editable',
    description: "Change the desktop h1",
    type: 'object',
    properties: {
        editableh1: {
            title: "editableh1",
            type: "string"
        }
    },
  }

export default accessoriesCustomH1Desktop

