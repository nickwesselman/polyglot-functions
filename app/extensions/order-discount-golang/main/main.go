package main

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/tidwall/gjson"
)

// Represents the merchant configuration for the discount
type Configuration struct {
	DiscountPercentage     float64
	QualifyingProductTotal float64
	QualifyingProductTags  []string
}

// The discount business logic
func calculateDiscount(input []byte) string {
	noDiscount := `{
		"discountApplicationStrategy": "FIRST",
		"discounts": []
	}`

	// If there's no customer on the order yet or they're not a VIP, no discount
	isVip := gjson.GetBytes(input, "cart.buyerIdentity.customer.metafield.value").Bool()
	if !isVip {
		return noDiscount
	}

	// Parse the discount configuration metafield, which is a string with more JSON
	configurationJson := gjson.GetBytes(input, "discountNode.metafield.value").String()
	configurationParsed := gjson.Parse(configurationJson)
	configuration := Configuration{
		DiscountPercentage:     configurationParsed.Get("discountPercentage").Float(),
		QualifyingProductTotal: configurationParsed.Get("qualifyingProductTotal").Float(),
	}

	// Total all qualifying products. If there aren't enough, no discount
	qualifyingTotal := 0.0
	gjson.GetBytes(input, "cart.lines").ForEach(func(_key gjson.Result, value gjson.Result) bool {
		isQualifying := value.Get("merchandise.product.isQualifying").Bool()
		if isQualifying {
			qualifyingTotal += value.Get("cost.totalAmount.amount").Float()
		}
		return true
	})
	if qualifyingTotal < configuration.QualifyingProductTotal {
		return noDiscount
	}

	// Create an order discount using the configured percentage
	return fmt.Sprintf(`{
		"discountApplicationStrategy": "MAXIMUM",
		"discounts": [
			{
				"message": "VIP Discount",
				"value": {
					"percentage": {
						"value": "%.2f"
					}
				},
				"targets": [
					{
						"orderSubtotal": {
							"excludedVariantIds": []
						}
					}
				]
			}
		]
	}`, configuration.DiscountPercentage)
}

// read the function input, calculate the discount, write the function output
func main() {
	input, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	discount := calculateDiscount(input)
	fmt.Println(discount)
}
