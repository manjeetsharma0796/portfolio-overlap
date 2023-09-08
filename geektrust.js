const fs = require("fs");

const { parseCommands, parseFunds } = require("./src/parser");
const { PortfolioManager } = require("./src/portfolio-manager");
const { formatLogs } = require("./src/log-formatter");

const main = () => {
  // eslint-disable-next-line prefer-destructuring
  const inputCommandPath = process.argv[2];
  const rawCommands = fs.readFileSync(inputCommandPath, "utf-8");
  const [portfolioInfo, ...commands] = parseCommands(rawCommands);

  const fundsJSON = fs.readFileSync("./resource/mutual-funds.json", "utf-8");
  const funds = parseFunds(fundsJSON);
  const portfolio = [...portfolioInfo.args];

  const portfolioManager = new PortfolioManager(funds, portfolio);
  const logs = portfolioManager.generateResult(commands);
  const formattedLogs = formatLogs(logs);

  console.log(formattedLogs);
};

main();
