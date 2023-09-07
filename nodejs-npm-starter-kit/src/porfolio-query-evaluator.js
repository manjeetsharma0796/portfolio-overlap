const countOverlap = (ownedStocks, stocks) => {
  const overlapCount = ownedStocks.filter((stock) =>
    stocks.includes(stock)
  ).length;
  const overlap =
    ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

  return `${overlap.toFixed(2)}%`;
};

const handleOverlapQuery = (fundName, portfolio, funds) => {
  if (!funds[fundName]) {
    return ["FUND_NOT_FOUND"];
  }

  const stocks = funds[fundName];

  return portfolio.map((ownedFundName) => {
    const ownedStocks = funds[ownedFundName];
    const overlap = countOverlap(ownedStocks, stocks);

    return `${fundName} ${ownedFundName} ${overlap}`;
  });
};

const restructureFund = (fund) => {
  const restructuredFund = {};

  fund.forEach(({ name, stocks }) => {
    restructuredFund[name] = stocks;
  });

  return restructuredFund;
};

const addStock = (fund, stock, funds) => {
  const availableFundsCopy = JSON.parse(JSON.stringify(funds));
  availableFundsCopy[fund].push(stock);

  return availableFundsCopy;
};

const evaluatePortfolioQuery = (parsedCommands, mutualFunds) => {
  const log = [];
  const portfolio = [];
  let funds = restructureFund(mutualFunds);

  const commandLookup = {
    CURRENT_PORTFOLIO: (fundList) => {
      portfolio.push(...fundList);
    },
    CALCULATE_OVERLAP: ([fund]) => {
      const result = handleOverlapQuery(fund, portfolio, funds);
      log.push(...result);
    },
    ADD_STOCK: (fundAndStock) => {
      const [fund, stock] = fundAndStock;
      funds = addStock(fund, stock, funds);
    },
  };

  parsedCommands.forEach(({ command, args }) => {
    commandLookup[command](args);
  });

  return log.join("\n").trim();
};

module.exports = {
  evaluatePortfolioQuery,
  addStock,
  restructureFund,
  countOverlap,
};
