export const getResizeImageUrl = (
	imageUrl: any,
	width: string | number = 800,
	height: string | number = 'auto',
) => {
	const imageUrlUpToId = imageUrl?.match(/.+ids\/(\d+)/)
	if (!imageUrlUpToId) return imageUrl
	return `${imageUrlUpToId?.[0]}-${width}-${height}?width=${width}&height=${height}&aspect=true`
}
