'use strict'

const API = require("../SendToAPI");
const fs = require('fs');
const catalogEntry = require('../catalogJsonFiles/CatalogEntry.json');
const catalogEntryDescription = require("../catalogJsonFiles/CatalogEntryDescription.json");
const BODLSkuIdToVtexSkuId = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const productIdMapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");
const SkuXAccessories = require("../catalogJsonFiles/SkuXAccessories.json");
const SkuXAccessories_converted = require("./SkuXAccessories_converted.json");
const accessoriesTriples = require("./accessoriesTriples.json");
const betaBundles = require("./betaBundles.json");
const bundles = require("./bundles.json");

function convertFile(){
    let bundles = [];
    SkuXAccessories.forEach(r => {
        let bundle = {};
        let acs = [];
        if(r.acc1!=0){
            acs.push(r.acc1);
        }
        if(r.acc2!=0){
            acs.push(r.acc2);
        } 
        if(r.acc3!=0){
            acs.push(r.acc3);
        }
        bundle["sku"]=r.sku;
        bundle["accessories"]=acs;
        bundles.push(bundle);
    
    });
    fs.writeFileSync("./new/SkuXAccessories_converted.json", JSON.stringify(bundles, null, 2));
}

function customIncludes(a,b){
    let ret = false;
    a.forEach(r0 => {
        let counter = 0;
        b.forEach(r1 => {
            if(r0.includes(r1)){
                counter++;
            }
        });
        if(counter==b.length){
            ret = true;
        }
    });
    return ret;
}

function getAccessoriesTriples(){
    let accessoriesArray=[];
    SkuXAccessories_converted.forEach(r => {
        if(!customIncludes(accessoriesArray,r.accessories)){
            accessoriesArray.push(r.accessories);
        }
    });
}

function customEquals(a,b){
    let counter = 0;
    b.forEach(r => {
        if(a.includes(r)){
            counter++;
        }
    });
    if(counter==b.length){
        return true;
    }
    return false;
}

function productsXAcessTriples (){
    let res = [];
    accessoriesTriples.forEach(r => {
        let obj = {};
        let prods = [];
        SkuXAccessories_converted.forEach(r1 => {
            if(customEquals(r,r1.accessories)){
                prods.push(r1.sku);
            }
        });
        obj["products"]=prods;
        obj["accessories"]=r;
        res.push(obj);
    });
    fs.writeFileSync("./new/betaBundles.json", JSON.stringify(res, null, 2));
}

function buildBundles (){
    let res = [];
    betaBundles.forEach(r => {
        let obj = {};
        let prods = [];
        let accs = [];
        r.products.forEach(p => {
            if(BODLSkuIdToVtexSkuId[p]!=undefined){
                prods.push(BODLSkuIdToVtexSkuId[p]);
            }
        });
        r.accessories.forEach(a => {
            if(BODLSkuIdToVtexSkuId[a]!=undefined){
                accs.push(BODLSkuIdToVtexSkuId[a]);
            }
        });
        if(prods.length>0 && accs.length>0){
            obj["products"]=prods;
            obj["accessories"]=accs;
            res.push(obj);
        }
    });
    fs.writeFileSync("./new/bundles.json", JSON.stringify(res, null, 2));
}

