import React, { useState } from 'react'
import styles from '../styles.css'
import { usePixel } from 'vtex.pixel-manager'
// import microondeSvg from "../assets/microonde.svg"

interface FilterProps {
  filterCategory: any
  filterCourses: any
  antipastoFilter: boolean
  primiFilter: boolean
  dolciFilter: boolean
  estrattiFilter: boolean
  microondeFilter: boolean
  fornoFilter: boolean
  juicerFilter: boolean
}

interface WindowGTM extends Window {
  dataLayer: any[]
}

const Filters: StorefrontFunctionComponent<FilterProps> = ({
  filterCategory,
  filterCourses,
  antipastoFilter,
  primiFilter,
  dolciFilter,
  estrattiFilter,
  microondeFilter,
  fornoFilter,
  juicerFilter,
}) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || []
  const { push } = usePixel()
  const [isActiveType, setIsActiveType]: any = useState(0)
  const [isActiveCategory1, setIsActiveCategory1]: any = useState(false)
  const [isActiveCategory2, setIsActiveCategory2]: any = useState(false)
  const [isActiveCategory3, setIsActiveCategory3]: any = useState(false)
  const [isActiveCategory4, setIsActiveCategory4]: any = useState(false)

  // Analytics
  const filtersPush = (filterValue, filterFamily) => {
    dataLayer.push({
      event: 'recipeFilters',
      eventCategory: 'Recipe Facet Tracking',
      eventAction: `Filter Recipes - ${filterFamily}`,
      eventLabel: filterValue,
      recipeFilterFamily: filterFamily,
    })
  }

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filters}>
        <div className={styles.categoryFiltersContainer}>
          <a
            className={
              !microondeFilter
                ? styles.imageFilterDisabled
                : isActiveType == 1
                ? styles.imageFilterActive
                : styles.imageFilter
            }
            onClick={() => {
              filterCourses('MICROONDE'),
                setIsActiveType(isActiveType == 1 ? 0 : 1),
                filtersPush('microwaves', 'category')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'Appliances',
                    filterValue: 'microonde',
                    type: 'recipe',
                  },
                })
            }}
          >
            <svg
              width="82px"
              height="48px"
              viewBox="0 0 82 48"
              className={styles.FilterImage}
            >
              <g transform="" id="TAB-GROUP">
                <path
                  d="M27.7433537,24.8148434 C27.9434582,24.6257349 27.9434582,24.3198072 27.7433537,24.1312771 L12.8805478,10.0852048 C12.6804433,9.89609639 12.3567269,9.89609639 12.1572343,10.0852048 C11.9571299,10.2737349 11.9571299,10.5796627 12.1572343,10.7687711 L27.0200403,24.8148434 C27.1197866,24.9091084 27.2507418,24.9565301 27.381697,24.9565301 C27.5126522,24.9565301 27.6436075,24.9091084 27.7433537,24.8148434 Z M45.3666224,33.1078554 C45.5661149,32.9193253 45.5661149,32.6133976 45.3666224,32.4242892 L21.6300701,9.99209639 C21.4299657,9.80356627 21.1062493,9.80356627 20.9067567,9.99209639 C20.7066522,10.1812048 20.7066522,10.4871325 20.9067567,10.6756627 L44.643309,33.1078554 C44.7430552,33.2026988 44.8740104,33.2495422 45.0049657,33.2495422 C45.1359209,33.2495422 45.2662642,33.2026988 45.3666224,33.1078554 Z M8.59390597,6.49503614 C7.71026418,6.49503614 6.99123433,7.17455422 6.99123433,8.00963855 L6.99123433,39.2217831 C6.99123433,40.0568675 7.71026418,40.7363855 8.59390597,40.7363855 L57.5552493,40.7363855 C58.4382791,40.7363855 59.157309,40.0568675 59.157309,39.2217831 L59.157309,8.00963855 C59.157309,7.17455422 58.4382791,6.49503614 57.5552493,6.49503614 L8.59390597,6.49503614 Z M57.5552493,41.7033253 L8.59390597,41.7033253 C7.14605522,41.7033253 5.96807015,40.5900723 5.96807015,39.2217831 L5.96807015,8.00963855 C5.96807015,6.6413494 7.14605522,5.52809639 8.59390597,5.52809639 L57.5552493,5.52809639 C59.0024881,5.52809639 60.1804731,6.6413494 60.1804731,8.00963855 L60.1804731,39.2217831 C60.1804731,40.5900723 59.0024881,41.7033253 57.5552493,41.7033253 Z M67.0776522,36.2220723 C66.1940104,36.2220723 65.4749806,36.9015904 65.4749806,37.7360964 L65.4749806,39.2217831 C65.4749806,40.0568675 66.1940104,40.7363855 67.0776522,40.7363855 L73.5219955,40.7363855 C74.4056373,40.7363855 75.1246672,40.0568675 75.1246672,39.2217831 L75.1246672,37.7360964 C75.1246672,36.9015904 74.4056373,36.2220723 73.5219955,36.2220723 L67.0776522,36.2220723 Z M73.5219955,41.7033253 L67.0776522,41.7033253 C65.6298015,41.7033253 64.4518164,40.5900723 64.4518164,39.2217831 L64.4518164,37.7360964 C64.4518164,36.3683855 65.6298015,35.2551325 67.0776522,35.2551325 L73.5219955,35.2551325 C74.9698463,35.2551325 76.1478313,36.3683855 76.1478313,37.7360964 L76.1478313,39.2217831 C76.1478313,40.5900723 74.9698463,41.7033253 73.5219955,41.7033253 Z M70.6881,21.5103614 C70.0339358,21.5103614 69.3803836,21.7451566 68.8822642,22.2159036 C67.8866373,23.1568193 67.8866373,24.6881928 68.8822642,25.6291084 C69.878503,26.5700241 71.497697,26.5700241 72.4939358,25.6291084 C73.4895627,24.6881928 73.4895627,23.1568193 72.4939358,22.2159036 C71.9958164,21.7451566 71.3422642,21.5103614 70.6881,21.5103614 Z M70.6881,27.301012 C69.7726373,27.301012 68.8565627,26.9713735 68.1589507,26.3126747 C66.7649507,24.9946988 66.7649507,22.8503133 68.1589507,21.5323373 C69.5541746,20.2149398 71.8226373,20.2149398 73.2172493,21.5323373 C74.6118612,22.8503133 74.6118612,24.9946988 73.2172493,26.3126747 C72.5196373,26.9713735 71.6041746,27.301012 70.6881,27.301012 Z M70.6881,6.95306024 C70.0339358,6.95306024 69.3803836,7.18843373 68.8822642,7.65918072 C67.8866373,8.60009639 67.8866373,10.1308916 68.8822642,11.0718072 C69.878503,12.0133012 71.497697,12.0133012 72.4939358,11.0718072 C73.4895627,10.1308916 73.4895627,8.60009639 72.4939358,7.65918072 C71.9958164,7.18843373 71.3422642,6.95306024 70.6881,6.95306024 Z M70.6881,12.7437108 C69.7726373,12.7437108 68.8565627,12.4140723 68.1589507,11.7553735 C66.7649507,10.4379759 66.7649507,8.29301205 68.1589507,6.97561446 C69.5541746,5.65821687 71.8226373,5.65821687 73.2172493,6.97561446 C74.6118612,8.29301205 74.6118612,10.4379759 73.2172493,11.7553735 C72.5196373,12.4140723 71.6041746,12.7437108 70.6881,12.7437108 Z M4.01230896,0.966939759 C2.36374179,0.966939759 1.0229806,2.23460241 1.0229806,3.792 L1.0229806,43.6499277 C1.0229806,45.2073253 2.36374179,46.4744096 4.01230896,46.4744096 L77.5907866,46.4744096 C79.2387418,46.4744096 80.5801149,45.2073253 80.5801149,43.6499277 L80.5801149,3.792 C80.5801149,2.23460241 79.2387418,0.966939759 77.5907866,0.966939759 L4.01230896,0.966939759 Z M77.5907866,47.4413494 L4.01230896,47.4413494 C1.79953284,47.4413494 -0.000183582089,45.7405301 -0.000183582089,43.6499277 L-0.000183582089,3.792 C-0.000183582089,1.70139759 1.79953284,0 4.01230896,0 L77.5907866,0 C79.8029507,0 81.6032791,1.70139759 81.6032791,3.792 L81.6032791,43.6499277 C81.6032791,45.7405301 79.8029507,47.4413494 77.5907866,47.4413494 Z"
                  id="path-1"
                ></path>
              </g>
            </svg>
            <span className={styles.imageFilterText}>Microonde</span>
          </a>
          <a
            className={
              !fornoFilter
                ? styles.imageFilterDisabled
                : isActiveType == 2
                ? styles.imageFilterActive
                : styles.imageFilter
            }
            onClick={() => {
              filterCourses('FORNO'),
                setIsActiveType(isActiveType == 2 ? 0 : 2),
                filtersPush('ovens', 'category')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'Appliances',
                    filterValue: 'forno',
                    type: 'recipe',
                  },
                })
            }}
          >
            <svg
              width="184.25px"
              height="184.25px"
              id="Livello_1"
              data-name="Livello 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 184.25 184.25"
              className={styles.FilterImage}
            >
              <title>FornoIncasso</title>
              <path
                id="FornoIncasso"
                d="M135.93,44.25a4.86,4.86,0,0,1,4.84,4.84v92.74a4.86,4.86,0,0,1-4.84,4.84H47.63a4.86,4.86,0,0,1-4.84-4.84V49.09a4.86,4.86,0,0,1,4.84-4.84h88.3m0-1.67H47.63a6.52,6.52,0,0,0-6.51,6.51v92.74a6.52,6.52,0,0,0,6.51,6.51h88.3a6.52,6.52,0,0,0,6.51-6.51V49.09a6.52,6.52,0,0,0-6.51-6.51ZM57.77,61.52a5.52,5.52,0,1,1,3.9-1.62A5.48,5.48,0,0,1,57.77,61.52Zm0-9.37a3.79,3.79,0,0,0-2.72,1.13,3.85,3.85,0,0,0,0,5.44,3.84,3.84,0,0,0,5.44,0,3.86,3.86,0,0,0,0-5.44h0A3.83,3.83,0,0,0,57.77,52.15Zm66,9.37a5.52,5.52,0,1,1,3.9-1.62A5.48,5.48,0,0,1,123.78,61.52Zm0-9.37a3.79,3.79,0,0,0-2.72,1.13,3.85,3.85,0,0,0,0,5.44,3.84,3.84,0,0,0,5.44,0,3.86,3.86,0,0,0,0-5.44h0A3.83,3.83,0,0,0,123.78,52.15Zm9.47,15.57a.83.83,0,0,0-.84-.84H51.14a.84.84,0,0,0,0,1.67h81.27A.83.83,0,0,0,133.25,67.72ZM129,136.34H54.6a4.3,4.3,0,0,1-4.29-4.29V82a4.3,4.3,0,0,1,4.29-4.29H129A4.3,4.3,0,0,1,133.25,82v50A4.3,4.3,0,0,1,129,136.34ZM54.6,79.41A2.63,2.63,0,0,0,52,82v50a2.63,2.63,0,0,0,2.62,2.62H129a2.63,2.63,0,0,0,2.62-2.62V82A2.63,2.63,0,0,0,129,79.41Zm56,43a.83.83,0,0,0,0-1.18L74.33,85a.84.84,0,0,0-1.18,1.19l36.27,36.26a.79.79,0,0,0,.59.25A.81.81,0,0,0,110.6,122.42ZM83.67,109a.84.84,0,0,0,0-1.19L61,85.13a.83.83,0,0,0-1.18,1.18L82.49,109a.84.84,0,0,0,.59.24A.82.82,0,0,0,83.67,109Zm-47.54.4V46a8.67,8.67,0,0,1,8.67-8.66h94.66A8.67,8.67,0,0,1,148.12,46V68.65a.84.84,0,1,0,1.67,0V46a10.35,10.35,0,0,0-10.33-10.34H44.8A10.35,10.35,0,0,0,34.46,46v63.39a.84.84,0,1,0,1.67,0ZM97.56,53.17A1.79,1.79,0,0,1,99.35,55v2.16a1.79,1.79,0,0,1-1.79,1.78H84a1.78,1.78,0,0,1-1.78-1.78V55A1.78,1.78,0,0,1,84,53.17H97.56m0-1.67H84A3.46,3.46,0,0,0,80.53,55v2.16A3.46,3.46,0,0,0,84,60.56H97.56A3.47,3.47,0,0,0,101,57.11V55a3.47,3.47,0,0,0-3.46-3.45Z"
              ></path>
            </svg>
            <span className={styles.imageFilterText}>Forno</span>
          </a>
          <a
            className={
              !juicerFilter
                ? styles.imageFilterDisabled
                : isActiveType == 3
                ? styles.imageFilterActive
                : styles.imageFilter
            }
            onClick={() => {
              filterCourses('SLOW JUICER'),
                setIsActiveType(isActiveType == 3 ? 0 : 3),
                filtersPush('juicers', 'category')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'Appliances',
                    filterValue: 'slower juiser',
                    type: 'recipe',
                  },
                })
            }}
          >
            <svg
              className={styles.FilterImage}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60.45 103.43"
            >
              <g data-name="Livello 2">
                <path
                  d="M54.76 96.92a.76.76 0 0 1-.75.75l-46.65.06a.75.75 0 1 1 0-1.5L54 96.17a.75.75 0 0 1 .76.75zm4.24 4.62a5.49 5.49 0 0 1-4.09 1.82l-49.42.07A5.51 5.51 0 0 1 0 97.37l1.09-31.48a6.85 6.85 0 0 1 6.81-6.22h2.43a8.29 8.29 0 0 1-.74-1.53h-.78a4.09 4.09 0 0 1-4.07-3.8l-1.88-21v-.13a4.32 4.32 0 0 1 4.31-4.32h20.39a4.32 4.32 0 0 1 4.31 4.31v.13L30 54.31a4.08 4.08 0 0 1-4 3.8h-.64a8.24 8.24 0 0 1-.73 1.53h2.65a4 4 0 0 0 4-3.62l2.87-20.59a8.31 8.31 0 0 1 8.3-7.5h7.17a5.5 5.5 0 0 1 5.49 5l5.31 64.37a5.5 5.5 0 0 1-1.42 4.24zM9.21 56.63a9.52 9.52 0 0 1-.12-1.31 8.31 8.31 0 0 1 2.45-5.92.74.74 0 0 1 1.06 0 .71.71 0 0 1 .22.53.74.74 0 0 1-.22.53 6.86 6.86 0 0 0 4.86 11.71 6.86 6.86 0 0 0 4.84-11.72.75.75 0 0 1 1.06-1.07 8.28 8.28 0 0 1 2.46 5.92 8.17 8.17 0 0 1-.11 1.31H26a2.57 2.57 0 0 0 2.57-2.41l1.83-21.07a2.82 2.82 0 0 0-2.81-2.8H7.2a2.81 2.81 0 0 0-2.8 2.82l1.84 21.08a2.57 2.57 0 0 0 2.57 2.4h.4zm49.71 40.81L53.58 33a4 4 0 0 0-4-3.59h-7.16a6.84 6.84 0 0 0-6.81 6.18l-2.87 20.62a5.48 5.48 0 0 1-5.48 4.94h-3.82l-.05.07a8.39 8.39 0 0 1-11.84 0l-.05-.06H7.9A5.33 5.33 0 0 0 2.59 66L1.53 97.47a4 4 0 0 0 4 4.46l49.42-.07a4 4 0 0 0 4-4.42zm-53-70.12l45.36-.06a.76.76 0 0 0 0-1.51l-45.35.06a.76.76 0 0 0 0 1.51zM22.66 48a.87.87 0 0 0 .53.38.86.86 0 0 0 .92-1.28l-9-14.49a.85.85 0 1 0-1.44.9zm-8.57-3.2a.85.85 0 0 0 .91-1.28L8.54 33.1a.85.85 0 0 0-1.45.9l6.47 10.42a.87.87 0 0 0 .53.38zm27.55-2.23A4.74 4.74 0 1 1 45 44a4.75 4.75 0 0 1-3.36-1.43zm1.14-1.15A3.12 3.12 0 1 0 45 36.09a3.09 3.09 0 0 0-2.22.92 3.12 3.12 0 0 0 0 4.41zM14 58.83a.76.76 0 0 0 1.07 0 .77.77 0 0 0 0-1.07 3.46 3.46 0 0 1 0-4.9 3.47 3.47 0 0 1 4.91 4.9.74.74 0 0 0 0 1.06.75.75 0 0 0 1.06 0 5 5 0 0 0-3.52-8.48A5 5 0 0 0 14 58.83zm4-37.3V3.87A3.84 3.84 0 0 1 21.74 0h5.91a3.86 3.86 0 0 1 3.85 3.85v17.66a2.68 2.68 0 0 1-2.67 2.67h-8.25a2.69 2.69 0 0 1-1.89-.78 2.65 2.65 0 0 1-.78-1.87zm1.39-17.66v17.65a1.17 1.17 0 0 0 1.17 1.17h8.28A1.16 1.16 0 0 0 30 21.51V3.86a2.36 2.36 0 0 0-2.35-2.36h-5.91a2.36 2.36 0 0 0-2.35 2.37z"
                  data-name="Livello 1"
                ></path>
              </g>
            </svg>
            <span className={styles.imageFilterText}>Slower juicer</span>
          </a>
        </div>
        <div className={styles.filtersDivider}>
          <div></div>
        </div>
        <div className={styles.coursersFiltersContainer}>
          <a
            className={
              isActiveCategory1
                ? styles.filterCoursesActive
                : !antipastoFilter
                ? styles.filterDisabled
                : styles.filterCourses
            }
            onClick={() => {
              filterCategory('Antipasti'),
                setIsActiveCategory1(!isActiveCategory1),
                filtersPush('appetizers', 'course')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'dishes',
                    filterValue: 'antipasti',
                    type: 'recipe',
                  },
                })
            }}
          >
            <span className={styles.filterCourserText}>Antipasti</span>
          </a>
          <a
            className={
              isActiveCategory2
                ? styles.filterCoursesActive
                : !primiFilter
                ? styles.filterDisabled
                : styles.filterCourses
            }
            onClick={() => {
              filterCategory('Primi e secondi'),
                setIsActiveCategory2(!isActiveCategory2),
                filtersPush('first and second courses', 'course')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'dishes',
                    filterValue: 'primi e secondi',
                    type: 'recipe',
                  },
                })
            }}
          >
            <span className={styles.filterCourserText}>Primi e secondi</span>
          </a>
          <a
            className={
              isActiveCategory3
                ? styles.filterCoursesActive
                : !dolciFilter
                ? styles.filterDisabled
                : styles.filterCourses
            }
            onClick={() => {
              filterCategory('Dolci'),
                setIsActiveCategory3(!isActiveCategory3),
                filtersPush('desserts', 'course')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'dishes',
                    filterValue: 'dolci',
                    type: 'recipe',
                  },
                })
            }}
          >
            <span className={styles.filterCourserText}>Dolci</span>
          </a>
          <a
            className={
              isActiveCategory4
                ? styles.filterCoursesActive
                : !estrattiFilter
                ? styles.filterDisabled
                : styles.filterCourses
            }
            onClick={() => {
              filterCategory('Estratti'),
                setIsActiveCategory4(!isActiveCategory4),
                filtersPush('extracts', 'course')
                //GA4FUNREQ13+14+15+81
                push({
                  event: 'filterManipulation',
                  items: {
                    filterName: 'dishes',
                    filterValue: 'estratti',
                    type: 'recipe',
                  },
                })
            }}
          >
            <span className={styles.filterCourserText}>Estratti</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Filters
