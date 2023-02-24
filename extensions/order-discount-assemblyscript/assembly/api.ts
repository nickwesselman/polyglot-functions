/**
 * Input Types
 * These represent what's needed for our input query.
 **/
export class FunctionInput {
  cart: Cart | null = null;
  discountNode: DiscountNode | null = null;
}

export class Cart {
  buyerIdentity: BuyerIdentity | null
}

export class BuyerIdentity {
  customer: Customer | null = null;
}

export class DiscountNode {
  metafield: Metafield | null = null;
}

export class Customer {
  metafield: Metafield | null = null;
}

export class Metafield {
  value: string | null = null;
}

/**
 * Configuration Types
 * These represent the JSON metafield where we are storing our configuration.
 */
export class Configuration {
  discountPercentage: f64 = 0.0;
}

/**
 * Output Types
 * These just represent the part of the schema needed for this function.
 **/

export class PercentageValue {
    value: f64 = 0;
}

export class PercentageValueType {
    percentage: PercentageValue = new PercentageValue();
}

export class OrderSubtotalTarget {
    orderSubtotal: OrderSubtotalTargetType = new OrderSubtotalTargetType();
}

export class OrderSubtotalTargetType {
    excludedVariantIds: string[] = [];
}

export class OrderDiscount {
    message: string | null = null;
    targets: OrderSubtotalTarget[] = [];
    value: PercentageValueType | null = null;
}

export class FunctionResult {
    discountApplicationStrategy: string | null = null;
    discounts: OrderDiscount[] = [];
}