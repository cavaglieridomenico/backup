import React from "react"
import ContentLoader from "react-content-loader"

export const ProductListSkeleton = () => (
	<ContentLoader width="100%" speed={1} height="100%" viewBox="0 0 380 80">
		<rect x="0" y="0" rx="8" ry="8" width="70" height="70" />
		<rect x="75" y="0" rx="3" ry="3" width="165" height="13" />
		<rect x="75" y="18" rx="3" ry="3" width="130" height="13" />
		<rect x="245" y="0" rx="3" ry="3" width="50" height="13" />
		<rect x="300" y="0" rx="3" ry="3" width="50" height="13" />
	</ContentLoader>
)
export const ProductSummarySkeleton = () => (
	<ContentLoader width="100%" speed={1} height="100%" viewBox="0 0 380 250">
		<rect x="0" y="0" rx="8" ry="8" width="380" height="50" />
		<rect x="0" y="60" rx="5" ry="5" width="380" height="25" />
		<rect x="0" y="105" rx="0" ry="0" width="380" height="1" />
		<rect x="0" y="126" rx="5" ry="5" width="380" height="30" />
		<rect x="180" y="166" rx="3" ry="3" width="200" height="15" />
		<rect x="20" y="210" rx="8" ry="8" width="340" height="40" />
	</ContentLoader>
)
export const CheckoutSkeleton = () => (
	<ContentLoader width="100%" speed={1} height="100%" viewBox="0 0 380 80">
		<rect x="0" y="-6" rx="3" ry="3" width="380" height="296" />
	</ContentLoader>
)
