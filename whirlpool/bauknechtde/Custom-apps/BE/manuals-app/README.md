# Manuals Application

This application was designed to interact with the <b>Whirlpool Sandwatch</b> infrastructure to retrieve all the available <b>manual documents</b>.

There were exposed two different endpoints:

- <b>ManualSuggestionsQueryInput</b>: 
    
    - INPUT: 
        
        - <b>code</b>: the <b>12nc code</b> or the <b>commercial code</b> of the product for which retrieve the suggestions. Please note that the API should receive at least <b>5 characters</b> long code strings.

    - OUTPUT:

        - <b>status</b>: the status object containing the response <b>code</b> and <b>message</b> 
        - <b>response</b>: an array containing all the <b>suggestion objects</b> available for the received product code. <b>Please note</b> that for each suggestion the API will retrieve the icon URL

    - Example:

        - GraphQL query:
        ```gql ...
            query ($query: ManualSuggestionsQueryInput!){
                queryManualSuggestions(query: $query){
                    status {
                        id
                        message
                    }
                    response{
                        brand
                        code12nc
                        f0
                        code12ncHana
                        ean
                        commercialCode
                        productGroup
                        iconUri
                    }
                }
            }
        ```

        - GraphQL query variables:
        ```json ...
            {
                "query":{
                    "code": "w9 93"
                }
            }
        ```

- <b>ManualDocumentsQueryInput</b>:

    - INPUT:
        - <b>code</b>: the full <b>12nc code</b> or the <b>commercial code</b> of the product for which retrieve the documents. 
        - <b> languages </b>: the array containing the languages of the documents to be retrieved


    - OUTPUT:
        - <b>status</b>: the status object containing the response <b>code</b> and <b>message</b> 
        - <b>response</b>: an object containing two arrays:
            - <b>documentations</b>: an array containing only the documentations file
            - <b>pictures</b>: an array containing only the pictures

    - Example:
        - GraphQL query:
        ```gql ...
        query ($query: ManualDocumentsQueryInput!){
            queryManualDocuments(query: $query){
                status {
                    id
                    message
                }
                response{
                    documentations{
                        id
                        mainType
                        type
                        languages
                        name
                        typeId
                        creationDate
                        uri
                    }
                    pictures{
                        id
                        mainType
                        type
                        languages
                        name
                        typeId
                        creationDate
                        uri
                    }
                }
            }
        }
        ```

        - GraphQL query variables:
        ```json ...
        {
            "query":{
                "code": "859991548020",
                "languages": ["es"]
            }
        }
        ```

         