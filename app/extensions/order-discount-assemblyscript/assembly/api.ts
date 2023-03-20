import {JSON} from "json-as";

/**
 * Input Types
 * These represent what's needed for our input query.
 **/

@JSON
export class FunctionInput {
  cart: Cart | null = null;
  discountNode: DiscountNode | null = null;
}

@JSON
export class Cart {
  buyerIdentity: BuyerIdentity | null
  lines: CartLine[]
}

@JSON
export class CartLine {
  merchandise: CartLineMerchandise
  cost: CartLineCost
}

@JSON
export class CartLineMerchandise {
  product: CartLineMerchandiseProduct
}

@JSON
export class CartLineMerchandiseProduct {
  isQualifying: bool
}

@JSON
export class CartLineCost {
  totalAmount: CartLineCostTotal
}

@JSON
export class CartLineCostTotal {
  amount: string
}

@JSON
export class BuyerIdentity {
  customer: Customer | null = null;
}

@JSON
export class DiscountNode {
  metafield: Metafield | null = null;
}

@JSON
export class Customer {
  metafield: Metafield | null = null;
}

@JSON
export class Metafield {
  value: string;
}

/**
 * Configuration Types
 * These represent the JSON metafield where we are storing our configuration.
 */

@JSON
export class Configuration {
  discountPercentage: f64 = 0.0;
  qualifyingProductTotal: f64 = 0.0;
  qualifyingProductTags: string[];
}

/**
 * Output Types
 * These just represent the part of the schema needed for this function.
 **/

@JSON
export class PercentageValue {
    value: f64 = 0;
}

@JSON
export class PercentageValueType {
    percentage: PercentageValue = new PercentageValue();
}

@JSON
export class OrderSubtotalTarget {
    orderSubtotal: OrderSubtotalTargetType = new OrderSubtotalTargetType();
}

@JSON
export class OrderSubtotalTargetType {
    excludedVariantIds: string[] = [];
}

@JSON
export class OrderDiscount {
    message: string;
    targets: OrderSubtotalTarget[] = [];
    value: PercentageValueType | null = null;
}

@JSON
export class FunctionResult {
    discountApplicationStrategy: string;
    discounts: OrderDiscount[] = [];
}