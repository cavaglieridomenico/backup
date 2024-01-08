//REQUESTS

import { ApprovedAuthorization } from "@vtex/payment-provider"

export interface Eligibility {
    purchase_amount: number
    queries?: QueriesObj[]
    origin?: string
    billing_address?: ReqAddresses
    shipping_address?: ReqAddresses
}

export interface QueriesObj {
    installments_count: number
    deferred_days?: number
    deferred_months?: number
    purchase_amount?: number
    deferred_trigger?: boolean
}

//RESPONSES

export interface ResEligibility {
    eligible: boolean
    deferred_days: number
    deferred_months: number
    installments_count: number
    customer_total_cost_amount: number
    customer_total_cost_bps: number
    payment_plan: PaymentPlan[],
    constraints: string | number
    reasons: string
}

interface PaymentPlan {
    purchase_amount: number
    customer_fee: number
    customer_interest: number
    total_amount: number
    due_date: string
}

//Create Payment Objs

export interface PaymentRequest {
    payment: PaymentObj
    //customer: CustomerObj
    order: OrderObj
}

export interface PaymentObj {
    purchase_amount: number
    installments_count?: number | null
    billing_address?: AddressesObj
    customer_cancel_url?: string
    custom_data?: any
    deferred_months?: number
    deferred_days?: number
    ipn_callback_url?: string
    return_url?: string
    shipping_address?: AddressesObj
    locale?: string
    deferred?: string
    deferred_description?: string
    expires_after?: number

}

export interface CustomerObj {
    id?: string
    created?: string
    first_name?: string
    last_name?: string
    addresses?: AddressesObj[]
    email?: string
    phone?: string
    birth_date?: string
    card?: CardObj
    banking_data_collected?: boolean
}

interface CardObj {
    id: string
    created: string
    exp_month: number
    exp_year: number
    last4: string
    country: string
    funding: string
    brand: string
    three_d_secure_possible: boolean
    verified: boolean
}


interface AddressesObj {
    id?: string
    created?: string
    company?: string
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    line1?: string
    line2?: string
    postal_code?: string
    city?: string
    country?: string
}

interface ReqAddresses extends AddressesObj {
    title?: string
    county_sublocality: string
    state_province: string
}


export interface OrderObj {
    merchant_reference?: string
    merchant_url?: string
    data?: Object
    customer_url?: string
    comment?: string
}


export interface MyAppsSettings {
    production: boolean
    Authentication: {
        appkey: string
        hashedAppToken: string
    }
    Cluster: ClusterObj[]
}

interface ClusterObj {
    sc: string,
    key: string
}

export interface RefundReq {
    amount: number
    merchant_reference: string
}

export interface ResCreatePayment {
    url: string
    id: string
}

export interface RetrivePaymentRes {
    id: string
    amount_left_to_pay?: number
    annual_interest_rate?: number
    can_be_charged?: boolean
    country_of_service?: string
    created?: string
    billing_address?: AddressesObj
    customer?: CustomerObj
    customer_cancel_url?: string
    custom_data?: any
    customer_fee?: number
    customer_interest?: number
    deferred_months?: number
    deferred_days?: number
    deferred_trigger?: boolean
    ipn_callback_url?: string
    merchant_name?: string
    orders?: { merchant_reference: string }[]
    preferred_payment_method?: string
    payment_plan?: PaymentPlanObj[]
    purchase_amount: number
    refunds: RefundReq[]
    return_url: string
    sepa_debit_enabled: boolean
    shipping_address: AddressesObj
    state: string
    url: string
    using_sepa_debit: boolean
    expired_at: string
    locale: string
    transaction_country: string
}

interface PaymentPlanObj {
    purchase_amount?: number
    original_purchase_amount?: number
    customer_fee?: number
    customer_interest?: number
    due_date?: string
    state?: string////////////////Forse
    time_delta_from_start?: string
}

export interface PersistedAuthorizationRes extends ApprovedAuthorization {
    amount: number
    callbackUrl: string
    orderId: string
}

export interface PersistedCustomOrderInfoRes extends ApprovedAuthorization {
    vtexPaymentId: string,
    almaPaymentId: string,
    orderId: string
}