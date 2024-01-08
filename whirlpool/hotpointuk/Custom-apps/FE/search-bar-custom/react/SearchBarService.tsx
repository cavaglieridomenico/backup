import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useIntl, defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Input } from 'vtex.styleguide'
import SearchIconService from './SearchIconService'

const CSS_HANDLES = ['container', 'iconContainer'] as const

const messages = defineMessages({
	placeholder: {
		id: 'store/search-bar-custom.service.placeholder',
		defaultMessage: 'Search service',
	},
})

interface SearchBarServiceProps {
	placeholder: string
	hrefRedirect: string
	useVtexNavigation: boolean
}

const SearchBarService: StorefrontFunctionComponent<SearchBarServiceProps> = ({
	placeholder = 'Search service',
	hrefRedirect = '/service/search',
	useVtexNavigation = false,
}) => {
	const handles = useCssHandles(CSS_HANDLES)
	const { formatMessage } = useIntl()
	const { navigate } = useRuntime()
	const [search, setSearch] = useState('')

	const handleSearch = (event: any) => {
		if (event?.key === 'Enter') {
			useVtexNavigation
				? navigate({
						to: hrefRedirect,
						query: `search=${search}`,
				  })
				: (window.location.href = `${hrefRedirect}?search=${search}`)
			setSearch('')
		}
	}

	const handleSearchClick = () => {
		useVtexNavigation
			? navigate({
					to: hrefRedirect,
					query: `search=${search}`,
			  })
			: (window.location.href = `${hrefRedirect}?search=${search}`)
		setSearch('')
	}

	return (
		<div className={`${handles.container} flex`}>
			<Input
				value={search}
				placeholder={placeholder ?? formatMessage(messages.placeholder)}
				onChange={(e: any) => setSearch(e.target.value)}
				onKeyPress={handleSearch}
				suffix={
					<SearchIconService
						handleSearch={handleSearchClick}
						blockClass={handles.iconContainer}
					/>
				}
			/>
		</div>
	)
}

SearchBarService.schema = {
	title: 'Search Bar Service',
	description: 'Search bar used in the Hotpoint UK Service',
	type: 'object',
	properties: {
		placeholder: {
			type: 'string',
			default: 'Search service',
			title: 'Search Bar Input placeholder',
		},
		hrefRedirect: {
			type: 'string',
			default: '/service/search?search=',
			title: 'Href redirect after search',
		},
		useVtexNavigation: {
			type: 'boolean',
			default: false,
			title:
				'Set true if you want to use VTEX navigation (navigate function from VTEX Runtime)',
		},
	},
}

export default SearchBarService
