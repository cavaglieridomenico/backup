export const isViewportMaxWidth = (breakpoint: string | number): boolean =>
	window.matchMedia && window.matchMedia(`(max-width: ${breakpoint}px)`).matches
