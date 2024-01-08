import { IOClients } from '@vtex/api'
import Manual from './manual'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get manual() {
        return this.getOrSet('manual', Manual)
    }
}
