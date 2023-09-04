const fs = require("fs");

const { parseCommands } = require("./src/command-parser");
const { myPortfolioApp } = require("./src/my-portfolio");

const main = () => {
  // eslint-disable-next-line prefer-destructuring
  const filePath = process.argv[2];
  const { funds: availableFunds } = JSON.parse(
    fs.readFileSync("./resource/mutual-funds.json", "utf-8")
  );

  const rawCommands = fs.readFileSync(filePath, "utf-8");
  const parsedCommands = parseCommands(rawCommands);
  const result = myPortfolioApp(parsedCommands, availableFunds);

  console.log(result);
};

main();
