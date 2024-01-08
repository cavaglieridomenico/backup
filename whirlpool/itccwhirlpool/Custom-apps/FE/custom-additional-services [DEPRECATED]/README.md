# Additional Services

This app is responsible of rendering all the additional services inside the cart page. The user will se the available services specific for that binding. There's also the check for gas and some other products with installation service: when clicked a modal appears showing all the needed infos.
This app has been customized because of the additional services specificity for cc, having a common one for all.

### NOTES

- (not mandatory) need to specify inside the theme this:
  `"custom-additional-services":{
    "props": {
      "installationModal": true,
      "tradepolicyWorkspace": 2,
      "fixedServiceTypeIds": [999]
    }
  },`
  so you'll have the Installation modal for gas Products(only for ukcc), and you can test inside the workspace the tradepolicy you prefer, choosing one of 1, 2 or 3 just as the VIP, FF and EPP salesChannels, and you can put serviceIds to fiter fixed services.

- need to specify (If needed in the country) via Site editor the list of additional services, with their names, filterNames(used inside the code to filter the correct service), tooltip boolean(used to show hide tooltip for that specific service), Description(if tooltip is true this will be its text)

- to handle MULTILANGUAGE we used an api `/_v/wrapper/api/product/${productId}/customAdditionalServices?sc=${orderForm?.orderForm?.salesChannel}&locale=${locale}`: this will return all informations translated from backend. If the country doesn't support this, it will be simply ignored and will use the orderform informations(and the site editor for tooltips if present).



