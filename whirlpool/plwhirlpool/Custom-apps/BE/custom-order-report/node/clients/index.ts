import { IOClients } from '@vtex/api'
import AuthUser from './AuthUser'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get AuthUser() {
        return this.getOrSet('AuthUser', AuthUser)
    }

}
