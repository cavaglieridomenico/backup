import { IOClients } from '@vtex/api'
import SandWatch from './sandWatch'
export class Clients extends IOClients {

    public get sandWatch() {
        return this.getOrSet("sandwatch", SandWatch)
    }
}
