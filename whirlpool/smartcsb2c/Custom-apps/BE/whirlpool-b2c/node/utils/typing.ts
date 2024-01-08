export interface Category {
    Id: number
    Name: string
    FatherCategoryId: number | null
    Title: string
    Description: string
    Keywords: string
    IsActive: boolean
    LomadeeCampaignCode: string
    AdWordsRemarketingCode: string
    ShowInStoreFront: boolean
    ShowBrandFilter: boolean
    ActiveStoreFrontLink: boolean
    GlobalCategoryId: number
    StockKeepingUnitSelectionMode: string
    Score: number | null
    LinkId: string
    HasChildren: boolean
}

export interface ProductSearch {
    productId: string
    productName: string
    brand: string
    brandId: number
    brandImageUrl: string | null
    linkText: string
    productReference: string
    categoryId: string
    productTitle: string
    metaTagDescription: string
    releaseDate: string
    clusterHighlights: object
    productClusters: object
    searchableClusters: object
    categories: Array<string>
    categoriesIds: Array<string>
    link: string
    allSpecifications: Array<string>
    allSpecificationsGroups: Array<string>
    description: string
    items?: Array<object>
    // Spare part attributes
    familyGroup?: Array<string>
    status?: Array<"in stock" | "out of stock" | "limited availability" | "obsolete" | "not sellable">
    jCode?: Array<string>
    winnerCode?: Array<string>
    looserCode?: Array<string>
    sparePartSpecificationGroup?: Array<string>
    tableReference?: Array<string>
    BOMSpecificationGroup?: Array<string>
    substitute?: Array<string>
    // Finished product attributes
    commercialCode?: Array<string>
    HANACode?: Array<string>
    indesitMaterialCode?: Array<string>
    industrialCode?: Array<string>
    productSpecificationGroup?: Array<string>
    spareParts?: Array<string>
    sparePartsProductSpecificationGroup?: Array<string>
}

export interface Collection {
    Id?: number
    Name: string
    Description?: string | null
    Searchable: boolean
    Highlight: boolean
    DateFrom: string
    DateTo: string
    TotalProducts?: number
}

export interface SearchCollection {
    items: Array<{
            id: number
            name: string
            searchable: boolean
            highlight: boolean
            dateFrom: string
            dateTo: string
            totalSku: number
            totalProducts: number
            type: string
            lastModifiedBy: string | null
    }>
    paging: {
        page: number
        perPage: number
        total: number
        pages: number
    }
}

export interface CollectionProducts {
    Page: number
    Size: number
    TotalRows: number
    TotalPage: number
    Data: Array<{
        ProductId: number
        SkuId: number
        SubCollectionId: number
        Position: number
        ProductName: string
        SkuImageUrl: string
    }>
}

export interface tradePolicyResponse {
    ProductId: number
    StoreId: number
}

export interface scrollResponse {
    bomId: string,
    finishedgoodId: string,
    sparepartId: string,
    sparepartInBom: string,
    quantity: string
}

export interface sparePart extends ProductSearch {
    bomRelationships?: Array<scrollResponse>
}
