type AppSettings = {
	bindingBounded: boolean
	bindingId?: string
	salesChannel: string
}

type BindingBoundedAppSettings = {
	bindingBounded: boolean
	settings: AppSettings[]
}
