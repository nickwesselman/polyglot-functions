const { execSync } = require('node:child_process');
const { buildSchema, coerceInputValue } = require('graphql');
const fs = require('fs');
const path = require('path');
var toml = require('toml');

const runFunction = (path, input) => {
    const result = execSync(`npm exec -- function-runner -j -f ${path}`, {
        input
    }).toString();
    return JSON.parse(result);
};

const getFunctionModule = () => {
    const tomlPath = path.join(process.env.INIT_CWD, 'shopify.function.extension.toml');
    const configContent = fs.readFileSync(tomlPath).toString();
    const config = toml.parse(configContent);
    return path.join(process.env.INIT_CWD, config.build.path);
};

const functionModule = getFunctionModule();
const input = fs.readFileSync(0).toString();
let functionResult = runFunction(functionModule, input);
if (functionResult?.output?.JsonOutput) {
    // function runner output
    functionResult = functionResult?.output?.JsonOutput;
}

const schemaPath = path.join(process.env.INIT_CWD, 'schema.graphql');
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
} else {
    console.log("Output validated!")
}