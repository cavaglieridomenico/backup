import React, { FC } from 'react'
import { IconSearch } from 'vtex.styleguide'

interface SearchIconServiceProps {
	handleSearch: any
	blockClass: any
}

const SearchIconService: FC<SearchIconServiceProps> = ({
	handleSearch,
	blockClass,
}) => {
	return (
		<div
			className={`${blockClass} flex justify-center items-center`}
			onClick={handleSearch}
		>
			<IconSearch />
		</div>
	)
}

export default SearchIconService
