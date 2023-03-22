// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */

/**
 * @type {FunctionResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The discount business logic
export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
  (input) => {

    // If there's no customer on the order yet or they're not a VIP, no discount
    if (input.cart.buyerIdentity?.customer?.metafield?.value != "true") {
      return EMPTY_DISCOUNT;
    }

    // Parse the discount configuration metafield, which is a string with more JSON
    /**
     * @type {{
    *    qualifyingProductTotal: number,
    *    discountPercentage: number
    * }}
    */
    const configuration = JSON.parse(
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