const countOverlap = (ownedStocks, stocks) => {
  const overlapCount = ownedStocks.filter((investorStock) =>
    stocks.includes(investorStock)
  ).length;
  const overlap =
    ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

  return `${overlap.toFixed(2)}%`;
};

const handleOverlapQuerry = (fundName, porfolio, availableFunds) => {
  if (!availableFunds[fundName]) {
    return ["FUND_NOT_FOUND"];
  }

  const log = [];
  const stocks = availableFunds[fundName];

  porfolio.forEach((ownedFundName) => {
    const ownedStocks = availableFunds[ownedFundName];
    const overlap = countOverlap(ownedStocks, stocks);
    log.push(`${fundName} ${ownedFundName} ${overlap}`);
  });

  return log;
};

const execute = (parsedCommands, commandLookup) => {
  parsedCommands.forEach(({ command, args }) => {
    commandLookup[command](args);
  });
};

const restructureFund = (fund) => {
  const restructuredFund = {};

  fund.forEach(({ name, stocks }) => {
    restructuredFund[name] = stocks;
  });

  return restructuredFund;
};

const addStock = (fund, stock, availableFunds) => {
  const availableFundsCopy = JSON.parse(JSON.stringify(availableFunds));
  availableFundsCopy[fund].push(stock);

  return availableFundsCopy;
};

const evaluatePortfolioQuerry = (parsedCommands, mutualFunds) => {
  const log = [];
  const porfolio = [];
  let availableFunds = restructureFund(mutualFunds);

  const commandLookup = {
    CURRENT_PORTFOLIO: (funds) => {
      porfolio.push(...funds);
    },
    CALCULATE_OVERLAP: ([fund]) => {
      const result = handleOverlapQuerry(fund, porfolio, availableFunds);
      log.push(...result);
    },
    ADD_STOCK: (fundAndStock) => {
      const [fund, stock] = fundAndStock;
      availableFunds = addStock(fund, stock, availableFunds);
    },
  };

  execute(parsedCommands, commandLookup);
  return log.join("\n").trim();
};

module.exports = { evaluatePortfolioQuerry, addStock, restructureFund };
