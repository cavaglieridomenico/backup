/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Helmet } from 'vtex.render-runtime'



const headJsonComponent = ({dataValue}) => {

if(dataValue?.length > 0) {
    return <Helmet>
                <script type="application/ld+json">
                    {dataValue}
                    </script>
            </Helmet>
} else return <></>
}
headJsonComponent.schema = {
    title: 'Head JSON Component',
    type: 'object',
    description: "A component that returns a string supposed to be a json+ld in the header",
    properties: {
        dataValue: {
            title: "Insert the json+ld to be returned in the header",
            description: 'A component that returns a json+ld in the header , it must follow the standard object structure example : {"@context": "https://schema.org/","@type": "Recipe","name": "Party Coffee Cake","author": {"@type": "Person","name": "Mary Stone"}} ',
            type: "string",
          }
    }
  }

export default headJsonComponent