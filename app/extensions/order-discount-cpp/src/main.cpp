#include "api.h"
#include "json_struct.h"
#include <iostream>
#include <iterator>
#include <numeric>
#include <string>

// Represents the merchant configuration for the discount
struct Configuration {
  float discountPercentage;
  float qualifyingProductTotal;
  JS_OBJ(discountPercentage, qualifyingProductTotal);
};

// The discount business logic
FunctionResult function(FunctionInput &input) {
  FunctionResult result;
  result.discountApplicationStrategy = DiscountApplicationStrategy::MAXIMUM;

  // If there's no customer on the order yet or they're not a VIP, no discount
  if (!input.cart.buyerIdentity.has_value() ||
      !input.cart.buyerIdentity.value().customer.has_value() ||
      !input.cart.buyerIdentity.value()
           .customer.value()
           .metafield.has_value() ||
      !input.cart.buyerIdentity.value()
           .customer.value()
           .metafield.value()
           .value.has_value() ||
      input.cart.buyerIdentity.value()
              .customer.value()
              .metafield.value()
              .value.value() != "true") {
    return result;
  }

  // Parse the discount configuration metafield, which is a string with more JSON
  Configuration config = input.config<Configuration>();

  // Total all qualifying products. If there aren't enough, no discount
  auto filter = [](CartLine &line) {
    return !line.merchandise.product.isQualifying;
  };
  auto qualifyingItems = std::stable_partition(input.cart.lines.begin(),
                                               input.cart.lines.end(), filter);
  auto accumulate = [](float total, CartLine &line) {
    return std::stof(line.cost.totalAmount.amount) + total;
  };
  float total = std::accumulate(qualifyingItems, input.cart.lines.end(), 0.0f,
                                accumulate);
  if (total < config.qualifyingProductTotal) {
    return result;
  }

  // Create an order discount using the configured percentage
  result.discounts = std::vector<Discount>{
      // Discount
      {                           // Value
       {std::optional<Percentage>{// Percentage
                                  {config.discountPercentage}}},
       std::vector<Target>{
           // Target
           {std::optional<OrderSubtotalTarget>{// OrderSubtotalTarget
                                               {}}}},
       "Hello world"}};
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
  std::string result_json = JS::serializeStruct(
      result, JS::SerializerOptions(JS::SerializerOptions::Compact));
  std::cout << result_json << std::endl;

  return 0;
}