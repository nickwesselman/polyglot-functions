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
    const result = execSync(`npm exec -- function-runner -j -f ${path}`, {
        input
    }).toString();
    return JSON.parse(result);
};

const input = fs.readFileSync('inputs/input.json').toString();

const x = 201;
const largeInput = JSON.parse(input);
const largeConfig = JSON.parse(largeInput.discountNode.metafield.value);
largeConfig.options = [
    {
        collections: ["gid://shopify/Collection/123456789","gid://shopify/Collection/123456789","gid://shopify/Collection/123456789","gid://shopify/Collection/123456789","gid://shopify/Collection/123456789"],
        tags: ["ABCDEFG", "ABCDEFG", "ABCDEFG", "ABCDEFG"]
    }
];
for (i = 0; i < x; i++) {
     largeConfig.options.push(JSON.parse(JSON.stringify(largeConfig.options[0])));
}
largeInput.discountNode.metafield.value = JSON.stringify(largeConfig);
console.log(JSON.stringify(largeInput, null, 2));
console.log(`JSON size: ${largeInput.discountNode.metafield.value.length}`);
console.log(`Input size: ${JSON.stringify(largeInput).length}`);
//console.log(largeInput.cart.lines.length)
//process.exit(0);



const testData = getFunctionModules()
    .filter(module => module.split(path.sep)[1] == "order-discount-rust")
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