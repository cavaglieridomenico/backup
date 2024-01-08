import { json } from 'co-body'
import { UserInputError } from '@vtex/api'
import { itemObject, Message, MessageSimulation, simulationBody } from '../typings/cartFix'


export async function checkItemStock(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-cache');
  const { orderFormId } = await json(ctx.req)


  if (!orderFormId) {
    throw new UserInputError('orderFormId is required')
  }

  try {
    const currentOrderForm = await ctx.clients.vtexAPI.getOrderForm(ctx, orderFormId, ctx.state.CheckoutOrderFormOwnershipCookie);
    console.log(currentOrderForm, "\nORDER FORM")
    const items = currentOrderForm.items;

    let simulationBody: simulationBody = {
      postalCode: "",
      country: "",
      geoCoordinates: [0, 0],
      items: []
    };

    let itemNumber = 0;

    items.forEach((item: any) => {
      let itemBody: itemObject = {
        id: item.id,
        quantity: item.quantity,
        seller: item.seller
      }
      simulationBody.items.push(itemBody);
      itemNumber++;
    });

    if (itemNumber > 0) {
      try {
        const simulation = await ctx.clients.vtexAPI.cartSimulation(simulationBody, ctx.state.CheckoutOrderFormOwnershipCookie);
        if (simulation.messages.length > 0) {

          let bodyResponse: MessageSimulation = {
            arrayMessages: []
          };

          simulation.messages.forEach((message: Message) => {

            bodyResponse.arrayMessages.push(
              {
                code: message.code,
                text: message.text,
                status: message.status,
                fields: {
                  skuName: message.fields.skuName
                }
              });
          });

          ctx.status = 200;
          ctx.body = {
            messages: bodyResponse
          }
        } else {
          ctx.status = 200;
          ctx.body = {
            messages: [],
            text: "No errors found"
          }
        }
      } catch (error) {
        console.log('## error.response.data', error.response?.data)
        throw new Error(error)
      }

    } else {
      ctx.status = 200;
      ctx.body = {
        messages: [],
        text: "No items in cart"
      }
    }
    ctx.status = 200

    await next()
  } catch (error) {
    console.log('## error.response.data', error.response?.data)
    throw new Error(error)
  }
}
