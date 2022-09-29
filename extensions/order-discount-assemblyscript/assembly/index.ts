import { FunctionInput, FunctionResult, OrderSubtotalTarget } from "./api";
import { Console } from "./console";

const input = FunctionInput.parse(Console.readAll()!);
Console.error(`Hello, AssemblyScript! ${input.discountNode!.metafield!.value!}`);

const output: FunctionResult = {
  conditions: [],
  discountApplicationStrategy: "MAXIMUM",
  discounts: [
    {
      message: "Hello, AssemblyScript!",
      targets: [
        {
          excludedVariantIds: [],
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