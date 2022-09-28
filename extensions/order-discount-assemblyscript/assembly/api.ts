import { JSON } from "json-as/assembly";

/**
 * Input Types
 * These represent what's needed for our input query.
 **/

@json
export class Metafield {
  value: string
}

@json
export class Customer {
  metafield: Metafield | null
}

@json
export class BuyerIdentity {
  customer: Customer | null
}

@json
export class Cart {
  buyerIdentity: BuyerIdentity | null
}

@json
export class DiscountNode {
    metafield: Metafield
}

@json
export class FunctionInput {
    cart: Cart
    discountNode: DiscountNode
}

/**
 * Output Types
 * These just represent the part of the schema needed for this function.
 **/

@json
export class PercentageValue {
    value: f64
}

@json
export class PercentageValueType {
    percentage: PercentageValue
}

@json
export class OrderSubtotalTarget {
    excludedVariantIds: string[]
}

@json
export class OrderDiscount {
    message: string
    targets: OrderSubtotalTarget[]
    value: PercentageValueType
}

@json
export class DiscountCondition {
    // unused
}

@json
export class FunctionResult {
    discountApplicationStrategy: string
    discounts: OrderDiscount[]
    conditions: DiscountCondition[]
}