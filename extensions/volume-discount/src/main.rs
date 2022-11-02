use serde::{Deserialize, Serialize};
use shopify_function::prelude::*;
use shopify_function::Result;
use shopify_function::{run_function_with_input};

generate_types!(query_path = "./input.graphql", schema_path = "./schema.graphql");

#[derive(Clone, Debug, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Configuration {}

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
    let _config = input.configuration();
    eprintln!("Hello, world!");
    Ok(output::FunctionResult {
        discounts: vec![],
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn input(config: Option<Configuration>) -> String {
        let config = serde_json::to_string(&config.unwrap_or_default()).unwrap();
        return format!(r#"
        {{
            "discountNode": {{
                "metafield": {{
                    "value": "{config}"
                }}
            }}
        }}
        "#);
    }

    #[test]
    fn test_discount_with_no_configuration() -> Result<()> {
        let handle_result = run_function_with_input(function, &input(None))?;

        let expected_handle_result = output::FunctionResult {
            discounts: vec![],
            discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
        };
        assert_eq!(handle_result, expected_handle_result);
        Ok(())
    }

    #[test]
    fn test_discount_with_configuration() -> Result<()> {
        let handle_result = run_function_with_input(function, &input(Some(Configuration {})))?;

        let expected_handle_result = output::FunctionResult {
            discounts: vec![],
            discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
        };
        assert_eq!(handle_result, expected_handle_result);
        Ok(())
    }
}
