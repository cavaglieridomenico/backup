/**
 * This mock runtime does not include fields:
 * - blocks
 * - blocksTree
 * - cacheHints
 * - components
 * - contentMap
 * - emitter
 * - introspectionResult
 * - workspaceCookie
 *
 * The following fields are set to = {}
 * - extensions
 * - messages
 */

export const runtime = {
  account: 'storecomponents',
  accountId: 'eade3d41847e4226b1c4e2fa592bcfad',
  amp: false,
  appsEtag: 'remove',
  assetServerLinkedHost: 'storecomponents.myvtex.com',
  assetServerLinkedPath: '/_v/private/assets/v1/linked/',
  assetServerPublishedHost: 'storecomponents.vtexassets.com',
  assetServerPublishedPath: '/_v/public/assets/v1/published/',
  binding: {
    id: 'aacb06b3-a8fa-4bab-b5bd-2d654d20dcd8',
    canonicalBaseAddress: 'storetheme.vtex.com/',
  },
  bindingChanged: false,
  culture: {
    availableLocales: [],
    country: 'USA',
    currency: 'USD',
    language: 'en',
    locale: 'en-US',
    customCurrencyDecimalDigits: null,
    customCurrencySymbol: '$',
  },
  disableSSQ: false,
  disableSSR: false,
  exposeBindingAddress: false,
  extensions: {},
  hints: {
    desktop: true,
    mobile: false,
    phone: false,
    tablet: false,
    unknown: false,
  },
  messages: {},
  page: 'store.home',
  pages: {
    'store.home': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/',
      routeId: 'store.home',
      blockId: 'vtex.store-theme@3.x:store.home',
      map: [],
    },
    'store.account': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/account',
      routeId: 'store.account',
      blockId: 'vtex.store-theme@3.x:store.account',
      map: [],
    },
    'store.login': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/login',
      routeId: 'store.login',
      blockId: 'vtex.store-theme@3.x:store.login',
      map: [],
    },
    'store.product': {
      allowConditions: true,
      context: 'vtex.store@2.x/ProductContext',
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/product/:id/:slug/p',
      routeId: 'store.product',
      blockId: 'vtex.store-theme@3.x:store.product',
      canonical: '/:slug/p',
      map: [],
    },
    'store.search': {
      allowConditions: true,
      context: 'vtex.store@2.x/SearchContext',
      declarer: 'vtex.store@2.x',
      path: '/:term/s',
      routeId: 'store.search',
      blockId: 'vtex.store-theme@3.x:store.search',
      canonical: '/:term',
      map: [],
    },
    'store.search#brand': {
      allowConditions: true,
      context: 'vtex.store@2.x/SearchContext',
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/brand/:id/:brand(/*terms)',
      routeId: 'store.search#brand',
      blockId: 'vtex.store-theme@3.x:store.search#brand',
      canonical: '/:brand',
      map: ['b'],
    },
    'store.search#department': {
      allowConditions: true,
      context: 'vtex.store@2.x/SearchContext',
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/department/:id/:department(/*terms)',
      routeId: 'store.search#department',
      blockId: 'vtex.store-theme@3.x:store.search#department',
      canonical: '/:department',
      map: ['c'],
    },
    'store.search#category': {
      allowConditions: true,
      context: 'vtex.store@2.x/SearchContext',
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/category/:id/:department/:category(/*terms)',
      routeId: 'store.search#category',
      blockId: 'vtex.store-theme@3.x:store.search#category',
      canonical: '/:department/:category',
      map: ['c', 'c'],
    },
    'store.search#subcategory': {
      allowConditions: true,
      context: 'vtex.store@2.x/SearchContext',
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/subcategory/:id/:department/:category/:subcategory(/*terms)',
      routeId: 'store.search#subcategory',
      blockId: 'vtex.store-theme@3.x:store.search#subcategory',
      canonical: '/:department/:category/:subcategory(/*terms)',
      map: ['c', 'c', 'c'],
    },
    'store.search#configurable': {
      allowConditions: true,
      context: 'vtex.store@2.x/SearchContext',
      declarer: 'vtex.store@2.x',
      path: '/s/*terms',
      routeId: 'store.search#configurable',
      blockId: 'vtex.store-theme@3.x:store.search',
      map: [],
    },
    'store.orderplaced': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/checkout/orderPlaced',
      routeId: 'store.orderplaced',
      blockId: 'vtex.store-theme@3.x:store.orderplaced',
      map: [],
    },
    'store.offline': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/_v/offline',
      routeId: 'store.offline',
      blockId: 'vtex.store@2.x:store.offline',
      map: [],
    },
    'store.not-found#product': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/notFoundProduct/:id/:slug/p',
      routeId: 'store.not-found#product',
      blockId: 'vtex.store-theme@3.x:store.not-found#product',
      canonical: '/:slug/p',
      map: [],
    },
    'store.not-found#search': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store@2.x',
      path: '/_v/segment/routing/vtex.store@2.x/notFoundSearch/:id/*terms',
      routeId: 'store.not-found#search',
      blockId: 'vtex.store-theme@3.x:store.not-found#search',
      canonical: '/*terms',
      map: [],
    },
    'store.custom#about-us': {
      allowConditions: true,
      context: null,
      declarer: 'vtex.store-theme@3.x',
      path: '/about-us',
      routeId: 'store.custom#about-us',
      blockId: 'vtex.store-theme@3.x:store.custom#about-us',
      map: [],
    },
    'vtex.store@2.x:store.custom#scheduled-page': {
      allowConditions: true,
      context: null,
      declarer: null,
      auth: false,
      path: '/scheduled-page',
      routeId: 'vtex.store@2.x:store.custom#scheduled-page',
      blockId: 'vtex.store@2.x:store.custom',
      map: [],
    },
  },
  platform: 'vtex',
  production: false,
  publicEndpoint: 'myvtex.com',
  query: {},
  renderMajor: 8,
  route: {
    domain: 'store',
    id: 'store.home',
    pageContext: {
      id: 'store.home',
      type: 'route',
    },
    params: {},
    path: '/',
    pathId: '/',
    queryString: {},
    fonts:
      '/_v/public/vtex.styles-graphql/v1/fonts/763084e2070c87d114459f42f07894b40143cfcc',
    overrides: [
      '/_v/public/vtex.styles-graphql/v1/overrides/vtex.product-list@0.19.0$overrides.css',
      '/_v/public/vtex.styles-graphql/v1/overrides/vtex.minicart@2.44.0$overrides.css',
      '/_v/public/vtex.styles-graphql/v1/overrides/vtex.store-theme@3.30.1$overrides.css',
    ],
    rootName: 'store.home',
    ssr: true,
    style:
      '/_v/public/vtex.styles-graphql/v1/style/vtex.store-theme@3.21.2$style.min.css',
    styleMeta: {
      fontsHash: '763084e2070c87d114459f42f07894b40143cfcc',
      overridesIds: [
        {
          id: 'vtex.product-list@0.19.0$overrides.css',
        },
        {
          id: 'vtex.minicart@2.44.0$overrides.css',
        },
        {
          id: 'vtex.store-theme@3.30.1$overrides.css',
        },
      ],
      themeId: 'vtex.store-theme@3.21.2$style.min.css',
    },
    blockId: 'vtex.store-theme@3.x:store.home',
    canonicalPath: '/',
    metaTags: null,
    routeId: 'store.home',
    title: null,
    varyContentById: false,
  },
  runtimeMeta: {
    config: null,
    version: '8.95.1',
  },
  segmentToken: '12345abcde',
  settings: {
    'vtex.store': {
      storeName: 'Store Theme - VTEX Base Store',
      titleTag: 'Store Theme - VTEX Base Store',
      metaTagDescription: 'Store Theme - VTEX Base Store',
      metaTagKeywords: 'store theme, vtex, store, vtex io, base store, vtex',
    },
  },
  start: true,
  workspace: 'addtocartbutton',
}
