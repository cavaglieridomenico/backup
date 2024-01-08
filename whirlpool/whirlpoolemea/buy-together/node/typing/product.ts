export interface BundleAssociations {
	target: number,
	associationType: String,
	associatedSku: number
}


export interface ProductArray {
	products: Product[]
}
export interface Product {
	skuId: String,
	brand: String,
	brandNumber: number,
	cacheNumber: number,
	categoryNumber: number,
	categories: [String],
	categoryTree: [Category],
	clusterHighlights: [ClusterHighlight],
	productClusters: [ProductClusters],
	description: String,
	items: [SKU],
	skuSpecifications: [SkuSpecification],
	link: String,
	linkText: String,
	productNumber: number,
	productName: String,
	properties: [Property],
	propertyGroups: [PropertyGroup],
	productReference: String,
	titleTag: String,
	metaTagDescription: String,
	recommendations: Recommendation,
	jsonSpecifications: String,
	benefits: [Benefit],
	itemMetadata: ItemMetadata,
	specificationGroups: [SpecificationGroup],
	priceRange: ProductPriceRange,
	releaseDate: String,
	selectedProperties: [SelectedProperty],
	rule: Rule,
}
interface SelectedProperty {
	key: String,
	value: String
}

interface Category {

	cacheNumber: number,

	href: String,

	slug: String,

	number: number,

	name: String,

	titleTag: String,

	hasChildren: Boolean,

	metaTagDescription: String,

	children: [Category],
}

interface Benefit {
	featured: Boolean,
	number: String,
	name: String,
	items: [BenefitItem],
	teaserType: String,
}

interface BenefitItem {
	benefitProduct: Product,
	benefitSKUNumbers: [String],
	discount: number,
	minQuantity: number,
}

interface ItemMetadata {
	items: [ItemMetadataUnit],
	priceTable: [ItemPriceTable],
}

interface ItemPriceTable {
	type: String,
	values: [PriceTableItem],
}

interface PriceTableItem {
	number: String,
	assemblyNumber: String,
	price: number,
}

interface ItemMetadataUnit {
	number: number,
	name: String,
	skuName: String,
	productNumber: String,
	refNumber: String,
	ean: String,
	imageUrl: String,
	detailUrl: String,
	seller: String,
	assemblyOptions: [AssemblyOption],
}

interface AssemblyOption {
	number: number,
	name: String,
	required: Boolean,
	composition: CompositionType,
	inputValues: [InputValue],
}


interface InputValue {
	label: String,
	maxLength: number,
	type: InputValueType,
	defaultValue: String | Boolean,
	domain: [String]
}

enum InputValueType {
	TEXT,
	BOOLEAN,
	OPTIONS
}

interface CompositionType {
	minQuantity: number,
	maxQuantity: number,
	items: [CompositionItem],
}

interface CompositionItem {
	number: number,
	minQuantity: number,
	maxQuantity: number,
	initialQuantity: number,
	priceTable: String,
	seller: String,
}


// enum ItemsFilter {
// 	ALL,
// 	FIRST_AVAILABLE,
// 	ALL_AVAILABLE
// }

interface ProductPriceRange {
	sellingPrice: PriceRange,
	listPrice: PriceRange,
}

interface PriceRange {
	highPrice: number,
	lowPrice: number,
}

interface OnlyProduct {
	brand: String,
	categoryNumber: number,
	categoryTree: [Category],
	clusterHighlights: [ClusterHighlight],
	productClusters: [ProductClusters],
	description: String,
	link: String,
	linkText: String,
	productNumber: number,
	productName: String,
	properties: [Property],
	propertyGroups: [PropertyGroup],
	productReference: String,
	recommendations: Recommendation,
	jsonSpecifications: String,
}

interface ProductClusters {
	number: number,
	name: String,
}

interface ClusterHighlight {
	number: number,
	name: String,
}

interface Seller {
	sellerId: string
	sellerNumber: number,
	sellerName: String,
	addToCartLink: String,
	sellerDefault: Boolean,
	commertialOffer: Offer,
}

interface Recommendation {
	buy: [Product],
	view: [Product],
	similars: [Product],
}

interface SKU {
	itemId: string,
	name: String,
	nameComplete: String,
	complementName: String,
	ean: String,
	referenceNumber: [Reference],
	measurementUnit: String,
	unitMultiplier: number,
	kitItems: [KitItem],
	images(quantity: number): [Image],
	vNumbereos: [VNumbereo],
	sellers: [Seller],
	variations: [Property],
	attachments: [Attachment],
	estimatedDateArrival: String,
}

interface SkuSpecification {
	field: SKUSpecificationField,
	values: [SKUSpecificationValue],
}

interface SKUSpecificationField {
	originalName: String,
	name: String,
}

interface SKUSpecificationValue {
	originalName: String,
	name: String,
}

/* interface productSpecification {
	fieldName: String ,
	fieldValues: [String] ,
} */


interface KitItem {
	itemNumber: number,
	amount: number,
	product: OnlyProduct,
	sku: SKU,
}

interface Attachment {
	number: number,
	name: String,
	required: Boolean,
	domainValues: [DomainValues],
}

interface DomainValues {
	FieldName: String,
	MaxCaracters: String,
	DomainValues: String,
}

