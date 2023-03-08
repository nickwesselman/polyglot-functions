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

export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
  (input) => {

    if (input.cart.buyerIdentity?.customer?.metafield?.value != "true") {
      return EMPTY_DISCOUNT;
    }

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