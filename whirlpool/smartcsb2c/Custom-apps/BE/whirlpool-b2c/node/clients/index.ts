import { IOClients } from '@vtex/api';

// Import clients
import { Search } from "@vtex/clients/build";
import Products from './product';
import ProductSpecificationClass from './productSpecification';
import Specification from './specification';
import Sku from './sku';
import Document from "./document";
import Category from "./category";
import SearchClient from './search';
import Inventory from "./inventory";
import Attachment from "./attachment";
import Collections from './collections';
import User from './user';
import TradePolicy from './trade';
import { GraphqlTranslation } from './graphql.translation';

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    // Category client
    public get category() {
        return this.getOrSet('category', Category);
    }
    // Products client
    public get products() {
        return this.getOrSet('products', Products);
    }
    // Product specification client
    public get productSpecification() {
        return this.getOrSet('productSpecification', ProductSpecificationClass);
    }
    // Sku client
    public get sku() {
        return this.getOrSet('sku', Sku);
    }
    // Specification client
    public get specification() {
        return this.getOrSet('specification', Specification);
    }
    // Document client
    public get document() {
        return this.getOrSet('document', Document);
    }
    // Search client
    public get search() {
        return this.getOrSet('search', SearchClient);
    }
    // Inventory client
    public get inventory() {
        return this.getOrSet('inventory', Inventory);
    }
    // Attachment client
    public get attachment() {
        return this.getOrSet('attachment', Attachment);
    }
    // Collections client
    public get collections() {
        return this.getOrSet('collections', Collections);
    }
    // Collections client
    public get Search() {
        return this.getOrSet('Search', Search);
    }
    // User client
    public get user() {
        return this.getOrSet('user', User);
    }
    // Trade Policy client
    public get tradePolicy() {
        return this.getOrSet('tradePolicy', TradePolicy);
    }

    // GRAPHQL 
    // GraphQL Translation client
    public get graphqlTranslation() {
        return this.getOrSet('graphqlTranslation', GraphqlTranslation)
    }
}
