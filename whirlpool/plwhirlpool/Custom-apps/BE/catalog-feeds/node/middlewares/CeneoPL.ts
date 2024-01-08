//import { CeneoXMLFeed } from "../typings/productDetails";
import { Builder } from "xml2js"
export async function CeneoPLFeed(ctx: Context, next: () => Promise<any>) {
  ctx.set('cache-control', 'no-store') //da rimuovere
  try {
    const { settings, products } = ctx.state
    const filteredXml = products.filter((el: any) => el.items.find((item: any) => item.sellers)?.sellers.find((seller: any) => seller.sellerId == "1")?.commertialOffer?.AvailableQuantity > 0)
    const xmlBody = filteredXml.map((el: any) => {
      let imgs = el.items.find((el: any) => el.images).images.map((img: any) => img.imageUrl)
      let attributes = { EAN: el.properties.find((property: any) => property.name.includes("EAN"))?.values[0], seller: el.brand }
      return {
        $: {
          id: el.productId,
          url: `${settings.publicUrl}/${el.linkText}/p`,
          price: el.items.find((item: any) => item.sellers)?.sellers.find((seller: any) => seller.sellerId == "1")?.commertialOffer?.Price,
          avail: 1
        },
        cat: {
          _: el.categoryTree.find((cat: any) => el.categoryId == cat.id).name
        },
        name: {
          _: el.productName,
        },
        imgs: {
          main: {
            $: {
              url: el.items.find((el: any) => el.images).images[0].imageUrl,
            }
          },
          i: buildImg(imgs),
        },
        desc: {
          _: el.description,
        },
        attrs: {
          a: buildAttrs(attributes),
        }
      }
    })

    const xml = {
      "offers": {
        "$": {
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "version": "1"
        },
        o: xmlBody
      }
    }

    const builder = new Builder({ cdata: true, xmldec: { version: "1.0", encoding: "UTF-8" } })
    ctx.body = builder.buildObject(xml)
    ctx.set('content-type', 'text/xml')
    ctx.status = 200;
    await next()
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

const buildAttrs = (obj: any) => {
  return Object.keys(obj).map((el: any) => {
    return {
      $: {
        name: el
      },
      _: obj[el]
    }
  })
}
const buildImg = (imgs: any) => {
  imgs.shift() //remove the first element of the array since is the mainImage
  return imgs.map((el: any) => {
    return {
      $: {
        url: el
      }
    }
  })
}
