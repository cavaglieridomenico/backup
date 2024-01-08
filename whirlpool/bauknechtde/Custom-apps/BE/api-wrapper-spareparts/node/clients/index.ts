import { IOClients } from '@vtex/api'
import VtexAPI from './vtexApi'
import masterdata from './masterdataCUSTOM'
import Products from './product'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get vtexAPI() {
        return this.getOrSet('vtexAPI', VtexAPI)
    }
    public get masterdataCUSTOM() {
        return this.getOrSet('masterdata', masterdata)
    }
    public get products() {
        return this.getOrSet('products', Products);
    }
}
