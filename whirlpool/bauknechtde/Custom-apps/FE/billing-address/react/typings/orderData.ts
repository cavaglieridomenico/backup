export interface OrderData {
	orderID?: string;
	sequence?: string;
	marketplaceOrderID?: string;
	marketplaceServicesEndpoint?: string;
	sellerOrderID?: string;
	origin?: string;
	affiliateID?: string;
	salesChannel?: string;
	merchantName?: null;
	status?: string;
	statusDescription?: string;
	value?: number;
	creationDate?: Date;
	lastChange?: Date;
	orderGroup?: string;
	totals?: Total[];
	items?: ItemElement[];
	marketplaceItems?: any[];
	clientProfileData?: ClientProfileData;
	giftRegistryData?: null;
	marketingData?: MarketingData;
	ratesAndBenefitsData?: RatesAndBenefitsData;
	shippingData?: ShippingData;
	paymentData?: PaymentData;
	packageAttachment?: PackageAttachment;
	sellers?: Seller[];
	callCenterOperatorData?: null;
	followUpEmail?: string;
	lastMessage?: null;
	hostname?: string;
	invoiceData?: InvoiceData;
	changesAttachment?: null;
	openTextField?: null;
	roundingError?: number;
	orderFormID?: string;
	commercialConditionData?: null;
	isCompleted?: boolean;
	customData?: CustomData;
	storePreferencesData?: StorePreferencesData;
	allowCancellation?: boolean;
	allowEdition?: boolean;
	isCheckedIn?: boolean;
	marketplace?: Marketplace;
	authorizedDate?: Date;
	invoicedDate?: null;
	cancelReason?: null;
	itemMetadata?: ItemMetadata;
	subscriptionData?: null;
	taxData?: null;
	checkedInPickupPointID?: null;
	cancellationData?: null;
}

export interface ClientProfileData {
	id?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	documentType?: string;
	document?: null;
	phone?: string;
	corporateName?: string;
	tradeName?: string;
	corporateDocument?: string;
	stateInscription?: string;
	corporatePhone?: string;
	isCorporate?: boolean;
	userProfileID?: string;
	customerClass?: null;
}

export interface CustomData {
	customApps?: CustomApp[];
}

export interface CustomApp {
	fields?: Fields;
	id?: string;
	major?: number;
}

export interface Fields {
	codiceFiscaleAzienda?: string;
	sdipec?: string;
	sendInvoiceTo?: string;
	typeOfDocument?: string;
}

export interface InvoiceData {
	address?: Address;
}

export interface Address {
	postalCode?: string;
	city?: string;
	state?: string;
	country?: string;
	street?: string;
	number?: string;
	neighborhood?: null;
	complement?: null;
	reference?: null;
	geoCoordinates?: any[];
	addressType?: string;
	receiverName?: string;
	addressID?: string;
}

export interface ItemMetadata {
	items?: Item[];
}

export interface Item {
	id?: string;
	seller?: string;
	name?: string;
	skuName?: string;
	productID?: string;
	refID?: string;
	ean?: string;
	imageURL?: string;
	detailURL?: string;
	assemblyOptions?: any[];
}

export interface ItemElement {
	uniqueID?: string;
	id?: string;
	productID?: string;
	ean?: string;
	lockID?: string;
	itemAttachment?: ItemAttachment;
	attachments?: any[];
	quantity?: number;
	seller?: string;
	name?: string;
	refID?: string;
	price?: number;
	listPrice?: number;
	manualPrice?: null;
	priceTags?: any[];
	imageURL?: string;
	detailURL?: string;
	components?: any[];
	bundleItems?: any[];
	params?: any[];
	offerings?: any[];
	sellerSku?: string;
	priceValidUntil?: null;
	commission?: number;
	tax?: number;
	preSaleDate?: null;
	additionalInfo?: AdditionalInfo;
	measurementUnit?: string;
	unitMultiplier?: number;
	sellingPrice?: number;
	isGift?: boolean;
	shippingPrice?: null;
	rewardValue?: number;
	freightCommission?: number;
	priceDefinitions?: null;
	taxCode?: null;
	parentItemIndex?: null;
	parentAssemblyBinding?: null;
	callCenterOperator?: null;
	serialNumbers?: null;
	assemblies?: any[];
	costPrice?: number;
}

export interface AdditionalInfo {
	brandName?: string;
	brandID?: string;
	categoriesIDS?: string;
	categories?: Category[];
	productClusterID?: string;
	commercialConditionID?: string;
	dimension?: Dimension;
	offeringInfo?: null;
	offeringType?: null;
	offeringTypeID?: null;
}

export interface Category {
	id?: number;
	name?: string;
}

export interface Dimension {
	cubicweight?: number;
	height?: number;
	length?: number;
	weight?: number;
	width?: number;
}

