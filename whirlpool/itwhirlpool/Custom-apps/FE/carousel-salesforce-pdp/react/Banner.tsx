import React
// , {useEffect} 
from 'react'
import { Link } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
// import { useQuery, gql } from 'react-apollo'

const styles = require('./styles');

const CSS_HANDLES = ['imgRegular', 'img', 'bannerLink'] as const



// const product =gql`
// {
//   productSearch(query: "869991594180"){
//     products{
//       items{
//         itemId
//       }
//       productId
//     }
//   }
// }
// `;



export interface Props {
  /** The image_link of the banner */
  image_link: string
  /** Link for the mobile image_link of the banner */
  mobileImage: string
  /** The name of the image_link */
  name: string
  /** Max height size of the banner */
  height: number
  /** The link where the image_link is pointing to, in case of external route */
  link: string
  /** The page where the image_link is pointing to */
  page: string
  /** Params of the link */
  params: string
  /** Indicates if the route is external or not */
  externalRoute: boolean
  /** The link where the image_link is pointing to, in case of internal route (optional) */
  customInternalURL: string
  /** Runtime injected deps */
  runtime: any
  /** Link for the tablet image_link of the banner */
  tabletImage: string
  
  regular_price: number
  added_date: string
  product_code: string
  sale_price: number
  sku_id: string
  brand_name: string
  catalog_type: string
}

function getParams(params: string) {
  const json: { [s: string]: string } = {}
  if (params) {
    const array = params.split(',')
    array.forEach(item => {
      const pair = item.split('=')
      json[pair[0]] = pair[1]
    })
    return json
  }
  return null
}

const Banner = (props: Props) => {
  const {
    link,
    page,
    image_link,
    params,
    mobileImage,
    tabletImage,
    height = 591,
    externalRoute,
    name = '',
    customInternalURL,
    regular_price,
    sale_price 
  } = props

  const { isMobile, device } = useDevice()
  const handles = useCssHandles(CSS_HANDLES)
    const { orderForm, loading } = useOrderForm()


    
    const addToCard = (event:any) => {
          //prodyct details

          const optionss = {
            method: 'GET',
          };
          const url = '/_v/wrapper/api/catalog_system/products/'+38+'/specification'
          console.log(url,"proooooooooduct");
          fetch(url,optionss).
          then(responsee=> {
            console.log("response product", responsee);
          }).catch(errr => {
            console.log("response errrrrrr",errr);
          })
      const orderFormId = !loading && orderForm ? orderForm.id : undefined
      
      console.log(orderForm, "orderFormId");
      event.preventDefault();
      fetch(`/api/checkout/pub/orderForm/${orderFormId}/items`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: 
      "{\"orderItems\": [{\"seller\": \"1\",\"quantity\": 1,\"id\": \"38\"}]}"
    })
    .then(response => {
      console.log("response",response);
      
    }) 
    .catch(err => {
      console.error("errr",err);
      
    });
  }

  const content = (
    <div className={classnames(styles.containerImg, 'flex w-100 mw9 items-center justify-center')}>
      <div
        className={classnames(
          handles.imgRegular,
          'flex '
        )}
        style={{ maxHeight: height }}
      >
        <img
          className={classnames(styles.img)}
          src={
            device === 'tablet'
              ? tabletImage || image_link
              : isMobile && mobileImage
              ? mobileImage
              : image_link
          }
          alt={name}
        />
      </div>
      <div className={classnames(styles.nameContainer, 'w-80')}>
      <span
        className={classnames(styles.name)}
        >{name}
      </span>
        </div>
      <div className={classnames(styles.price, 'w-80')} >
        <div className={classnames(styles.regularPrice)}>{regular_price}&nbsp;€</div>
        <div className={classnames(styles.salePrice, 'flex mt0 mb6 pt0 pb0    justify-start  vtex-flex-layout-0-x-flexRowContent items-stretch w-100')}>
          <div>

          {sale_price}&nbsp;€
          </div>
        <div>
          <span className={classnames(handles.discount, 'vtex-product-price-1-x-savings vtex-product-price-1-x-savings--summary vtex-product-price-1-x-savings--padding vtex-product-price-1-x-savings--backWhitheBorderEdb112ColorEdb112')}>
          {Math.floor((sale_price/regular_price) * 100)}&nbsp;%
          </span>
        </div>
        </div>
      </div>
        <button onClick={addToCard} className={classnames(styles.addToCardButton, 'vtex-button bw1 ba fw5 v-mid relative pa0 lh-solid min-h-regular t-action bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary pointer w-80 ')}>
          aggiungi al carello
        </button>
    </div>

  )

  if (!externalRoute) {
    return page || customInternalURL ? (
      <Link
        className={classnames(handles.bannerLink, 'w-100')}
        page={customInternalURL ? undefined : page}
        params={getParams(params)}
        to={customInternalURL || undefined}
      >
        {content}
      </Link>
    ) : (
      content
    )
  }

  return (
    <a
      className={classnames(handles.bannerLink, 'w-80')}
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      text-decoration= "none"
    >
      {content}
    </a>
  )
}

export default Banner