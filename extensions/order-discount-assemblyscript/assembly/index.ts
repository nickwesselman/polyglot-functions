import { FunctionInput, FunctionResult, Configuration } from "./api";
import { JSON } from "json-as";
import { Console } from "as-wasi/assembly";

let calculateDiscount = (input: FunctionInput) : FunctionResult => {
  let noDiscount: FunctionResult = {
    discountApplicationStrategy: "MAXIMUM",
    discounts: []
  };

  if (input.cart!.buyerIdentity == null ||
    input.cart!.buyerIdentity!.customer == null ||
    input.cart!.buyerIdentity!.customer!.metafield == null ||
    input.cart!.buyerIdentity!.customer!.metafield!.value != "true") {
  
    return noDiscount;
  }

  const configuration = JSON.parse<Configuration>(input.discountNode!.metafield!.value);
  let qualifyingProductTotal = input.cart!.lines
    .filter((value) => value.merchandise.product.isQualifying)
    .reduce((previousValue, currentValue) => previousValue + f64.parse(currentValue.cost.totalAmount.amount), 0.0);

  if (qualifyingProductTotal < configuration.qualifyingProductTotal) {
    return noDiscount;
  }

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

const input = JSON.parse<FunctionInput>(Console.readAll()!);
const result = calculateDiscount(input);
Console.log(JSON.stringify(result));