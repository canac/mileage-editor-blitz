// Hack until https://github.com/blitz-js/blitz/issues/3814 is fixed
const config = require("@blitzjs/next/eslint");
config.rules["react/no-unknown-property"] = [
  2,
  {
    ignore: ["global", "jsx"],
  },
];
module.exports = config;
