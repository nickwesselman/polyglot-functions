import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// Represents the merchant configuration for the discount
type Configuration = {
  qualifyingProductTotal: number,
  discountPercentage: number
};

// The discount business logic
export default (input: InputQuery): FunctionResult => {
  // If there's no customer on the order yet or they're not a VIP, no discount
  if (input.cart.buyerIdentity?.customer?.metafield?.value != "true") {
    return EMPTY_DISCOUNT;
  }

  // Parse the discount configuration metafield, which is a string with more JSON
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  if (!configuration.discountPercentage || !configuration.qualifyingProductTotal) {
    return EMPTY_DISCOUNT;
  }

  // Total all qualifying products. If there aren't enough, no discount
  const qualifyingProductTotal = input.cart.lines.reduce((total, line) => {
    const isQualifying = line.merchandise.__typename == "ProductVariant" && line.merchandise.product.isQualifying;
    return total += isQualifying ? parseFloat(line.cost.totalAmount.amount) : 0;
  }, 0);
  if (qualifyingProductTotal < configuration.qualifyingProductTotal) {
    return EMPTY_DISCOUNT;
  }

  // Create an order discount using the configured percentage
  return {
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    discounts: [
      {
        value: {
          percentage: {
            value: configuration.discountPercentage
          }
        },
        targets: [
          {
            orderSubtotal: {
              excludedVariantIds: []
            }
          }
        ]
      }
    ]
  };
};