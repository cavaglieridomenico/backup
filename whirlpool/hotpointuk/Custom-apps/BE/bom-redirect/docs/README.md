# Bom redirect

This app can be used to create or update documents into BR entity and Update BOM Pages VTEX internals. If It already exist and 
there are fields in the request different than those already existing, update the document,
otherwise it does nothing. If a document doesn't exist, the app will create it. 
Each document is distinguished according to the unique key << sparePartId, industrialCode, bomId >>.

# Master Data Entity
The entity used for this service is BR
It's schema is defined here:

  BR ->  bomId: string,
        categoryId: number,
        categoryName: string,
        familyGroup: string,
        fCode: string,
        industrialCode: string,
        modelNumber: string,
        originalModelNumber: string,
        referenceNumber: string,
        sparePartId: string,
        spareSkuId: number,
        twelveNc: string

# Rest services exposed

- "/bom-relationship": the main service that create a document in BR entity if not exist, or update it;

- "/bom-relationship/deleteInternal": Service that delete an internal link by passing <from>;

- "/bom-relationship/createInternal": Service that create an internal link by passing <modelNumber, industrialCode>;

- "/bom-relationship/checkInternal": Service that check if an internal link exist according to <modelNumber, industrialCode>,
                                     if not returns the "from" string;

- "/bom-relationship/listInternals": Service that returns a list of internal link, but it isn't the complete list therefore it returns also
                                    the "next" string in order to retrieve other pages.
