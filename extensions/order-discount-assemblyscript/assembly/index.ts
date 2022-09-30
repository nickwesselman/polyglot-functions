import { FunctionInput, FunctionResult, Configuration } from "./api";
import { Console } from "./console";

const input = FunctionInput.parse(Console.readAll()!);
const configuration = Configuration.parse(input.discountNode!.metafield!.value!);

let result: FunctionResult;

if (input.cart!.buyerIdentity == null ||
    input.cart!.buyerIdentity!.customer == null ||
    input.cart!.buyerIdentity!.customer!.metafield == null ||
    input.cart!.buyerIdentity!.customer!.metafield!.value != "true") {
  
  // no discount
  result = {
    discountApplicationStrategy: "MAXIMUM",
    discounts: []
  }

} else {

  result = {
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

Console.log(result.marshal());