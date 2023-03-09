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

const testData = getFunctionModules()
    .map(module => ({
        module,
        result: runFunction(module, input)
    }))
    .sort((a, b) => a.result.instructions - b.result.instructions)
    .map(({ module, result }) => {
        return {
            function: module.split(path.sep)[1],
            "instr (K)": Math.round(result.instructions / 1000),
            "size (KB)": result.size,
        }
    });

console.table(testData);