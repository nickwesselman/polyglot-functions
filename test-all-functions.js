const { execSync } = require('node:child_process');
const fs = require('fs');
const path = require('path');
var toml = require('toml');

const getFunctionModules = () => {
    return fs.readdirSync('extensions', { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => path.join('extensions', entry.name, 'shopify.function.extension.toml'))
        .filter(tomlPath => fs.existsSync(tomlPath))
        .map(tomlPath => {
            const configContent = fs.readFileSync(tomlPath).toString();
            const config = toml.parse(configContent);
            return path.join(path.dirname(tomlPath), config.build.path);
        })
};

const runFunction = (path, input) => {
    return JSON.parse(execSync(`npm run function-runner --silent -- -j -f ${path}`, {
        input
    }).toString());
};

const input = fs.readFileSync('inputs/input.json').toString();

// build a cart with 128 items
const largeInput = JSON.parse(input);
for (i = 0; i < 6; i++) {
    largeInput.cart.lines = largeInput.cart.lines.concat(JSON.parse(JSON.stringify(largeInput.cart.lines)));
}
//console.log(JSON.stringify(largeInput, null, 2));
//console.log(largeInput.cart.lines.length)
//process.exit(0);

const testData = getFunctionModules()
    .map(module => ({
        module,
        result: runFunction(module, input),
        largeResult: runFunction(module, JSON.stringify(largeInput))
    }))
    .sort((a, b) => a.result.instructions - b.result.instructions)
    .map(({ module, result, largeResult }) => {
        //console.error(result.logs);
        //console.error(largeResult.logs);
        return {
            "Function": module.split(path.sep)[1],
            "Kinstr (2 cart lines)": Math.round(result.instructions / 1000),
            "Kinstr (128 cart lines)": Math.round(largeResult.instructions / 1000),
            "Size (KB)": result.size,
        }
    });

console.table(testData);