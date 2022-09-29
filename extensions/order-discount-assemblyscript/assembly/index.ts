import { FunctionInput, FunctionResult, OrderSubtotalTarget } from "./api";
import { Console } from "./console";

const input = FunctionInput.parse(Console.readAll()!);
Console.error(`Hello, AssemblyScript! ${input.discountNode!.metafield!.value!}`);

const emptyResult: FunctionResult = {
  discountApplicationStrategy: "MAXIMUM",
  discounts: []
}

const output: FunctionResult = {
  discountApplicationStrategy: "MAXIMUM",
  discounts: [
    {
      message: "Hello, AssemblyScript!",
      targets: [
        {
          orderSubtotal: {
            excludedVariantIds: [],
          }
        }
      ],
      value: {
        percentage: {
          value: 10.5,
        }
      }
    }
  ]
}

Console.log(output.marshal());