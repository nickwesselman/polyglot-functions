import shopify from "../shopify.js";

const CREATE_METAFIELD_DEFINITION = `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

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
  createDefinitions: async (session) => {
    Object.values(MetafieldDefinitions).forEach(async (definition) => {
      const client = new shopify.api.clients.Graphql({
        session
      });
      const payload = {
        data: {
          query: CREATE_METAFIELD_DEFINITION,
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
