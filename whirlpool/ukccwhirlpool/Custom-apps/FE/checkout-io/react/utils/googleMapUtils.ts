import addressStates from '../utils/addressStates';

export const loadGMapsScript = () => {
  const mapURL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCTsKMvwf-S3N8PWrii8Nd4hzzRJRZGjVE&libraries=places&callback=initAutocomplete'
  //Check if GMaps script already exist and delete it
  const scripts = document.getElementsByTagName('script')
  for(let i=0; i < scripts.length; i++) {
    if(scripts[i].src.includes('maps.googleapis')) {
      scripts[i].remove()
    }
  }
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = mapURL
  script.async = true
  script.defer = true
  index.parentNode?.insertBefore(script,index)
}

export const getPlaceInfo = (address_info: any) => {
  let placeInfo = {
    number: '',
    street: '',
    state: '',
    country: '',
    city: '',
    postalCode: ''
  }
  address_info.map((item: any) => {
    item?.types.map((type: string) => {
      switch(type) {
        case "street_number": placeInfo.number = item.short_name; break;
        case "route": placeInfo.street = item.short_name; break;
        case "locality": placeInfo.city = item.short_name; break;
        case "postal_town": placeInfo.city = item.short_name; break;    // Added for English addresses
        case "administrative_area_level_1": placeInfo.state = getPlaceState(item.short_name) || ''; break;
        case "country": placeInfo.country = item.short_name; break;
        case "postal_code": placeInfo.postalCode = item.short_name; break;
      }
    })
  })

  return placeInfo
}

const getPlaceState = (state: string) => {
  return addressStates.find((item: any) => (
    item.value === state || item.label === state
  ))?.value
}

export const countryMapping =  {
  "FR": "FRA",
  "GB": "GBR"
}