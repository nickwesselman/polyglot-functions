import { FunctionInput, FunctionResult, Configuration } from "./api";
import { JSON } from "json-as";
import { Console } from "./console";

const input = JSON.parse<FunctionInput>(Console.readAll()!);
const configuration = JSON.parse<Configuration>(input.discountNode!.metafield!.value);

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

Console.log(JSON.stringify(result));