function createBundle(){
    API.start(200);
    var counter = 0;
    bundles.forEach(r0 => {
        let accessories = [];
        let products = [];
        r0.accessories.forEach(a => {
            let acc = {
                id: a,
                name: Object.keys(BODLSkuIdToVtexSkuId).find(k => BODLSkuIdToVtexSkuId[k]==a)+" ("+a+")",
                quantity: 1,
                sellers: [
                    {
                        id: "1",
                        name: "1"
                    }
                ]
            };
            accessories.push(acc);
        });
        r0.products.forEach(p => {
            let pid = Object.keys(BODLSkuIdToVtexSkuId).find(k => BODLSkuIdToVtexSkuId[k]==p);
            let parent = catalogEntry.root.record.find(r => r.partnumber==pid).parentpartnumber;
            let prod = {
                id: p,
                name: catalogEntryDescription.root.record.find(rx => rx.partnumber==parent).name+" (Product "+productIdMapping[parent]+")"
            };
            products.push(prod);
        });
        let bundle = {
            name: "Gift-"+counter,
            beginDateUtc: "2021-02-08T23:00:00Z",
            endDateUtc: "3021-02-09T22:30:00Z",
            lastModified: "2021-02-09T17:05:16.5566888Z",
            daysAgoOfPurchases: 0,
            isActive: true,
            isArchived: false,
            isFeatured: false,
            disableDeal: false,
            activeDaysOfWeek: [],
            offset: 1,
            activateGiftsMultiplier: true,
            newOffset: 1.0,
            maxPricesPerItems: [],
            cumulative: true,
            nominalShippingDiscountValue: 0.0,
            absoluteShippingDiscountValue: 0.0,
            nominalDiscountValue: 0.0,
            maximumUnitPriceDiscount: 0.0,
            percentualDiscountValue: 0.0,
            rebatePercentualDiscountValue: 0.0,
            percentualShippingDiscountValue: 0.0,
            percentualTax: 0.0,
            shippingPercentualTax: 0.0,
            percentualDiscountValueList1: 0.0,
            percentualDiscountValueList2: 0.0,
            skusGift: {
                quantitySelectable: accessories.length,
                gifts: accessories
            },
            nominalRewardValue: 0.0,
            percentualRewardValue: 0.0,
            orderStatusRewardValue: "invoiced",
            maxNumberOfAffectedItems: 0,
            maxNumberOfAffectedItemsGroupKey: "perCart",
            applyToAllShippings: false,
            nominalTax: 0.0,
            origin: "Marketplace",
            idSellerIsInclusive: true,
            idsSalesChannel: [],
            areSalesChannelIdsExclusive: false,
            marketingTags: [],
            marketingTagsAreNotInclusive: false,
            paymentsMethods: [],
            stores: [],
            campaigns: [],
            storesAreInclusive: true,
            categories: [],
            categoriesAreInclusive: true,
            brands: [],
            brandsAreInclusive: true,
            products: products,
            productsAreInclusive: true,
            skus: [],
            skusAreInclusive: true,
            collections1BuyTogether: [],
            collections2BuyTogether: [],
            minimumQuantityBuyTogether: 0,
            quantityToAffectBuyTogether: 0,
            enableBuyTogetherPerSku: false,
            listSku1BuyTogether: [],
            listSku2BuyTogether: [],
            coupon: [],
            totalValueFloor: 0.0,
            totalValueCeling: 0.0,
            totalValueIncludeAllItems: false,
            totalValueMode: "IncludeMatchedItems",
            collections: [],
            collectionsIsInclusive: true,
            restrictionsBins: [],
            cardIssuers: [],
            totalValuePurchase: 0.0,
            slasIds: [],
            isSlaSelected: false,
            isFirstBuy: false,
            firstBuyIsProfileOptimistic: true,
            compareListPriceAndPrice: false,
            isDifferentListPriceAndPrice: false,
            zipCodeRanges: [],
            itemMaxPrice: 0.0,
            itemMinPrice: 0.0,
            installment: 0,
            isMinMaxInstallments: false,
            minInstallment: 0,
            maxInstallment: 0,
            merchants: [],
            clusterExpressions: [],
            clusterOperator: "all",
            paymentsRules: [],
            giftListTypes: [],
            productsSpecifications: [],
            affiliates: [],
            maxUsage: 0,
            maxUsagePerClient: 0,
            multipleUsePerClient: true,
            type: "regular",
            useNewProgressiveAlgorithm: false,
            percentualDiscountValueList: []
        };
        //console.log(bundle);
        API.sendRequest('/api/rnb/pvt/calculatorconfiguration', 'POST', bundle, null,null);
        counter++;
    });
    API.stop();    
}

//convertFile();
//getAccessoriesTriples();
//productsXAcessTriples();
//buildBundles();
createBundle();