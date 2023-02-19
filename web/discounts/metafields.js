import { Shopify } from "@shopify/shopify-api";
import createMetafieldDefinition from "./createMetafieldDefinition.graphql";

export const MetafieldDefinitions = {
  customerLevel: {
    name: "VIP Customer",
    namespace: "$app:polyglot-functions",
    key: "vip",
    description: "Is the customer a VIP?",
    type: "boolean",
    ownerType: "CUSTOMER",
    access: {
      "admin": "MERCHANT_READ_WRITE"
    }
  },
  functionConfiguration: {
    name: "Function Configuration",
    namespace: "$app:polyglot-functions",
    key: "function-configuration",
    description: "Configuration for the function",
    type: "json",
    ownerType: "DISCOUNT",
  }
};

export const DiscountMetafields = {
  //TODO: Get definitions and only create if they don't exist
  createDefinitions: async (shop, accessToken) => {
    Object.values(MetafieldDefinitions).forEach(async (definition) => {
      const client = new Shopify.Clients.Graphql(shop, accessToken);
      const payload = {
        data: {
          query: createMetafieldDefinition,
          variables: {
            definition,
          },
        },
      };
      const result = await client.query(payload);
      console.log(JSON.stringify(result, null, 2));
      const createResult = result.body.data?.metafieldDefinitionCreate;
      const errors = createResult?.userErrors ?? result.body.errors;
      if (errors && errors.length > 0) {
        console.log(
          `Error creating metafield definition: ${JSON.stringify(
            errors,
            null,
            2
          )}`
        );
      } else {
        console.log(
          `Created metafield definition: ${createResult?.createdDefinition?.id}`
        );
      }
    });
  },
};
