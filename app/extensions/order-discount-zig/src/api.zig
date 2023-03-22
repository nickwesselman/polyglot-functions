//
// Input Types
//

pub const Metafield = struct {
    value: ?[]const u8
};

pub const Customer = struct {
    metafield: ?Metafield
};

pub const DiscountNode = struct {
    metafield: ?Metafield
};

pub const BuyerIdentity = struct {
    customer: ?Customer
};

pub const CartLineCostTotal = struct {
    amount: []const u8
};

pub const CartLineCost = struct {
    totalAmount: CartLineCostTotal
};

pub const CartLineMerchandiseProduct = struct {
    isQualifying: bool
};

pub const CartLineMerchandise = struct {
    __typename: []const u8,
    product: CartLineMerchandiseProduct
};

pub const CartLine = struct {
    merchandise: CartLineMerchandise,
    cost: CartLineCost
};

pub const Cart = struct {
    buyerIdentity: ?BuyerIdentity,
    lines: []CartLine
};

pub const FunctionInput = struct {
    cart: Cart,
    discountNode: DiscountNode
};

//
// Output Types
//

pub const Percentage = struct {
    value: f64
};

pub const Value = struct {
    percentage: ?Percentage
};

pub const OrderSubtotalTarget = struct {
    excludedVariantIds: [] []const u8
};

pub const Target = struct {
    orderSubtotal: OrderSubtotalTarget
};

pub const Discount = struct {
    message: []const u8,
    value: Value,
    targets: []Target
};

pub const FunctionResult = struct {
    discounts: []Discount,
    discountApplicationStrategy: []const u8
};