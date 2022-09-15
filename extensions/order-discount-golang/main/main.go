package main

import (
	"fmt"
	"io/ioutil"
	"main/api"
	"os"

	"github.com/mailru/easyjson"
)

func main() {
	bytes, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	var input api.InputResponse
	err = easyjson.Unmarshal(bytes, &input)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	var output api.FunctionResult
	output = function(input)

	bytes, err = easyjson.Marshal(output)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	fmt.Println(string(bytes))
}

func function(input api.InputResponse) api.FunctionResult {
	var vipMetafield = input.Cart.BuyerIdentity.Customer.Metafield
	if vipMetafield.Value != "true" {
		return api.FunctionResult{
			Discounts:                   []api.Discount{},
			DiscountApplicationStrategy: api.DiscountApplicationStrategyFirst,
		}
	}

	var message = "VIP Discount"
	var config = input.DiscountNode.GetConfiguration()
	return api.FunctionResult{
		Discounts: []api.Discount{
			api.Discount{
				Value: api.Value{
					Percentage: &api.Percentage{
						Value: config.DiscountPercentage,
					},
				},
				Message: &message,
				Targets: []api.Target{
					api.Target{
						OrderSubtotal: &api.OrderSubtotalTarget{
							ExcludedVariantIds: []string{},
						},
					},
				},
			},
		},
		DiscountApplicationStrategy: api.DiscountApplicationStrategyMaximum,
	}
}
