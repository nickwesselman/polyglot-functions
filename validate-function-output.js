const { buildSchema, coerceInputValue } = require('graphql');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(process.env.INIT_CWD, process.argv[2]);
if (!schemaPath) {
    console.error("You must provide a path to the function schema");
    process.exit(1);
}

let functionResult = JSON.parse(fs.readFileSync(0).toString());
if (functionResult?.output?.JsonOutput) {
    // function runner output
    functionResult = functionResult?.output?.JsonOutput;
}

const schemaStr = fs.readFileSync(schemaPath, {encoding:'utf8', flag:'r'});
const schema = buildSchema(schemaStr);
const functionResultType = schema.getType("FunctionResult");

let hadError = false;
coerceInputValue(functionResult, functionResultType, (path, invalidValue, error) => {
    console.error(error.message);
    hadError = true;
})

if (hadError) {
    process.exit(1);
}