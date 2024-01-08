export interface AdditionalServicesProps {
	tooltipTexts: TooltipTexts[]
	installationModal: boolean
	tradepolicyWorkspace?: number
	fixedServiceTypeIds?: Array<string>
	IncludedOfferings: Service[]
}

export interface Service {
	id: string
	name: string
	description?: string
	price: number
	sellingPrice?: number
	position?: number
	__typename?: string
}

export interface TooltipTexts {
	addServiceName: string
	tooltipText: string
}
