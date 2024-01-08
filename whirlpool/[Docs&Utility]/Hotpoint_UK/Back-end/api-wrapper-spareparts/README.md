# hotpoint-b2c-uk 
This folder contain some GraphQL queries and relative resolvers for BOM, LandigPage and PDP.

Resolvers for:

  - BOM PAGE:

    - getBomImage
        query schema: getBomImage(industrialCode: String!): [BomTD] @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition:
        this query retrieves the technical images(service net urls) from bm entity using the "bomid" field in br entity as a primarykey to link the two entities together

    - getFamilyGroup
        query schema: getFamilyGroup(industrialCode: String!): FamilyGroupL   @cacheControl(scope: PUBLIC, maxAge: LONG)
        this query retrieves all the subcategories name(third level category of spare parts) using an industrialcode as key

    - getJcodeForBom
        query schema: getJcodeForBom(referenceNumber: String!, bomId: String!, industrialCode: String!): [SpareAndReference]   @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition: 
        this query gets a specific spare part in a technical image via the reference number of the spare itself, the id of the bom image and the       industrialcode of the finished good

    - getSpareByIndustrialWithFilterPAG
        query schema: getSpareByIndustrialWithFilterPAG(filter: [Filter], page: Int, pageSize: Int): [SparePart]  @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition: this query return an array of sparepart according to filters passed as a parameter. The number of filter is undefined
                    and concatenate all the filter values with the same type(or name) in a single string example (type1 = value1 OR type1 = value2).
                    The resulting where condition string is for example (type1 = value1 OR type1 = value2) AND (type2 = value1).
                    **getSpareByIndustrialWithFilterPAG(filter:[{name:"", value:""}], page:1,pageSize:100)**



  - LANDING PAGE:

    - getBomCodes
        query schema: getBomCodes(searchTerm: String!): [BomCodes]    @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition: This query returns all the model number and industrial Code of the FG associated to a given search term input by the user.

  - PDP:

    - doesItFit
        query schema: doesItFit(sparePartId:  String!, industrialCode: String!): OutcomeFit   @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition: This query returns a "found" or "not found" output when the user input an industrialcode of the finished good to check if the spare part fits 

    - getFitsIn
        query schema: getFitsIn(sparePartId:  String!): [FitsInFG]    @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition: This query returns all the model numbers and industrialcode associeted to a spare part JCODE

    - getSupportVideos
        query schema: getSupportVideos(sparePartId:  String!): SupportVideos   @cacheControl(scope: PUBLIC, maxAge: LONG)
        definition: This query returns all the support videos (taken from masterdata CV entity) related to the category of the spare part
        

