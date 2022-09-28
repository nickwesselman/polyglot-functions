import { FunctionInput, FunctionResult } from "./api";
import { JSON } from "json-as/assembly";
import { Console } from "as-wasi/assembly";

var input = Console.readAll()!;
const parsed = JSON.parse<FunctionInput>(input);

Console.error(`Hello, AssemblyScript! ${parsed.discountNode.metafield.value}`);

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

Console.log(JSON.stringify<FunctionResult>(output));