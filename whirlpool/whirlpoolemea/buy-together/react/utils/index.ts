export const mapSKUItemsToCartItems = (
	skuItems: Item[] = [],
	currentItem: Product
): Array<CartItem | null> =>
	currentItem ? [...skuItems.map(item => {
		const {
			selectedItem: {
				itemId,
				name,
				measurementUnit,
				images,
				referenceId,
				seller,
				sellers,
			},
			product: {
				productId,
				linkText,
				productName,
				brand,
				categories,
				productReference,
			},
		} = item
		const selectedSeller = seller ?? sellers[0]

		if (!selectedSeller) {
			return null
		}
		return {
			id: itemId,
			productId,
			quantity: 1,
			uniqueId: '',
			detailUrl: `/${linkText}/p`,
			name: productName,
			brand,
			category: categories && categories.length > 0 ? categories[0] : '',
			productRefId: productReference,
			seller: selectedSeller.sellerId,
			variant: name,
			skuName: name,
			price: selectedSeller.commertialOffer.PriceWithoutDiscount * 100,
			listPrice: selectedSeller.commertialOffer.ListPrice * 100,
			sellingPrice: selectedSeller.commertialOffer.Price * 100,
			sellingPriceWithAssemblies: selectedSeller.commertialOffer.Price * 100,
			measurementUnit,
			skuSpecifications: [],
			imageUrl: images[0]?.imageUrl,
			options: [],
			assemblyOptions: {
				added: [],
				removed: [],
				parentPrice: selectedSeller.commertialOffer.Price,
			},
			referenceId,
		}
	}),
	{
		id: currentItem.items[0].itemId,
		productId: currentItem.productId,
		quantity: 1,
		uniqueId: '',
		detailUrl: `/${currentItem.linkText}/p`,
		name: currentItem.productName,
		brand: currentItem.brand,
		category: currentItem.categories && currentItem.categories.length > 0 ? currentItem.categories[0] : '',
		productRefId: currentItem.productReference,
		seller: currentItem.items[0].sellers[0].sellerId,
		variant: currentItem.items[0].name,
		skuName: currentItem.items[0].name,
		price: currentItem.items[0].sellers[0].commertialOffer.PriceWithoutDiscount * 100,
		listPrice: currentItem.items[0].sellers[0].commertialOffer.ListPrice * 100,
		sellingPrice: currentItem.items[0].sellers[0].commertialOffer.Price * 100,
		sellingPriceWithAssemblies: currentItem.items[0].sellers[0].commertialOffer.Price * 100,
		measurementUnit: currentItem.items[0].measurementUnit,
		skuSpecifications: [],
		imageUrl: currentItem.items[0].images[0]?.imageUrl,
		options: [],
		assemblyOptions: {
			added: [],
			removed: [],
			parentPrice: currentItem.items[0].sellers[0].commertialOffer.Price,
		},
		referenceId: currentItem.items[0].referenceId,
	}
	] : []

export const sortBaseProductsBySuggestedLists = (
	products: Product[],
	suggestedLists: SuggestedProductsList[]
) => {
	const ids =
		suggestedLists
			?.map(list => list.baseProductId)
			.filter(id => id && id !== '') ?? []
	return products?.sort(
		(a: Product, b: Product) =>
			ids.indexOf(a.productId) - ids.indexOf(b.productId)
	)
}

export const sortProductsBySuggestedIds = (
	products: Product[],
	suggestedIds: string[]
) => {
	return products?.sort(
		(a: Product, b: Product) =>
			suggestedIds.indexOf(a.productId) - suggestedIds.indexOf(b.productId)
	)
}

export const sortItemsByLists = (
	items: Item[],
	suggestedLists: SuggestedList[]
) => {
	const ids = suggestedLists.map(list => list.products[list.current].productId)
	const copyItems: Item[] = Object.assign([], items)
	return copyItems.sort(
		(a: Item, b: Item) =>
			ids.indexOf(a.product.productId) - ids.indexOf(b.product.productId)
	)
}
