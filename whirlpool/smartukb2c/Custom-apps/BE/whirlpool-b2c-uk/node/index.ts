import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api';
import { LRUCache, method, Service } from '@vtex/api';

// Clients
import { Clients } from './clients'
import { createCategory, getCategoryById, updateCategory } from "./middlewares/category";
import { getProduct, getProductByRefId, createProduct, updateProduct, getProductCategory} from './middlewares/product';
import { createSpecification, createSpecificationField, createSpecificationFieldValue, createSpecificationGroup, createSpecificationValue, updateSpecificationGroup } from './middlewares/specification';
import { appendProductSpecification, createProductSpecification, deleteAllProductSpecifications, deleteProductSpecification, getProductSpecification, updateProductSpecification } from './middlewares/productSpecification';
import { getSkuIds, getSku, getSkusByProductId, createSku, updateSku, createSkuFile, updateSkuFile, getSkuFile, getSkuComplementById, createSkuComplement } from './middlewares/sku';
import { createDocument, createSchema, getAllDocuments, getAllSchemas, getDocument, createVTableApp, scrollDocuments } from "./middlewares/document";
import { getFamilyGroups, productByfamilyGroupAndCategory } from './middlewares/familyGroup';
import { getProductStatus } from './middlewares/productStatus';
import { autocomplete, searchProductByCollection, searchFilteredProducts, searchProductById, searchProductBySpecification } from './middlewares/search';
import { updateInventory } from "./middlewares/inventory";
import { retrieveAttachment, saveAttachment } from './middlewares/attachment';
import { scrollBom, searchBom, sparePartsBom } from './middlewares/bom';
import { checkSparePart } from "./middlewares/checkSparePart";
import {
    createCollection,
    getCollectionByCategoryName,
    getCollectionById,
    getCollectionProducts,
    searchCollection,
    updateCollection
} from './middlewares/collections';
import { registerUser, getUserDocumentIdByEmail } from './middlewares/user';
import { substitute } from './middlewares/substitute';
import { setEnv } from './middlewares/env';
import {
    getCategoryTranslation,
    getProductTranslation,
    getToken,
    translateCategory,
    translateProduct,
    triggerToken
} from "./middlewares/translation";
import { setBrand } from "./middlewares/setBrand"

import { fitsIn } from './middlewares/fitsIn'
import { triggerBackInStockEmail } from "./middlewares/backInStock";
import {checkAuthorization} from "./middlewares/authorization";
import {changeProductScore} from "./middlewares/productScore";


const TIMEOUT_MS = 8000

// Create a LRU memory cache for the GraphqlTranslation client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000, maxAge: 1000 * 60 * 60 * 24 })
const defaultClientCache = new LRUCache<string, any>({ max: 15000, maxAge: 1000 * 60 * 60 * 24 })

//metrics.trackCache('graphqlTranslation', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
    // We pass our custom implementation of the clients bag, containing the Status client.
    implementation: Clients,
    options: {
        // All IO Clients will be initialized with these options, unless otherwise specified.
        default: {
            retries: 2,
            timeout: TIMEOUT_MS,
            memoryCache : defaultClientCache
        },
        // This key will be merged with the default options and add this cache to our Status client.
        graphqlTranslation: {
            memoryCache
        },
    }
}

declare global {
    // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
    type Context = ServiceContext<Clients, State>

    // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
    interface State extends RecorderState {
        // code: number
        locale?: string
    }
}