/* enum InstallmentsCriteria {
	MAX_WITHOUT_NumberEREST,
	MAX_WITH_NumberEREST,
	MIN,
	ALL,
} */
//potrebbe dare errori
interface Offer {
	Price: number,
	ListPrice: number,
	spotPrice: number,
	PriceWithoutDiscount: number,
	RewardValue: number,
	PriceValNumberUntil: String,
	AvailableQuantity: number,
	Tax: number,
	taxPercentage: number,
	CacheVersionUsedToCallCheckout: String,
	DeliverySlaSamples: [DeliverySlaSamples],
	discountHighlights: [Discount],
	teasers: [Teaser],
	giftSkuNumbers: [String],
	gifts: [Gift],
}

interface Gift {
	productName: String,
	skuName: String,
	brand: String,
	linkText: String,
	description: String,
	images: [GiftImage],
}

interface GiftImage {
	imageUrl: String,
	imageLabel: String,
	imageText: String,
}

interface Teaser {
	name: String,
	conditions: TeaserCondition,
	effects: TeaserEffects,
}

interface TeaserCondition {
	minimumQuantity: number,
	parameters: [TeaserValue],
}

interface TeaserEffects {
	parameters: [TeaserValue],
}

interface TeaserValue {
	name: String,
	value: String,
}



interface Discount {
	name: String,
}

interface DeliverySlaSamples {
	DeliverySlaPerTypes: [DeliverySlaPerTypes],
	Region: Region,
}

interface DeliverySlaPerTypes {
	TypeName: String,
	Price: number,
	EstimatedTimeSpanToDelivery: String,
}

interface Region {
	IsPersisted: Boolean,
	IsRemoved: Boolean,
	number: number,
	Name: String,
	CountryCode: String,
	ZipCode: String,
	CultureInfoName: String,
}

interface Image {
	cacheNumber: number,
	imageNumber: number,
	imageLabel: String,
	imageTag: String,
	imageUrl: String,
	imageText: String,
}

interface VNumbereo {
	vNumbereoUrl: String,
}

interface SpecificationGroup {
	originalName: String,
	name: String,
	specifications: [SpecificationGroupProperty],
}

interface SpecificationGroupProperty {
	originalName: String,
	name: String,
	values: [String],
}

interface Property {
	originalName: String,
	name: String,
	values: [String],
}

interface PropertyGroup {
	name: String,
	properties: [String],
}

/* interface Installment {
	Value: number,
	NumbererestRate: number,
	TotalValuePlusNumbererestRate: number,
	NumberOfInstallments: number,
	PaymentSystemName: String,
	PaymentSystemGroupName: String,
	Name: String,
} */

interface Reference {
	Key: String,
	Value: String,
}

/* enum CrossSelingInputEnum {
	buy,
	similars,
	view,
	viewAndBought,
	accessories,
	suggestions,
} */

interface Rule {
	number: String
}

/* SECONDA QUERY */

export interface BodyDiscount {
	items: DiscountData[]
	country?: String
}

export interface DiscountData {
	id: String,
	quantity: number,
	seller: String
}

export interface DiscountResponse {
	items: ItemsDisount[],
	ratesAndBenefitsData: any,
	paymentData: PaymentData,
	selectableGifts: any[],
	marketingData: String,
	postalCode: String,
	country: String,
	logisticsInfo: LogisticsInfo[],
	messages: DiscountMessage[],
	purchaseConditions: PurchaseConditions,
	pickupPoints: any[],
	subscriptionData: any,
	totals: any[],
	itemMetadata: any
}

interface Offerings {
	type: String,
	id: String,
	name: String,
	allowGiftMessage: Boolean,
	attachmentOfferings: any[],
	price: number
}

interface PriceDefinition {
	calculatedSellingPrice: number,
	total: number,
	sellingPrices: SellingPrices[]
}

interface SellingPrices {
	value: number,
	quantity: number
}

interface ItemsDisount {
	id: String,
	requestIndex: number,
	quantity: number,
	seller: String,
	sellerChain: String[],
	tax: number,
	priceValidUntil: String,
	price: number,
	listPrice: number,
	rewardValue: number,
	sellingPrice: number,
	offerings: Offerings[],
	priceTags: any[],
	measurementUnit: String,
	unitMultiplier: number,
	parentItemIndex: number,
	parentAssemblyBinding: any,
	availability: String,
	catalogProvider: String,
	priceDefinition: PriceDefinition
}

interface PaymentData {
	installmentOptions: any[],
	paymentSystems: any[],
	payments: any[],
	giftCards: any[],
	giftCardMessages: any[],
	availableAccounts: any[],
	availableTokens: any[],
	availableAssociations: any
}

interface DeliveryChannels {
	id: String
}

interface LogisticsInfo {
	itemIndex: number,
	addressId: String,
	selectedSla: String,
	selectedDeliveryChannel: String,
	quantity: number,
	shipsTo: String[],
	slas: String[],
	deliveryChannels: DeliveryChannels[]
}

interface MessageFields {
	ean: String,
	itemIndex: String,
	skuName: String
}

interface DiscountMessage {
	code: String,
	text: String,
	status: String,
	fields: MessageFields
}

interface ItemPurchaseConditions {
	id: String,
	seller: String,
	sellerChain: String[],
	slas: any[],
	price: number,
	listPrice: number
}

interface PurchaseConditions {
	itemPurchaseConditions: ItemPurchaseConditions[]
}
