#include "json_struct.h"

struct Metafield
{
    std::optional<std::string> value;
    JS_OBJ(value);
};

struct Customer
{
    std::optional<Metafield> metafield;
    JS_OBJ(metafield);
};

struct DiscountNode
{
    std::optional<Metafield> metafield;
    JS_OBJ(metafield);
};

struct BuyerIdentity
{
    std::optional<Customer> customer;
    JS_OBJ(customer);
};

struct CartLineCostTotal
{
    std::string amount;
    JS_OBJ(amount);
};

struct CartLineCost
{
    CartLineCostTotal totalAmount;
    JS_OBJ(totalAmount);
};

struct CartLineMerchandiseProduct
{
    bool isQualifying;
    JS_OBJ(isQualifying);
};

struct CartLineMerchandise
{
    CartLineMerchandiseProduct product;
    JS_OBJ(product);
};

struct CartLine
{
    CartLineMerchandise merchandise;
    CartLineCost cost;
    JS_OBJ(merchandise, cost);
};

struct Cart
{
    std::optional<BuyerIdentity> buyerIdentity;
    std::vector<CartLine> lines;
    JS_OBJ(buyerIdentity, lines);
};

struct Percentage
{
    float value;
    JS_OBJ(value);
};

struct Value
{
    std::optional<Percentage> percentage;
    JS_OBJ(percentage);
};

struct OrderSubtotalTarget
{
    std::vector<std::string> excludedVariantIds;
    JS_OBJ(excludedVariantIds);
};

struct Target
{
    std::optional<OrderSubtotalTarget> orderSubtotal;
    JS_OBJ(orderSubtotal);
};

struct Discount
{
    Value value;
    std::vector<Target> targets;
    std::string message;
    JS_OBJ(value, message, targets);
};

JS_ENUM(DiscountApplicationStrategy, FIRST, MAXIMUM);
JS_ENUM_DECLARE_STRING_PARSER(DiscountApplicationStrategy);

struct FunctionResult
{
    std::vector<Discount> discounts;
    DiscountApplicationStrategy discountApplicationStrategy;
    JS_OBJ(discounts, discountApplicationStrategy);
};


class FunctionInput
{
    public:
        Cart cart;
        DiscountNode discountNode;
        JS_OBJ(cart, discountNode);

    public:
        template<typename T> inline T config()
        {
            JS::ParseContext context(discountNode.metafield.value().value.value());
            T config;
            context.parseTo(config);
            return config;
        }
};