const fs = require("fs");

const { parseCommands } = require("./src/command-parser");
const { evaluatePortfolioQuerry } = require("./src/porfolio-querry-evaluator");

const main = () => {
  // eslint-disable-next-line prefer-destructuring
  const filePath = process.argv[2];
  const { funds } = JSON.parse(
    fs.readFileSync("./resource/mutual-funds.json", "utf-8")
  );

  const rawCommands = fs.readFileSync(filePath, "utf-8");
  const parsedCommands = parseCommands(rawCommands);
  const result = evaluatePortfolioQuerry(parsedCommands, funds);

  console.log(result);
};

main();
