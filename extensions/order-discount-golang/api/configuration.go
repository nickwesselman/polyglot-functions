/* Defines types for unmarshalling our app-specific discount metafield json value. */

package api

import easyjson "github.com/mailru/easyjson"

type DiscountConfiguration struct {
	DiscountPercentage float64 `json:"discountPercentage"`
}

func (discount *InputDiscountNode) GetConfiguration() *DiscountConfiguration {
	var configuration = &DiscountConfiguration{}
	err := easyjson.Unmarshal([]byte(discount.Metafield.Value), configuration)
	if err != nil {
		return nil
	}
	return configuration
}