// Export a service that defines route handlers and client options.
export default new Service({
    clients,
    // A route maps to an array of middlewares (or a single handler).
    routes: {
        // CATEGORY ROUTES
        category: method({
            GET: [getCategoryById],
            PUT: [updateCategory]
        }),
        createCategory: method({
            POST: [createCategory],
        }),

        // PRODUCT ROUTES
        products_id: method({ // Route with param id for the products middleware (GET and PUT requests)
            GET: [getProduct],
            PUT: [updateProduct]
        }),
        getProductByRefId : method({
            GET: [getProductByRefId]
        }),
        products: method({  // Route for the products middleware (only POST request)
            POST: [createProduct]
        }),
        productUpdateScore: method({
            POST: [changeProductScore]
        }),
        productStatus: method({
            GET: [getProductStatus] // Get the status of a product (i.e. in stock, out of stock, etc...) by product ID
        }),
        substitute: method({
            GET: [setEnv, setBrand, substitute]
        }),
        productCategory : method({
            GET: [setEnv, getProductCategory]
        }),

        // PRODUCT SPECIFICATION ROUTES
        productSpecification: method({
            GET: [getProductSpecification],
            POST: [createProductSpecification],
            DELETE: [deleteAllProductSpecifications]
        }),
        productSpecificationDelete: method({
            DELETE: [deleteProductSpecification]
        }),
        productSpecificationUpdate: method({
            POST: [updateProductSpecification]
        }),
        productSpecificationAppend: method({
            POST: [appendProductSpecification]
        }),
        // SKU ROUTES
        skuIds: method({
            GET: [getSkuIds]
        }),
        sku: method({
            GET: [getSku],
            PUT: [updateSku]
        }),
        skuProductId: method({
            GET: [getSkusByProductId]
        }),
        skuCreate: method({
            POST: [createSku]
        }),
        skuFile: method({
            GET: [getSkuFile],
            POST: [createSkuFile]
        }),
        skuFileUpdate: method({
            PUT: [updateSkuFile]
        }),
        getSkuComplementById: method({
            GET: [getSkuComplementById]
        }),
        createSkuComplement: method({
            POST: [createSkuComplement]
        }),

        // SPECIFICATION ROUTES
        specification: method({
            POST: [createSpecification]
        }),
        specificationField: method({
            POST: [createSpecificationField]
        }),
        specificationFieldValue: method({
            POST: [createSpecificationFieldValue]
        }),
        specificationGroup: method({
            POST: [createSpecificationGroup]
        }),
        updateSpecificationGroup: method({
            PUT: [updateSpecificationGroup]
        }),
        specificationValue: method({
            POST: [createSpecificationValue]
        }),

        // DOCUMENT ROUTES
        getDocument: method({
            GET: [getDocument],
        }),
        createDocument: method({
            POST: [createDocument],
        }),
        getAllDocuments: method({
            GET: [getAllDocuments],
        }),
        getAllSchemas: method({
            GET: [getAllSchemas],
        }),
        createSchema: method({
            PUT: [createSchema],
        }),
        createVTableApp: method({
            PUT: [createVTableApp],
        }),
        scrollDocuments: method({
            GET: [scrollDocuments]
        }),

        // FAMILY GROUP
        familyGroups: method({
            GET: [setBrand, getFamilyGroups]
        }),
        productByfamilyGroupAndCategory: method({
            GET: [setBrand, productByfamilyGroupAndCategory]
        }),

        // SEARCH
        search: method({
            GET: [searchFilteredProducts]
        }),
        searchProductById: method({
            GET: [searchProductById]
        }),
        searchProductBySpecification: method({
            GET: [setEnv, setBrand, searchProductBySpecification]
        }),
        autocomplete: method({
            GET: [setEnv, setBrand, autocomplete]
        }),
        searchProductByCollection: method({
            GET: [searchProductByCollection]
        }),

        // INVENTORY
        updateInventory: method({
            PUT: [setEnv, updateInventory]
        }),

        // ATTACHMENT
        retrieveAttachment: method({
            GET: [retrieveAttachment]
        }),
        saveAttachment: method({
            POST: [saveAttachment]
        }),

        // BOM
        scrollBom: method({
            GET: [setEnv, setBrand, scrollBom]
        }),
        searchBom: method({
            GET: [setEnv, setBrand, searchBom]
        }),
        sparePartsBom: method({
            POST: [setEnv, setBrand, sparePartsBom]
        }),

        // CHECKSPAREPART
        checkSparePart: method({
            GET: [setEnv, setBrand, checkSparePart]
        }),

        // COLLECTIONS
        getCollectionById: method({
            GET: [getCollectionById]
        }),
        getCollectionByCategoryName: method({
            GET: [getCollectionByCategoryName]
        }),
        searchCollection: method({
            GET: [searchCollection]
        }),
        getCollectionProducts: method({
            GET: [getCollectionProducts]
        }),
        createCollection: method({
            POST: [createCollection]
        }),
        updateCollection: method({
            PUT: [updateCollection]
        }),

        // USER
        registerUser: method({
            POST: [registerUser]
        }),
        getUserDocumentIdByEmail: method({
            GET: [getUserDocumentIdByEmail]
        }),

        // TRANSLATION
        triggerToken: method({
            GET: [triggerToken]
        }),
        getToken: method({
            POST: [getToken]
        }),
        getCategoryTranslation: method({
            GET: [getCategoryTranslation]
        }),
        getProductTranslation: method({
            GET: [getProductTranslation]
        }),
        translateCategory: method({
            POST: [translateCategory]
        }),
        translateProduct: method({
            POST: [translateProduct]
        }),
        fitsIn : method({
            GET: [setEnv,fitsIn]
        }),

        // BACK-IN-STOCK
        triggerBackInStockEmail: method({
            POST: [checkAuthorization, triggerBackInStockEmail]
        })
    }
})
