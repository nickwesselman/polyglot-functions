import { FunctionInput, FunctionResult } from "./api";
import { JSON } from "json-as";
import { Console } from "as-wasi/assembly";

// Represents the merchant configuration for the discount
@JSON
class Configuration {
  discountPercentage: f64 = 0.0;
  qualifyingProductTotal: f64 = 0.0;
  qualifyingProductTags: string[];
}

// The discount business logic
let calculateDiscount = (input: FunctionInput) : FunctionResult => {
  let noDiscount: FunctionResult = {
    discountApplicationStrategy: "MAXIMUM",
    discounts: []
  };

  // If there's no customer on the order yet or they're not a VIP, no discount
  if (input.cart!.buyerIdentity == null ||
    input.cart!.buyerIdentity!.customer == null ||
    input.cart!.buyerIdentity!.customer!.metafield == null ||
    input.cart!.buyerIdentity!.customer!.metafield!.value != "true") {
  
    return noDiscount;
  }

  // Parse the discount configuration metafield, which is a string with more JSON
  const configuration = JSON.parse<Configuration>(input.discountNode!.metafield!.value);

  // Total all qualifying products. If there aren't enough, no discount
  let qualifyingProductTotal = input.cart!.lines
    .filter((value) => value.merchandise.product.isQualifying)
    .reduce((previousValue, currentValue) => previousValue + f64.parse(currentValue.cost.totalAmount.amount), 0.0);
  if (qualifyingProductTotal < configuration.qualifyingProductTotal) {
    return noDiscount;
  }

  // Create an order discount using the configured percentage
  return {
    discountApplicationStrategy: "MAXIMUM",
    discounts: [
      {
        message: "VIP Discount",
        targets: [
          {
            orderSubtotal: {
              excludedVariantIds: [],
            }
          }
        ],
        value: {
          percentage: {
            value: configuration.discountPercentage,
          }
        }
      }
    ]
  }
}

// read the function input, calculate the discount, write the function output
const input = JSON.parse<FunctionInput>(Console.readAll()!);
const result = calculateDiscount(input);
Console.log(JSON.stringify(result));