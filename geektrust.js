const fs = require("fs");

const { parseCommands, parseFunds } = require("./src/parser");
const { evaluatePortfolioQuery } = require("./src/portfolio-manager");
const { displayLog } = require("./src/renderer");

const main = () => {
  // eslint-disable-next-line prefer-destructuring
  const inputCommandPath = process.argv[2];
  const rawCommands = fs.readFileSync(inputCommandPath, "utf-8");
  const commands = parseCommands(rawCommands);

  const fundsJSON = fs.readFileSync("./resource/mutual-funds.json", "utf-8");
  const funds = parseFunds(fundsJSON);

  const logs = evaluatePortfolioQuery(commands, funds);

  displayLog(logs);
};

main();
