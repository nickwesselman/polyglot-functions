use serde::{Deserialize, Serialize};
use shopify_function::prelude::*;
use shopify_function::Result;

generate_types!(query_path = "./input.graphql", schema_path = "./schema.graphql");

#[derive(Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Configuration {
    discount_percentage: f64,
}

impl Configuration {
    fn from_str(value: &str) -> Self {
        serde_json::from_str(value).expect("Unable to parse configuration value from metafield")
    }
}

impl input::ResponseData {
    pub fn configuration(&self) -> Configuration {
        match &self.discount_node.metafield {
            Some(input::InputDiscountNodeMetafield { value }) => Configuration::from_str(value),
            None => Configuration::default(),
        }
    }
}

#[shopify_function]
fn function(input: input::ResponseData) -> Result<output::FunctionResult> {
    let no_discount = output::FunctionResult {
        discounts: vec![],
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    };
    let buyer = match input.cart.buyer_identity {
        Some(ref buyer) => buyer,
        None => return Ok(no_discount),
    };
    let customer = match buyer.customer {
        Some(ref customer) => customer,
        None => return Ok(no_discount),
    };
    let vip_metafield = match customer.metafield {
        Some(ref metafield) => metafield,
        None => return Ok(no_discount),
    };
    if vip_metafield.value != "true" {
        return Ok(no_discount);
    }

    let config = input.configuration();
    Ok(output::FunctionResult {
        discounts: vec![
            output::Discount {
                value: output::Value {
                    percentage: Some(output::Percentage {
                        value: config.discount_percentage.to_string(),
                    }),
                    fixed_amount: None,
                },
                targets: vec![output::Target {
                    order_subtotal: Some(output::OrderSubtotalTarget {
                        excluded_variant_ids: vec![],
                    }),
                    product_variant: None,
                }],
                message: Some("VIP Discount".to_string()),
                conditions: None,
            },
        ],
        discount_application_strategy: output::DiscountApplicationStrategy::MAXIMUM,
    })
}