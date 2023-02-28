import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { graphql } from 'graphql'
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.env.INIT_CWD, process.argv[2]);
if (!schemaPath) {
    console.error("You must provide a path to the function schema");
    process.exit(1);
}

const queryPath = path.join(process.env.INIT_CWD, process.argv[3]);
if (!queryPath) {
    console.error("You must provide a path to the function schema");
    process.exit(1);
}

const schemaString = fs.readFileSync(schemaPath).toString();
const queryString = fs.readFileSync(queryPath).toString();

// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString })

const mockId = function(domainName) {
  const min = 10000000;
  const max = 90000000;
  const id = Math.floor(Math.random() * (max - min) + min);
  return `gid://${domainName ?? "DomainObject"}/${id}`;
}

const mocks = {
  ID: mockId,
  Decimal: () => (Math.random() * 100).toFixed(2).toString(),
  Customer: () => ({
    id: () => mockId("Customer"),
    email: "user@domain.com"
  })
}

// Create a new schema with mocks
const schemaWithMocks = addMocksToSchema({
  schema,
  mocks
})
 
graphql({
  schema: schemaWithMocks,
  source: queryString,
  variableValues: {
    qualifyingProductTags: "test"
  }
}).then(result => console.log(JSON.stringify(result, null, 2)));