export interface ItemAttachment {
	content?: Content;
	name?: null;
}

export interface Content {
}

export interface MarketingData {
	id?: string;
	utmSource?: null;
	utmPartner?: null;
	utmMedium?: null;
	utmCampaign?: null;
	coupon?: null;
	utmiCampaign?: null;
	utmipage?: null;
	utmiPart?: null;
	marketingTags?: string[];
}

export interface Marketplace {
	baseURL?: string;
	isCertified?: null;
	name?: string;
}

export interface PackageAttachment {
	packages?: any[];
}

export interface PaymentData {
	giftCards?: any[];
	transactions?: Transaction[];
}

export interface Transaction {
	isActive?: boolean;
	transactionID?: string;
	merchantName?: string;
	payments?: Payment[];
}

export interface Payment {
	id?: string;
	paymentSystem?: string;
	paymentSystemName?: string;
	value?: number;
	installments?: number;
	referenceValue?: number;
	cardHolder?: null;
	cardNumber?: null;
	firstDigits?: null;
	lastDigits?: null;
	cvv2?: null;
	expireMonth?: null;
	expireYear?: null;
	url?: null;
	giftCardID?: null;
	giftCardName?: null;
	giftCardCaption?: null;
	redemptionCode?: null;
	group?: string;
	tid?: string;
	dueDate?: null;
	connectorResponses?: ConnectorResponses;
	giftCardProvider?: null;
	giftCardAsDiscount?: null;
	koinURL?: null;
	accountID?: null;
	parentAccountID?: null;
	bankIssuedInvoiceIdentificationNumber?: null;
	bankIssuedInvoiceIdentificationNumberFormatted?: null;
	bankIssuedInvoiceBarCodeNumber?: null;
	bankIssuedInvoiceBarCodeType?: null;
	billingAddress?: null;
}

export interface ConnectorResponses {
	tid?: string;
	returnCode?: null;
	message?: null;
	authID?: string;
	acquirer?: string;
}

export interface RatesAndBenefitsData {
	id?: string;
	rateAndBenefitsIdentifiers?: RateAndBenefitsIdentifier[];
}

export interface RateAndBenefitsIdentifier {
	description?: null;
	featured?: boolean;
	id?: string;
	name?: string;
	matchedParameters?: MatchedParameters;
	additionalInfo?: null;
}

export interface MatchedParameters {
	productCatalogSystem?: string;
}

export interface Seller {
	id?: string;
	name?: string;
	logo?: string;
	fulfillmentEndpoint?: string;
}

export interface ShippingData {
	id?: string;
	address?: Address;
	logisticsInfo?: LogisticsInfo[];
	trackingHints?: null;
	selectedAddresses?: Address[];
}

export interface LogisticsInfo {
	itemIndex?: number;
	selectedSla?: string;
	lockTTL?: string;
	price?: number;
	listPrice?: number;
	sellingPrice?: number;
	deliveryWindow?: DeliveryWindow;
	deliveryCompany?: string;
	shippingEstimate?: string;
	shippingEstimateDate?: Date;
	slas?: Sla[];
	shipsTo?: string[];
	deliveryIDS?: DeliveryID[];
	deliveryChannel?: string;
	pickupStoreInfo?: PickupStoreInfo;
	addressID?: string;
	polygonName?: null;
	pickupPointID?: null;
	transitTime?: string;
}

export interface DeliveryID {
	courierID?: string;
	courierName?: string;
	dockID?: string;
	quantity?: number;
	warehouseID?: string;
	accountCarrierName?: string;
}

export interface DeliveryWindow {
	startDateUTC?: Date;
	endDateUTC?: Date;
	price?: number;
}

export interface PickupStoreInfo {
	additionalInfo?: null;
	address?: null;
	dockID?: null;
	friendlyName?: null;
	isPickupStore?: boolean;
}

export interface Sla {
	id?: string;
	name?: string;
	shippingEstimate?: string;
	deliveryWindow?: DeliveryWindow;
	price?: number;
	deliveryChannel?: string;
	pickupStoreInfo?: PickupStoreInfo;
	polygonName?: null;
	lockTTL?: string;
	pickupPointID?: null;
	transitTime?: string;
}

export interface StorePreferencesData {
	countryCode?: string;
	currencyCode?: string;
	currencyFormatInfo?: CurrencyFormatInfo;
	currencyLocale?: number;
	currencySymbol?: string;
	timeZone?: string;
}

export interface CurrencyFormatInfo {
	currencyDecimalDigits?: number;
	currencyDecimalSeparator?: string;
	currencyGroupSeparator?: string;
	currencyGroupSize?: number;
	startsWithCurrencySymbol?: boolean;
}

export interface Total {
	id?: string;
	name?: string;
	value?: number;
}
