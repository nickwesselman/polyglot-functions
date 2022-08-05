use serde::{Deserialize, Serialize};
use graphql_client::GraphQLQuery;

mod api;
use api::*;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "schema.graphql",
    query_path = "input.graphql",
    response_derives = "Debug, Clone, Deserialize, Default",
    normalization = "rust",
)]
struct Input;

#[derive(Clone, Debug, Serialize, Deserialize, Default)]
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

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let input: input::ResponseData = serde_json::from_reader(std::io::BufReader::new(std::io::stdin()))?;
    let mut out = std::io::stdout();
    let mut serializer = serde_json::Serializer::new(&mut out);
    function(input)?.serialize(&mut serializer)?;
    Ok(())
}

fn function(input: input::ResponseData) -> Result<FunctionResult, Box<dyn std::error::Error>> {
    let no_discount = FunctionResult {
        discounts: vec![],
        discount_application_strategy: DiscountApplicationStrategy::First,
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
    Ok(FunctionResult {
        discounts: vec![
            Discount {
                value: Value::Percentage {
                    value: config.discount_percentage,
                },
                targets: vec![Target::OrderSubtotal {
                    excluded_variant_ids: vec![],
                }],
                message: Some("VIP Discount".to_string()),
                conditions: None,
            },
        ],
        discount_application_strategy: DiscountApplicationStrategy::Maximum,
    })
}