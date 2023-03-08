import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {
  qualifyingProductTotal: number,
  discountPercentage: number
};

export default (input: InputQuery): FunctionResult => {
  if (input.cart.buyerIdentity?.customer?.metafield?.value != "true") {
    return EMPTY_DISCOUNT;
  }

  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  if (!configuration.discountPercentage || !configuration.qualifyingProductTotal) {
    return EMPTY_DISCOUNT;
  }

  const qualifyingProductTotal = input.cart.lines.reduce((total, line) => {
    const isQualifying = line.merchandise.__typename == "ProductVariant" && line.merchandise.product.isQualifying;
    return total += isQualifying ? parseFloat(line.cost.totalAmount.amount) : 0;
  }, 0);

  if (qualifyingProductTotal < configuration.qualifyingProductTotal) {
    return EMPTY_DISCOUNT;
  }

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