import { FunctionInput, FunctionResult, Configuration } from "./api";
import { JSON } from "json-as";
import { Console } from "./console";

//const input = FunctionInput.parse(Console.readAll()!);
const input = JSON.parse<FunctionInput>(Console.readAll()!);
const configuration = JSON.parse<Configuration>(input.discountNode!.metafield!.value!);

function result(result: FunctionResult) : void {
  Console.log(JSON.stringify(result));
  process.exit();
}

let noDiscount: FunctionResult = {
  discountApplicationStrategy: "MAXIMUM",
  discounts: []
};


if (input.cart!.buyerIdentity == null ||
    input.cart!.buyerIdentity!.customer == null ||
    input.cart!.buyerIdentity!.customer!.metafield == null ||
    input.cart!.buyerIdentity!.customer!.metafield!.value != "true") {
  
  result(noDiscount);
}

let qualifyingProductTotal = input.cart!.lines
  .filter((value) => value.merchandise.product.isQualifying)
  .reduce((previousValue, currentValue) => previousValue + f64.parse(currentValue.cost.totalAmount.amount), 0.0);

if (qualifyingProductTotal < configuration.qualifyingProductTotal) {
  result(noDiscount);
}

result({
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
});