package main

import (
	"fmt"
	"strconv"

	"github.com/valyala/fastjson"
)

func UnmarshalFunctionInput(object *fastjson.Value) FunctionInput {
	return FunctionInput{
		Cart:         UnmarshalCart(object.Get("cart")),
		DiscountNode: UnmarshalDiscountNode(object.Get("discountNode")),
	}
}

func UnmarshalCart(object *fastjson.Value) Cart {
	var cartLinesJson = object.GetArray("lines")
	var cartLines []CartLine
	for _, cartLineJson := range cartLinesJson {
		cartLines = append(cartLines, UnmarshalCartLine(cartLineJson))
	}
	var cart = Cart{
		Lines: cartLines,
	}
	var buyerIdentityJson = object.Get("buyerIdentity")
	if buyerIdentityJson != nil {
		var buyerIdentity = UnmarshalBuyerIdentity(buyerIdentityJson)
		cart.BuyerIdentity = &buyerIdentity
	}
	return cart
}

func UnmarshalCartLine(object *fastjson.Value) CartLine {
	return CartLine{
		Merchandise: UnmarshalCartLineMerchandise(object.Get("merchandise")),
		Cost:        UnmarshalCartLineCost(object.Get("cost")),
	}
}

func UnmarshalCartLineMerchandise(object *fastjson.Value) CartLineMerchandise {
	return CartLineMerchandise{
		Product: UnmarshalMerchandiseProduct(object.Get("product")),
	}
}

func UnmarshalMerchandiseProduct(object *fastjson.Value) CartLineMerchandiseProduct {
	return CartLineMerchandiseProduct{
		IsQualifying: object.GetBool("isQualifying"),
	}
}

func UnmarshalCartLineCost(object *fastjson.Value) CartLineCost {
	return CartLineCost{
		TotalAmount: UnmarshalCartLineCostTotal(object.Get("totalAmount")),
	}
}

func UnmarshalCartLineCostTotal(object *fastjson.Value) CartLineCostTotal {
	var amountStr = string(object.GetStringBytes("amount"))
	var amount, err = strconv.ParseFloat(amountStr, 64)
	if err != nil {
		panic(fmt.Sprintf("%s", err))
	}
	return CartLineCostTotal{
		Amount: amount,
	}
}

func UnmarshalBuyerIdentity(object *fastjson.Value) BuyerIdentity {
	var buyerIdentity = BuyerIdentity{}
	var customerJson = object.Get("customer")
	if customerJson != nil {
		var customer = UnmarshalCustomer(customerJson)
		buyerIdentity.Customer = &customer
	}
	return buyerIdentity
}

func UnmarshalCustomer(object *fastjson.Value) Customer {
	var customer = Customer{}
	var metafieldJson = object.Get("metafield")
	if metafieldJson != nil {
		var metafield = UnmarshalMetafield(metafieldJson)
		customer.Metafield = &metafield
	}
	return customer
}

func UnmarshalDiscountNode(object *fastjson.Value) DiscountNode {
	var discount = DiscountNode{}
	var metafieldJson = object.Get("metafield")
	if metafieldJson != nil {
		var metafield = UnmarshalMetafield(metafieldJson)
		discount.Metafield = &metafield
	}
	return discount
}

func UnmarshalMetafield(object *fastjson.Value) Metafield {
	return Metafield{
		Value: string(object.GetStringBytes("value")),
	}
}
