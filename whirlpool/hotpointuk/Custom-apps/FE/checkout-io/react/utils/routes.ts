// FOR EACH STEP YOU SHOULD ADD THE CORRESPONDING ROUTE
const routes = {
  CART: { route: "/cart", order: 0 },
  INDEX: { route: "/", order: 1 },
  PROFILE: { route: "/profile", order: 2 },
  SHIPPING: { route: "/shipping", order: 4 },
  ADDRESS: { route: "/address", order: 3 },
  PAYMENT: { route: "/payment", order: 5 },
}

export const getCurrentStep = (window: any) => {
  let hash = window?.location?.hash?.replace("#", "")
  let currentStep = Object.values(routes).find(step => step.route == hash)
  return currentStep || routes.INDEX
}

export default routes