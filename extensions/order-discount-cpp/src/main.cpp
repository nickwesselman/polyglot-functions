#include <iostream>
#include <iterator>
#include <numeric>
#include <string>
#include "json_struct.h"
#include "api.h"

struct Configuration
{
    float discountPercentage;
    float qualifyingProductTotal;
    JS_OBJ(discountPercentage, qualifyingProductTotal);
};

FunctionResult function(FunctionInput input)
{
    FunctionResult result;
    result.discountApplicationStrategy = DiscountApplicationStrategy::MAXIMUM;

    if (!input.cart.buyerIdentity.has_value() ||
        !input.cart.buyerIdentity.value().customer.has_value() ||
        !input.cart.buyerIdentity.value().customer.value().metafield.has_value() ||
        !input.cart.buyerIdentity.value().customer.value().metafield.value().value.has_value() ||
        input.cart.buyerIdentity.value().customer.value().metafield.value().value.value() != "true")
    {
        return result;
    }

    Configuration config = input.config<Configuration>();

    // filter only qualifying products
    std::vector<CartLine> qualifyingLines;
    auto filter = [](CartLine line) { return line.merchandise.product.isQualifying; };
    std::copy_if(input.cart.lines.begin(), input.cart.lines.end(), std::back_inserter(qualifyingLines), filter);

    // get total for qualifying products
    auto accumulate = [](float total, CartLine line)
    {
        return std::stof(line.cost.totalAmount.amount) + total;
    };
    float total = std::accumulate(qualifyingLines.begin(), qualifyingLines.end(), 0.0f, accumulate);
    
    if (total < config.qualifyingProductTotal)
    {
        return result;
    }

    result.discounts = std::vector<Discount> {
        // Discount
        {
            // Value
            {
                std::optional<Percentage> {
                    // Percentage
                    { config.discountPercentage }
                }
            },
            std::vector<Target> {
                // Target
                {
                    std::optional<OrderSubtotalTarget> {
                        // OrderSubtotalTarget
                        {}
                    }
                }
            },
            "Hello world"
        }
    };
    return result;
}

int main(void)
{
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