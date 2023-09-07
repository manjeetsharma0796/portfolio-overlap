const fs = require("fs");

const { parseCommands, restructureFunds } = require("./src/parser");
const { evaluatePortfolioQuery } = require("./src/portfolio-manager");

const main = () => {
  // eslint-disable-next-line prefer-destructuring
  const inputCommandPath = process.argv[2];
  const rawCommands = fs.readFileSync(inputCommandPath, "utf-8");
  const parsedCommands = parseCommands(rawCommands);
  const { funds } = JSON.parse(
    fs.readFileSync("./resource/mutual-funds.json", "utf-8")
  );
  const structuredFunds = restructureFunds(funds);
  const result = evaluatePortfolioQuery(parsedCommands, structuredFunds);

  console.log(result);
};

main();
