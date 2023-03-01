#include "json_struct.h"

// define Metafield with optional value
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

// define DiscountNode with std::optional metafield
struct DiscountNode
{
    std::optional<Metafield> metafield;
    JS_OBJ(metafield);
};

struct BuyerIdentity
{
    Customer customer;
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

// define FixedAmount with optional applies_to_each_item and value of float
struct FixedAmount
{
    bool applies_to_each_item;
    float value;
    JS_OBJ(applies_to_each_item, value);
};

// define Percentage with float value
struct Percentage
{
    float value;
    JS_OBJ(value);
};

// define Value with optional FixedAmount and Percentage
struct Value
{
    std::optional<FixedAmount> fixedAmount;
    std::optional<Percentage> percentage;
    JS_OBJ(fixedAmount, percentage);
};

// define ProductVariant with id and std::optional quantity
struct ProductVariant
{
    std::string id;
    std::optional<int> quantity;
    JS_OBJ(id, quantity);
};

// Define Target to be a ProductVariant or a Value
struct Target
{
    std::optional<ProductVariant> productVariant;
    JS_OBJ(productVariant);
};

JS_ENUM(ConditionTargetType, product_variant)
JS_ENUM_DECLARE_STRING_PARSER(ConditionTargetType)

// define ProductMinimumQuantity with ids and minimum_quantity and target_type
struct ProductMinimumQuantity
{
    std::vector<std::string> ids;
    int minimum_quantity;
    ConditionTargetType target_type;
    JS_OBJ(ids, minimum_quantity, target_type);
};

// define ProductMinimumSubtotal with ids and minimum_amount and target_type
struct ProductMinimumSubtotal
{
    std::vector<std::string> ids;
    float minimum_amount;
    ConditionTargetType target_type;
    JS_OBJ(ids, minimum_amount, target_type);
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

// FunctionResult function(Input input);
