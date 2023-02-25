package main

/**
 * Input Types
 * These represent what's needed for our input query.
 **/

type FunctionInput struct {
	Cart         Cart
	DiscountNode DiscountNode
}

type Cart struct {
	BuyerIdentity *BuyerIdentity
	Lines         []CartLine
}

type CartLine struct {
	Merchandise CartLineMerchandise
	Cost        CartLineCost
}

type CartLineMerchandise struct {
	Product CartLineMerchandiseProduct
}

type CartLineMerchandiseProduct struct {
	IsQualifying bool
}

type CartLineCost struct {
	TotalAmount CartLineCostTotal
}

type CartLineCostTotal struct {
	Amount float64
}

type BuyerIdentity struct {
	Customer *Customer
}

type Customer struct {
	Metafield *Metafield
}

type DiscountNode struct {
	Metafield *Metafield
}

type Metafield struct {
	Value string
}

//  /**
//   * Configuration Types
//   * These represent the JSON metafield where we are storing our configuration.
//   */

type Configuration struct {
	DiscountPercentage     float64
	QualifyingProductTotal float64
	QualifyingProductTags  []string
}

//  /**
//   * Output Types
//   * These just represent the part of the schema needed for this function.
//   **/

type PercentageValue struct {
	Value float64
}

type PercentageValueType struct {
	Percentage *PercentageValue
}

type OrderSubtotalTargetType struct {
	ExcludedVariantIds []string
}

type OrderSubtotalTarget struct {
	OrderSubtotal OrderSubtotalTargetType
}

type OrderDiscount struct {
	Message string
	Targets []OrderSubtotalTarget
	Value   PercentageValueType
}

type FunctionResult struct {
	DiscountApplicationStrategy string
	Discounts                   []OrderDiscount
}
