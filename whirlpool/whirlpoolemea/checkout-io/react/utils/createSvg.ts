export const createSvg = (svgString: string) => {
	const svgBase64 = Buffer.from(svgString).toString("base64")
	return `data:image/svg+xml;base64,${svgBase64}`
}
