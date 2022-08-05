const presets = [
  [
    "@babel/preset-env",
    {
      exclude: ["transform-regenerator"],
    },
  ],
];
const plugins = [
  [
    "babel-plugin-inline-import",
    {
      extensions: [".graphql"],
    },
  ],
];

module.exports = { presets, plugins };
