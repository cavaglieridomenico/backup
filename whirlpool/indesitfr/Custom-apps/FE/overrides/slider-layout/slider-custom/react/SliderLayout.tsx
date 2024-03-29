import React, { PropsWithChildren } from 'react'
import { defineMessages } from 'react-intl'
import { CssHandlesTypes, useCssHandles } from 'vtex.css-handles'
import { useListContext } from 'vtex.list-context'
import { useResponsiveValue } from 'vtex.responsive-values'

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
  const newChildren = totalItems !== undefined && children !== null && children !== undefined? (children as Array<object>).splice((children as Array<object>).length-totalItems,(children as Array<object>).length) : children
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, { classes })
  const list = useListContext()?.list ?? []
  const totalSlides = React.Children.count(newChildren) + list.length
  const responsiveArrowIconSize = useResponsiveValue(arrowSize)
  const responsiveItemsPerPage = useResponsiveValue(itemsPerPage)
  const responsiveCenterMode = useResponsiveValue(centerMode)
  const slides = React.Children.toArray(newChildren).concat(list)
  // Force fullWidth mode when centerMode is on
  const resolvedFullWidth = fullWidth || responsiveCenterMode !== 'disabled'

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
    totalItems:{
      type:"number",
      description:"number of element to show",
      title:"Number of items",
      default:"undefined"
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
