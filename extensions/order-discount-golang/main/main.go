package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/valyala/fastjson"
)

func main() {
	bytes, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	var p fastjson.Parser
	value, err := p.ParseBytes(bytes)
	if err != nil {
		log.Fatal(err)
	}

	var functionInput = UnmarshalFunctionInput(value)
	fmt.Println(functionInput.Cart.BuyerIdentity.Customer.Metafield.Value)

	// var input FunctionInput
	// err = json.Unmarshal(bytes, &input)
	// if err != nil {
	// 	fmt.Println(err)
	// 	os.Exit(1)
	// }

	// var output api.FunctionResult
	// output = function(input)

	// bytes, err = json.Marshal(output)
	// if err != nil {
	// 	fmt.Println(err)
	// 	os.Exit(1)
	// }

	// fmt.Println(string(bytes))
}

// func function(input api.InputResponse) api.FunctionResult {
// 	var emptyResult = api.FunctionResult{
// 		Discounts:                   []api.Discount{},
// 		DiscountApplicationStrategy: api.DiscountApplicationStrategyFirst,
// 	}
// 	var buyer = input.Cart.BuyerIdentity
// 	if buyer == nil {
// 		return emptyResult
// 	}
// 	var customer = buyer.Customer
// 	if customer == nil {
// 		return emptyResult
// 	}
// 	var vipMetafield = customer.Metafield
// 	if vipMetafield == nil || vipMetafield.Value != "true" {
// 		return emptyResult
// 	}

// 	var message = "VIP Discount"
// 	var discountPercentage = 0.0
// 	var configuration = input.DiscountNode.GetConfiguration()
// 	if configuration != nil {
// 		discountPercentage = configuration.DiscountPercentage
// 	}

// 	return api.FunctionResult{
// 		Discounts: []api.Discount{
// 			api.Discount{
// 				Value: api.Value{
// 					Percentage: &api.Percentage{
// 						Value: discountPercentage,
// 					},
// 				},
// 				Message: &message,
// 				Targets: []api.Target{
// 					api.Target{
// 						OrderSubtotal: &api.OrderSubtotalTarget{
// 							ExcludedVariantIds: []string{},
// 						},
// 					},
// 				},
// 				Conditions: []api.Condition{},
// 			},
// 		},
// 		DiscountApplicationStrategy: api.DiscountApplicationStrategyMaximum,
// 	}
// }
