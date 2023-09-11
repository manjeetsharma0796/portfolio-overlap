const fs = require("fs");

const { parseCommands, parseFunds } = require("./src/parser");
const { FundPortfolioController } = require("./src/fund-portfolio-controller");
const { formatLogs } = require("./src/log-formatter");
const { MutualFunds } = require("./src/mutual-funds");

const main = () => {
  // eslint-disable-next-line prefer-destructuring
  const inputCommandPath = process.argv[2];
  const rawCommands = fs.readFileSync(inputCommandPath, "utf-8");
  const [portfolioInfo, ...commands] = parseCommands(rawCommands);

  const fundsJSON = fs.readFileSync("./resource/mutual-funds.json", "utf-8");
  const funds = parseFunds(fundsJSON);
  const portfolio = [...portfolioInfo.args];

  const mutualFunds = new MutualFunds(funds);
  const fundPortfolioController = new FundPortfolioController(
    mutualFunds,
    portfolio
  );

  const logs = fundPortfolioController.execute(commands);
  const formattedLogs = formatLogs(logs);

  console.log(formattedLogs);
};

main();
