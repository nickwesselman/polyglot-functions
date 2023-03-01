#include <iostream>
#include <iterator>
#include <string>
#include "json_struct.h"
#include "api.h"

FunctionResult function(FunctionInput input) {
    FunctionResult result = {
        std::vector<Discount> {
            // Discount
            {
                // Value
                {
                    std::nullopt,
                    std::optional<Percentage> {
                        // Percentage
                        { 10.0 }
                    }
                },
                std::vector<Target> {
                    // Target
                    {
                        std::optional<ProductVariant> {
                            // ProductVariant
                            { "gid://test/123", std::nullopt }
                        }
                    }
                },
                "Hello world"
            }
        }
    };
    return result;
}

int main(void) {
    // read input from stdin
    std::istreambuf_iterator<char> begin(std::cin), end;
    std::string inputStr(begin, end);

    // parse function input
    JS::ParseContext context(inputStr);
    FunctionInput input;
    context.parseTo(input);

    // call function
    FunctionResult result = function(input);

    // output json result
    std::string result_json = JS::serializeStruct(result, JS::SerializerOptions(JS::SerializerOptions::Compact));
    std::cout << result_json << std::endl;

    return 0;
}