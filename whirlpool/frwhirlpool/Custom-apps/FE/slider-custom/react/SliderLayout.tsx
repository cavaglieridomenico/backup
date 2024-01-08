import React, { PropsWithChildren, useState, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import { CssHandlesTypes, useCssHandles } from 'vtex.css-handles'
import { useListContext } from 'vtex.list-context'
import { useResponsiveValue } from 'vtex.responsive-values'
import Loading from './Skeleton'
import Slider, { CSS_HANDLES as SliderCssHandles } from './components/Slider'
import {
  SliderContextProvider,
  SliderLayoutProps,
  SliderLayoutSiteEditorProps,
} from './components/SliderContext'
import { CssHandlesProvider } from './modules/cssHandles'

export const CSS_HANDLES = SliderCssHandles

interface Props {
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function SliderLayout({
  totalItems,
  skeletonHeight,
  infinite = false,
  showNavigationArrows = 'always',
  showPaginationDots = 'always',
  usePagination = true,
  fullWidth = true,
  arrowSize = 25,
  children,
  centerMode = 'disabled',
  itemsPerPage = {
    desktop: 5,
    tablet: 3,
    phone: 1,
  },
  classes,
  ...contextProps
}: PropsWithChildren<SliderLayoutProps & SliderLayoutSiteEditorProps & Props>) {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, { classes })

  //children management to print
  const newChildren = totalItems && children ? (children as Array<object>).slice(0, totalItems) : children
  const list = useListContext()?.list ?? []
  const totalSlides = React.Children.count(newChildren) + list.length
  const slides = React.Children.toArray(newChildren).concat(list)

  const responsiveArrowIconSize = useResponsiveValue(arrowSize)
  const responsiveItemsPerPage = useResponsiveValue(itemsPerPage)
  const responsiveCenterMode = useResponsiveValue(centerMode)

  const skel = [
    <div style={{ height: skeletonHeight, width: "304px" }}>
      <Loading height={"284"} count={4} />
    </div>,
    <div style={{ height: skeletonHeight, width: "304px" }}>
      <Loading height={"284"} count={4} />
    </div>,
    <div style={{ height: skeletonHeight, width: "304px" }}>
      <Loading height={"284"} count={4} />
    </div>,
    <div style={{ height: skeletonHeight, width: "304px" }}>
      <Loading height={"284"} count={4} />
    </div>,
    <div style={{ height: skeletonHeight, width: "304px" }}>
      <Loading height={"284"} count={4} />
    </div>,
  ]
  // Force fullWidth mode when centerMode is on
  const resolvedFullWidth = fullWidth || responsiveCenterMode !== 'disabled'

  const [skelON, setSkelON] = useState(true)
  //wait the componet is mount then set 'skelON' as false 
  useEffect(() => {
    setTimeout(() => (setSkelON(false)), 0)
  }, []);

  if (skelON) {
    return (<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "80vw", margin: "auto" }}>
      {skel}
    </div>
    )
  } else {
    return (
      <CssHandlesProvider handles={handles} withModifiers={withModifiers}>
        <SliderContextProvider
          infinite={infinite}
          totalItems={totalSlides}
          itemsPerPage={responsiveItemsPerPage}
          centerMode={responsiveCenterMode}
          {...contextProps}
        >
          <Slider
            centerMode={responsiveCenterMode}
            infinite={infinite}
            showNavigationArrows={showNavigationArrows}
            showPaginationDots={showPaginationDots}
            totalItems={totalSlides}
            usePagination={usePagination}
            fullWidth={resolvedFullWidth}
            arrowSize={responsiveArrowIconSize}
            itemsPerPage={responsiveItemsPerPage}
          >
            {slides}
          </Slider>
        </SliderContextProvider>
      </CssHandlesProvider>
    )
  }
}

const messages = defineMessages({
  sliderTitle: {
    id: 'admin/editor.slider-layout.title',
    defaultMessage: '',
  },
  sliderInfinite: {
    id: 'admin/editor.slider-layout.infinite',
    defaultMessage: '',
  },
  sliderShowNavigation: {
    id: 'admin/editor.slider-layout.showNavigation',
    defaultMessage: '',
  },
  sliderShowPaginationDots: {
    id: 'admin/editor.slider-layout.showPaginationDots',
    defaultMessage: '',
  },
  sliderUsePagination: {
    id: 'admin/editor.slider-layout.usePagination',
    defaultMessage: '',
  },
  sliderFullWidth: {
    id: 'admin/editor.slider-layout.sliderFullWidth',
    defaultMessage: '',
  },
  sliderFullWidthDescription: {
    id: 'admin/editor.slider-layout.sliderFullWidthDescription',
    defaultMessage: '',
  },
})

SliderLayout.schema = {
  title: messages.sliderTitle.id,
  type: 'object',
  properties: {
    totalItems: {
      type: "number",
      description: "Numero di elementi da mostrare",
      title: "Numero di elementi",
      default: "undefined"
    },
    skeletonHeight: {
      type: "string",
      description: "Altezza dello skeleton principale",
      title: "Altezza Skeleton Loader",
      default: "516"
    },
    autoplay: {
      type: 'object',
      isLayout: true,
      properties: {
        timeout: {
          type: 'number',
        },
        stopOnHover: {
          type: 'boolean',
        },
      },
    },
    itemsPerPage: {
      type: 'object',
      isLayout: true,
      properties: {
        desktop: {
          default: 5,
          type: 'number',
        },
        tablet: {
          default: 3,
          type: 'number',
        },
        phone: {
          default: 1,
          type: 'number',
        },
      },
    },
  },
}

export default SliderLayout
