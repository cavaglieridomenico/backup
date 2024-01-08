import { InstanceOptions, ExternalClient, IOContext } from '@vtex/api'
import { handleSpecialChars } from '../utils/functions'



export default class SandWatch extends ExternalClient {
    production = false
    constructor(context: IOContext, options?: InstanceOptions) {
        super("https://api.d2c.service-locator.wpsandwatch.com", context, {
            ...options,
            headers: {
                Accept: "application/json"
            },
        })
    }



    public async SLCities(brand: string, country: string, locale: string, country_id: string, province: string, region: string): Promise<any> {
        let path = handleSpecialChars({ province, region })
        return new Promise((resolve, reject) => {
            this.http.get(`/v1/geo/cities?brand=${brand}&country=${country}&locale=${locale}&province_id=${path.province}&region_id=${path.region}&country_id=${country_id}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
        })
    }

    public async SLProvinces(brand: string, country: string, locale: string, region: string, country_id: string): Promise<any> {
        let path = handleSpecialChars({ region })
        return new Promise((resolve, reject) => {
            this.http.get(`/v1/geo/provinces?brand=${brand}&country=${country}&locale=${locale}&region_id=${path.region}&country_id=${country_id}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
        })
    }

    public async SLRegions(brand: string, country: string, locale: string, country_id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`/v1/geo/regions?brand=${brand}&country=${country}&locale=${locale}&country_id=${country_id}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))

        })

    }

    public async SLServices(brand: string, country: string, locale: string, country_id: string, province: string, region: string, city: string): Promise<any> {
        let path = handleSpecialChars({ province, region, city })
        return new Promise((resolve, reject) => {
            this.http.get(`/v1/geo/services?brand=${brand}&country=${country}&locale=${locale}&province_id=${path.province}&region_id=${path.region}&country_id=${country_id}&cities_id=${path.city}`)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
        })
    }
} 